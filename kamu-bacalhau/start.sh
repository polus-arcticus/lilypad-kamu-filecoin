#!/bin/bash

ipfs config Addresses.Gateway /ip4/0.0.0.0/tcp/8080
ipfs config Addresses.API /ip4/0.0.0.0/tcp/5001
ipfs init
kamu init
kamu config set --user protocol.ipfs.httpGateway "http://0.0.0.0:8080"

nohup ipfs daemon &
nohup kamu system api-server --http-port 3080 --address 0.0.0.0 &
nohup kamu ui --http-port 36083 --address 0.0.0.0 &
npm run dev