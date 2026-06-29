#!/bin/sh
set -e

mkdir -p /opt/app/public/uploads
chown -R node:node /opt/app/public/uploads

cd /opt/app
exec su-exec node "$@"
