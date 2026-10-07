---
outline: 'deep'
---

# Docker Setup Documentation

Codecannon apps include preconfigured Docker setups to simplify both local
development and production deployments. This guide covers detailed steps for
setting up your local Docker environment.

## Local Dev Environment

### Setup

Follow these steps to set up and run your local Docker environment:

1. **Clone the Repository**

```bash
git clone https://github.com/codecannondotdev/demo-app.git
```

2. **Configure Environment Variables**

```bash
cp .env.example .env
cp api/.env.example api/.env
cp ui/.env ui/.env.local
```

3. **Configure UID/GID (Linux only)**

`HOST_UID` and `HOST_GID` are blank by default, so the local Docker entrypoints skip UID/GID remapping.

On macOS with Docker Desktop, leave these variables blank. No additional setup is required.

On Linux, set these values if you want bind-mounted files created by containers to stay aligned with your host user. You can do that by running:

```bash
./setup-uid-gid.sh
```

Or manually add them to your `.env` file on Linux:

```bash
# Linux only: get your UID and GID
id -u  # Your UID
id -g  # Your GID

# Add to .env file
HOST_UID=1000
HOST_GID=1000
```

If you leave these values unset on Linux, files created through bind mounts may be owned by the container user instead of your host user.

4. **Start Docker Compose**

```bash
docker compose up
```

### Access

- **UI**: [`http://localhost:9999`](http://localhost:9999)
- **API**: [`http://localhost:9999/api`](http://localhost:9999/api)
- **MailHog**: [`http://localhost:7788`](http://localhost:7788)

### Customization

Customize your application settings using `.env`:

```bash
# ===================================================
#  Application Configuration
# ===================================================

# APP_NAME: Application name which will be used for prefixes, notifications,
# titles and any other places where the app name is required
# Example: codecannon
APP_NAME=codecannon

# HTTP_PROTOCOL: Application protocol which will be used for generating links
# with all of the other urls.
# Possible values: http, https
HTTP_PROTOCOL=http

# APP_URL: Application URL (both frontend and backend).
# URL should be without trailing slash, and wihtout http/https prefix.
# Example: localhost
APP_URL=localhost

# APP_URL: Application port (both frontend and backend).
# Should be a valid port number.
# Example: 80
APP_PORT=9999

# ===================================================
#  Mail Configuration
# ===================================================

# For local development, the default configuration uses MailHog
# To see emails, access the MailHog web interface at http://localhost:7788

# MAIL_USERNAME: Mail server username (if necessary)
# Not needed for MailHog
MAIL_USERNAME=null

# MAIL_PASSWORD: Mail server password (if necessary)
# Not needed for MailHog
MAIL_PASSWORD=null

# ===================================================
#  User/Group ID Configuration
# ===================================================

# HOST_UID: Linux-only host user ID for container user mapping
# On Linux, set this to your host UID to avoid bind-mount ownership issues.
# On macOS with Docker Desktop, leave this blank.
# Example (Linux): 1000
HOST_UID=

# HOST_GID: Linux-only host group ID for container user mapping
# On Linux, set this to your host GID to avoid bind-mount ownership issues.
# On macOS with Docker Desktop, leave this blank.
# Example (Linux): 1000
HOST_GID=
```

For other .env variables you can customize `ui/.env.local` and `api/.env` files.

## Production Environment

Codecannon apps also ship with production docker files for running apps on a
simple production server. While we recommend using kubernetes for production
deployments, the production `docker-compose.production.yml` can also be used.

The example production deployment configs are meant for the simplest HTTPS
deployment we could come up with. For running actual production servers
you'll likely want to configure the apps a bit differently. The included
configs should be a good jumping off point.

### Setup

#### Assumptions
- **You have a server with `docker` and `docker compose` installed**

- **Your server has enough memory/swap to handle building of the UI** (around
    2GB memory is usually sufficient, if you have less, check out this
    guide to help you set up swap: [Swap guide](https://www.digitalocean.com/community/tutorials/how-to-add-swap-space-on-ubuntu-20-04))

- **You have an SMTP mail server for sending emails to users**. If you don't have
    this yet, you can still test the app with the default user without it.

- **You have a domain and doman records configured and pointing to your server**.
    This is required if you want to obtain an SSL certificate. If you don't
    have a domain, you'll likely need to tweak a few configs, otherwise the
    deployment should work with default configs.

- **You have no other servers running on port 80 and 443**. The docker-compose
    config binds these ports to your host, so if you have other services
    running on those ports the default setup won't work, but you can always
    configure a reverse proxy if needed.

- **Ports 80 and 443 are exposed**. Relevant if you have a firewall, and required
    for the app to be visible outside your local network.

#### Deployment

0. *(OPTIONAL)* Update `api/.env.production.example` to point to your mail server
    - **This step is optional if you just want to see the app in action**. If
        you want registration, email verification and password resets to work
        you'll need to set up a mailing server.
    - If you have a mail server, we recommend updating and commiting the
        `MAIL_HOST`, `MAIL_PORT`, `MAIL_FROM_ADDRESS` and `MAIL_FROM_NAME`
        variables in the `api/.env.production.example` file, as these usually
        aren't sensitive information.
    - If you don't want to commit any of these variables, you can always add
        them to the root `.env` file and pass them to the `api` service in
        `docker-compose.production.yml`

1. Clone your repository to your server
```bash
git clone https://github.com/codecannondotdev/demo-app.git
```

2. Copy production .env files
```bash
cp .env.production.example .env
cp api/.env.production.example api/.env
cp ui/.env ui/.env.local
```

:::info
The `APP_KEY` property in `api/.env` can be generated automatically. For this to work `api/.env` needs to be owned by `1000:1000`. You can do this by running `sudo chown 1000:1000 api/.env` or you can just set the `APP_KEY` value manually.
:::


3. Update the root `.env` file
    - Set the `APP_DOMAIN` to your domain
    - Set the `ACME_EMAIL` to an email address used for obtaining SSL certs
    - Set the `MAIL_USERNAME` and `MAIL_PASSWORD` for your mailing provider (if
        you don't have one yet, these can remain unset)

4. Run the app stack
```bash
docker compose -f docker-compose.production.yml up
```

That should be everything that's required for the app to start with `https` enabled.

You should now be able to access your app on your `APP_DOMAIN`.

## Overview

- Codecannon apps ship with a local and production docker configuration
- The production docker configs are the simplest we could make them but you
are free to extend and modify them as you see fit
- If you have any issues deploying the apps, we would be happy to have a look
with you, so ping us in our [Discord](https://discord.com/channels/1235556510311120896/1376637504551260170)
or send an email at [support@codecannon.dev](mailto:support@codecannon.dev)
