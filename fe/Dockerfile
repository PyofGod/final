# Base image with Node.js
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy project files into the container
COPY . .

# Expose the development server's port
EXPOSE 8080

# Default command to run the development server
CMD ["npm", "run", "dev"]
