var nativePort;

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

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (!nativePort)
		return;

	if (request.cmd == "native_list_devices") {
		nativePort.postMessage({
			cmd: "list_devices"
		});
	} else if (request.cmd == "native_listen_device") {
		chrome.storage.local.get(['deviceSelected'], function(result) {
			if (!result.deviceSelected)
				return;

			nativePort.postMessage({
				cmd: "listen_device",
				device_index: result.deviceSelected
			});

			console.log("Listing device: " + result.deviceSelected);
		});
	}
});

chrome.runtime.onConnect.addListener(function(tabPort) {
	nativePort = chrome.runtime.connectNative('com.mkuzmin.srfmidihelper');

	nativePort.onMessage.addListener(function(msg) {
		if (msg.type === "devices_list") {
			chrome.storage.local.set({devices: msg.devices});
			fireUpdateUiState();
		} else if (msg.type === "pong") {
			chrome.storage.local.set({loaded: true});
			fireUpdateUiState();
		} else if (msg.type === "midi_message") {
			var data = base64ToBinary(msg.message);
			var midiData = {
				status: (data[0] & 0xff) >> 4,
				channel: data[0] & 0x0F,
				data1: (data.length > 1) ? data[1] : 0,
				data2: (data.length > 2) ? data[2] : 0
			};
			
			tabPort.postMessage({
			    cmd: "midi_message",
			    message: midiData
			});

			console.log("MIDI Message", midiData);
		}
	});
	
	nativePort.onDisconnect.addListener(function() {
	  console.log("Failed to connect: " + chrome.runtime.lastError.message);
	});

	nativePort.postMessage({
		cmd: "ping"
	});

	tabPort.onDisconnect.addListener(function() {
		console.log("Disconnected");
		nativePort.disconnect();
	});
});