# policy-manager
Rego policy manager for kubernetes

```bash
export GIT_BRANCH='master' \
export GIT_REPO='policies' \
export GIT_OWNER='' \
export GIT_PAT='' \
export PORT=3003 \
export HOST_NAME='0.0.0.0' 
```

```bash
docker build -t {user}/z-policy-manager:{version}  \
--build-arg VAR_PAT="Personal Access Token" \
--build-arg VAR_OWNER="Repository Owner" .
```

```bash
docker run --name z-policy-manager -d -p 8443:8443 {user}/z-policy-manager:{version}
```