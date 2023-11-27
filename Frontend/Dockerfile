# We don't want to start from scratch.
# That is why we tell node here to use the current node image as base.
FROM node:18-alpine

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

# Build the app
ENV PORT=443
ENV REACT_APP_END_URL=https://collab-ntust-backend-j27rktigzq-de.a.run.app

RUN npm run build

EXPOSE 443

CMD ["npm", "start"]