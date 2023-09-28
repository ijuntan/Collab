# tell which version node to use
FROM node:18-alpine

# app directory
WORKDIR /app

# copy package.json and package-lock.json
COPY package*.json ./

# install the dependencies
RUN npm install

COPY . .

# expose port 5000
EXPOSE 5000

CMD [ "npm", "start" ]
