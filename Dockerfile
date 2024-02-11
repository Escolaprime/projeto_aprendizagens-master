# Use the official Node.js 16.16 image as base
FROM node:16.16 as build-stage

WORKDIR /app

COPY package*.json /app/

RUN npm install -g ionic

RUN npm install

COPY ./ /app/

RUN npm run-script build:prod

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build-stage /app/www/ /usr/share/nginx/html/