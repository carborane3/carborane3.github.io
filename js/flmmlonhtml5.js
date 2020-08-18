/*! flmml-on-html5 v1.2.0 | (c) 2015, argentum384 | BSD-3-Clause | https://github.com/argentum384/flmml-on-html5 */
"use strict";var FlMMLonHTML5=function(){var t={BUFFER_SIZE:8192,COM_BOOT:1,COM_PLAY:2,COM_STOP:3,COM_PAUSE:4,COM_BUFFER:5,COM_COMPCOMP:6,COM_BUFRING:7,COM_COMPLETE:8,COM_SYNCINFO:9,COM_PLAYSOUND:10,COM_STOPSOUND:11};function o(t,e){for(var i in e)t[i]=e[i];return t}function n(t){t||(t="FlMMLonHTML5"===n.name?"flmmlworker-raw.js":"flmmlworker.js");var e=this.worker=new Worker(t);e.addEventListener("message",this.onMessage.bind(this)),this.onAudioProcessBinded=this.onAudioProcess.bind(this),this.warnings="",this.totalTimeStr="00:00",this.bufferReady=!1,this.volume=100,this.events={},e.postMessage({type:n.COM_BOOT,sampleRate:n.audioCtx.sampleRate,bufferSize:n.BUFFER_SIZE}),this.setInfoInterval(125)}t.emptyBuffer=new Float32Array(t.BUFFER_SIZE),o(n,t),o(n.prototype,{onMessage:function(t){var e=t.data;switch(e.type){case n.COM_BUFFER:this.buffer=e.buffer,this.bufferReady=!0;break;case n.COM_COMPCOMP:o(this,e.info),this.oncompilecomplete&&this.oncompilecomplete(),this.trigger("compilecomplete");break;case n.COM_BUFRING:this.onbuffering&&this.onbuffering(e),this.trigger("buffering",e);break;case n.COM_COMPLETE:this.oncomplete&&this.oncomplete(),this.trigger("complete");break;case n.COM_SYNCINFO:o(this,e.info),this.onsyncinfo&&this.onsyncinfo(),this.trigger("syncinfo");break;case n.COM_PLAYSOUND:this.playSound();break;case n.COM_STOPSOUND:this.stopSound(e.isFlushBuf),this.worker.postMessage({type:n.COM_STOPSOUND})}},playSound:function(){if(!(this.gain||this.scrProc||this.oscDmy)){var t=n.audioCtx,e=this.gain=t.createGain();e.gain.value=this.volume/127,e.connect(t.destination),this.scrProc=t.createScriptProcessor(n.BUFFER_SIZE,1,2),this.scrProc.addEventListener("audioprocess",this.onAudioProcessBinded),this.scrProc.connect(this.gain),this.oscDmy=t.createOscillator(),this.oscDmy.connect(this.scrProc),this.oscDmy.start(0)}},stopSound:function(t){t&&(this.bufferReady=!1),(this.gain||this.scrProc||this.oscDmy)&&(this.scrProc.removeEventListener("audioprocess",this.onAudioProcessBinded),this.gain&&(this.gain.disconnect(),this.gain=null),this.scrProc&&(this.scrProc.disconnect(),this.scrProc=null),this.oscDmy&&(this.oscDmy.disconnect(),this.oscDmy=null))},onAudioProcess:function(t){var e=t.outputBuffer;this.bufferReady?(e.getChannelData(0).set(this.buffer[0]),e.getChannelData(1).set(this.buffer[1]),this.bufferReady=!1,this.worker.postMessage({type:n.COM_BUFFER,retBuf:this.buffer},[this.buffer[0].buffer,this.buffer[1].buffer])):(e.getChannelData(0).set(n.emptyBuffer),e.getChannelData(1).set(n.emptyBuffer),this.worker.postMessage({type:n.COM_BUFFER,retBuf:null}))},trigger:function(t,e){var i=this.events[t];if(i){var s={};o(s,e);for(var n=0,r=i.length;n<r;n++)i[n]&&i[n].call(this,s)}},play:function(t){this.worker.postMessage({type:n.COM_PLAY,mml:t})},stop:function(){this.worker.postMessage({type:n.COM_STOP})},pause:function(){this.worker.postMessage({type:n.COM_PAUSE})},setMasterVolume:function(t){this.volume=t,this.gain&&(this.gain.gain.value=this.volume/127)},isPlaying:function(){return this._isPlaying},isPaused:function(){return this._isPaused},getWarnings:function(){return this.warnings},getTotalMSec:function(){return 0|this.totalMSec},getTotalTimeStr:function(){return this.totalTimeStr},getNowMSec:function(){return 0|this.nowMSec},getNowTimeStr:function(){return this.nowTimeStr},getVoiceCount:function(){return this.voiceCount},getMetaTitle:function(){return this.metaTitle},getMetaComment:function(){return this.metaComment},getMetaArtist:function(){return this.metaArtist},getMetaCoding:function(){return this.metaCoding},setInfoInterval:function(t){this.worker.postMessage({type:n.COM_SYNCINFO,interval:t})},syncInfo:function(){this.worker.postMessage({type:n.COM_SYNCINFO,interval:null})},addEventListener:function(t,e){var i=this.events[t];i||(i=this.events[t]=[]);for(var s=i.length;s--;)if(i[s]===e)return!1;return i.push(e),!0},removeEventListener:function(t,e){var i=this.events[t];if(!i)return!1;for(var s=i.length;s--;)if(i[s]===e)return i.splice(s,1),!0;return!1},release:function(){this.stopSound(),this.worker.terminate()}});var e=window.AudioContext||window.webkitAudioContext;return n.audioCtx=new e,document.addEventListener("DOMContentLoaded",function(){window.addEventListener("click",function t(e){var i=n.audioCtx,s=i.createBufferSource();s.connect(i.destination),s.start(0),i.resume(),window.removeEventListener("click",t,!0)},!0)}),n}();