'use strict';
const noble = require('noble');

const NUS_SERVICE_ID = '6e400001b5a3f393e0a9e50e24dcca9e';
const NUS_RX_CHAR = '6e400003b5a3f393e0a9e50e24dcca9e';
const NUS_TX_CHAR = '6e400002b5a3f393e0a9e50e24dcca9e';

var tx_char = null;

noble.on('discover', (peripheral) => {
    console.log('Found device with local name: ' + peripheral.advertisement.localName);
    console.log('advertising the following service uuid\'s: ' + peripheral.advertisement.serviceUuids);
    console.log();

    peripheral.connect((error) => {
		if (error) {
			console.log("connect", error);
			process.exit(0);
		}

		peripheral.on('disconnect', () => {
			process.exit(0);
		});

		peripheral.discoverServices([], (error, services) => {
			for (let i = 0; i < services.length; i++) {
				if (services[i].uuid != NUS_SERVICE_ID)
					continue;
				services[i].discoverCharacteristics([], (error, characteristics) => {
					for (let i = 0; i < characteristics.length; i++) {
						let char = characteristics[i];
						if (char.uuid == NUS_RX_CHAR) {
							char.on('data', (data, isNotification) => {
								process.stdout.write(data.toString('utf8'));
							});
							char.subscribe();
						} else if (char.uuid == NUS_TX_CHAR) {
							tx_char = char;
						}
					}
				});
			}
		});
	});
});

noble.on('stateChange', (state) => {
	if (state == "poweredOn")
		noble.startScanning(NUS_SERVICE_ID);
	else
		noble.stopScanning();
});

process.stdin.setRawMode(true);

process.stdin.on('readable', () => {
	var chunk = process.stdin.read();
	if ((chunk !== null) && (tx_char !== null)) {
		tx_char.write(Buffer.from(chunk), true);
	}
});
