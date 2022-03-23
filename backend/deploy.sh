#!/bin/bash

echo What should the version be?
read VERSION

sudo docker build -t davidprokopec/share.it.backend:$VERSION .
sudo docker push davidprokopec/share.it.backend:$VERSION
ssh root@167.99.220.83 "docker pull davidprokopec/share.it.backend:$VERSION && docker tag davidprokopec/share.it.backend:$VERSION dokku/api:$VERSION && dokku tags:deploy api $VERSION"