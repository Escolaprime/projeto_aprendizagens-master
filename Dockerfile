# Use the official Node.js 16.16 image as base
FROM node:16.16 as build-stage

WORKDIR /app

COPY package*.json ./

RUN npm install -g ionic

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

FROM nginx:latest

COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 3002

CMD ["nginx", "-g", "daemon off;"]%