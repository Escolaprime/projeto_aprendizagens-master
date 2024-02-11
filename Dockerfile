# Use the official Node.js 16.16 image as base
FROM node:16.16 as build-stage

RUN npm install -g vue-cli
# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

RUN npm run build

FROM nginx:latest

COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 3002

CMD ["nginx", "-g", "daemon off;"]