var nativePort, nativePortConnected = false, tabPorts = [];

var base64ToBinary = function(base64) {
  var raw = atob(base64);
  var rawLength = raw.length;
  var array = new Uint8Array(new ArrayBuffer(rawLength));

  for(i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
}

var fireUpdateUiState = function() {
	chrome.runtime.sendMessage({
	    cmd: "popup_update_ui"
	});
};

var initNativePort = function() {
	nativePort = chrome.runtime.connectNative('com.mkuzmin.srfmidihelper');
	nativePortConnected = true;

	nativePort.onMessage.addListener(function(msg) {
		switch (msg.type) {
			case "devices_list":
				chrome.storage.local.set({devices: msg.devices});
				fireUpdateUiState();
				break;
			case "pong":
				chrome.storage.local.set({isLoaded: true});
				fireUpdateUiState();
				break;
			case "midi_message":
				var data = base64ToBinary(msg.message);
				var midiData = {
					status: (data[0] & 0xff) >> 4,
					channel: data[0] & 0x0F,
					data1: (data.length > 1) ? data[1] : 0,
					data2: (data.length > 2) ? data[2] : 0
				};
				
				tabPorts.forEach(function(tabPort) {
					tabPort.postMessage({
					    cmd: "midi_message",
					    message: midiData
					});
				});

				console.log("MIDI Message", midiData);
				break;
			case "device_closed":
				chrome.storage.local.set({
					showRuntimeScreen: false,
					deviceSelected: -1,
					devices: []
				});

				chrome.runtime.sendMessage({
					cmd: "native_list_devices"
				});

				console.log("MIDI device was closed");
				break;
		}
	});
	
	nativePort.onDisconnect.addListener(function() {
		nativePortConnected = false;
		
		chrome.storage.local.set({
			isLoaded: false,
			isSheetGenerated: false
		});

		console.log("Failed to connect the host: " + chrome.runtime.lastError.message);
	});
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (!nativePortConnected)
		return;

	if (request.cmd == "native_list_devices") {
		nativePort.postMessage({
			cmd: "list_devices"
		});
	} else if (request.cmd == "native_listen_device") {
		chrome.storage.local.get(['deviceSelected'], function(result) {
			if (result.deviceSelected === -1)
				return;

			nativePort.postMessage({
				cmd: "listen_device",
				device_index: result.deviceSelected
			});

			console.log("Listening device: " + result.deviceSelected);
		});
	}
});

chrome.runtime.onConnect.addListener(function(tabPort) {
	tabPorts.push(tabPort);

	if (tabPorts.length === 1) {
		initNativePort();

		nativePort.postMessage({
			cmd: "ping"
		});

		chrome.runtime.sendMessage({
			cmd: "native_listen_device"
		});
	}

	tabPort.onDisconnect.addListener(function() {
		tabPorts.splice(tabPorts.indexOf(tabPort), 1);

		if (tabPorts.length === 0) {
			nativePort.disconnect();
			nativePortConnected = false;

			chrome.storage.local.set({
				isLoaded: false,
				isSheetGenerated: false
			});

			console.log("Disconnected from host");
		}
	});
});

chrome.storage.local.set({
	isLoaded: false,
	showRuntimeScreen: false,
	isSheetGenerated: false,
	deviceSelected: -1,
	devices: []
});