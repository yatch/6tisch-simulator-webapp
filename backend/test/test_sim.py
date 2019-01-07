import json
import os

import eel
import gevent
import pytest

import backend
import backend.sim


def call_exposed_api(func, *args):
    gevent.spawn(func, *args)
    # yield the CPU so that the func is invoked in a greenlet
    gevent.sleep(backend.sim.GEVENT_SLEEP_SECONDS_IN_SIM_ENGINE)


@pytest.fixture(scope='module', autouse=True)
def setup_fake_notifyLogEvent(request):
    if hasattr(eel, 'notifyLogEvent'):
        notifyLogEvent_backup = eel.notifyLogEvent
    else:
        notifyLogEvent_backup = None
    eel.notifyLogEvent = lambda event: None

    def _revert_notifyLogEvent():
        if notifyLogEvent_backup is None:
            # nothing to do
            pass
        else:
            eel.notifyLogEvent = notifyLogEvent_backup

    request.addfinalizer(_revert_notifyLogEvent)


@pytest.fixture
def sim_engine():
    def _generator(settings):
        call_exposed_api(backend.sim.start, settings)
        return backend.sim._sim_engine

    yield _generator
    if backend.sim._sim_engine is not None:
        backend.sim._destroy_sim()


def test_get_default_settings():
    # read the default config.json from the simulator source directory
    default_config_path = os.path.join(
        backend.get_simulator_path(),
        'bin/config.json'
    )
    with open(default_config_path) as f:
        default_config = json.load(f)

    # get config to test
    settings = backend.sim.get_default_settings()

    # Combination settings in default_config should have the first
    # values of them in settings
    for key, values in default_config['settings']['combination'].items():
        assert settings[key] == values[0]

    # Other settings should be the same as default_config.
    for key, value in default_config['settings']['regular'].items():
        assert (
            settings[key] ==
            default_config['settings']['regular'][key]
        )


def test_get_available_scheduling_functions():
    ret = backend.sim.get_available_scheduling_functions()
    assert 'SFNone' in ret
    assert 'MSF' in ret


def test_get_available_connectivities():
    ret = backend.sim.get_available_connectivities()
    assert 'Linear' in ret
    assert 'Random' in ret
    assert 'K7' in ret


def test_start():
    settings = backend.sim.get_default_settings()
    # set one (slotframe) to exec_numSlotframesPerRun so that the test
    # finishes in a short time
    settings['exec_numSlotframesPerRun'] = 1

    # _sim_engine should be None before starting a simulation
    assert backend.sim._sim_engine is None

    # call start()
    call_exposed_api(backend.sim.start, settings)

    # _sim_engine should be available now
    assert backend.sim._sim_engine is not None
    assert backend.sim._sim_engine.is_alive() is True

    # the simulator should yield the CPU at every end of slotframe
    assert (
        backend.sim._sim_engine.getAsn() ==
        (settings['tsch_slotframeLength'] - 1)
    )

    # sleep for a while. this makes the simulator run until it
    # finishes
    gevent.sleep(0.5)

    # the simulator should be finished
    assert backend.sim._sim_engine is None


def test_pause(sim_engine):
    settings = backend.sim.get_default_settings()
    _sim_engine = sim_engine(settings)

    # the simulator should stop at the end of the first slotframe
    asn_before_sleep = _sim_engine.getAsn()

    # call pause()
    call_exposed_api(backend.sim.pause)

    # the simulator should stop at the next ASN of 'asn_before_sleep'
    assert _sim_engine.is_alive() is True
    assert _sim_engine.getAsn() == asn_before_sleep + 1


def test_resume(sim_engine):
    settings = backend.sim.get_default_settings()
    _sim_engine = sim_engine(settings)

    # call pause()
    call_exposed_api(backend.sim.pause)

    # the simulator should stop at the next ASN of 'asn_before_sleep'
    asn_before_sleep = _sim_engine.getAsn()

    # sleep to yield the CPU
    gevent.sleep(0.001)

    # the simulator should still be paused
    assert _sim_engine.getAsn() == asn_before_sleep

    # call resume
    call_exposed_api(backend.sim.resume)

    # then, the simulator should proceed its global ASN by one slotframe
    assert _sim_engine.getAsn() == (
        asn_before_sleep + settings['tsch_slotframeLength'] - 1
    )


@pytest.fixture(params=['with_pause', 'without_pause'])
def pause_option(request):
    return request.param


def test_abort(sim_engine, pause_option):
    settings = backend.sim.get_default_settings()
    _sim_engine = sim_engine(settings)

    # pause the simulation if necessary
    if pause_option == 'with_pause':
        # call pause()
        call_exposed_api(backend.sim.pause)
    else:
        assert pause_option == 'without_pause'

    # the simulator should be alive
    assert _sim_engine.is_alive() is True

    # call abort()
    call_exposed_api(backend.sim.abort)

    # sleep for a while
    gevent.sleep(0.5)

    # _sim_engine should be destroyed
    assert backend.sim._sim_engine is None


@pytest.fixture(params=['start', 'pause', 'resume', 'abort'])
def sim_action(request):
    return request.param


@pytest.fixture(params=['success', 'failure'])
def return_type(request):
    return request.param


def test_return_values(sim_action, return_type):
    settings = backend.sim.get_default_settings()
    settings['exec_numSlotframesPerRun'] = 1

    if sim_action == 'start':
        if return_type == 'success':
            # use the default settings; do nothing
            pass
        else:
            # make an error in settings
            del settings['exec_numMotes']
        ret_val = backend.sim.start(settings)
        assert backend.sim._sim_engine is None
    else:
        method_to_call = getattr(backend.sim, sim_action)
        greenlet = gevent.spawn(backend.sim.start, settings)
        if return_type == 'success':
            # start a simulation
            gevent.sleep(backend.sim.GEVENT_SLEEP_SECONDS_IN_SIM_ENGINE)
            if sim_action == 'resume':
                # make the simulation pause
                backend.sim.pause()
        else:
            # do nothing; _sim_engine is not available yet
            pass

        ret_val = method_to_call()
        if backend.sim._sim_engine is not None:
            backend.sim._destroy_sim()

        gevent.kill(greenlet)
        assert backend.sim._sim_engine is None

    if return_type == 'success':
        assert 'message' not in ret_val
        assert 'trace' not in ret_val
    else:
        assert ret_val['message'] is not None
        assert ret_val['trace'] is not None

    assert ret_val['status'] == return_type
