# Javascript MIDI Player

* A Javascript Library to Play MIDI files in a web site using the WebMIDIAPI.
* Based on the project WebAudioFont https://github.com/surikov/webaudiofont by Sergey Surikov.

## Usage

### Include the Javascript Libraries. 

You can download the files and directy include in your project:

```html
<script src='WebAudioFontPlayer.js'></script>
<script src='MIDIFile.js'></script>
<script src='MIDIPlayer.js'></script>
```

Using the online version:

```html
<script src='WebAudioFontPlayer.js'></script>
<script src='MIDIFile.js'></script>
<script src='MIDIPlayer.js'></script>
```

###  Basic usage 

```javascript
// create the player object using a file input by id or DOM Element
player=new MIDIPlayer('filesinput');
// register the onload function to start playing
player.onload = function(song){
    player.play();
    var pos= document.getElementById("position");
    pos.setAttribute("max",song.duration);
}
// the tick event is triggered in every position change
player.ontick=function(song,position){
    var pos= document.getElementById("position");
    pos.value=position;
}
// stop playing when the window is unfocused
window.onblur=function(){
    console.log("Blur", new Date())
    player.pause();
}
// resume playing when window is in focus
window.onfocus=function(){
    console.log("Focus", new Date())
    player.play();
}
```

## MIDIPlayer reference

**new MIDIPlayer(fileInput)**

Create a new MIDIPlayer object. You can use the file input id or a file input DOM element.

**MIDIPlayer.play()**

Start/Resume playing an already loaded file.

**MIDIPlayer.pause()**

Pause playback.

**MIDIPlayer.stop()**

Stops playback.

**MIDIPlayer.setPosition(pos)**

Sets the current position (in seconds). 

**MIDIPlayer.setVolume(vol)**

Sets the current volume (0-100). 


**[float] MIDIPlayer.getPosition()**

Returns the current playback time (in seconds).




### Online Demo

https://fraigo.github.io/javascript-midi-player/midiplayer/


