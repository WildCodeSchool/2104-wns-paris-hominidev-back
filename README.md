# PYGMA.LINK
## Installation
### Get the sources on the right place
``` 
mkdir pygma.link
cd pygma.link
git clone https://github.com/WildCodeSchool/2104-wns-paris-hominidev-back.git pygma-server
git clone https://github.com/WildCodeSchool/2104-wns-paris-hominidev-front.git pygma-client-ext
```

### Docker-compose
```
<<<<<<< HEAD
cd pygma-server
yarn run dockercompose
=======
cd pygma.link
docker-compose -f pygma-server/docker-compose.dev.yml up --build
>>>>>>> ef28c8a59096a690d807d7dc5a53580316c110ff
```

### Install extension
The build is available in /pygma.link/pygma-client-ext/build

It should work in Chrome flavor like browser & firefox. You must pick the manifest.json in Firefox.

### Special commands
Build docker image : 
```
    yarn dockbuild
```
run docker image : 
```
    yarn dockrun
```