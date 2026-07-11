FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

# Expose host to allow Vite to be accessible from outside the container
CMD ["npm", "run", "dev", "--", "--host"]
