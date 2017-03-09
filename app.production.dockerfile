FROM node:7.5.0

ENV NODE_ENV production
ENV PORT 9000

EXPOSE 9000

WORKDIR /app

COPY server/package.json ./server
RUN cd server && npm install --only=production

COPY app .

CMD ["node", "server/app.js"]
