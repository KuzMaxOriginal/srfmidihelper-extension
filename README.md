# Sight Reading Factory MIDI Helper

This extension was written for education purposes for those who have MIDI keyboard and actively use Sight Reading Factory
to enhance their sight reading skills, and want to see if they're playing correct notes or not.

## Demo

This video is demonstrating how to use the extension: *(available shortly)*

## Features

* Check if you're playing correct notes (correct current note is red highlighted)
* Highlight wrong notes
* Show mistakes count
* Both-hands friendly

## Installation

1. Install [host application](https://github.com/KuzMaxOriginal/srfmidihelper-host) for your OS (required for connecting
to your MIDI keyboard)
2. Install the extension from Chrome Web Store: [link](https://chrome.google.com/webstore/detail/sight-reading-factory-mid/abmeklchcniphkahfejbcjplnkefnkaa/)

## Usage

Once you have installed the host application (see installation section) and the extension, you need to open [Sight
Reading Factory app](https://www.sightreadingfactory.com/app) and generate new sheet music. If everything was set up
correctly, the first pitches will be highlighted with red color.

Now you want to set up connection to your MIDI device. To do that, simply choose your device from a dropdown box and
click "Select device" (make sure that your device is powered on). Now you can play the keyboard and see if you're
playing it correctly.

To reset highlighted notes to the start position, press "Reset" button.

You're also allowed to switch on/switch off the extension, as well as pick your own colors for highlighting notes. All
of these can be configured on the options page (cog icon in the top right corner of the popup).

## Build

NPM tasks available:

1. `build` - build project for production (removes all `console.log` as well).
2. `build-dev` - build project for development
3. `lint` is not configured yet, so please DO NOT rely on its results so far.  