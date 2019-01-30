const chrome = window.chrome;

let storage = {
    update(values, callback) {
        chrome.storage.local.set(values, function() {
            chrome.runtime.sendMessage({
                type: "storage_updated"
            });

            typeof callback === "function" && callback.apply(this, arguments);
        });
    },
    get(keys, callback) {
        chrome.storage.local.get(keys, callback);
    }
};

let native = {
    ping() {
        chrome.runtime.sendMessage({
            type: "native_message",
            data: {
                cmd: "ping"
            }
        });
    },
    listDevices() {
        chrome.runtime.sendMessage({
            type: "native_message",
            data: {
                cmd: "list_devices"
            }
        });
    },
    listenDevice() {
        storage.get('deviceSelected', (result) => {
            chrome.runtime.sendMessage({
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
    tabPorts: [],
    midiMessage(midiData) {
        this.tabPorts.forEach((tabPort) => {
            tabPort.postMessage({
                type: "midi_message",
                message: midiData
            });
        });
    },
    add(tabPort) {
        this.tabPorts.push(tabPort);
    },
    remove(tabPort) {
        this.tabPorts.splice(tabPorts.indexOf(tabPort), 1);
    },
    count() {
        return this.tabPorts.length;
    }
};

export { storage, native, tabs };