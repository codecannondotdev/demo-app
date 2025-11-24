# Stage 1: Build the UI
# Use a node image that includes bun, or a bun-specific image if available
FROM node:24-alpine AS ui-builder

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package.json package-lock.json ./

# Change directory to /ui, install dependencies and build the UI
RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline --no-audit --no-fund;

# Copy the source code contents into the container
COPY . .

# Set the GITHUB_SHA environment variable for Sentry release tracking
ARG GITHUB_SHA=""
ENV GITHUB_SHA="${GITHUB_SHA}"

RUN NODE_OPTIONS=--max_old_space_size=4096 npm run build;

#------------------------------------------------------------------------------

FROM caddy:2.10-alpine AS runtime-production

RUN \
	addgroup -S codecannon -g 1000; \
	adduser -S codecannon -u 1000 -G codecannon; \
	chown -R codecannon:codecannon /config/caddy /data/caddy;

COPY --from=ui-builder --chown=codecannon:codecannon /app/dist /app

COPY --chown=codecannon:codecannon ./ui/Caddyfile /etc/caddy/Caddyfile

USER codecannon:codecannon

#------------------------------------------------------------------------------

FROM node:24-alpine AS runtime-local

USER root:root

RUN apk add --no-cache bash shadow findutils;

# Install gosu
ENV GOSU_VERSION 1.19
RUN set -eux; \
	\
	apk add --no-cache --virtual .gosu-deps \
		ca-certificates \
		dpkg \
		gnupg \
	; \
	\
	dpkgArch="$(dpkg --print-architecture | awk -F- '{ print $NF }')"; \
	wget -O /usr/local/bin/gosu "https://github.com/tianon/gosu/releases/download/$GOSU_VERSION/gosu-$dpkgArch"; \
	wget -O /usr/local/bin/gosu.asc "https://github.com/tianon/gosu/releases/download/$GOSU_VERSION/gosu-$dpkgArch.asc"; \
	\
# verify the signature
	export GNUPGHOME="$(mktemp -d)"; \
	gpg --batch --keyserver hkps://keys.openpgp.org --recv-keys B42F6819007F00F88E364FD4036A9C25BF357DD4; \
	gpg --batch --verify /usr/local/bin/gosu.asc /usr/local/bin/gosu; \
	gpgconf --kill all; \
	rm -rf "$GNUPGHOME" /usr/local/bin/gosu.asc; \
	\
# clean up fetch dependencies
	apk del --no-network .gosu-deps; \
	\
	chmod +x /usr/local/bin/gosu; \
# verify that the binary works
	gosu --version; \
	gosu nobody true;

COPY ./docker-entrypoint-local.sh /root/docker-entrypoint-local.sh
RUN chmod +x /root/docker-entrypoint-local.sh;
ENTRYPOINT ["/root/docker-entrypoint-local.sh"]
