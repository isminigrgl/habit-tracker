FROM node:20
WORKDIR /app
COPY package*.json ./
RUN mpm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
