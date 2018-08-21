FROM node:10.8
RUN npm install -g nodemon
EXPOSE 9222
ENV NODE_ENV development
WORKDIR /usr/local/app
ENTRYPOINT nodemon --inspect=0.0.0.0:9222 lib/server
