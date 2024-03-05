# Specify the base image. Use the official Node.js image from Docker Hub.
FROM node:20

# Set the working directory inside the container to /app.
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to the working directory.
COPY package*.json ./

# Install project dependencies.
RUN npm install

# Copy the rest of your application's source code from your host to your image filesystem.
COPY . .

# Expose the port your app runs on.
EXPOSE 3000

# Command to run your app using Node.js
CMD ["node", "index.js"]
