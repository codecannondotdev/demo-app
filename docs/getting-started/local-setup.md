# Local Setup

## Prerequisites

Generated applications come with a fully configured and configurable local
development environment. To get started, you will need to install [Docker](https://docs.docker.com/get-docker/).

If you haven't generated an app yet, you can use our [demo app](https://github.com/codecannondotdev/demo-app.git)
to get familiar with the environment. You can always build your own app using
our open source [app base](https://github.com/codecannondotdev/app-base.git), but to
unlock the full power of codecannon, you should generate your own app on [app.codecannon.dev](https://app.codecannon.dev).

If you're unsure how to do this, please refer to the [Getting Started](/getting-started/generating-applications) guide.

## Bundled documentation

Your app includes a copy of the CodeCannon documentation in `docs/` that matches
the version used to generate it. Use it to look up setup instructions, guides and
API reference as you develop your app.

With Node.js 24 installed, run the documentation locally:

```bash
cd docs
npm ci
npm run dev
```

Open the local URL printed by VitePress. To preview a production build, run
`npm run build` followed by `npm run preview` from `docs/`.

The included docs stay with your app, while the
[online documentation](https://docs.codecannon.dev) may describe a newer version.

## First time setup

1. Clone the repository

```bash
# Replace github repo URL with your own upon code delivery
git clone https://github.com/codecannon/demo-app.git
```

2. Copy the local example .env file

```bash
cp .env.example .env
cp api/.env.example api/.env
cp ui/.env ui/.env.local
```

3. Configure UID/GID (Linux only and optional but recommended)

`HOST_UID` and `HOST_GID` are blank by default, so the local Docker entrypoints skip UID/GID remapping.

On macOS with Docker Desktop, leave these variables blank. No additional setup is required.

On Linux, set these values if you want bind-mounted files created by containers to stay aligned with your host user. You can do that by running:

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

If you leave these values unset on Linux, files created through bind mounts may be owned by the container user instead of your host user.

4. Start the local environment

```bash
docker compose up
```

## Configuring local environment

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

---

See also:
  - [Essentials - Docker](/essentials/docker)
