FROM node:10.8
RUN npm install -g nodemon
ENV NODE_ENV development
WORKDIR /usr/local/app
ENTRYPOINT nodemon lib/server
