FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Backend API
ENV PORT=4000
EXPOSE 4000

CMD ["npm", "start"]