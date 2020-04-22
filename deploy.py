#!/usr/bin/env python

import json
import os
import shutil

import git

BACKEND_CONFIG_JSON = 'backend.config.json'
DIST_DIR = 'dist'
BACKEND_DIR = 'backend'
DEPLOY_TARGET_SUBDIR = 'gui'
WEBAPP_COMMIT_INFO = 'WEBAPP_COMMIT_INFO.txt'
LICENSE = 'LICENSE'
GITHUB_REPO_URL = 'https://github.com/yatch/6tisch-simulator-webapp'

webapp_dir_path = os.path.abspath(os.path.dirname(__file__))

def remove_if_exist(path):
    if os.path.exists(path):
        if os.path.isdir(path):
            print('removing {0}...'.format(path))
            shutil.rmtree(path)
        elif os.path.isfile(path):
            print('removing {0}'.format(path))
            os.remove(path)
        else:
            raise NotImplementedError('cannot remove {0}'.format(path))

# read the config
backend_config_json_path = os.path.join(webapp_dir_path, BACKEND_CONFIG_JSON)
with open(backend_config_json_path, 'r') as f:
    backend_config = json.load(f)

# make sure we have the simulator directory
simulator_dir_path = os.path.abspath(backend_config['simulator_path'])
if not os.path.isdir(simulator_dir_path):
    raise ValueError('incorrect simulator path in backend.config.json')

# make sure we have something to deploy
src_dist_path = os.path.join(webapp_dir_path, DIST_DIR)
if not os.path.isdir(src_dist_path):
    raise ValueError('dist is not found; forget to build?')

# prepare a directory to deploy
deploy_path = os.path.join(
    simulator_dir_path,
    DEPLOY_TARGET_SUBDIR
)

if not os.path.exists(deploy_path):
    os.mkdir(deploy_path)
elif not os.path.isdir(deploy_path):
    raise ValueError('{0} is not a directory'.format(deploy_path))

# dist
dst_dist_path = os.path.join(deploy_path, DIST_DIR)
remove_if_exist(dst_dist_path)
print('copying {0} to {1}...'.format(src_dist_path, dst_dist_path))
shutil.copytree(src_dist_path, dst_dist_path)

# backend
src_backend_path = os.path.join(webapp_dir_path, BACKEND_DIR)
dst_backend_path = os.path.join(deploy_path, BACKEND_DIR)
remove_if_exist(dst_backend_path)
print('copying {0} to {1}...'.format(src_backend_path, dst_backend_path))
shutil.copytree(src_backend_path, dst_backend_path)

# backend.config.json
dst_backend_config_json_path = os.path.join(deploy_path, BACKEND_CONFIG_JSON)
remove_if_exist(dst_backend_config_json_path)
with open(dst_backend_config_json_path, 'w') as f:
    config = {
        'simulator_path': '..',
        'trace_dir_path': '../traces',
        'host': '127.0.0.1'
    }
    print('generating {0} at {1}...'.format(BACKEND_CONFIG_JSON, deploy_path))
    json.dump(config, f, indent=4)

# add WEBAPP_COMMIT_INFO.txt
dst_webapp_commit_info_path = os.path.join(deploy_path, WEBAPP_COMMIT_INFO)
remove_if_exist(dst_webapp_commit_info_path)
print('generating {0} at {1}...'.format(WEBAPP_COMMIT_INFO, deploy_path))
with open(dst_webapp_commit_info_path, 'w') as f:
    repo = git.Repo(webapp_dir_path)
    commit_hash = repo.head.object.hexsha
    f.write('{0}/commit/{1}\n'.format(GITHUB_REPO_URL, commit_hash))

# copy LICENSE
src_license_path = os.path.join(webapp_dir_path, LICENSE)
dst_license_path = os.path.join(deploy_path, LICENSE)
remove_if_exist(dst_license_path)
print('copying {0} at {1}...'.format(LICENSE, deploy_path))
shutil.copyfile(src_license_path, dst_license_path)
