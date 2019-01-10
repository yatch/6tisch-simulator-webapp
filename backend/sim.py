import json
import math
import os
import re
import time
import types
import traceback
import subprocess

import eel
import gevent

import backend
from SimEngine import (
    SimEngine,
    SimSettings,
    SimLog
)


DUMMY_COMBINATION_KEYS = ['exec_numMotes']
SIM_LOG_FILTERS = 'all'
DEFAULT_LOG_NOTIFICATION_FILTER = [
    SimLog.LOG_SIMULATOR_STATE['type'],
    SimLog.LOG_SIMULATOR_RANDOM_SEED['type'],
    SimLog.LOG_MAC_ADD_ADDR['type']
]
GEVENT_SLEEP_SECONDS_IN_SIM_ENGINE = 0.001

RETURN_STATUS_SUCCESS = 'success'
RETURN_STATUS_FAILURE = 'failure'

_sim_engine = None
_elapsed_minutes = 0


# exported functions


@eel.expose
def get_default_settings():
    # read the default config.json from the simulator source directory
    default_config_path = os.path.join(
        backend.get_simulator_path(),
        'bin/config.json'
    )
    with open(default_config_path) as f:
        default_config = json.load(f)
    settings = default_config['settings']['regular']

    # move all the combination params to regular using the first value
    # of each
    for key, values in default_config['settings']['combination'].items():
        settings[key] = values[0]

    return settings


@eel.expose
def get_available_scheduling_functions():
    sf_py_path = os.path.join(
        backend.get_simulator_path(),
        'SimEngine/Mote/sf.py'
    )
    ret_val = set()
    with open(sf_py_path, 'r') as f:
        ret_val = set(
            re.findall(r'SchedulingFunction\w+', f.read(), re.MULTILINE)
        )

    # remove "SchedulingFunctionBase" that is the base (super) class
    # for concrete scheduling function implementations
    ret_val.remove('SchedulingFunctionBase')

    # strip leading "SchedulingFunction" and return
    return map(
        lambda elem:
        re.sub(r'SchedulingFunction(\w+)', r'\1', elem),
        ret_val
    )


@eel.expose
def get_git_info():
    # to prevent memory leak, we will have a separate process to get
    # information of the Git repositories with gitpython:
    # https://gitpython.readthedocs.io/en/stable/intro.html#limitations
    get_git_info_cmd_path = os.path.join(
        backend.BACKEND_BASE_PATH,
        'get_git_info'
    )
    return json.loads(subprocess.check_output([get_git_info_cmd_path]))


@eel.expose
def get_available_connectivities():
    conn_py_path = os.path.join(
        backend.get_simulator_path(),
        'SimEngine/Connectivity.py'
    )
    ret_val = set()
    with open(conn_py_path, 'r') as f:
        ret_val = set(
            re.findall(r'Connectivity\w+', f.read(), re.MULTILINE)
        )

    # remove "ConnectivityBase" that is the base (super) class for
    # concrete scheduling function implementations
    ret_val.remove('ConnectivityBase')

    # strip leading "Connectivity" and return
    return map(
        lambda elem:
        re.sub(r'Connectivity(\w+)', r'\1', elem),
        ret_val
    )


@eel.expose
def start(settings, log_notification_filter='all'):
    global _sim_engine
    global _elapsed_minutes

    sim_settings = None
    sim_log = None
    ret_val = {}

    if _sim_engine is not None:
        return {
            'status' : RETURN_STATUS_FAILURE,
            'message': 'SimEngine has been started already',
            'trace'  : None
        }

    try:
        sim_settings = SimSettings.SimSettings(
            cpuID        = 0,
            run_id       = 0,
            log_root_dir = backend.SIM_DATA_PATH,
            **settings
        )
        start_time = time.time()
        sim_settings.setLogDirectory(
            '{0}-{1:03d}'.format(
                time.strftime(
                    "%Y%m%d-%H%M%S",
                    time.localtime(start_time)
                ),
                int(round(start_time * 1000)) % 1000
            )
        )
        sim_settings.setCombinationKeys(DUMMY_COMBINATION_KEYS)

        sim_log = SimLog.SimLog()
        sim_log.set_log_filters(SIM_LOG_FILTERS)
        _overwrite_sim_log_log(log_notification_filter)

        _sim_engine = SimEngine.SimEngine()
        _elapsed_minutes = 0
        _overwrite_sim_engine_actionEndSlotframe()

        # start and wait until the simulation ends
        _sim_engine.start()
        _sim_engine.join()
    except Exception as e:
        ret_val['status'] = RETURN_STATUS_FAILURE
        ret_val['message'] = e
        ret_val['trace'] = traceback.format_exc()

        # cleanup
        if _sim_engine is None:
            if sim_settings is not None:
                sim_settings.destroy()
            if sim_log is not None:
                sim_log.destroy()
        else:
            _destroy_sim()
    else:
        if _sim_engine.getAsn() == (
                sim_settings.exec_numSlotframesPerRun *
                sim_settings.tsch_slotframeLength
            ):
            # simulation ends successfully
            pass
        else:
            # simulation is aborted
            pass
        ret_val['status'] = RETURN_STATUS_SUCCESS
        # clean up
        _destroy_sim()

    return ret_val


@eel.expose
def pause():
    global _sim_engine

    try:
        # we cannot make the simulation pause on the current ASN because
        # of a limitation of the event scheduler; so we schedule pause on
        # the next ASN
        _sim_engine.pauseAtAsn(_sim_engine.getAsn() + 1)
    except Exception as e:
        return {
            'status':  RETURN_STATUS_FAILURE,
            'message': e,
            'trace': traceback.format_exc()
        }
    else:
        return {
            'status': RETURN_STATUS_SUCCESS
        }


@eel.expose
def resume():
    global _sim_engine

    try:
        _sim_engine.play()
    except Exception as e:
        return {
            'status':  RETURN_STATUS_FAILURE,
            'message': e,
            'trace': traceback.format_exc()
        }
    else:
        return {
            'status': RETURN_STATUS_SUCCESS
        }


@eel.expose
def abort():
    global _sim_engine
    try:
        _destroy_sim()
    except Exception as e:
        return {
            'status':  RETURN_STATUS_FAILURE,
            'message': e,
            'trace': traceback.format_exc()
        }
    else:
        return {
            'status': RETURN_STATUS_SUCCESS
        }


def _overwrite_sim_engine_actionEndSlotframe():
    global _sim_engine

    _sim_engine.original_actionEndSlotframe = _sim_engine._actionEndSlotframe

    def _new_actionEndSlotframe(self):
        global _elapsed_minutes

        self.original_actionEndSlotframe()
        asn = _sim_engine.getAsn()
        minutes = math.floor(asn * _sim_engine.settings.tsch_slotDuration / 60)
        if _elapsed_minutes < minutes:
           _elapsed_minutes = minutes
           eel.notifyLogEvent({
               '_type': '_backend.tick.minute',
               '_asn': asn,
               'currentValue': _elapsed_minutes
           })
        # we need to yield the CPU explicitly for other tasks because
        # threading is monkey-patched by gevent. see __init__.py.
        gevent.sleep(GEVENT_SLEEP_SECONDS_IN_SIM_ENGINE)

    _sim_engine._actionEndSlotframe = types.MethodType(
        _new_actionEndSlotframe,
        _sim_engine
    )


def _overwrite_sim_log_log(log_notification_filter):
    if log_notification_filter == 'all':
        _filter = 'all'
    elif isinstance(log_notification_filter, str):
        _filter = DEFAULT_LOG_NOTIFICATION_FILTER
        _filter.append(log_notification_filter)
    elif isinstance(log_notification_filter, list):
        _filter = DEFAULT_LOG_NOTIFICATION_FILTER + log_notification_filter
    else:
        raise RuntimeError('unsupported type for log_notification_filter')

    sim_log = SimLog.SimLog()
    sim_log.original_log = sim_log.log

    def _new_log(self, simlog, content):
        self.original_log(simlog, content)

        # content is expected to be updated adding _asn, _type
        assert '_asn' in content
        assert '_type' in content

        if (
                (_filter == 'all')
                or
                (content['_type'] in _filter)
            ):
            eel.notifyLogEvent(content)
        else:
            pass

    sim_log.log = types.MethodType(_new_log, sim_log)


def _destroy_sim():
    global _sim_engine
    global _elapsed_minutes

    sim_log = SimLog.SimLog()
    connectivity = _sim_engine.connectivity
    sim_settings = _sim_engine.settings

    _sim_engine.destroy()
    sim_log.destroy()
    connectivity.destroy()
    sim_settings.destroy()

    _sim_engine = None
    _elapsed_minutes = 0


def clear_sim():
    global _sim_engine
    if _sim_engine == None:
        # nothing to do
        pass
    else:
        _destroy_sim()
