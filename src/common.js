// Workaround for receiving runtime messages from the same page

let messaging = {
    _messageHandlers: [],
    sendMessage(message) {
        this._messageHandlers.forEach((handler) => {
            handler.apply(null, [message]);
        });

        chrome.runtime.sendMessage(message);
    },
    addMessageHandler(callback) {
        this._messageHandlers.push(callback);
        chrome.runtime.onMessage.addListener(callback);
    }
};

let storage = {
    update(values, callback) {
        chrome.storage.local.set(values, function () {
            messaging.sendMessage({
                type: "storage_updated"
            });

            typeof callback === "function" && callback.apply(this, [].slice.call(arguments));
        });
    },
    get(keys, callback) {
        chrome.storage.local.get(keys, callback);
    }
};

let native = {
    ping() {
        messaging.sendMessage({
            type: "native_message",
            data: {
                cmd: "ping"
            }
        });
    },
    listDevices() {
        messaging.sendMessage({
            type: "native_message",
            data: {
                cmd: "list_devices"
            }
        });
    },
    listenDevice() {
        storage.get('deviceSelected', (result) => {
            messaging.sendMessage({
                type: "native_message",
                data: {
                    cmd: "listen_device",
                    device_index: result.deviceSelected
                }
            });
        });
    }
}

let tabs = {
    _tabPorts: [],
    midiMessage(midiData) {
        this._tabPorts.forEach((tabPort) => {
            tabPort.postMessage({
                type: "midi_message",
                message: midiData
            });
        });
    },
    storageUpdated() {
        this._tabPorts.forEach((tabPort) => {
           tabPort.postMessage({
               type: "storage_updated"
           });
        });
    },
    add(tabPort) {
        this._tabPorts.push(tabPort);
    },
    remove(tabPort) {
        this._tabPorts.splice(this._tabPorts.indexOf(tabPort), 1);
    },
    count() {
        return this._tabPorts.length;
    }
};

export {messaging, storage, native, tabs};