FROM node:13.7.0-alpine3.10

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .
EXPOSE 3003

ARG VAR_PAT
ARG VAR_OWNER

ENV PORT=3003
ENV GIT_PAT=$VAR_PAT
ENV GIT_OWNER=$VAR_OWNER
ENV GIT_REPO="policies"
ENV GIT_BRANCH="master"

CMD ["node", "index.js"]
