# Idea Wall
This awesome application lets you post ideas, to a wall.  Clue is in the name, hey?

This application is not actually a genuine app, it's to be used in the docker/kubernetes workshop.

## Dependencies
This application writes its data to Redis, so you need to have a redis to connect it to.

## Building & Running
The following steps will get you into a working state:

  - `npm install`
  - `npm run assets`
  - set environment variables `REDIS_HOST` and `REDIS_PASSWORD` to the right values
  - `npm run start`

The application should then be on http://127.0.0.1:9000
