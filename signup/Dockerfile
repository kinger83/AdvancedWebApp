# Base image
FROM node:16

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the source code
COPY ./signup .

# Expose the port
EXPOSE 8082

# Run the application
CMD [ "npm", "start" ]
