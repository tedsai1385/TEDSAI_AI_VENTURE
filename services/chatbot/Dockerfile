FROM node:18-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (production only)
RUN npm ci --only=production

# Copy app source
COPY . .

# Set environment variables (Defaults, can be overridden)
ENV PORT=8080

# Expose port
EXPOSE 8080

# Start command
CMD ["node", "index.js"]
