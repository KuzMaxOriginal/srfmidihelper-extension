$(function() {
	var selectedKeySignature, currentNoteIndex, pitchIndexed, isRun, midiPressedPitches = [], drawnNotes = [];
	var port = chrome.runtime.connect();

	chrome.runtime.sendMessage({
		cmd: "native_listen_device"
	});

	port.onMessage.addListener(function(msg) {
		if (!isRun)
			return;

		if (msg.cmd === "midi_message") {
			if (msg.message.status === 9) {
				midiPressedPitches.push(msg.message.data1);

				var requiredPitches = pitchIndexed[currentNoteIndex].pitches;
				var equalSets = $(requiredPitches).not(midiPressedPitches).get().length === 0
					&& $(midiPressedPitches).not(requiredPitches).get().length === 0;

				if (equalSets) {
					if (pitchIndexed.length <= currentNoteIndex + 1) {
						alert("You've reached the end of the piano piece! Errors: 0.");
						currentNoteIndex = 0;
					} else {
						currentNoteIndex++;
					}
				} else {
					if (requiredPitches.indexOf(msg.message.data1) === -1) {
						drawnNotes.push(msg.message.data1);
					}
				}

				updateSvgState();
			} else if (msg.message.status === 8) {
				midiPressedPitches.splice(midiPressedPitches.indexOf(msg.message.data1), 1);

				if (drawnNotes.indexOf(msg.message.data1) !== -1) {
					drawnNotes.splice(drawnNotes.indexOf(msg.message.data1), 1);
				}

				updateSvgState();
			}
		}
	});

	var showDialog = function(title, message) {
		$dialogElement = $('<div></div>')
			.attr('title', title)
			.text(message);

		$('body').append($dialogElement);

		$dialogElement.dialog({
			close: function() {
				// $(this).remove();
			}
		});

		return $dialogElement;
	}

	showDialog("title", "message");

	var arrayDifference = function(array1, array2) {
		var diff1 = array1.filter(function(value, index) {
			return array2.indexOf(value) > -1;
		});

		var diff2 = array2.filter(function(value, index) {
			return array1.indexOf(value) > -1;
		});

		return diff1.concat(diff2);
	}

	var detectKeySignature = function() {
		return constants.keySignatures[selectedKeySignature];
	}

	var alteratedPitchIncrement = function(noteName, keySignature) {
		var result = 0;

		$.each(keySignature.sharp, function(key, value) {
			if (noteName === value) {
				result = 1;
			}
		});

		$.each(keySignature.flat, function(key, value) {
			if (noteName === value) {
				result = -1;
			}
		});

		return result;
	}

	var detectNoteDuration = function(noteNode) {
		for (var i = 0; i < noteNode.classList.length; i++) {
			if (noteNode.classList[i].startsWith('abcjs-d0-')) {
				return parseFloat('0.' + noteNode.classList[i].split('-')[2]);
			}
		}

		return 1;
	}

	var makeSVG = function(tag, attrs) {
        var el= document.createElementNS('http://www.w3.org/2000/svg', tag);

        for (var k in attrs)
            el.setAttribute(k, attrs[k]);

        return el;
    }

    var pitchAbcjsToName = function(abcjsPitch) {
    	return constants.pitchNames[(abcjsPitch + 11) % 7];
    }

    var pitchMidiToAbcjs = function(midiPitch) {
    	var currentKeySignature = detectKeySignature();
    	
    	var pitchNamesMap = {
    		0: "C", 1: "C",
    		2: "D", 3: "D",
    		4: "E",
    		5: "F", 6: "F",
    		7: "G", 8: "G",
    		9: "A", 10: "A",
    		11: "B"
    	}

    	var pitchRawName = pitchNamesMap[midiPitch % 12];

    	var pitchMidiToAbcjsMap = {
    		0: 0,
    		1: currentKeySignature.sharp.indexOf(pitchRawName) ? 0 : 1,
    		2: 1,
    		3: currentKeySignature.sharp.indexOf(pitchRawName) ? 1 : 2,
    		4: 2,
    		5: 3,
    		6: currentKeySignature.sharp.indexOf(pitchRawName) ? 3 : 4,
    		7: 4,
    		8: currentKeySignature.sharp.indexOf(pitchRawName) ? 4 : 5,
    		9: 5,
    		10: currentKeySignature.sharp.indexOf(pitchRawName) ? 5 : 6,
    		11: 6
    	};

    	var sharpRequiredMap = {
    		0: false,
    		1: true,
    		2: false,
    		3: true,
    		4: false,
    		5: false,
    		6: true,
    		7: false,
    		8: true,
    		9: false,
    		10: true,
    		11: false
    	}

    	var resultPitch = pitchMidiToAbcjsMap[midiPitch % 12] + (Math.floor(midiPitch / 12) - 5) * 7;
    	var sharpRequired = currentKeySignature.sharp.indexOf(pitchRawName) === -1
    		&& currentKeySignature.flat.indexOf(pitchRawName) === -1
    		&& sharpRequiredMap[midiPitch % 12];

    	return {
    		pitch: resultPitch,
    		sharp: sharpRequired
    	};
    }

	var keySignature;
	var detectNotePitches = function(noteNode) {
		var pitches = [];

		for (var i = 0; i < noteNode.classList.length; i++) {
			if (noteNode.classList[i].startsWith('abcjs-p')) {
				var pitchIndex = parseInt(noteNode.classList[i].slice(7));
				var pitchName = pitchAbcjsToName(pitchIndex);

				var pitchModdedIndex = pitchIndex >= 0 ? pitchIndex % 7
					: (pitchIndex % 7 === 0 ? 0 : (7 + pitchIndex % 7));

				var pitchIndexMidiOffset = {
					0: 0,
					1: 2,
					2: 4,
					3: 5,
					4: 7,
					5: 9,
					6: 11
				}

				var pitchMidiIndex = pitchIndexMidiOffset[pitchModdedIndex]
					+ alteratedPitchIncrement(pitchName, detectKeySignature())
					+ (Math.floor(pitchIndex / 7) + 5) * 12;

				pitches.push(pitchMidiIndex);
			}
		}

		return pitches;
	}

	var updateSvgState = function() {
		var $rootSvg = $("#staffDiv svg");

		if (!$rootSvg.length)
			return;

		$rootSvg.find(".abcjs-note").attr("fill", "#000000");
		$.each(pitchIndexed[currentNoteIndex].noteNodes, function(key, value) {
			$(value).attr("fill", "#ff0000");
		});

		$rootSvg.find('.srfmh-wrong_note').remove();
		$.each(drawnNotes, function(idx, drawingNote) {
			var abcjsPitch = pitchMidiToAbcjs(drawingNote);
			var relativeNote = pitchIndexed[currentNoteIndex].noteNodes[0];
			var splittedCurrentNotePath = $(relativeNote).attr("d").split(" ");
			var relativeNoteX = splittedCurrentNotePath[1];
			var relativeNoteY = parseFloat(splittedCurrentNotePath[2].slice(0, splittedCurrentNotePath[2].length - 1)); // remove 'c' at the end

			var relativePitchIndex;
			for (var i = 0; i < relativeNote.classList.length; i++) {
				if (relativeNote.classList[i].startsWith('abcjs-p')) {
					relativePitchIndex = parseInt(relativeNote.classList[i].slice(7));
					break;
				}
			}

			// Draw new lines (if needed)

			var newLinesDirectionUp = $(relativeNote).is(".abcjs-v0")
				? abcjsPitch.pitch > 10
				: abcjsPitch.pitch > -2;

			var newLinesCount = Math.floor(($(relativeNote).is(".abcjs-v0")
				? Math.max(2 + abcjsPitch.pitch * (-1), abcjsPitch.pitch - 10)
				: Math.max(2 + abcjsPitch.pitch, abcjsPitch.pitch * (-1) - 10)) / 2);

			var newLineX = relativeNoteX - 10;
			var newLinesOffsetY = relativeNoteY
				+ 3.875 * (1 + (newLinesDirectionUp ? -2 : 2) + ($(relativeNote).is(".abcjs-v0")
					? (newLinesDirectionUp ? relativePitchIndex - 10 : relativePitchIndex - 2)
					: (newLinesDirectionUp ? relativePitchIndex + 2: relativePitchIndex + 10)));

			console.log(newLinesCount, newLinesDirectionUp);

			for (var i = 0; i < newLinesCount; i++) {
				var newLineY = newLinesOffsetY + (newLinesDirectionUp ? -3.875 * 2 * i : 3.875 * 2 * i);


				var newLinePath = "m " + newLineX + " " + newLineY + "h 22.5";

				var newLineElement = makeSVG('path', {
					d: newLinePath,
					stroke: '#000000',
					fill: 'none',
					'fill-opacity': 0.7,
					class: 'srfmh-wrong_note srfmh-wrong_note-line'
				});

				$rootSvg.append(newLineElement);
			}

			// Draw note

			var notePath;
			var noteX = relativeNoteX;
			var noteY = relativeNoteY - 3.875 * (abcjsPitch.pitch - relativePitchIndex);

			if (abcjsPitch.sharp) {
				noteY -= 3.875 * 2 - 1;
				noteX -= 10.61;
				notePath = "m " + noteX + " " + noteY + constants.wrongNoteSharpPath
					+ "m 10.93999999999994 -3.509999999999991" + constants.wrongNotePath;
			} else {
				notePath = "m " + noteX + " " + noteY + constants.wrongNotePath;
			}

			var noteElement = makeSVG('path', {
				d: notePath,
				stroke: 'none',
				fill: '#000000',
				'fill-opacity': 0.7,
				class: 'srfmh-wrong_note'
			});

			$rootSvg.append(noteElement);
		});
	}

	var makeDurationArray = function(elements, durationArray) {
		var currentTime;
		
		currentTime = 0;
		elements.each(function() {
			var noteDuration = detectNoteDuration(this) * 1e6;

			if ($(this).is(".abcjs-note")) {
				var notePithces = detectNotePitches(this)

				durationArray.push({
					time: currentTime,
					noteNode: this,
					pitches: notePithces
				});
			}

			currentTime += noteDuration;
		});
	}

	var generateIndexedPitches = function() {
		var $rootSvg = $("#staffDiv svg");
		isRun = true;

		if (!$rootSvg.length)
			return;

		keySignature = detectKeySignature();

		var durationArray = [];
		
		makeDurationArray($rootSvg.find(".abcjs-note.abcjs-v0, .abcjs-rest.abcjs-v0"), durationArray);
		makeDurationArray($rootSvg.find(".abcjs-note.abcjs-v1, .abcjs-rest.abcjs-v1"), durationArray);

		durationArray.sort(function(a, b) {
			return a.time - b.time;
		});

		pitchIndexed = [];

		var prevTime = 0;
		var i = 0;
		$.each(durationArray, function(key, value) {
			if (prevTime != value.time) {
				i++;
			}

			if (pitchIndexed[i] === undefined) {
				pitchIndexed[i] = {pitches: [], noteNodes: []};
			}

			pitchIndexed[i].pitches = pitchIndexed[i].pitches.concat(value.pitches);
			pitchIndexed[i].noteNodes = pitchIndexed[i].noteNodes.concat(value.noteNode);
			prevTime = value.time;
		});

		console.log("Indexed pitches", pitchIndexed);

		currentNoteIndex = 0;
		updateSvgState();
	}

	document.addEventListener('click', function(event) {
		if ($(event.target).is(".keySigs a")) {
			selectedKeySignature = $(event.target).parent().attr("data-name");
		} else if ($(event.target).is(".mixerStartButton, .action-regenerate, .action-regenerate *")) {
			isRun = false;

			var waitLoading = setInterval(function() {
				if ($(".render-spinner.loading-spinner").is(":visible"))
					return;

				setTimeout(function() {
					clearInterval(waitLoading);
					generateIndexedPitches();
				}, 300);
			}, 100);
		}
	}, true);
});