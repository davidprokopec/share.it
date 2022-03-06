#!/bin/bash

echo What should the version be?
read VERSION

sudo docker build -t davidprokopec/share.it:$VERSION .
sudo docker push davidprokopec/share.it:$VERSION
ssh root@141.144.248.167 "docker pull davidprokopec/share.it:$VERSION && docker tag davidprokopec/share.it:$VERSION dokku/api:$VERSION && dokku ps:rebuild api"