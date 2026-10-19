export class SoundSynth {
  constructor(){
    this.ctx = null;
  }
  init(){
    if(!this.ctx){
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }
  playTone(freq,type='sine',dur=0.15,vol=0.1){
    if(!this.ctx) return;
    try{
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = type;
      o.frequency.setValueAtTime(freq, this.ctx.currentTime);
      g.gain.setValueAtTime(vol, this.ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + dur);
      o.connect(g); g.connect(this.ctx.destination); o.start(); o.stop(this.ctx.currentTime + dur);
    }catch(e){}
  }
  sndInteract(){ this.playTone(520,'triangle',0.1,0.12); }
  sndCash(){ this.playTone(987,'sine',0.1,0.12); setTimeout(()=>this.playTone(1318,'sine',0.14,0.12),90); }
  sndWrench(){ this.playTone(180,'square',0.12,0.08); }
  sndSuccess(){ this.playTone(440,'sine',0.1,0.08); setTimeout(()=>this.playTone(554,'sine',0.1,0.08),80); }
  sndFootstep(){ this.playTone(90,'sine',0.04,0.03); }
}

export const audio = new SoundSynth();
