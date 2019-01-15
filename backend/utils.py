import json
import os
import subprocess
import sys

# import backend.routes before eel so that our custom routes are
# processed first. this is needed to provide a GET route to
# '/results/*.zip'. otherwise route to <path:path> in Eel will
# prevents that.
import backend.routes
import eel

import backend
# need to import backend.sim to expose its APIs
import backend.sim

# DON'T CHANGE THIS PORT NUMBER, which is referred when you run "$ npm
# run serve"
LISTEN_PORT = 8081

CONFIG_JSON_TEMPLATE = {
    'version': 0,
    'execution': {
        'numCPUs': 1,
        'numRuns': 1,
    },
    'settings': {},
    'logging': 'all',
    'log_directory_name': 'startTime',
    'post': []
}


def on_close_callback(page, sockets):
    print 'Detect a WebSocket is closed; keep running'
    backend.sim.clear_sim()


def start_server():
    # initialize eel
    eel.init(backend.DEFAULT_WEB_ROOT_PATH)

    try:
        _create_config_json()
        _start()
    finally:
        _delete_config_json()


def _start():
    # start the server
    with open(backend.BACKEND_CONFIG_PATH) as f:
        config = json.load(f)
    print 'Starting the backend server on {0}:{1}'.format(
        config['host'],
        LISTEN_PORT
    )
    sys.stdout.flush()
    eel.start(
        backend.START_URL,
        options = {
            'host': config['host'],
            'port': LISTEN_PORT,
            'mode': None
        },
        callback = on_close_callback
    )


def _create_config_json():
    # read the default config.json from the simulator source directory
    default_config_path = os.path.join(
        backend.get_simulator_path(),
        'bin/config.json'
    )
    with open(default_config_path) as f:
        default_config = json.load(f)

    # check its settings
    check_config_json = os.path.join(
        backend.get_simulator_path(),
        'bin/check_config_json.py'
    )
    popen = subprocess.Popen(
        [check_config_json, '-s', '-c', '-'],
        stdin  = subprocess.PIPE,
        stdout = subprocess.PIPE
    )
    _ = popen.communicate(json.dumps(default_config))
    if popen.returncode != 0:
        raise ValueError('invalid default config.json')

    # create a new config.json
    config = dict(CONFIG_JSON_TEMPLATE)
    config['settings'] = default_config['settings']

    config_dir = os.path.dirname(backend.SIM_CONFIG_PATH)
    if os.path.exists(config_dir) is True:
        _delete_config_json()
    else:
        os.mkdir(config_dir)

    with open(backend.SIM_CONFIG_PATH, 'w') as f:
        json.dump(config, f, indent=4)


def _delete_config_json():
    if os.path.exists(backend.SIM_CONFIG_PATH):
        os.remove(backend.SIM_CONFIG_PATH)
