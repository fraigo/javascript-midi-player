

function MIDIPlayer(fileinput,onload) {
    
    var audioContext = null;
    var player = null;
    var reverberator = null;
    var songStart = 0;
    var input = null;
    var currentSongTime = 0;
    var nextStepTime = 0;
    var nextPositionTime = 0;
    var loadedsong = null;
    var stoppedsong = null;
    var stepDuration = 44 / 1000;
    var lastPosition = 0;
    var self=this;

    this.currentPosition = 0;
    this.duration=0;
    this.onload = onload;
    this.STOPPED = "stopped";
    this.PLAYING = "playing";
    this.PAUSED = "paused";
    
    this.log=function(msg, extra){
        console.log(msg,extra);
    }

    this.play =function() {
        if (!loadedsong && stoppedsong){
            loadedsong = stoppedsong;
        }
        if (loadedsong) {
            try {
                this.startPlay(loadedsong);
                if (this.state==this.PAUSED){
                    this.setPosition(lastPosition);
                }
                this.state = this.PLAYING;
            } catch (expt) {
                this.log('error ', expt);
            }
        }
    }
    this.pause=function(){
        if (loadedsong) {
            lastPosition=this.getPosition();
            console.log("Position",lastPosition);
            this.stop();
            currentSongTime = lastPosition;
            this.state = this.PAUSED;
        }
    }
    this.stop=function(){
        if (loadedsong) {
            player.cancelQueue(audioContext);
            songStart = 0;
            currentSongTime = 0;
            stoppedsong = loadedsong;
            loadedsong = null;
            this.state = this.STOPPED;
        }
    }
    this.getContext=function(){
        return player;
    }
    this.startPlay =function(song) {
        currentSongTime = 0;
        songStart = audioContext.currentTime;
        nextStepTime = audioContext.currentTime;
        
        this.tick(song, stepDuration);
    }

    this.tick=function(song, stepDuration) {
        if (audioContext.currentTime > nextStepTime - stepDuration) {
            this.sendNotes(song, songStart, currentSongTime, currentSongTime + stepDuration, audioContext, input, player);
            currentSongTime = currentSongTime + stepDuration;
            nextStepTime = nextStepTime + stepDuration;
            if (currentSongTime > song.duration) {
                currentSongTime = currentSongTime - song.duration;
                this.sendNotes(song, songStart, 0, currentSongTime, audioContext, input, player);
                songStart = songStart + song.duration;
            }
        }
        if (nextPositionTime < audioContext.currentTime) {
            this.currentPosition = currentSongTime;
            this.duration = song.duration;
            nextPositionTime = audioContext.currentTime + 3;
        }
        if (this.ontick){
            this.ontick(loadedsong,currentSongTime);
        }
        window.requestAnimationFrame(function (t) {
            if (loadedsong){
                self.tick(loadedsong, stepDuration);
            }
        });
    }
    this.sendNotes=function(song, songStart, start, end, audioContext, input, player) {
        for (var t = 0; t < song.tracks.length; t++) {
            var track = song.tracks[t];
            for (var i = 0; i < track.notes.length; i++) {
                if (track.notes[i].when >= start && track.notes[i].when < end) {
                    var when = songStart + track.notes[i].when;
                    var duration = track.notes[i].duration;
                    if (duration > 3) {
                        duration = 3;
                    }
                    var instr = track.info.variable;
                    var v = track.volume / 7;
                    player.queueWaveTable(audioContext, input, window[instr], when, track.notes[i].pitch, duration, v, track.notes[i].slides);
                }
            }
        }
        for (var b = 0; b < song.beats.length; b++) {
            var beat = song.beats[b];
            for (var i = 0; i < beat.notes.length; i++) {
                if (beat.notes[i].when >= start && beat.notes[i].when < end) {
                    var when = songStart + beat.notes[i].when;
                    var duration = 1.5;
                    var instr = beat.info.variable;
                    var v = beat.volume / 2;
                    player.queueWaveTable(audioContext, input, window[instr], when, beat.n, duration, v);
                }
            }
        }
    }
    this.startLoad=function(song) {
        console.log(song);
        var AudioContextFunc = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioContextFunc();
        player = new WebAudioFontPlayer();
        reverberator = player.createReverberator(audioContext);
        reverberator.output.connect(audioContext.destination);
        input = reverberator.input;
        for (var i = 0; i < song.tracks.length; i++) {
            var nn = player.loader.findInstrument(song.tracks[i].program);
            var info = player.loader.instrumentInfo(nn);
            song.tracks[i].info = info;
            song.tracks[i].id = nn;
            player.loader.startLoad(audioContext, info.url, info.variable);
        }
        for (var i = 0; i < song.beats.length; i++) {
            var nn = player.loader.findDrum(song.beats[i].n);
            var info = player.loader.drumInfo(nn);
            song.beats[i].info = info;
            song.beats[i].id = nn;
            player.loader.startLoad(audioContext, info.url, info.variable);
        }
        player.loader.waitLoad(function () {
            self.loadSong(song);
        });
    }
    this.getCurrentSong=function(){
        return loadedsong;
    }
    this.getPosition=function(){
        //console.log(currentSongTime);
        return currentSongTime;
    }
    this.setPosition=function(position){
        if (loadedsong || stoppedsong) {
            player.cancelQueue(audioContext);
            var next = position; //song.duration * position / 100;
            songStart = songStart - (next - currentSongTime);
            currentSongTime = next;
            lastPosition = currentSongTime;
        }
    }
    this.setVolume=function(volume){
        if (loadedsong){
            player.cancelQueue(audioContext);
            var v = volume / 100;
            if (v < 0.000001) {
                v = 0.000001;
            }
            loadedsong.tracks[i].volume = v;
        } 
    }
    this.setInstrument=function(value){
        if (loadedsong){
            var nn = value;
            var info = player.loader.instrumentInfo(nn);
            player.loader.startLoad(audioContext, info.url, info.variable);
            player.loader.waitLoad(function () {
                console.log('loaded');
                loadedsong.tracks[i].info = info;
                loadedsong.tracks[i].id = nn;
            });
        }
    }
    this.loadSong=function(song) {
        this.stop();
        audioContext.resume();

        console.log("Tracks",song.tracks);
        console.log("Beats",song.beats);
        console.log("Duration", song.duration);
        console.log("Instruments", player.loader.instrumentKeys());
        console.log("Drums", player.loader.drumKeys());
        loadedsong = song;
        if (this.onload){
            this.onload(song)
        }
    }
    this.openFile=function(fileObj){
        var midiFile = new MIDIFile(fileObj);
        var song = midiFile.parseSong();
        self.startLoad(song);
    }
    this.handleFileSelect=function(event) {
        var self=this;
        console.log(event);
        var file = event.target.files[0];
        console.log(file);
        var fileReader = new FileReader();
        fileReader.onload = function (event ) {
            console.log(event);
            var fileObj = event.target.result;
            self.openFile(fileObj);
        };
        fileReader.readAsArrayBuffer(file);
    }
    this.handleExample=function(path) {
        console.log(path);
        var xmlHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.open("GET", path, true);
        xmlHttpRequest.responseType = "arraybuffer";
        xmlHttpRequest.onload = function (e) {
            var arrayBuffer = xmlHttpRequest.response;
            var midiFile = new MIDIFile(arrayBuffer);
            var song = midiFile.parseSong();
            self.startLoad(song);
        };
        xmlHttpRequest.send(null);
    }

    if (typeof(fileinput)=="string"){
        fileinput=document.getElementById(fileinput)
    }
    if (fileinput){
        
        fileinput.addEventListener('change', this.handleFileSelect.bind(this), false);
    }	

}