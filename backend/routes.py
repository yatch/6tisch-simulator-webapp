import os

import bottle as btl

import backend


@btl.get('/config.json')
def get_config_json():
    filename = os.path.basename(backend.SIM_CONFIG_PATH)
    root = os.path.dirname(backend.SIM_CONFIG_PATH)
    return btl.static_file(filename, root=root, download=filename)
