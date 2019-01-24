$(function() {
	var updateDevices = function() {
		chrome.runtime.sendMessage({
		    cmd: "native_list_devices"
		});
	};

	var updateUiState = function() {
		chrome.storage.local.get(['devices', 'loaded', 'deviceSelected', 'inRuntime'], function(result) {
			if (result.loaded) {
				$('#loadingScreen').css('display', 'none');
			} else {
				$('#loadingScreen').css('display', 'flex');
			}

			if (result.inRuntime) {
				$('#runtimeScreen').css('display', 'flex');
			} else {
				$('#runtimeScreen').css('display', 'none');
			}

			$('#deviceSelect')
				.find('option')
	    		.remove();

			for (key in result.devices) {
			     $('#deviceSelect')
			         .append($('<option></option>')
	                    .attr('value', key)
	                    .attr('selected', result.deviceSelected === key)
	                    .text(result.devices[key]));
			}
		});
	};

	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		if (request.cmd == "popup_update_ui") {
			updateUiState();
		}
	});

	$('#deviceSelect').change(function() {
		chrome.storage.local.set({deviceSelected: $(this).val()});
	});

	$('#updateDevices').click(function() {
		updateDevices();
	});

	$('#goBtn').click(function() {
		chrome.runtime.sendMessage({
		    cmd: "native_listen_device"
		});

		chrome.storage.local.set({inRuntime: true}, function() {
			updateUiState();
		});
	});

	$('#selectAnotherDevice').click(function() {
		chrome.storage.local.set({inRuntime: false}, function() {
			updateUiState();
		});
	});

	updateDevices();
	updateUiState();
});