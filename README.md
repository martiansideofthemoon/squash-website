# Generating Question-Answer Hierarchies - Website

This is the official repository for the website and demo accompanying the ACL 2019 long paper *[Generating Question-Answer Hierarchies](https://arxiv.org/abs/1906.02622)*. The main codebase and data can be found in [martiansideofthemoon/squash-generation](https://github.com/martiansideofthemoon/squash-generation).

To get started, place this repository as a sister folder to the repository [martiansideofthemoon/squash-generation](https://github.com/martiansideofthemoon/squash-generation). Your folder structure should look like this,

```
squash-root/squash-generation
squash-root/squash-website
```

## SQuASH Landing Page

The landing page is a static HTML file which can be found under [`squash-landing`](squash-landing). All the code is written in [`squash-landing/index.html`](squash-landing/index.html). The website is hosted at [http://squash.cs.umass.edu/](http://squash.cs.umass.edu/). This file has been adapted from [Rowan Zeller](https://rowanzellers.com)'s landing page for [HellaSwag](https://rowanzellers.com/hellaswag/).

## SQuASH Backend

The code for the SQuASH APIs and backend is found under [`squash-backend`](squash-backend). All the code is written in [`squash-backend/app.py`](squash-backend/app.py). The code requires Python 3.6+ (for the `secrets` module) as well as the python package [Flask](https://palletsprojects.com/p/flask/). This code triggers the scripts in a fork of the main SQuASH repository. To get started,

```
cd squash-backend
export FLASK_APP=app.py
python -m flask run --host 0.0.0.0 --port 3001
```

Remove the `--host 0.0.0.0` flag if you do not want to expose the APIs publicly. Also note that you will need to restart the Flask server to reflect edits in the codebase. This server is running on [http://squash.cs.mass.edu:3001](http://squash.cs.mass.edu:3001).

## SQuASH Frontend

The SQuASH frontend has been written in [ReactJS](http://reactjs.org/). To get started, make sure you the latest `npm` and `node` installed ([reference](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)). The dependencies for the frontend have been specified in [`squash-frontend/package.json`](squash-frontend/package.json).

To get started, first edit the [`squash-frontend/src/url.js`](squash-frontend/src/url.js) to point to the local server URL. Then, install the dependencies and run the frontend server (while the backend is running on a different process and port),

```
npm install
npm start
```

This server is running on [http://squash.cs.mass.edu:3000](http://squash.cs.mass.edu:3000).

## Citation

If you find this website demo useful, please cite us.

```
@inproceedings{squash2019,
Author = {Kalpesh Krishna and Mohit Iyyer},
Booktitle = {Association for Computational Linguistics,
Year = "2019",
Title = {Generating Question-Answer Hierarchies}
}
```