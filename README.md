# Geoweb Referral

An API to store all the referral claims and retrieve them made in [nestjs](https://nestjs.com/)

It has two ports, one port for the public routes and one for the private routes. By default these are 3000 and 3001 so be careful when you forward your ports.

## Getting started

### Installation

#### Install Docker

Follow this [official guide](https://docs.docker.com/get-docker/) to install Docker, and [this one](https://docs.docker.com/compose/install/) to install Docker compose.\
If you want to play a little bit with Docker, you can follow this [tutorial](https://docker-curriculum.com)

#### Install Geoweb Referral

```sh
# Get the project
git clone git@github.com:0xtekgrinder/geoweb-referral.git
cd geoweb-referral

# Build docker image
docker compose build
```

### Quickstart

#### Run Geoweb Referral

```sh
# Run docker image
docker compose up
```

You are now ready to access to your API at [`http://localhost:3000`](http://localhost:3000) and [`http://localhost:3001`](http://localhost:3001)

## Documentation

You can access the swagger documentation at `doc` route.

Just be sure to keep in mind that admin routes are on port 3001 and app routes are on port 3000.