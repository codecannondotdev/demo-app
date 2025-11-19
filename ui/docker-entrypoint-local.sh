#!/usr/bin/env bash
set -Eeuo pipefail

# This entrypoint syncs your host user's uid and gid with the docker user's uid
# and gid. This is done, so that files created inside the container by, for example,
# installing dependencies are owned by the host user, resulting in fewer permission
# issues during development. This can be removed without any consequence to
# production builds, it'll just hurt local ergonomics.

# Config
USER_NAME="node"
GROUP_NAME="node"
HOST_UID="${HOST_UID:-}"
HOST_GID="${HOST_GID:-}"

# If host IDs aren't provided, do nothing.
if [[ -z "$HOST_UID" || -z "$HOST_GID" ]]; then
  exec gosu "$USER_NAME:$GROUP_NAME" "$@"
fi

# Current IDs
OLD_UID="$(id -u "$USER_NAME")"
OLD_GID="$(id -g "$USER_NAME")"

# 1) If already matching, we're done.
if [[ "$OLD_UID" == "$HOST_UID" && "$OLD_GID" == "$HOST_GID" ]]; then
  exec gosu "$USER_NAME:$GROUP_NAME" "$@"
fi

# 2) Update the user's UID/GID to host values
groupmod -g "$HOST_GID" "$GROUP_NAME"
usermod  -u "$HOST_UID" -g "$GROUP_NAME" "$USER_NAME"

# 3) Update ownership of all files/folders that had the old IDs
#    (skip virtual FS to avoid noise)
find / \
  \( -path /proc -o -path /sys -o -path /dev -o -path /run \) -prune -o \
  \( -uid "$OLD_UID" -o -gid "$OLD_GID" \) \
  -exec chown -h "$HOST_UID:$HOST_GID" {} + || true

# Run the requested command as the (possibly updated) user
exec gosu "$USER_NAME:$GROUP_NAME" "$@"
