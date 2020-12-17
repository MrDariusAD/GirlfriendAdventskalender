FROM node:13-alpine as build
WORKDIR /app
COPY package*.json /app/
RUN yarn global add @ionic/cli
RUN yarn
COPY ./ /app/
RUN ionic build --prod

FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY ./deployment/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/www/ /usr/share/nginx/html/
CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]