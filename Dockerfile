# Build stage — compile l'admin Strapi
FROM node:22-alpine AS build
RUN apk update && apk add --no-cache \
    build-base gcc autoconf automake zlib-dev libpng-dev bash vips-dev git python3

WORKDIR /opt/
COPY package.json package-lock.json ./
RUN npm install -g node-gyp
RUN npm config set fetch-retry-maxtimeout 600000 -g && npm ci
ENV PATH=/opt/node_modules/.bin:$PATH

WORKDIR /opt/app
COPY . .

# Décommentez sur Doploy si l'admin ne charge pas (URL publique du CMS) :
# ARG STRAPI_ADMIN_BACKEND_URL=https://cms.votredomaine.com
# ENV STRAPI_ADMIN_BACKEND_URL=${STRAPI_ADMIN_BACKEND_URL}

ENV NODE_ENV=production
RUN npm run build

# Production stage — image légère
FROM node:22-alpine
RUN apk add --no-cache vips-dev build-base python3 su-exec
ENV NODE_ENV=production

WORKDIR /opt/
COPY --from=build /opt/package.json /opt/package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
ENV PATH=/opt/node_modules/.bin:$PATH

WORKDIR /opt/app
COPY --from=build /opt/app ./
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh \
  && mkdir -p public/uploads \
  && chown -R node:node /opt/app

EXPOSE 1337
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "run", "start"]
