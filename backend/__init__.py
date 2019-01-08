import json
import os
import sys

import gevent.monkey

BACKEND_BASE_PATH = os.path.dirname(os.path.abspath(__file__))
BACKEND_CONFIG_PATH = os.path.join(BACKEND_BASE_PATH, '../backend.config.json')
SIM_DATA_PATH = os.path.join(BACKEND_BASE_PATH, '../simData')
DEFAULT_WEB_ROOT_PATH = os.path.join(BACKEND_BASE_PATH, '../public')
START_URL = '/index.html'


def get_simulator_path():
    with open(BACKEND_CONFIG_PATH) as f:
        config = json.load(f)
        simulator_path = config['simulator_path']

    if simulator_path is None:
        return None
    elif os.path.isabs(simulator_path):
        return simulator_path
    else:
        # simulator_path is a relative path
        return os.path.join(
            os.path.dirname(BACKEND_CONFIG_PATH),
            simulator_path
        )


def get_sim_data_path():
    return os.path.join(
        get_simulator_path(),
        'bin/simData'
    )


# add the path of the simulator source directory to Python module
# search path list so that SimEngine and other relevant modules can be
# imported
sys.path.insert(0, get_simulator_path())

# do monkey patching here before eel is imported
# https://github.com/ChrisKnott/Eel#asynchronous-python
gevent.monkey.patch_all()
