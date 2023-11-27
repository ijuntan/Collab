FROM node:18

# Create an application directory
RUN mkdir -p /app

# The /app directory should act as the main application directory
WORKDIR /app

# Copy the app package and package-lock.json file
COPY ./package*.json ./

# Install node packages
RUN npm install

# Copy or project directory (locally) in the current directory of our docker image (/app)
COPY . .

#Expose PORT
EXPOSE 5000
EXPOSE 8000

# Start the app
CMD [ "npm", "start" ]