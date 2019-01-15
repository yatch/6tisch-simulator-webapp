import json
import os
import sys

import gevent.monkey

BACKEND_BASE_PATH = os.path.dirname(os.path.abspath(__file__))
BACKEND_CONFIG_PATH = os.path.join(BACKEND_BASE_PATH, '../backend.config.json')
BACKEND_VAR_DIR_PATH = os.path.join(BACKEND_BASE_PATH, 'var')
SIM_DATA_PATH = os.path.join(BACKEND_BASE_PATH, '../simData')
DEFAULT_WEB_ROOT_PATH = os.path.join(BACKEND_BASE_PATH, '../public')
SIM_CONFIG_PATH = os.path.join(BACKEND_VAR_DIR_PATH, 'config.json')
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


# add the path of the simulator source directory to Python module
# search path list so that SimEngine and other relevant modules can be
# imported
sys.path.insert(0, get_simulator_path())

# do monkey patching here before eel is imported
# https://github.com/ChrisKnott/Eel#asynchronous-python
gevent.monkey.patch_all()
