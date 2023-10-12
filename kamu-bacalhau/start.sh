#!/bin/bash

nohup ipfs daemon &
nohup kamu system api-server --http-port 3080 --address 0.0.0.0
npm run dev