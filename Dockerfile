
FROM scratch AS build-stage
ADD alpine-minirootfs-3.21.3-x86_64.tar /
RUN apk add --no-cache nodejs npm

ARG VERSION=1.0.0
ENV APP_VERSION=$VERSION

WORKDIR /app

COPY app.js .
COPY package.json .

RUN npm install

FROM nginx:alpine

COPY --from=build-stage /app /app

RUN apk add --no-cache nodejs npm

ARG VERSION=1.0.0
ENV APP_VERSION=$VERSION

RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    location / { \
        proxy_pass http://localhost:3000; \
        proxy_http_version 1.1; \
        proxy_set_header Upgrade $http_upgrade; \
        proxy_set_header Connection "upgrade"; \
        proxy_set_header Host $host; \
        proxy_cache_bypass $http_upgrade; \
    } \
}' > /etc/nginx/conf.d/default.conf

HEALTHCHECK --interval=30s --timeout=3s CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

EXPOSE 80

CMD sh -c "cd /app && node app.js & nginx -g 'daemon off;'"
