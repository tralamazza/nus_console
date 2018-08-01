## NUS console

This will scan and connect to the first BLE peripheral advertising the nordic UART service (`6e400001b5a3f393e0a9e50e24dcca9e`).

![nrf52 console image](mp_nrf52.gif)


### noble issue with Node 10

Noble depends on `bluetooth-hci-socket` which (as of today) will [not build on node 10](https://github.com/noble/node-bluetooth-hci-socket/pull/91). The quick fix is to `npm link` the patched version.

    git clone -b fix-builds-for-node-10 https://github.com/jrobeson/node-bluetooth-hci-socket.git
    cd node-bluetooth-hci-socket
    npm link

go into nus_console folder

    npm link bluetooth-hci-socket
    npm install
