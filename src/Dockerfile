FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN mkdir -p uploads && chmod 755 uploads
ENV NODE_ENV=production
EXPOSE 4000
CMD ["node", "server.js"]