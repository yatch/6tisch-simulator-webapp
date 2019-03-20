# 6TiSCH Simulator WebApp

This app provides a web user-interface for [the 6TiSCH
Simulator](https://bitbucket.org/6tisch/simulator/src).


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


## Caveat

You could have a different simulation result by the WebApp from one by
`runSim.py` of the simulator even though you use the same random seed
due to a limitation in implementation.


## Useful Commands for Developers

* `$ npm run serve`: run
  [webpack-dev-server](https://github.com/webpack/webpack-dev-server)
  and `backend` server with `--auto-restart` and `--dev`
* `$ npm run dev-server`: run only webpack-dev-server
* `$ npm run backend-dev-server`: equivalent to `$ backend/start --auto-restart --dev`

With `--auto-restart` option, the `backend` server will be restarted
automatically when it detects file changes under the directories of
the 6TiSCH Simulator and the 6TiSCH Simulator WebApp.
