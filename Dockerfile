# Specify the base image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire app directory to the working directory
COPY . .

# Set the command to run the app
CMD [ "npm", "start" ]
