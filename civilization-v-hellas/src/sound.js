export class AmbientSound {
constructor(){this.context=null;this.timer=null;this.step=0;}
toggle(on){if(!on){clearInterval(this.timer);this.context?.suspend();return;}if(!this.context)this.context=new AudioContext();this.context.resume();this.play();this.timer=setInterval(()=>this.play(),2300);}
play(){const ctx=this.context;if(!ctx||ctx.state!=='running')return;const notes=[146.83,220,293.66,349.23,329.63,220,196,261.63,293.66,220,174.61,196];const f=notes[this.step++%notes.length],t=ctx.currentTime;for(const[n,v]of [[f,.032],[f/2,.018],[f*2,.009]]){const o=ctx.createOscillator(),gain=ctx.createGain();o.type='sine';o.frequency.value=n;gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(v,t+.08);gain.gain.exponentialRampToValueAtTime(.0001,t+4);o.connect(gain);gain.connect(ctx.destination);o.start(t);o.stop(t+4.1);}}
}
