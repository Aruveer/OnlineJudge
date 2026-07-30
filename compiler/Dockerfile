FROM node:18-alpine

WORKDIR /app

# Install Python, GCC/G++ (for C++), and OpenJDK (for Java)
RUN apk add --no-cache python3 g++ openjdk11

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5001

CMD ["node", "server.js"]
