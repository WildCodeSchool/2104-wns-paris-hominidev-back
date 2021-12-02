#!/bin/ash
#define the version of node
FROM node:15.1-alpine
# pour palier a l'installation de bcrypt ou de dependance manquante
RUN apk add --update alpine-sdk && \
    apk add libffi-dev openssl-dev && \
    apk add python-dev python3-dev

# define app as working container directory
WORKDIR /pygma-server
#copy all package  with ext json in root of workdir
COPY package*.json ./
#copy tsconfig
COPY tsconfig.json ./
#copy le dossier src
COPY src src
#copy les variables d'environement
COPY .env .env
# will expose the container on PORT 4000
EXPOSE 4000
# launch script stuffs
COPY launch.sh ./
RUN chmod +x ./launch.sh
ENTRYPOINT ["/bin/sh", "./launch.sh"]

