FROM node:latest

#RUN npm install -g nodemon

RUN mkdir -p /usr/server

WORKDIR /usr/server

COPY package*.json ./

# set dependences
RUN npm install

# copy all files
COPY . .

RUN npm run build

EXPOSE 4001

CMD [ "npm", "start" ]
#CMD [ "nodemon", "dist/server.js" ]