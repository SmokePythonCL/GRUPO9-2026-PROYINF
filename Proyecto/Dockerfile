FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Default to mock API for black-box testing
ENV PORT=4000
EXPOSE 4000

CMD ["npm", "run", "mock"]