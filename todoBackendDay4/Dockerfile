# Stage 1: Build Stage
FROM node:18 AS build
# Set the working directory
WORKDIR /app
# Copy the package.json and package-lock.json files
COPY package*.json ./
# Install dependencies
RUN npm install
# Copy the rest of the application code
COPY . .

# Set a default port value if not provided
ARG PORT=8000
ENV PORT=${PORT}

# Expose the port
EXPOSE ${PORT}

# Start node server
CMD ["npm", "start"]