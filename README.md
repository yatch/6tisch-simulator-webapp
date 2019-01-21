# 6TiSCH Simulator WebApp

This app provides a web user-interface for [the 6TiSCH
Simulator](https://bitbucket.org/6tisch/simulator/src).


## Quick Start

Do you want to try the 6TiSCH Simulator easily with [IBM
Cloud](https://www.ibm.com/cloud/)? OK, use this button:

[![Deploy to IBM
Cloud](https://cloud.ibm.com/devops/setup/deploy/button.png)](https://cloud.ibm.com/devops/setup/deploy?repository=https://gitlab.inria.fr/ytanaka/6tisch-simulator-webapp&branch=master)

By clicking the button, you will have:

* Continuous Delivery service under your Resource List (unless you've
  already had one)
* A Toolchain for the app at resource group, cloud foundry org, and
  location you've selected
* A cloned repository of the 6TiSCH Simulator WebApp at the IBM hosted
  GitLab site of the same region as the toolchain
* A "ready-for-use" cloud foundry app of the 6TiSCH Simulator WebApp

The app will be automatically built in several minutes and you can
access the app through `View app` button on the toolchain page or
`Visit App URL` button on the cloud foundry app page. To stop the app,
you need to do it manually on the Cloud Foundry menu of IBM Cloud.

You can find the resulting toolchain at the Toolchains list past in
`DevOps` menu. If you cannot find the toolchain, please confirm the
right resource group, cloud foundry org, and regions are selected at
the Toolchains list page.

The API key you've created for this app can be found `Manage > Access
(IAM) > Users > API Keys` menu.


## Prerequisites

* Python 2.7.x
* Node.js 10.15.0 and above
* [The 6TiSCH Simulator](https://bitbucket.org/6tisch/simulator/src) v1.1.7 and above


## Installation

If you want to use the app locally, follow these steps:

1. clone or download this repository
1. go into the root directory: `$ cd 6tisch-simulator-webapp`
1. install dependencies:
    * `$ npm install`
    * `$ pip install -r requirements.txt`
1. build the frontend: `$ npm run build`
1. edit `backend.config.json` if necessary

In `backend.config.json`, you need to have the right paths to the
6TiSCH Simulator source directory and a directory where trace files
are stored. The default directory configuration is shown below:

```
.
├── 6tisch-simulator-app
└── simulator
    └── traces
```


## Usage


Run `backend/start`, then access to `http://127.0.0.1:8080` by your
web browser:

```
$ backend/start
Starting the backend server on 127.0.0.1:8080
```

To stop the backend, use `Ctrl-C`.


## Useful Commands for Developers

* `$ npm run serve`: run
  [webpack-dev-server](https://github.com/webpack/webpack-dev-server)
  and `backend` server with `--auto-restart` and `--dev`
* `$ npm run dev-server`: run only webpack-dev-server
* `$ npm run backend-dev-server`: equivalent to `$ backend/start --auto-restart --dev`

With `--auto-restart` option, the `backend` server will be restarted
automatically when it detects file changes under the directories of
the 6TiSCH Simulator and the 6TiSCH Simulator WebApp.
