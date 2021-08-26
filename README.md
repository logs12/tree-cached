# README #

## Initial environment ##
1. Need to install docker. You can download install package from address https://www.docker.com/

2. It is necessary to create a .env file in the root of the project folder from .env.sample with all process.env variables

3. In order to expand the working environment, you need to run the command at the root of the project
``docker-compose up``

    If any changes are made to the docker files, then you must run the same command with the prefix ``docker-compose up --build``

4. Interface application will be available in http://127.0.0.1:5000/
