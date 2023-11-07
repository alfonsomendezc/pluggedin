#!/usr/bin/env bash
# exit on error
set -o errexit

npm install
npm run build

pipenv install

flask db init
flask db migrate
pipenv run upgrade