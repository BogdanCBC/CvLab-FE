# Stage 1: Build
FROM node:22-alpine AS build
WORKDIR /app

ARG REACT_APP_BASE_URL

ENV REACT_APP_BASE_URL=$REACT_APP_BASE_URL

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

# Stage 2: Serve
FROM nginx:alpine

ARG DOMAIN=cvdev.feel-it-services.com
ENV SERVER_NAME=$DOMAIN

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf.template /tmp/nginx.conf.template
RUN envsubst '${SERVER_NAME}' < /tmp/nginx.conf.template > /etc/nginx/conf.d/default.conf && \
    rm /tmp/nginx.conf.template

COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
