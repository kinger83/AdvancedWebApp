# Base image
FROM node:16

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the source code
COPY ./landing .

# Expose the port
EXPOSE 8083

# Run the application
CMD [ "npm", "start" ]
