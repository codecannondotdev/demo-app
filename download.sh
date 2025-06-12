#!/usr/bin/env sh
#
# download_and_extract.sh
#
# Downloads a .tar.gz file from a private DigitalOcean Space and
# extracts it into a target folder, overwriting existing files.
#

set -exuo pipefail

########################################
# Variables
########################################

# Example endpoint: "nyc3.digitaloceanspaces.com"
SPACES_ENDPOINT="fra1.digitaloceanspaces.com"

# Your DigitalOcean Spaces bucket name
BUCKET_NAME="codedjen"

# The path/key to your .tar.gz file in the Space (e.g., "backups/sitebackup.tar.gz")
REMOTE_UI_TAR="generated/$USER_ID/$APP_ID/$BUILD_ID/ui.tar.gz"
REMOTE_API_TAR="generated/$USER_ID/$APP_ID/$BUILD_ID/api.tar.gz"

# Where to download the file locally before extracting
LOCAL_UI_TAR="/var/www/html/ui.tar.gz"
LOCAL_API_TAR="/var/www/html/api.tar.gz"

# Where to extract the files. Must already exist or you can create it
TARGET_UI_PATH="/var/www/html/ui"
TARGET_API_PATH="/var/www/html/api"

########################################
# Download from DigitalOcean Space
########################################
echo "Downloading s3://${BUCKET_NAME}/${REMOTE_UI_TAR} from DigitalOcean Space..."
aws --endpoint-url "https://${SPACES_ENDPOINT}" \
    s3 cp "s3://${BUCKET_NAME}/${REMOTE_UI_TAR}" "${LOCAL_UI_TAR}"
echo "Downloading s3://${BUCKET_NAME}/${REMOTE_API_TAR} from DigitalOcean Space..."
aws --endpoint-url "https://${SPACES_ENDPOINT}" \
    s3 cp "s3://${BUCKET_NAME}/${REMOTE_API_TAR}" "${LOCAL_API_TAR}"
echo "Download complete."

########################################
# Extract the archive (overwriting existing files)
########################################
echo "Extracting '${LOCAL_UI_TAR}' to '${TARGET_UI_PATH}'..."
tar -xzf "${LOCAL_UI_TAR}" -C "${TARGET_UI_PATH}" --overwrite
echo "Extracting '${LOCAL_API_TAR}' to '${TARGET_API_PATH}'..."
tar -xzf "${LOCAL_API_TAR}" -C "${TARGET_API_PATH}" --overwrite
echo "Extraction complete."

echo "Done!"
