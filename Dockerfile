from node:12-alpine

# Create app directory
WORKDIR /code

# Install app dependencies
COPY package*.json ./

RUN if [ "$NODE_ENV" = "dev" ]; then \
        npm install; \
    else \
        npm ci --only=production; \
    fi

# Copy tsconfig and env files
COPY ts*.json ./
COPY .env* ./

EXPOSE 3000
