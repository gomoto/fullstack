FROM node:7.5.0

ENV NODE_ENV production
ENV PORT 9000

EXPOSE 9000

WORKDIR /opt/app

COPY package.json ./
RUN npm install --only=production

COPY app .

ENTRYPOINT ["node", "server/app.js"]

# Add debug flags as docker run commands. For example:
# docker run image --debug --debug-brk
