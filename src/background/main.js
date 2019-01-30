import { storage, native, tabs } from "../common";

const chrome = window.chrome;

let nativePort, nativePortConnected = false;

let base64ToBinary = function(base64) {
    let raw = atob(base64);
    let rawLength = raw.length;
    let array = new Uint8Array(new ArrayBuffer(rawLength));

    for(let i = 0; i < rawLength; i++) {
        array[i] = raw.charCodeAt(i);
    }

    return array;
}

let initNativePort = function() {
    nativePort = chrome.runtime.connectNative('com.mkuzmin.srfmidihelper');
    nativePortConnected = true;

    nativePort.onMessage.addListener(function(msg) {
        switch (msg.type) {
            case "devices_list":
                storage.update({devices: msg.devices});
                break;
            case "pong":
                storage.update({connectedToHost: true});
                break;
            case "midi_message":
                let data = base64ToBinary(msg.message);
                let midiData = {
                    status: (data[0] & 0xff) >> 4,
                    channel: data[0] & 0x0F,
                    data1: (data.length > 1) ? data[1] : 0,
                    data2: (data.length > 2) ? data[2] : 0
                };

                tabs.midiMessage(midiData);
                console.log("MIDI Message", midiData);
                break;
            case "device_closed":
                storage.update({
                    // showRuntimeScreen: false,
                    deviceSelected: -1,
                    devices: []
                });

                console.log("MIDI device was closed");
                break;
        }
    });
    
    nativePort.onDisconnect.addListener(function() {
        nativePortConnected = false;
        
        storage.update({
            connectedToHost: false,
            // isSheetGenerated: false
        });

        console.log("Failed to connect the host: " + chrome.runtime.lastError.message);
    });

    console.log("Connected to host");
}

chrome.runtime.onMessage.addListener(function(request) {
    if (request.type === "native_message") {
        if (!nativePortConnected)
            return;

        nativePort.postMessage(request.data);
    }
});

chrome.runtime.onConnect.addListener(function(tabPort) {
    tabs.add(tabPort);

    if (tabs.count() === 1) {
        initNativePort();

        native.ping();
        native.listDevices();
        native.listenDevice();
    }

    tabPort.onDisconnect.addListener(function() {
        tabs.remove(tabPort);

        if (tabs.count() === 0) {
            nativePort.disconnect();
            nativePortConnected = false;

            storage.update({
                connectedToHost: false,
                // isSheetGenerated: false
            });

            console.log("Disconnected from host");
        }
    });
});

storage.update({
    connectedToHost: false,
    // showRuntimeScreen: false,
    // isSheetGenerated: false,
    deviceSelected: -1,
    devices: []
});

initNativePort(); // Temporary