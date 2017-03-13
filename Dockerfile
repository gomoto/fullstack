FROM node:7.5.0

ENV NODE_ENV production
ENV PORT 9000

EXPOSE 9000

WORKDIR /build

# Install dependencies
COPY ./server/package.json ./package.json
RUN ["npm", "install", "--only=production"]

# Copy built app. Must build app before building this image.
COPY ./build .

CMD ["node", "server/app.js"]
