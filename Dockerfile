#define the version of node
FROM node:15.1-alpine
# pour palier a l'installation de bcrypt ou de dependance manquante
RUN apk add --update alpine-sdk && \
    apk add libffi-dev openssl-dev && \
    apk add python-dev python3-dev
# create a working directory for the container
RUN mkdir /app
# define app as working container directory
WORKDIR /app
#copy all package  with ext json in root of workdir
COPY package*.json ./
#copy tsconfig
COPY tsconfig.json ./
# install package
COPY ./src src
# run while build package instalation
RUN npm i
COPY .env .env
# will expose the container on PORT 4000
EXPOSE 4000
#start the container
CMD npm start

