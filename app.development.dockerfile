FROM node:7.5.0

ENV NODE_ENV development
ENV PORT 9000

EXPOSE 9000

WORKDIR /app

VOLUME ["/app"]

CMD node server/app.js

# TODO: Support debug flags --debug --debug-brk
