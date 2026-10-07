#!/usr/bin/env bash
set -Eeuo pipefail

ENV_FILE=".env"

# Check if .env file exists
if [[ ! -f "$ENV_FILE" ]]; then
  echo "Error: .env file not found. Please run 'cp .env.example .env' first."
  exit 1
fi

set_env_value() {
  local key="$1"
  local value="$2"

  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s/^${key}=.*/${key}=${value}/" "$ENV_FILE"
  else
    sed -i "s/^${key}=.*/${key}=${value}/" "$ENV_FILE"
  fi
}

if [[ "$OSTYPE" == "darwin"* ]]; then
  echo "macOS detected. Docker Desktop does not require HOST_UID/HOST_GID remapping."

  if grep -q "^HOST_UID=" "$ENV_FILE"; then
    set_env_value "HOST_UID" ""
  fi

  if grep -q "^HOST_GID=" "$ENV_FILE"; then
    set_env_value "HOST_GID" ""
  fi

  echo "Left HOST_UID and HOST_GID blank in $ENV_FILE"
  exit 0
fi

CURRENT_UID=$(id -u)
CURRENT_GID=$(id -g)

echo "Detected UID: $CURRENT_UID"
echo "Detected GID: $CURRENT_GID"

# Check if HOST_UID and HOST_GID already exist in .env
if grep -q "^HOST_UID=" "$ENV_FILE"; then
  set_env_value "HOST_UID" "$CURRENT_UID"
  set_env_value "HOST_GID" "$CURRENT_GID"
  echo "Updated HOST_UID and HOST_GID in $ENV_FILE"
else
  echo "" >> "$ENV_FILE"
  echo "# Linux-only host user ID and group ID for Docker container user matching" >> "$ENV_FILE"
  echo "# Set automatically by setup-uid-gid.sh" >> "$ENV_FILE"
  echo "HOST_UID=$CURRENT_UID" >> "$ENV_FILE"
  echo "HOST_GID=$CURRENT_GID" >> "$ENV_FILE"
  echo "Added HOST_UID and HOST_GID to $ENV_FILE"
fi

echo "Configuration complete! Your UID ($CURRENT_UID) and GID ($CURRENT_GID) have been set in $ENV_FILE"
