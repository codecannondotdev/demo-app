# Generated Application Local Setup

## Prerequisites

Generated applications come with a fully configured and configurable local
development environment. To get started, you will need to install
[Docker](https://docs.docker.com/get-docker/) and
[Docker Compose](https://docs.docker.com/compose/install/).

If you haven't generated an app yet, you can use our
[demo app](https://github.com/codecannondotdev/demo-app.git) to get familiar with the
environment. To get the full power of codecannon, you should generate your own app
at [codecannon.dev](https://codecannon.dev).

For more information plese refer to the
[codecannon documentation](https://docs.codecannon.dev).

## First time setup

1. Clone the repository

```bash
# Replace github repo URL with your own upon code delivery
git clone https://github.com/codecannondotdev/demo-app.git
```

2. Copy the local example .env file

```bash
cp .env.example .env
cp api/.env.example api/.env
cp ui/.env ui/.env.local
```

3. Configure UID/GID (optional but recommended)

To avoid file permission issues when Docker containers create files on your host system, you should configure your user ID (UID) and group ID (GID) in the `.env` file. This ensures that files created inside containers are owned by your host user.

You can automatically set these values by running:

```bash
./setup-uid-gid.sh
```

Or manually add them to your `.env` file:

```bash
# Get your UID and GID
id -u  # Your UID
id -g  # Your GID

# Add to .env file
HOST_UID=1000
HOST_GID=1000
```

If you don't set these values, Docker will use the default user IDs from the container, which may cause permission issues when accessing files created by the containers.

4. Start the local environment

```bash
docker compose up
```

## Accessing the local environment

You can find the docker compose file for the local environment in the root of the
repository (`docker-compose.yml`). The local environment consists of the following
services:

- **api**: Laravel API
  - Accessible at [http://localhost:9999/api](http://localhost:9999/api) by default
- **ui**: Vue SPA
  - Accessible at [http://localhost:9999](http://localhost:9999) by default
- **proxy**: Traefik reverse proxy
  - Routes requests to the appropriate service based on the URL
- **mailhog**: Mail Testing Service
  - Accessible at [http://localhost:8025](http://localhost:8025) for viewing sent emails

You can change your settings in the .env file in the root of the repository
(`.env.example`).

### Changing the application host

You can change the application host (URL) by changing the `APP_URL` variable in
the `.env` file. This will change the URL at which the application is accessible.

```sh
# APP_URL: Application URL (both frontend and backend).
# URL should be without trailing slash, and wihtout http/https prefix.
# Example: localhost
APP_URL=localhost
```

### Changing the application port

You can change the application port by changing the `APP_PORT` variable in the
`.env` file. This will change the port at which the application is accessible.

```sh
# APP_URL: Application port (both frontend and backend).
# Should be a valid port number.
# Example: 80
APP_PORT=80
```

### Email Configuration

The application includes email verification functionality, which is configured to use MailHog for local development. MailHog allows you to view all sent emails without actually sending them to real email addresses.

To view emails sent during development (such as verification emails):
1. Access the MailHog web interface at [http://localhost:8025](http://localhost:8025)
2. All emails sent by the application will appear here

For production deployment, update the mail configuration in your `.env` file with your actual mail provider credentials:

```sh
MAIL_USERNAME=your-mail-username
MAIL_PASSWORD=your-mail-password
```

Additional mail configuration settings like host, port, and encryption can be configured in the `api/.env` file.
