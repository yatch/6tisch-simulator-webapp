import json
import sys

import eel

import backend

# DON'T CHANGE THIS PORT NUMBER, otherwise "$ npm run serve" doesn't
# work as you expect
LISTEN_PORT = 8081

# initialize eel
eel.init(backend.DEFAULT_WEB_ROOT_PATH)

# start the server
with open(backend.BACKEND_CONFIG) as f:
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
    }
)
