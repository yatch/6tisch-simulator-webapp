#!/bin/bash

# install the latest LTS version of node.js since node versions
# provided by IBM Cloud are too old
# https://console.bluemix.net/docs/services/ContinuousDelivery/pipeline_deploy_var.html#runtimes-and-tools
# https://stackoverflow.com/questions/42269590/bluemix-build-pipeline-set-node-and-npm-version
export NVM_DIR=/home/pipeline/nvm
export NODE_VERSION=10.15.0
export NVM_VERSION=0.34.0

npm config delete prefix \
    && mkdir -p $NVM_DIR \
    && curl -o- https://raw.githubusercontent.com/creationix/nvm/v${NVM_VERSION}/install.sh | bash \
    && . $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default \
    && node -v \
    && npm -v

# install dependencies
npm install

# build html/css/js
npm run build

# fetch the simulator source code
git clone --single-branch --branch develop https://bitbucket.org/6tisch/simulator.git simulator

# append its dependencies to requirements.txt so that they will
# be installed during deployment
cat simulator/requirements.txt >> requirements.txt

# adjust backend.config.json for IBM cloud
sed -i 's/\.\.\/simulator/simulator/' backend.config.json
sed -i 's/127\.0\.0\.1/0.0.0.0/' backend.config.json
