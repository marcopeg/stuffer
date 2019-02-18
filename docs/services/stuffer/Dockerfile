#
# Build Production Artifacts
# ==========================================
#
# this first step takes in the source files and build the artifacts
# (basicall all that need to be transpiled).
#
# We do install the NPM dependencies twice so to copy over to the
# production image only what is strictly needed to execute our app.
# 
# NPM Install is the first step so to exploit Docker's cache mechanism
# and speed up the building process. We will re-install from NPM only
# if we touch the `package.json` file. Which doesn't happen so often.
#

FROM node:10.14-alpine AS builder

# Pass arguments down to the webpack builder to substitute variables
ARG REACT_APP_NAME

# NPM Install for building
WORKDIR /usr/src/app-build
ADD package.json /usr/src/app-build/package.json
RUN yarn install --production=false

# NPM Install for production
WORKDIR /usr/src/app-run
ADD package.json /usr/src/app-run/package.json
RUN cp /usr/src/app-build/yarn.lock ./
RUN yarn install --production=true

# Copy source files:
WORKDIR /usr/src/app-build
ADD index.js /usr/src/app-build
ADD .babelrc /usr/src/app-build
ADD .env /usr/src/app-build/.env
ADD .eslintrc /usr/src/app-build/.eslintrc
ADD .eslintignore /usr/src/app-build/.eslintignore
ADD webpack.config.extend.js /usr/src/app-build
ADD webpackDevServer.config.extend.js /usr/src/app-build
ADD react-intl-pack.js /usr/src/app-build

# Fix weird stuff with dependencies, can't explain why this is needed now
WORKDIR /usr/src/app-build
RUN yarn add react-loadable

# Fix a weird building problem related to CRA
# https://github.com/facebook/create-react-app/issues/6336
WORKDIR /usr/src/app-build
RUN yarn add terser@3.14.1

# Build backend
WORKDIR /usr/src/app-build
ADD ssr /usr/src/app-build/ssr
RUN npm run build:ssr

# Build frontend
WORKDIR /usr/src/app-build
ADD src /usr/src/app-build/src
RUN npm run build:src
ADD public /usr/src/app-build/public
RUN npm run build


#
# Runner Image
# ==========================================
#
# in this step we start over with a fresh image and copy only what is
# strictly necessary in order to run a production build.
#
# the idea is to keep this image as small as possible.
#

FROM node:10.14-alpine AS runner

# Copy assets for build:
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app-run/node_modules ./node_modules
COPY --from=builder /usr/src/app-build/build ./build
COPY --from=builder /usr/src/app-build/build-src ./build-src
COPY --from=builder /usr/src/app-build/build-ssr ./build-ssr
ADD package.json /usr/src/app
ADD index.js /usr/src/app





#
# Startup Info
# ==========================================
#

# Default environment configuration:
ENV NODE_ENV production
ENV LOG_LEVEL error
ENV GRAPHQL_MOUNT_POINT /api
ENV REACT_SSR no
ENV REACT_SSR_ENABLED no
ENV REACT_SSR_USE_CACHE no
ENV PG_PORT 5432
ENV PG_DATABASE pigtail
ENV PG_MAX_CONN_ATTEMPTS 10
ENV PG_CONN_ATTEMPTS_DELAY 2500

ENTRYPOINT [ "node", "index.js" ]
