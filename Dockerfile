FROM node:18-alpine3.15 as base

# Create app directory
WORKDIR /app

# Add Maintainer Info
LABEL maintainer="Arnob <arnobxtreme@gmail.com>"

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

EXPOSE 4242


CMD [ "node", "server.js" ]