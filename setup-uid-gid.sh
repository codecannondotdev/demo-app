#!/usr/bin/env bash
set -Eeuo pipefail

# This script automatically detects and sets HOST_UID and HOST_GID in the .env file
# to match the current user's UID and GID. This helps avoid file permission issues
# when Docker containers create files on the host system.

ENV_FILE=".env"

# Check if .env file exists
if [[ ! -f "$ENV_FILE" ]]; then
  echo "Error: .env file not found. Please run 'cp .env.example .env' first."
  exit 1
fi

# Get current user's UID and GID
CURRENT_UID=$(id -u)
CURRENT_GID=$(id -g)

echo "Detected UID: $CURRENT_UID"
echo "Detected GID: $CURRENT_GID"

# Check if HOST_UID and HOST_GID already exist in .env
if grep -q "^HOST_UID=" "$ENV_FILE"; then
  # Update existing values
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS uses BSD sed
    sed -i '' "s/^HOST_UID=.*/HOST_UID=$CURRENT_UID/" "$ENV_FILE"
    sed -i '' "s/^HOST_GID=.*/HOST_GID=$CURRENT_GID/" "$ENV_FILE"
  else
    # Linux uses GNU sed
    sed -i "s/^HOST_UID=.*/HOST_UID=$CURRENT_UID/" "$ENV_FILE"
    sed -i "s/^HOST_GID=.*/HOST_GID=$CURRENT_GID/" "$ENV_FILE"
  fi
  echo "Updated HOST_UID and HOST_GID in $ENV_FILE"
else
  # Append new values
  echo "" >> "$ENV_FILE"
  echo "# Host user ID and group ID for Docker container user matching" >> "$ENV_FILE"
  echo "# Set automatically by setup-uid-gid.sh" >> "$ENV_FILE"
  echo "HOST_UID=$CURRENT_UID" >> "$ENV_FILE"
  echo "HOST_GID=$CURRENT_GID" >> "$ENV_FILE"
  echo "Added HOST_UID and HOST_GID to $ENV_FILE"
fi

echo "Configuration complete! Your UID ($CURRENT_UID) and GID ($CURRENT_GID) have been set in $ENV_FILE"

