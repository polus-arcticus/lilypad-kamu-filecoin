FROM node:20.7-buster
RUN apt-get update && apt-get install build-essential curl -y
RUN curl -LO https://github.com/Kitware/CMake/releases/download/v3.20.0/cmake-3.20.0-linux-x86_64.sh \
    && chmod +x cmake-3.20.0-linux-x86_64.sh \
    && ./cmake-3.20.0-linux-x86_64.sh --prefix=/usr/local --exclude-subdir --skip-license \
    && rm cmake-3.20.0-linux-x86_64.sh
WORKDIR /app
COPY start.sh .
RUN wget https://dist.ipfs.tech/kubo/v0.22.0/kubo_v0.22.0_linux-amd64.tar.gz
RUN tar -xvzf kubo_v0.22.0_linux-amd64.tar.gz
RUN cd kubo && bash install.sh
# get working with macos
RUN curl -s "https://get.kamu.dev" | sh
RUN ln -s /root/.local/bin/kamu /usr/local/bin/kamu

#COPY package.json .
#RUN npm install

EXPOSE 3000
# Swarm TCP; should be exposed to the public
EXPOSE 4001
# Swarm UDP; should be exposed to the public
EXPOSE 4001/udp
# Daemon API; must not be exposed publicly but to client services under you control
EXPOSE 5001
# Web Gateway; can be exposed publicly with a proxy, e.g. as https://ipfs.example.org
EXPOSE 8080
# Swarm Websockets; must be exposed publicly when the node is listening using the websocket transport (/ipX/.../tcp/8081/ws).
EXPOSE 8081

# Talk to Kamu Http gateway
EXPOSE 3080
# Talk to Kamu Ui
EXPOSE 36083

ENV ADDRESS=0.0.0.0 PORT=3000

CMD ["/app/start.sh"]