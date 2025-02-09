# Javascript MIDI Player

* A Javascript Library to Play MIDI files in a web site using the WebMIDIAPI.
* Based on the project WebAudioFont https://github.com/surikov/webaudiofont by Sergey Surikov.



## Online Demo

See [https://fraigo.github.io/javascript-midi-player/midiplayer/](https://fraigo.github.io/javascript-midi-player/midiplayer/)


## Usage

### Include the Javascript Libraries. 

You can download the Javascript files and directly include in your project:

```html
<script src='WebAudioFontPlayer.js'></script>
<script src='MIDIFile.js'></script>
<script src='MIDIPlayer.js'></script>
```

Also, using the online version:

```html
<script src='https://fraigo.github.io/javascript-midi-player/midiplayer/WebAudioFontPlayer.js'></script>
<script src='https://fraigo.github.io/javascript-midi-player/midiplayer/MIDIFile.js'></script>
<script src='https://fraigo.github.io/javascript-midi-player/midiplayer/MIDIPlayer.js'></script>
```

###  Basic usage 

```html
<html>
    <head>
        <script src='https://fraigo.github.io/javascript-midi-player/midiplayer/WebAudioFontPlayer.js'></script>
<script src='https://fraigo.github.io/javascript-midi-player/midiplayer/MIDIFile.js'></script>
<script src='https://fraigo.github.io/javascript-midi-player/midiplayer/MIDIPlayer.js'></script>
    </head>
    <body>
        <div id='cntls'>
            <p>
                <input type="file" id="filesinput" name="filesarr[]" accept=".mid,.midi,.kar"/>
                <button type="button" onclick="player.play()">Play</button>
                <button type="button" onclick="player.pause()">Pause</button>
                <button type="button" onclick="player.stop()">Stop</button>
                <input id="position" type="range" min="0" max="100" value="0">
                <input type="checkbox" id="autoplay" checked onchange="autoplay=this.checked">Autoplay
            </p>
        </div>
        <script>
// autoplay flag
var autoplay=true;
// create the player object using a file input by id or DOM Element
var player=new MIDIPlayer('filesinput');
// register the onload function to start playing
player.onload = function(song){
    if (autoplay){
        player.play();
    }
    var pos= document.getElementById("position");
    pos.setAttribute("max",Math.round(song.duration*10));
}
// the tick event is triggered in every position change
player.ontick=function(song,position){
    var pos= document.getElementById("position");
    pos.value=Math.round(position*10);
}
// the end event is triggered when the song ends
player.onend=function(){
    console.log("End", new Date())
}
// stop playing when the window is unfocused
window.onblur=function(){
    console.log("Blur", new Date())
    player.pause();
}
        <script>
    </body>
</html>
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







