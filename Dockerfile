FROM node:alpine
WORKDIR /usr/src
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["node", "src/server.js"]
