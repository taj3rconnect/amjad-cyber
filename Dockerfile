# Local copy of the static site. Production stays on GitHub Pages.
FROM nginxinc/nginx-unprivileged:1.30.6-alpine

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY . /usr/share/nginx/html/amjad-cyber/
# Replaces the production config so this copy never reaches the live Worker.
COPY docker/config.local.js /usr/share/nginx/html/amjad-cyber/config.js

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1
