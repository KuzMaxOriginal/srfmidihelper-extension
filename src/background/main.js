import {messaging, storage, native, tabs} from "../common";
import constants from "../content/constants";

let nativePort, nativePortConnected = false;

let base64ToBinary = function (base64) {
    let raw = atob(base64);
    let rawLength = raw.length;
    let array = new Uint8Array(new ArrayBuffer(rawLength));

    for (let i = 0; i < rawLength; i++) {
        array[i] = raw.charCodeAt(i);
    }

    return array;
}

let initNativePort = function () {
    nativePort = chrome.runtime.connectNative('com.mkuzmin.srfmidihelper');
    nativePortConnected = true;

    nativePort.onMessage.addListener(function (msg) {
        switch (msg.type) {
            case "pong":
                storage.update({isConnectedToHost: true});
                console.log("Successfully connected to host");
                break;
            case "devices_list":
                storage.update({deviceList: msg.devices});
                console.log("Retrieved devices list", msg.devices);
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
        }
    });

    nativePort.onDisconnect.addListener(function () {
        nativePortConnected = false;

        storage.update({
            isConnectedToHost: false,
            isSheetGenerated: false
        });

        console.log("Failed to connect the host: " + chrome.runtime.lastError.message);
    });

    console.log("Connecting to host...");
}

messaging.addMessageHandler(function (request) {
    if (request.type === "native_message") {
        if (!nativePortConnected)
            return;

        nativePort.postMessage(request.data);
        console.log("Sending native message", request.data);
    } else if (request.type === "storage_updated") {
        tabs.storageUpdated();
    }
});

chrome.runtime.onConnect.addListener(function (tabPort) {
    tabs.add(tabPort);

    if (tabs.count() === 1) {
        initNativePort();

        native.ping();
        native.listDevices();
        native.listenDevice();
    }

    tabPort.onDisconnect.addListener(function () {
        tabs.remove(tabPort);

        if (tabs.count() === 0) {
            nativePort.disconnect();
            nativePortConnected = false;

            storage.update({
                isConnectedToHost: false,
                isSheetGenerated: false
            });

            console.log("Disconnected from host");
        }
    });
});

storage.update({
    isConnectedToHost: false,
    isSheetGenerated: false,
    deviceSelected: null,
    deviceList: [],
    popupLastRoute: "loading",
    isSwitchedOn: true,
    noteFillHighlighted: constants.svg.noteFillHighlighted,
    noteFillWrong: constants.svg.noteFillWrong,
});