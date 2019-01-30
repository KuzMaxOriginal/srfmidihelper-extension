$(function() {

	var updateDevices = function() {
		chrome.runtime.sendMessage({
		    cmd: "native_list_devices"
		});
	};

	var showScreen = function(screenId, show) {
		$('#' + screenId)
			.addClass('messageScreen-show')
			.siblings('.messageScreen')
			.removeClass('messageScreen-show');
	}

	var updateUiState = function() {
		// TODO: replace multiple isXXXScreen to routing system
		chrome.storage.local.get(['devices', 'deviceSelected', 'isLoaded', 'showRuntimeScreen', 'isSheetGenerated'], function(result) {
			if (!result.isSheetGenerated) {
				showScreen('noSheetsScreen');
				return;
			} else if (!result.isLoaded) {
				showScreen('loadingScreen');
				return;
			} else if (result.showRuntimeScreen) {
				showScreen('runtimeScreen');
				return;
			} else {
				$('#deviceSelect')
					.find('option')
		    		.remove();

				$.each(result.devices, function(idx, deviceIndex) {
				    $('#deviceSelect')
				        .append($('<option></option>')
		                	.attr('value', deviceIndex)
		                    .attr('selected', result.deviceSelected === deviceIndex)
		                    .text(deviceIndex));
				});

				showScreen('deviceSelectScreen');
			}
		});
	};

	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		if (request.cmd == "popup_update_ui") {
			updateUiState();
		}
	});

	$('body').on('click', 'a', function(event) {
		event.preventDefault();
		chrome.tabs.create({
			url: $(this).attr('href')
		});
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

		chrome.storage.local.set({showRuntimeScreen: true}, function() {
			updateUiState();
		});
	});

	$('#selectAnotherDevice').click(function() {
		chrome.storage.local.set({showRuntimeScreen: false}, function() {
			updateUiState();
		});
	});

	updateDevices();
	updateUiState();
});