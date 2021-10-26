# Fullstack Challenge - Backend

## Introduction

This project was developed in Nodejs.

## Requirements
  
For running that application you must install following tools:

- [Node](https://nodejs.org/pt-br/download/)
- [Docker](https://www.docker.com/products/docker-desktop)
- [Docker-Compose](https://docs.docker.com/compose/install/)


### Configure Project

1. Clone this repository.
2. In root directory of this repository, run following commands:
```
npm install

docker-compose up -d
``` 

Note: When you execute docker-compose you start mongodb docker, so you need to run the command <b>docker-compose down</b> to stop postegresSQL's docker.


### Run application

Execute the following command:

```
npm start
```

### Run Tests

Execute the following command:

```
npm test
```


### Endpoints

- Load CSV file: http://localhost:3000/v1/upload - Note: request CSV file is placed in <b>test/files/patients.csv</b>
- Health applicaiton: http://localhost:3000/v1/health

### Notes

- In postman folder in this repository contains a collection for end-to-end tests in Postman.
