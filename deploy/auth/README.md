# Nginx basic-auth users

The gateway (`deploy/nginx.conf`) protects the whole site with HTTP basic auth.
Credentials live in `.htpasswd` in this directory, mounted read-only into the nginx
container at `/etc/nginx/auth/.htpasswd`.

**The real `.htpasswd` is gitignored. Never commit credentials.**

## Create / update a user

```bash
./scripts/set_password.sh <username>        # prompts for the password
# or non-interactive:
PASSWORD=secret ./scripts/set_password.sh <username>
```

Then reload nginx (no downtime):

```bash
docker compose exec nginx nginx -s reload
```

The stack will not let anyone in until `.htpasswd` exists with at least one user.
`.htpasswd.example` shows the file format (one `user:hash` line per user, apr1 or
bcrypt hashes). Health and readiness probes (`/api/health`, `/api/ready`) are exempt
from auth so deploy and monitoring keep working.
