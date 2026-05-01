# Frontend Dockerfile
FROM node:20-alpine

WORKDIR /app/frontend

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Expose React port
EXPOSE 3000

# Set environment variables for development
ENV WDS_SOCKET_PORT=0
ENV CI=true

# Start React app
CMD ["npm", "start"]
