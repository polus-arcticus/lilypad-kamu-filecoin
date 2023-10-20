#!/bin/bash

ipfs init
ipfs config Addresses.Gateway /ip4/0.0.0.0/tcp/8080
ipfs config Addresses.API /ip4/0.0.0.0/tcp/5001
kamu init
kamu config set --user protocol.ipfs.httpGateway "http://0.0.0.0:8080"

nohup ipfs daemon &
while true; do
  if ipfs id >/dev/null 2>&1; then
    echo "IPFS daemon is ready"
    break
  else
    echo "Waiting for IPFS daemon to start..."
    sleep 1
  fi
done
kamu add ./test/ca.bankofcanada.exchange-rates.daily.yaml
kamu system ipfs add ca.bankofcanada.exchange-rates.daily.yaml
#nohup kamu system api-server --http-port 3080 --address 0.0.0.0 &
#nohup kamu ui --http-port 36083 --address 0.0.0.0 &
#npm run dev