import { useState, useEffect, useRef, useCallback } from "react";
import {
  Timer, BarChart2, BookOpen, FileText, FlaskConical, Settings,
  Calculator, Atom, BarChart, Globe, Cpu, Music, Building,
  Telescope, Pencil, Target, Zap, Layers, TrendingUp, Code2, Brain,
  Microscope, Palette, Compass, Database, Network, BookMarked,
  Activity, Award, Briefcase, Clock, Coffee, Flame,
  Heart, Home, Layout, Map, Moon, Star, Sun, User, Wind,
  Edit2, Trash2, Copy, Download, ExternalLink, Sigma, Infinity,
  Triangle, Square, Circle, Hexagon, GitBranch, Thermometer,
  Radio, Magnet, Waves, Binary, Pi, IterationCw, Maximize2,Server,
  TableProperties, DraftingCompass, Cone, Blocks,Cctv, Github, Gitlab,
} from "lucide-react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const MODES = { FOCUS:"FOCUS", SHORT:"SHORT BREAK", LONG:"LONG BREAK" };
const DEBUG_MODE = false; // set false for production — true = timer in seconds not minutes
const T = DEBUG_MODE ? 1 : 60; // multiplier
const PRESET_COLORS = ["#FF4D4D","#FF8C42","#FFD700","#4ECDC4","#45B7D1","#3498DB","#9B59B6","#96CEB4","#F7C59F","#E91E63","#FF69B4","#FF1493","#CC0000","#39FF14","#F0F0F0"];
const DAYS          = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const MONTHS        = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// Greek letters as special text icons
const GREEK = ["α","β","γ","δ","ε","ζ","η","θ","ι","κ","λ","μ","ν","ξ","π","ρ","σ","τ","υ","φ","χ","ψ","ω","Δ","Γ","Λ","Φ","Ψ","Ω","Σ","Π","∫","∂","∇","∞","√","∑","∏"];

// Lucide icon registry
const LUCIDE_ICONS = [
  {name:"Calculator", C:Calculator}, {name:"Atom",      C:Atom},
  {name:"BarChart",   C:BarChart},   {name:"Globe",     C:Globe},
  {name:"Cpu",        C:Cpu},        {name:"Music",     C:Music},
  {name:"Building",   C:Building},   {name:"Telescope", C:Telescope},
  {name:"Pencil",     C:Pencil},     {name:"Target",    C:Target},
  {name:"Zap",        C:Zap},        {name:"Layers",    C:Layers},
  {name:"TrendingUp", C:TrendingUp}, {name:"Code2",     C:Code2},
  {name:"Brain",      C:Brain},      {name:"Microscope",C:Microscope},
  {name:"Palette",    C:Palette},    {name:"Compass",   C:Compass},
  {name:"Database",   C:Database},   {name:"Network",   C:Network},
  {name:"BookMarked", C:BookMarked}, {name:"Sigma",     C:Sigma},
  {name:"Infinity",   C:Infinity},   {name:"Activity",  C:Activity},
  {name:"Award",      C:Award},      {name:"Briefcase", C:Briefcase},
  {name:"Clock",      C:Clock},      {name:"Coffee",    C:Coffee},
  {name:"Flame",      C:Flame},      {name:"Heart",     C:Heart},
  {name:"Home",       C:Home},       {name:"Layout",    C:Layout},
  {name:"Map",        C:Map},        {name:"Moon",      C:Moon},
  {name:"Star",       C:Star},       {name:"Sun",       C:Sun},
  {name:"Timer",      C:Timer},      {name:"User",      C:User},
  {name:"Wind",       C:Wind},       {name:"BookOpen",  C:BookOpen},
  {name:"FileText",   C:FileText},   {name:"FlaskConical",C:FlaskConical},
  {name:"Triangle",   C:Triangle},   {name:"Square",    C:Square},
  {name:"Circle",     C:Circle},     {name:"Hexagon",   C:Hexagon},
  {name:"GitBranch",  C:GitBranch},  {name:"Thermometer",C:Thermometer},
  {name:"Radio",      C:Radio},      {name:"Magnet",    C:Magnet},
  {name:"Waves",      C:Waves},      {name:"Binary",    C:Binary},
  {name:"Pi",         C:Pi},         {name:"IterationCw",C:IterationCw},
  {name:"Maximize2",  C:Maximize2},  {name:"Server" ,C:Server},
  {name:"TableProperties" ,C:TableProperties}, {name:"DraftingCompass" ,C:DraftingCompass},
  {name:"Cone" ,C:Cone}, {name:"Blocks" ,C:Blocks}, {name:"Cctv", C:Cctv}, 
  {name:"Github" ,C:Github}, {name:"Gitlab", C:Gitlab},
];

const ACCENT_THEMES = [
  { name:"Red",       primary:"#f81a1a", secondary:"#fa7928" },
  { name:"Teal",      primary:"#3DFFD4", secondary:"#45B7D1" },
  { name:"Purple",    primary:"#9a4acf", secondary:"#e436cd" },
  { name:"Blue",      primary:"#3498DB", secondary:"#4ECDC4" },
  { name:"Gold",      primary:"#FFD700", secondary:"#FF8C42" },
  { name:"Green",     primary:"#89c9ab", secondary:"#4ECDC4" },
  { name:"Pink",      primary:"#FF69B4", secondary:"#FF1493" },
  { name:"Mono",      primary:"#E8E8E0", secondary:"#888888" },
  { name:"Matrix",    primary:"#00FF41", secondary:"#00FF41", matrix:true },
];

// Wolfenstein difficulty levels (hardest 3) + original 3
const DIFFICULTY   = ["low","medium","high","I Am Death Incarnate!","Bring 'em On!","Mein Leben!"];
const DIFF_COLOR   = {
  "low":"#96CEB4", "medium":"#FFD700", "high":"#FF4D4D",
  "I Am Death Incarnate!":"#FF6B00", "Bring 'em On!":"#CC0000", "Mein Leben!":"#8B0000",
};

const FONT_OPTIONS = [
  { name:"Mono",      value:"'Courier New',Courier,monospace" },
  { name:"Sans",      value:"'Inter',system-ui,sans-serif" },
  { name:"Helvetica", value:"'Helvetica Neue',Helvetica,Arial,sans-serif" },
  { name:"VSCode",    value:"'Iosevka','Cascadia Code','Cascadia Mono','Consolas',monospace" },
  { name:"Monaco",    value:"'Monaco','Menlo','DejaVu Sans Mono',monospace" },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmt = (secs) => `${Math.floor(secs/60).toString().padStart(2,"0")}:${(secs%60).toString().padStart(2,"0")}`;

function fmtHours(secs) {
  const h=Math.floor(secs/3600), m=Math.floor((secs%3600)/60), s=secs%60;
  if(h>0) return `${h}h ${m}m`;
  if(m>0) return `${m}m ${s}s`;
  return `${s}s`;
}
function loadLS(key,fallback){ try{ const v=localStorage.getItem(key); return v?JSON.parse(v):fallback; }catch{ return fallback; } }
function saveLS(key,value){ try{ localStorage.setItem(key,JSON.stringify(value)); }catch{} }

// ─── SOUND ────────────────────────────────────────────────────────────────────

// 🔔 Boxing / school bell — for end of round
function playDoneSound(){
  try{
    const ctx=new(window.AudioContext||window.webkitAudioContext)();
    // A real bell is a sum of inharmonic partials with slow decay
    // Fundamental ~440Hz + 2-3 strong partials + shimmer
    const partials=[
      {freq:440,  gain:0.5,  decay:3.2},
      {freq:1108, gain:0.28, decay:2.4},
      {freq:1755, gain:0.18, decay:1.8},
      {freq:2350, gain:0.10, decay:1.2},
      {freq:2970, gain:0.06, decay:0.8},
    ];
    // ring it 3 times
    [0, 0.55, 1.1].forEach(ringT=>{
      partials.forEach(({freq,gain:g,decay})=>{
        const osc=ctx.createOscillator(), gainNode=ctx.createGain();
        osc.connect(gainNode); gainNode.connect(ctx.destination);
        osc.type="sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime+ringT);
        gainNode.gain.setValueAtTime(g,            ctx.currentTime+ringT);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+ringT+decay);
        osc.start(ctx.currentTime+ringT);
        osc.stop( ctx.currentTime+ringT+decay+0.05);
      });
      // small metallic clank transient at impact
      const buf=ctx.createBuffer(1,Math.floor(ctx.sampleRate*0.015),ctx.sampleRate);
      const d=buf.getChannelData(0);
      for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,3);
      const src=ctx.createBufferSource(), cg=ctx.createGain(), cf=ctx.createBiquadFilter();
      cf.type="bandpass"; cf.frequency.value=3500; cf.Q.value=1;
      src.buffer=buf; src.connect(cf); cf.connect(cg); cg.connect(ctx.destination);
      cg.gain.setValueAtTime(0.6, ctx.currentTime+ringT);
      cg.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+ringT+0.06);
      src.start(ctx.currentTime+ringT); src.stop(ctx.currentTime+ringT+0.08);
    });
  }catch(e){}
}

// 🎵 Referee whistle — short blast for START
function playWhistleStart(){
  try{
    const ctx=new(window.AudioContext||window.webkitAudioContext)();
    // Whistle = sine ~2600Hz + narrow noise burst + slight pitch wobble
    const osc=ctx.createOscillator(), og=ctx.createGain();
    osc.type="sine";
    osc.frequency.setValueAtTime(2600, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(2750, ctx.currentTime+0.06);
    osc.frequency.linearRampToValueAtTime(2620, ctx.currentTime+0.22);
    og.gain.setValueAtTime(0, ctx.currentTime);
    og.gain.linearRampToValueAtTime(0.45, ctx.currentTime+0.015);
    og.gain.setValueAtTime(0.45, ctx.currentTime+0.18);
    og.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+0.28);
    osc.connect(og); og.connect(ctx.destination);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime+0.3);
    // air noise layer
    const buf=ctx.createBuffer(1,Math.floor(ctx.sampleRate*0.28),ctx.sampleRate);
    const d=buf.getChannelData(0);
    for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1;
    const src=ctx.createBufferSource(), ng=ctx.createGain(), nf=ctx.createBiquadFilter();
    nf.type="bandpass"; nf.frequency.value=2600; nf.Q.value=8;
    src.buffer=buf; src.connect(nf); nf.connect(ng); ng.connect(ctx.destination);
    ng.gain.setValueAtTime(0.08, ctx.currentTime);
    ng.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+0.26);
    src.start(ctx.currentTime); src.stop(ctx.currentTime+0.3);
  }catch(e){}
}

// 🎵 Referee whistle — two short blasts for PAUSE (end of half)
function playWhistlePause(){
  try{
    [0, 0.22].forEach(t=>{
      const ctx=new(window.AudioContext||window.webkitAudioContext)();
      const osc=ctx.createOscillator(), og=ctx.createGain();
      osc.type="sine";
      osc.frequency.setValueAtTime(2700, ctx.currentTime+t);
      osc.frequency.linearRampToValueAtTime(2550, ctx.currentTime+t+0.14);
      og.gain.setValueAtTime(0, ctx.currentTime+t);
      og.gain.linearRampToValueAtTime(0.4, ctx.currentTime+t+0.012);
      og.gain.setValueAtTime(0.4, ctx.currentTime+t+0.1);
      og.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+t+0.18);
      osc.connect(og); og.connect(ctx.destination);
      osc.start(ctx.currentTime+t); osc.stop(ctx.currentTime+t+0.2);
      // air noise
      const buf=ctx.createBuffer(1,Math.floor(ctx.sampleRate*0.18),ctx.sampleRate);
      const d=buf.getChannelData(0);
      for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1;
      const src=ctx.createBufferSource(), ng=ctx.createGain(), nf=ctx.createBiquadFilter();
      nf.type="bandpass"; nf.frequency.value=2700; nf.Q.value=9;
      src.buffer=buf; src.connect(nf); nf.connect(ng); ng.connect(ctx.destination);
      ng.gain.setValueAtTime(0.07, ctx.currentTime+t);
      ng.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+t+0.16);
      src.start(ctx.currentTime+t); src.stop(ctx.currentTime+t+0.2);
    });
  }catch(e){}
}

// ⚡ Electric zap — for clear / delete / reset
function playZap(){
  try{
    const ctx=new(window.AudioContext||window.webkitAudioContext)();
    const buf=ctx.createBuffer(1,ctx.sampleRate*0.25,ctx.sampleRate);
    const data=buf.getChannelData(0);
    for(let i=0;i<data.length;i++) data[i]=(Math.random()*2-1)*Math.pow(1-i/data.length,2);
    const src=ctx.createBufferSource(), gain=ctx.createGain(), filter=ctx.createBiquadFilter();
    filter.type="bandpass"; filter.frequency.value=3200; filter.Q.value=0.8;
    src.buffer=buf; src.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.7,ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.22);
    // pitch-swept zap on top
    const osc=ctx.createOscillator(), og=ctx.createGain();
    osc.connect(og); og.connect(ctx.destination);
    osc.type="sawtooth";
    osc.frequency.setValueAtTime(1800,ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120,ctx.currentTime+0.18);
    og.gain.setValueAtTime(0.3,ctx.currentTime);
    og.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.2);
    src.start(); src.stop(ctx.currentTime+0.25);
    osc.start(); osc.stop(ctx.currentTime+0.22);
  }catch(e){}
}

// 💊 Half-Life Health Charger — for copy
function playCharger(){
  try{
    const ctx=new(window.AudioContext||window.webkitAudioContext)();
    // mechanical hum base
    const hum=ctx.createOscillator(), humG=ctx.createGain();
    hum.type="sawtooth"; hum.frequency.setValueAtTime(60,ctx.currentTime);
    hum.frequency.linearRampToValueAtTime(80,ctx.currentTime+0.15);
    humG.gain.setValueAtTime(0.15,ctx.currentTime);
    humG.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.4);
    hum.connect(humG); humG.connect(ctx.destination);
    // electric buzz sweep up
    const buzz=ctx.createOscillator(), buzzG=ctx.createGain();
    buzz.type="square"; buzz.frequency.setValueAtTime(220,ctx.currentTime+0.05);
    buzz.frequency.exponentialRampToValueAtTime(880,ctx.currentTime+0.25);
    buzzG.gain.setValueAtTime(0,ctx.currentTime+0.05);
    buzzG.gain.linearRampToValueAtTime(0.18,ctx.currentTime+0.1);
    buzzG.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.38);
    buzz.connect(buzzG); buzzG.connect(ctx.destination);
    // short high ping at end
    const ping=ctx.createOscillator(), pingG=ctx.createGain();
    ping.type="sine"; ping.frequency.setValueAtTime(1760,ctx.currentTime+0.28);
    pingG.gain.setValueAtTime(0.25,ctx.currentTime+0.28);
    pingG.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.45);
    ping.connect(pingG); pingG.connect(ctx.destination);
    hum.start(ctx.currentTime); hum.stop(ctx.currentTime+0.45);
    buzz.start(ctx.currentTime+0.05); buzz.stop(ctx.currentTime+0.4);
    ping.start(ctx.currentTime+0.28); ping.stop(ctx.currentTime+0.48);
  }catch(e){}
}

// 🌸 Kirby inhale/transform — for logo toggle
function playKirby(){
  try{
    const ctx=new(window.AudioContext||window.webkitAudioContext)();
    // swoosh inhale
    const buf=ctx.createBuffer(1,ctx.sampleRate*0.18,ctx.sampleRate);
    const d=buf.getChannelData(0);
    for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*Math.sin(Math.PI*i/d.length)*0.4;
    const src=ctx.createBufferSource(), filter=ctx.createBiquadFilter(), sg=ctx.createGain();
    filter.type="highpass"; filter.frequency.value=800;
    src.buffer=buf; src.connect(filter); filter.connect(sg); sg.connect(ctx.destination);
    sg.gain.setValueAtTime(0.5,ctx.currentTime); sg.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.18);
    // cute two-note jingle
    [[523,0.18],[659,0.3],[784,0.42],[1047,0.54]].forEach(([f,t])=>{
      const o=ctx.createOscillator(), g=ctx.createGain();
      o.type="sine"; o.frequency.setValueAtTime(f,ctx.currentTime+t);
      g.gain.setValueAtTime(0.2,ctx.currentTime+t);
      g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+t+0.13);
      o.connect(g); g.connect(ctx.destination);
      o.start(ctx.currentTime+t); o.stop(ctx.currentTime+t+0.15);
    });
    src.start(); src.stop(ctx.currentTime+0.2);
  }catch(e){}
}

// ⏳ ZA WARUDO — Dio's theme synthesized
function playZaWarudo(){
  try{
    const ctx=new(window.AudioContext||window.webkitAudioContext)();
    // menacing low drone
    const drone=ctx.createOscillator(), dg=ctx.createGain();
    drone.type="sawtooth"; drone.frequency.setValueAtTime(55,ctx.currentTime);
    dg.gain.setValueAtTime(0.4,ctx.currentTime); dg.gain.linearRampToValueAtTime(0.6,ctx.currentTime+0.5);
    dg.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+3.5);
    drone.connect(dg); dg.connect(ctx.destination);
    // "ZA" brass stab
    [[110,0],[138.59,0.02],[164.81,0.04]].forEach(([f,t])=>{
      const o=ctx.createOscillator(), g=ctx.createGain(), dist=ctx.createWaveShaper();
      const curve=new Float32Array(256); for(let i=0;i<256;i++){const x=i*2/256-1; curve[i]=Math.tanh(x*4);}
      dist.curve=curve; o.type="sawtooth"; o.frequency.setValueAtTime(f,ctx.currentTime+t);
      g.gain.setValueAtTime(0.3,ctx.currentTime+t); g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+t+0.8);
      o.connect(dist); dist.connect(g); g.connect(ctx.destination);
      o.start(ctx.currentTime+t); o.stop(ctx.currentTime+t+1);
    });
    // "WARUDO" melody
    [[220,0.9,0.12],[246.94,1.05,0.12],[261.63,1.2,0.2],[293.66,1.45,0.25],[329.63,1.75,0.4]].forEach(([f,t,dur])=>{
      const o=ctx.createOscillator(), g=ctx.createGain();
      o.type="square"; o.frequency.setValueAtTime(f,ctx.currentTime+t);
      g.gain.setValueAtTime(0.22,ctx.currentTime+t);
      g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+t+dur);
      o.connect(g); g.connect(ctx.destination);
      o.start(ctx.currentTime+t); o.stop(ctx.currentTime+t+dur+0.05);
    });
    // clock tick stutters (time stopping)
    for(let i=0;i<6;i++){
      const t=2.2+i*0.13*(1-i*0.06);
      const o=ctx.createOscillator(), g=ctx.createGain();
      o.type="square"; o.frequency.value=880;
      g.gain.setValueAtTime(0.15,ctx.currentTime+t);
      g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+t+0.04);
      o.connect(g); g.connect(ctx.destination);
      o.start(ctx.currentTime+t); o.stop(ctx.currentTime+t+0.05);
    }
    drone.start(ctx.currentTime); drone.stop(ctx.currentTime+3.6);
  }catch(e){}
}

function playCoin(){
  try{
    const ctx=new(window.AudioContext||window.webkitAudioContext)();
    const osc=ctx.createOscillator(), gain=ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type="square";
    // Mario coin: B5 then E6
    osc.frequency.setValueAtTime(987.77, ctx.currentTime);
    osc.frequency.setValueAtTime(1318.51, ctx.currentTime+0.07);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+0.35);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime+0.35);
  }catch(e){}
}

function playGuitarRiff(){
  try{
    const ctx=new(window.AudioContext||window.webkitAudioContext)();
    // Power chord + distortion simulation with sawtooth + detune
    const notes=[
      {freq:110, t:0,    dur:0.12},
      {freq:110, t:0.13, dur:0.12},
      {freq:146.83, t:0.28, dur:0.18},
      {freq:110, t:0.48, dur:0.10},
      {freq:98,  t:0.60, dur:0.20},
    ];
    notes.forEach(({freq,t,dur})=>{
      // two oscillators slightly detuned = power chord thickness
      [0, 7].forEach(semitones=>{
        const f = freq * Math.pow(2, semitones/12);
        const osc=ctx.createOscillator(), gain=ctx.createGain(), dist=ctx.createWaveShaper();
        // simple distortion curve
        const curve=new Float32Array(256);
        for(let i=0;i<256;i++){ const x=i*2/256-1; curve[i]=x<0?-Math.pow(-x,0.5):Math.pow(x,0.5); }
        dist.curve=curve;
        osc.connect(dist); dist.connect(gain); gain.connect(ctx.destination);
        osc.type="sawtooth";
        osc.frequency.setValueAtTime(f, ctx.currentTime+t);
        gain.gain.setValueAtTime(0.18, ctx.currentTime+t);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+t+dur);
        osc.start(ctx.currentTime+t); osc.stop(ctx.currentTime+t+dur+0.05);
      });
    });
  }catch(e){}
}

// ─── OUTLINER NODE ────────────────────────────────────────────────────────────
// ─── ICON PICKER ──────────────────────────────────────────────────────────────
function IconPicker({ selected, onSelect, accent }) {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("icons"); // "icons" | "greek"

  const filteredLucide = query.trim()
    ? LUCIDE_ICONS.filter(i=>i.name.toLowerCase().includes(query.toLowerCase()))
    : LUCIDE_ICONS;
  const filteredGreek = query.trim()
    ? GREEK.filter(g=>g.includes(query))
    : GREEK;

  return (
    <div>
      <div style={{display:"flex",gap:"6px",marginBottom:"8px"}}>
        <input
          value={query} onChange={e=>setQuery(e.target.value)}
          placeholder="Search..."
          style={{flex:1,background:"#0A0A0A",border:"1px solid #222",borderRadius:"6px",
            padding:"6px 10px",color:"#C8C8C0",fontSize:"11px",fontFamily:"inherit",
            outline:"none",caretColor:accent}}
        />
        {["icons","greek"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{
            background:tab===t?`${accent}22`:"#0A0A0A",
            border:`1px solid ${tab===t?accent:"#222"}`,
            color:tab===t?accent:"#555",borderRadius:"6px",
            padding:"6px 10px",cursor:"pointer",fontSize:"10px",fontFamily:"inherit",
          }}>{t==="greek"?"α β γ":"Icons"}</button>
        ))}
      </div>
      {tab==="icons" ? (
        <div style={{display:"grid",gridTemplateColumns:"repeat(9,1fr)",gap:"3px",maxHeight:"150px",overflowY:"auto"}}>
          {filteredLucide.map(({name,C})=>{
            const isSel = selected===name;
            return (
              <button key={name} onClick={()=>onSelect(name)} title={name} style={{
                background:isSel?`${accent}22`:"#0A0A0A",
                border:`1px solid ${isSel?accent:"#1A1A1A"}`,
                borderRadius:"5px",padding:"6px",cursor:"pointer",
                display:"flex",alignItems:"center",justifyContent:"center",
                color:isSel?accent:"#555",transition:"all 0.1s",
              }}><C size={13}/></button>
            );
          })}
          {filteredLucide.length===0 && <div style={{gridColumn:"1/-1",fontSize:"10px",color:"#444",padding:"12px",textAlign:"center"}}>No icons found</div>}
        </div>
      ) : (
        <div style={{display:"grid",gridTemplateColumns:"repeat(9,1fr)",gap:"3px",maxHeight:"150px",overflowY:"auto"}}>
          {filteredGreek.map(g=>{
            const isSel = selected===`greek:${g}`;
            return (
              <button key={g} onClick={()=>onSelect(`greek:${g}`)} title={g} style={{
                background:isSel?`${accent}22`:"#0A0A0A",
                border:`1px solid ${isSel?accent:"#1A1A1A"}`,
                borderRadius:"5px",padding:"6px",cursor:"pointer",
                fontSize:"14px",color:isSel?accent:"#888",fontFamily:"serif",
              }}>{g}</button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── LUCIDE SUBJECT ICON ──────────────────────────────────────────────────────
function SubjectIcon({ name, size=14, color }) {
  if(name && name.startsWith("greek:")) {
    const ch = name.slice(6);
    return <span style={{fontSize:size,color,fontFamily:"serif",lineHeight:1}}>{ch}</span>;
  }
  const found = LUCIDE_ICONS.find(i=>i.name===name);
  if(!found) return <span style={{fontSize:size,color}}>{name||"?"}</span>;
  const C = found.C;
  return <C size={size} color={color}/>;
}

const emptySubject = { name:"", icon:"Calculator", color:"#4ECDC4", difficulty:"medium", goalMinutes:60 };

// ─── NOTES EDITOR ─────────────────────────────────────────────────────────────
function NotesEditor({ accent, theme }) {
  const INDENT = 20;

  const [lines, setLines] = useState(()=>{
    try {
      const saved = localStorage.getItem("gt_notes_v2");
      return saved ? JSON.parse(saved) : [{ text:"", indent:0 }];
    } catch { return [{ text:"", indent:0 }]; }
  });
  const [focusIdx, setFocusIdx] = useState(-1); // -1 = no line focused
  const refs = useRef([]);

  useEffect(()=>{ localStorage.setItem("gt_notes_v2", JSON.stringify(lines)); }, [lines]);

  // Re-measure all textareas after any lines change (indent/dedent changes width)
  useEffect(()=>{
    refs.current.forEach(el=>{ if(el){ el.style.height="auto"; el.style.height=el.scrollHeight+"px"; } });
  }, [lines]);

  useEffect(()=>{
    if(focusIdx < 0) return;
    const el = refs.current[focusIdx];
    if(el){ el.focus(); const len=el.value.length; el.setSelectionRange(len,len); }
  }, [focusIdx, lines.length]);

  const handleKey = (e, idx) => {
    if(e.key==="Tab"){
      e.preventDefault();
      setLines(prev => prev.map((l,i) => i===idx
        ? { ...l, indent: e.shiftKey ? Math.max(0,l.indent-1) : l.indent+1 }
        : l
      ));
    } else if(e.key==="Enter"){
      e.preventDefault();
      const newLine = { text:"", indent: lines[idx].indent };
      setLines(prev => [...prev.slice(0,idx+1), newLine, ...prev.slice(idx+1)]);
      setFocusIdx(idx+1);
    } else if(e.key==="Backspace" && lines[idx].text==="" && lines.length>1){
      e.preventDefault();
      setLines(prev => prev.filter((_,i)=>i!==idx));
      setFocusIdx(Math.max(0,idx-1));
    }
  };


  const indentColors = ["#2A2A2A", accent+"88", accent+"55", accent+"33", accent+"22"];

  const PUNCT_SET_N = new Set([...`:;'"}][{)(-+=\\|/?.><,*!@#$%^&`]);
  const URL_RE = /https?:\/\/[^\s]+/g;

  // Render text: URLs become clickable links, punctuation gets accent color
  const renderLine = (text, baseColor, isActive) => {
    if(!text) return null;
    const out = [];
    let lastIdx = 0;
    let m;
    URL_RE.lastIndex = 0;
    while((m = URL_RE.exec(text)) !== null){
      // render text before URL with punct coloring
      if(m.index > lastIdx){
        const seg = text.slice(lastIdx, m.index);
        let buf = "";
        for(let i=0;i<seg.length;i++){
          const ch = seg[i];
          if(PUNCT_SET_N.has(ch)){
            if(buf){ out.push(<span key={`tb${lastIdx+i}`} style={{color:baseColor}}>{buf}</span>); buf=""; }
            out.push(<span key={`pb${lastIdx+i}`} style={{color:accent}}>{ch}</span>);
          } else buf+=ch;
        }
        if(buf) out.push(<span key={`te${m.index}`} style={{color:baseColor}}>{buf}</span>);
      }
      // render URL as link — only clickable when line is not being edited
      const url = m[0];
      out.push(
        <a key={`url${m.index}`}
          href={url} target="_blank" rel="noreferrer"
          onClick={e=>{ e.stopPropagation(); if(isActive) e.preventDefault(); else window.open(url,'_blank','noreferrer'); }}
          style={{
            color: accent, textDecoration:"underline",
            textDecorationColor: accent+"88",
            cursor: isActive ? "text" : "pointer",
            pointerEvents: isActive ? "none" : "auto",
          }}
        >{url}</a>
      );
      lastIdx = m.index + url.length;
    }
    // remaining text after last URL
    if(lastIdx < text.length){
      const seg = text.slice(lastIdx);
      let buf = "";
      for(let i=0;i<seg.length;i++){
        const ch = seg[i];
        if(PUNCT_SET_N.has(ch)){
          if(buf){ out.push(<span key={`tr${lastIdx+i}`} style={{color:baseColor}}>{buf}</span>); buf=""; }
          out.push(<span key={`pr${lastIdx+i}`} style={{color:accent}}>{ch}</span>);
        } else buf+=ch;
      }
      if(buf) out.push(<span key="tend" style={{color:baseColor}}>{buf}</span>);
    }
    return out;
  };

  return (
    <div>
      <div style={{background:"#000",minHeight:"calc(100vh - 320px)",borderRadius:"12px",border:"1px solid #111",padding:"20px 24px"}}>
        {lines.map((line, idx) => {
          const baseColor = line.indent===0 ? "#C8C8C0" : "#888";
          const fontSize  = line.indent===0 ? "13px" : `${Math.max(11,13-line.indent)}px`;
          const isActive  = focusIdx === idx;
          return (
            <div key={idx} style={{display:"flex",alignItems:"flex-start",marginBottom:"2px",paddingLeft: line.indent * INDENT}}>
              {line.indent > 0 && (
                <div style={{
                  width:"2px", minHeight:"22px", marginRight:"8px", marginTop:"6px", flexShrink:0,
                  background: indentColors[Math.min(line.indent, indentColors.length-1)],
                  borderRadius:"2px",
                }}/>
              )}
              <div style={{flex:1, position:"relative"}}>
                {/* colored overlay — always relative to hold height */}
                <div
                  onClick={()=>{ setFocusIdx(idx); setTimeout(()=>refs.current[idx]?.focus(),0); }}
                  style={{
                    position:"relative",
                    fontSize, fontFamily:"inherit", lineHeight:"1.7",
                    padding:"4px 2px", whiteSpace:"pre-wrap", wordBreak:"break-word",
                    minHeight:"1.7em", color:baseColor,
                    boxSizing:"border-box", cursor:"text",
                    pointerEvents: isActive ? "none" : "auto",
                    visibility: isActive ? "hidden" : "visible",
                  }}>
                  {line.text ? renderLine(line.text, baseColor, false) : (
                    idx===0&&line.indent===0
                      ? <span style={{color:"#333",pointerEvents:"none"}}>Start writing... (Tab to indent)</span>
                      : null
                  )}
                </div>
                {/* textarea — absolute overlay, only active when focused */}
                <textarea
                  ref={el=>refs.current[idx]=el}
                  value={line.text}
                  onChange={e=>{
                    setLines(prev=>prev.map((l,i)=>i===idx?{...l,text:e.target.value}:l));
                    e.target.style.height="auto";
                    e.target.style.height=e.target.scrollHeight+"px";
                  }}
                  onKeyDown={e=>handleKey(e,idx)}
                  onFocus={()=>setFocusIdx(idx)}
                  onBlur={()=>setFocusIdx(-1)}
                  rows={1}
                  style={{
                    position:"absolute", top:0, left:0,
                    width:"100%", height:"100%",
                    background:"transparent", border:"none",
                    borderBottom: isActive ? "1px solid #1A1A1A" : "none",
                    color: isActive ? baseColor : "transparent",
                    caretColor: accent,
                    fontSize, fontFamily:"inherit", outline:"none", padding:"4px 2px",
                    lineHeight:"1.7", boxSizing:"border-box",
                    resize:"none", overflow:"hidden",
                    pointerEvents: isActive ? "auto" : "none",
                    zIndex: isActive ? 2 : -1,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── CONFETTI / MATRIX ────────────────────────────────────────────────────────
function Confetti({ active, colors, matrix }) {
  const canvasRef = useRef(null);
  useEffect(()=>{
    if(!active) return;
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if(matrix) {
      // Matrix rain: columns of falling green chars
      const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789αβγδεζηθλμνξπσφψω∫∂∇";
      const fontSize = 14;
      const cols = Math.floor(canvas.width / fontSize);
      const drops = Array(cols).fill(0).map(()=>-Math.floor(Math.random()*50));
      let frame;
      let elapsed = 0;
      const draw = () => {
        elapsed++;
        ctx.fillStyle = "rgba(0,0,0,0.05)";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.font = `${fontSize}px monospace`;
        drops.forEach((y,i)=>{
          const ch = CHARS[Math.floor(Math.random()*CHARS.length)];
          // bright head
          ctx.fillStyle = "#AAFFAA";
          ctx.fillText(ch, i*fontSize, y*fontSize);
          // dim trail already done by the fade overlay
          drops[i]++;
          if(drops[i]*fontSize > canvas.height && elapsed > 150) {
            drops[i] = -Math.floor(Math.random()*20);
          }
        });
        // stop after ~5s and all drops past bottom
        if(elapsed < 300) frame = requestAnimationFrame(draw);
      };
      draw();
      return ()=>{ cancelAnimationFrame(frame); ctx.clearRect(0,0,canvas.width,canvas.height); };
    }

    // Regular confetti: run until every piece exits bottom of screen
    const pieces = Array.from({length:150},()=>({
      x: Math.random()*canvas.width,
      y: -20 - Math.random()*300,
      w: 6+Math.random()*8,
      h: 10+Math.random()*14,
      rot: Math.random()*360,
      rotV: (Math.random()-0.5)*6,
      vy: 2+Math.random()*4,
      vx: (Math.random()-0.5)*2,
      color: colors[Math.floor(Math.random()*colors.length)],
    }));
    let frame;
    const fadeStart = canvas.height * 0.75;
    const fadeEnd   = canvas.height * 1.05;
    const draw = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      let alive = false;
      pieces.forEach(p=>{
        p.y += p.vy; p.x += p.vx; p.rot += p.rotV;
        if(p.y < fadeEnd) alive = true;
        // smooth alpha fade from fadeStart to fadeEnd
        const alpha = p.y < fadeStart ? 1
          : p.y > fadeEnd ? 0
          : 1 - (p.y - fadeStart) / (fadeEnd - fadeStart);
        ctx.save();
        ctx.globalAlpha = Math.max(0, alpha);
        ctx.translate(p.x+p.w/2, p.y+p.h/2);
        ctx.rotate(p.rot*Math.PI/180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);
        ctx.restore();
      });
      if(alive) frame = requestAnimationFrame(draw);
    };
    draw();
    return ()=>cancelAnimationFrame(frame);
  },[active, colors, matrix]);

  if(!active) return null;
  return <canvas ref={canvasRef} style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:999}}/>;
}

// ─── OUTLINER HELPERS ─────────────────────────────────────────────────────────
// ─── COLOR PUNCTUATION ────────────────────────────────────────────────────────
const PUNCT_SET = new Set([...`:;'"}][{)(-+=\\|/?.><,*!@#$%^&`]);
function ColorPunct({ text, accent, style={} }) {
  if(!text) return null;
  // split by individual characters, group consecutive non-punct
  const out = [];
  let buf = "";
  for(let i=0;i<text.length;i++){
    if(PUNCT_SET.has(text[i])){
      if(buf){ out.push(<span key={`t${i}`}>{buf}</span>); buf=""; }
      out.push(<span key={`p${i}`} style={{color:accent}}>{text[i]}</span>);
    } else { buf+=text[i]; }
  }
  if(buf) out.push(<span key="end">{buf}</span>);
  return <span style={style}>{out}</span>;
}

// ─── HOVER BUTTON ─────────────────────────────────────────────────────────────
function HoverBtn({ onClick, color, border, bg="#111", children, style={} }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>setHov(false)}
      style={{
        background: hov ? `${color}22` : bg,
        border, color,
        borderRadius:"5px", padding:"4px 10px", cursor:"pointer",
        fontSize:"9px", fontFamily:"inherit", letterSpacing:"1px",
        display:"flex", alignItems:"center", gap:"4px",
        transition:"background 0.15s, transform 0.1s, box-shadow 0.15s",
        transform: hov ? "scale(1.07)" : "scale(1)",
        boxShadow: hov ? `0 0 8px ${color}44` : "none",
        ...style,
      }}
    >{children}</button>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [activeTab,        setActiveTab]        = useState("pomodoro");
  const [subjects,         setSubjects]         = useState(()=>loadLS("gt_subjects",[]));
  const [rounds,           setRounds]           = useState(()=>loadLS("gt_rounds",0));
  const [sessionTime,      setSessionTime]      = useState(0);
  const [sessionLog,       setSessionLog]       = useState(()=>loadLS("gt_log",[]));
  const [themeIdx,         setThemeIdx]         = useState(()=>loadLS("gt_theme",0));
  const [fontIdx,          setFontIdx]          = useState(()=>loadLS("gt_font",0));
  const [showSettings,     setShowSettings]     = useState(false);
  const [statsTab,         setStatsTab]         = useState("hour");
  const [logoHeart,        setLogoHeart]        = useState(false);
  const [showConfetti,     setShowConfetti]     = useState(false);
  const [notesClearKey,    setNotesClearKey]    = useState(0);
  const [roundsAnim,       setRoundsAnim]       = useState(false);
  const prevRoundsRef = useRef(rounds);
  const [zaWarudo,         setZaWarudo]         = useState(false);
  const totalClickRef = useRef(0);

  const [mode,             setMode]             = useState(MODES.FOCUS);
  const [timeLeft,         setTimeLeft]         = useState(50*T);
  const [running,          setRunning]          = useState(false);
  const [selectedSubject,  setSelectedSubject]  = useState(null);
  const [customFocus,      setCustomFocus]      = useState(()=>loadLS("gt_focus",50));
  const [customShort,      setCustomShort]      = useState(()=>loadLS("gt_short",10));
  const [customLong,       setCustomLong]       = useState(()=>loadLS("gt_long",30));

  const [showModal,         setShowModal]         = useState(false);
  const [editingSubject,    setEditingSubject]    = useState(null);
  const [form,              setForm]              = useState(emptySubject);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const tickRef    = useRef(null);
  const settingsRef= useRef(null);
  const theme      = ACCENT_THEMES[themeIdx]||ACCENT_THEMES[0];
  const accent     = theme.primary;
  const font       = FONT_OPTIONS[fontIdx]?.value || FONT_OPTIONS[0].value;

  const MODE_COLORS = { FOCUS:accent, "SHORT BREAK":theme.secondary, "LONG BREAK":theme.secondary };
  const modeColor   = MODE_COLORS[mode];

  // ── persist ──
  useEffect(()=>{ saveLS("gt_subjects",subjects); },[subjects]);
  useEffect(()=>{ saveLS("gt_rounds",rounds);
    if(rounds > prevRoundsRef.current){
      // coin sound + +1UP after confetti (~4.5s)
      setTimeout(()=>{ playCoin(); setRoundsAnim(true); setTimeout(()=>setRoundsAnim(false),900); }, 4600);
    }
    prevRoundsRef.current = rounds;
  },[rounds]);
  useEffect(()=>{ saveLS("gt_log",sessionLog); },[sessionLog]);
  useEffect(()=>{ saveLS("gt_theme",themeIdx); },[themeIdx]);
  useEffect(()=>{ saveLS("gt_font",fontIdx); },[fontIdx]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(()=>{ saveLS("gt_focus",customFocus); if(!running&&mode===MODES.FOCUS) setTimeLeft(customFocus*T); },[customFocus]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(()=>{ saveLS("gt_short",customShort); if(!running&&mode===MODES.SHORT) setTimeLeft(customShort*T); },[customShort]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(()=>{ saveLS("gt_long",customLong);   if(!running&&mode===MODES.LONG)  setTimeLeft(customLong*T);  },[customLong]);

  useEffect(()=>{
    if(subjects.length>0&&!selectedSubject) setSelectedSubject(subjects[0]);
    if(selectedSubject&&!subjects.find(s=>s.id===selectedSubject.id)) setSelectedSubject(subjects[0]||null);
  },[subjects, selectedSubject]);

  // close settings on outside click
  useEffect(()=>{
    if(!showSettings) return;
    const h=(e)=>{ if(settingsRef.current&&!settingsRef.current.contains(e.target)) setShowSettings(false); };
    document.addEventListener("mousedown",h);
    return ()=>document.removeEventListener("mousedown",h);
  },[showSettings]);

  const getDuration = useCallback((m)=>{
    if(m===MODES.FOCUS)  return customFocus*T;
    if(m===MODES.SHORT)  return customShort*T;
    return customLong*T;
  },[customFocus,customShort,customLong]);

  const switchMode = useCallback((newMode)=>{
    clearInterval(tickRef.current);
    tickRef.current = null;
    finishedRef.current = false;
    setRunning(false);
    setMode(newMode);
    setTimeLeft(getDuration(newMode));
    if(newMode!==MODES.FOCUS) setSelectedSubject(null);
  },[getDuration]);

  // ── timer ──
  const finishedRef = useRef(false); // guard against StrictMode double-invoke

  useEffect(()=>{
    if(running){
      finishedRef.current = false;
      tickRef.current=setInterval(()=>{
        setTimeLeft(t=>{
          if(t<=1){
            clearInterval(tickRef.current);
            return 0;
          }
          return t-1;
        });
      },1000);
    } else clearInterval(tickRef.current);
    return ()=>clearInterval(tickRef.current);
  },[running]);

  // separate effect: fires when timer hits 0 — exactly once via finishedRef guard
  useEffect(()=>{
    if(timeLeft!==0 || !running) return; // only act when tick just landed on 0
    if(finishedRef.current) return;      // StrictMode guard
    finishedRef.current = true;

    clearInterval(tickRef.current);
    setRunning(false);
    playDoneSound();
    setShowConfetti(true);
    setTimeout(()=>setShowConfetti(false), 4500);

    if(mode===MODES.FOCUS){
      const dur=getDuration(MODES.FOCUS), now=new Date();
      if(selectedSubject){
        setSessionTime(prev=>prev+dur);
        setSessionLog(prev=>[...prev,{
          subjectId:selectedSubject.id, subjectName:selectedSubject.name,
          subjectColor:selectedSubject.color, duration:dur, timestamp:now.toISOString(),
          hour:now.getHours(), day:now.getDay()===0?6:now.getDay()-1, month:now.getMonth(),
        }]);
      }
      setRounds(r=>r+1);
    }
  },[timeLeft, running, mode, selectedSubject, getDuration]);

  // ── derived ──
  const circumference  = 2*Math.PI*90;
  const configuredMins = mode===MODES.FOCUS?customFocus:mode===MODES.SHORT?customShort:customLong;
  const timerFinished  = timeLeft===0;

  // ── derived time tracking — single source of truth: sessionLog ──
  const todayStr = new Date().toDateString();
  const liveId   = (running && mode===MODES.FOCUS && selectedSubject) ? selectedSubject.id : null;
  const liveSecs = liveId ? (getDuration(MODES.FOCUS) - timeLeft) : 0;

  // total all-time seconds per subject (for stats)
  const subjectTime = subjects.reduce((acc,s)=>{
    const total = sessionLog
      .filter(l=>l.subjectId===s.id)
      .reduce((a,l)=>a+l.duration, 0);
    acc[s.id] = total + (liveId===s.id ? liveSecs : 0);
    return acc;
  }, {});

  // today seconds per subject (for daily goal bar)
  const todaySecsById = subjects.reduce((acc,s)=>{
    const logged = sessionLog
      .filter(l=>l.subjectId===s.id && new Date(l.timestamp).toDateString()===todayStr)
      .reduce((a,l)=>a+l.duration, 0);
    acc[s.id] = logged + (liveId===s.id ? liveSecs : 0);
    return acc;
  }, {});

  const totalStudied = Object.values(subjectTime).reduce((a,b)=>a+b,0);

  const primaryFill = timerFinished ? 0 : (() => {
    // Static shape based on configuredMins (0–60min scale)
    const staticFill = Math.min(1, configuredMins / 60);
    if (!running) return staticFill;
    // While running: drain proportionally. timeLeft/totalDuration gives remaining ratio.
    const totalDuration = getDuration(mode);
    const remainingRatio = timeLeft / totalDuration;
    return staticFill * remainingRatio;
  })();
  const primaryDash = circumference*primaryFill;
  const primaryGap  = circumference-primaryDash;
  const overtimeMins= Math.max(0,configuredMins-60);
  const overtimeFill= timerFinished ? 0 : (() => {
    const staticOT = Math.min(1, overtimeMins / 60);
    if (!running || staticOT === 0) return staticOT;
    const totalDuration = getDuration(mode);
    const remainingRatio = timeLeft / totalDuration;
    return staticOT * remainingRatio;
  })();
  const overtimeDash= circumference*overtimeFill;
  const overtimeGap = circumference-overtimeDash;
  const ringColor   = timerFinished ? "#2A2A2A" : modeColor;

  // ── stats — update in real-time including the current live second ──
  const now_rt = new Date();
  const liveHour  = now_rt.getHours();
  const liveDay   = now_rt.getDay()===0?6:now_rt.getDay()-1;
  const liveMonth = now_rt.getMonth();

  const statsByHour = Array(24).fill(0).map((_,h)=>{
    const logged = sessionLog.filter(l=>l.hour===h).reduce((a,l)=>a+l.duration,0);
    return logged + (running&&mode===MODES.FOCUS&&selectedSubject&&h===liveHour ? 1 : 0);
  });
  const statsByDay  = DAYS.map((_,d)=>{
    const logged = sessionLog.filter(l=>l.day===d).reduce((a,l)=>a+l.duration,0);
    return logged + (running&&mode===MODES.FOCUS&&selectedSubject&&d===liveDay ? 1 : 0);
  });
  const statsByMonth= MONTHS.map((_,mo)=>{
    const logged = sessionLog.filter(l=>l.month===mo).reduce((a,l)=>a+l.duration,0);
    return logged + (running&&mode===MODES.FOCUS&&selectedSubject&&mo===liveMonth ? 1 : 0);
  });
  const peakHour    = statsByHour.reduce((b,v,i)=>v>statsByHour[b]?i:b,0);
  const peakDay     = statsByDay.reduce((b,v,i)=>v>statsByDay[b]?i:b,0);
  const peakMonth   = statsByMonth.reduce((b,v,i)=>v>statsByMonth[b]?i:b,0);
  const maxH=Math.max(...statsByHour,1), maxD=Math.max(...statsByDay,1), maxM=Math.max(...statsByMonth,1);

  // ── subjects ──
  const openAdd  = ()=>{ setForm(emptySubject); setEditingSubject(null); setShowModal(true); };
  const openEdit = (s)=>{ setForm({name:s.name,icon:s.icon,color:s.color,difficulty:s.difficulty,goalMinutes:s.goalMinutes}); setEditingSubject(s); setShowModal(true); };
  const saveSubject = ()=>{
    if(!form.name.trim()) return;
    if(editingSubject){
      setSubjects(prev=>prev.map(s=>s.id===editingSubject.id?{...s,...form}:s));
      if(selectedSubject?.id===editingSubject.id) setSelectedSubject(prev=>({...prev,...form}));
    } else {
      const newS={...form,id:Date.now().toString()};
      setSubjects(prev=>[...prev,newS]);
      if(!selectedSubject) setSelectedSubject(newS);
    }
    setShowModal(false);
  };
  const deleteSubject=(id)=>{ setSubjects(prev=>prev.filter(s=>s.id!==id)); setShowDeleteConfirm(null); };
  const handleReset=()=>{ if(window.confirm("Reset ALL time data and session log?")){ setRounds(0); setSessionTime(0); setSessionLog([]); } };
  const handleBackup=()=>{ const notes_v2=loadLS("gt_notes_v2",[]); const d={subjects,rounds,sessionLog,notes_v2,date:new Date().toLocaleString()}; const b=new Blob([JSON.stringify(d,null,2)],{type:"application/json"}); const u=URL.createObjectURL(b); const a=document.createElement("a"); a.href=u; a.download="gtracker_backup.json"; a.click(); };
  const handleDeleteAll=()=>{ if(window.confirm("Delete ALL data including subjects, time, notes and logs? This cannot be undone.")){ setSubjects([]); setRounds(0); setSessionTime(0); setSessionLog([]); localStorage.removeItem("gt_notes_v2"); setNotesClearKey(k=>k+1); } };

  const S = {
    card:  { background:"#0C0C0C", border:"1px solid #1A1A1A", borderRadius:"12px", padding:"20px" },
    label: { fontSize:"9px", color:"#444", letterSpacing:"3px", textTransform:"uppercase", marginBottom:"12px" },
  };

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div style={{background:"#000",minHeight:"100vh",fontFamily:font,color:"#E8E8E0"}}>

      {/* ── HEADER ── */}
      <div style={{background:"#080808",borderBottom:"1px solid #141414",padding:"12px 24px",display:"grid",gridTemplateColumns:"1fr auto 1fr",alignItems:"center",position:"sticky",top:0,zIndex:50}}>

        {/* left: logo */}
        <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
          <div
            onClick={()=>{ setLogoHeart(v=>!v); playKirby(); }}
            style={{fontSize:"20px",fontWeight:"900",letterSpacing:"2px",cursor:"pointer",
              transition:"transform 0.2s",userSelect:"none",
            }}
            onMouseEnter={e=>e.currentTarget.style.transform="scale(1.1)"}
            onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
          >
            {logoHeart ? (
              <span style={{
                background:`linear-gradient(90deg,${theme.primary},${theme.secondary})`,
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                fontSize:"22px", display:"inline-block",
                animation:"heartPop 0.3s ease",
              }}>&lt;3</span>
            ) : (
              <>
                <span style={{color:theme.primary}}>G</span>
                <span style={{color:theme.secondary}}>Tracker</span>
              </>
            )}
          </div>
          <div style={{fontSize:"9px",color:"#2A2A2A",letterSpacing:"3px"}}>FOCUS · TRACK · ACHIEVE</div>
        </div>

        {/* center: session stats */}
        <div style={{display:"flex",gap:"28px",alignItems:"center"}}>
          {[
            {label:"SESSION", value:fmtHours(sessionTime), color:theme.primary, onClick:null},
          ].map(s=>(
            <div key={s.label} style={{textAlign:"center"}}>
              <div style={{fontSize:"16px",fontWeight:"700",color:s.color,letterSpacing:"-0.5px"}}>{s.value}</div>
              <div style={{fontSize:"8px",color:"#444",letterSpacing:"2px",marginTop:"2px"}}>{s.label}</div>
            </div>
          ))}
          {/* TOTAL — easter egg on 10 clicks */}
          <div style={{textAlign:"center",cursor:"pointer",userSelect:"none"}}
            onClick={()=>{
              totalClickRef.current++;
              if(totalClickRef.current>=10){
                totalClickRef.current=0;
                playZaWarudo();
                setZaWarudo(true);
                setTimeout(()=>setZaWarudo(false),4000);
              }
            }}>
            <div style={{fontSize:"16px",fontWeight:"700",color:theme.secondary,letterSpacing:"-0.5px"}}>{fmtHours(totalStudied)}</div>
            <div style={{fontSize:"8px",color:"#444",letterSpacing:"2px",marginTop:"2px"}}>TOTAL</div>
          </div>
          <div style={{textAlign:"center",position:"relative"}}>
            <div style={{fontSize:"16px",fontWeight:"700",color:"#9B59B6",letterSpacing:"-0.5px"}}>{rounds}</div>
            <div style={{fontSize:"8px",color:"#444",letterSpacing:"2px",marginTop:"2px"}}>ROUNDS</div>
            {roundsAnim && (
              <div style={{
                position:"absolute",bottom:"-4px",left:"50%",
                color:theme.primary,fontSize:"11px",fontWeight:"900",whiteSpace:"nowrap",
                animation:"oneUp 0.9s ease forwards",pointerEvents:"none",letterSpacing:"1px",
              }}>+1 UP</div>
            )}
          </div>
        </div>

        {/* right: settings */}
        <div style={{display:"flex",justifyContent:"flex-end"}}>
          <div style={{position:"relative"}} ref={settingsRef}>
            <button onClick={()=>setShowSettings(v=>!v)} style={{
              background:showSettings?`${accent}22`:"none",
              border:`1px solid ${showSettings?accent:"#222"}`,
              color:showSettings?accent:"#555",
              borderRadius:"8px",width:"32px",height:"32px",
              cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
            }}><Settings size={14}/></button>

            {showSettings && (
              <div style={{position:"absolute",right:0,top:"40px",background:"#0A0A0A",border:"1px solid #222",borderRadius:"12px",padding:"16px",zIndex:200,minWidth:"200px",boxShadow:"0 12px 40px #000"}}>

                {/* accent tray */}
                <div style={{...S.label,marginBottom:"8px"}}>ACCENT</div>
                <div style={{display:"flex",flexDirection:"column",gap:"4px",marginBottom:"16px"}}>
                  {ACCENT_THEMES.map((t,i)=>(
                    <button key={i} onClick={()=>{ setThemeIdx(i); }} style={{
                      display:"flex",alignItems:"center",gap:"10px",
                      background:themeIdx===i?`${t.primary}18`:"none",
                      border:`1px solid ${themeIdx===i?t.primary:"#1A1A1A"}`,
                      borderRadius:"6px",padding:"6px 10px",cursor:"pointer",fontFamily:"inherit",transition:"all 0.15s",
                    }}>
                      <div style={{width:"12px",height:"12px",borderRadius:"50%",background:t.primary,flexShrink:0}}/>
                      <div style={{fontSize:"11px",color:themeIdx===i?t.primary:"#555",flex:1}}>{t.name}</div>
                      {themeIdx===i && <span style={{fontSize:"10px",color:t.primary}}>✓</span>}
                    </button>
                  ))}
                </div>

                {/* font tray */}
                <div style={{...S.label,marginBottom:"8px"}}>FONT</div>
                <div style={{display:"flex",flexDirection:"column",gap:"4px",marginBottom:"16px"}}>
                  {FONT_OPTIONS.map((f,i)=>(
                    <button key={i} onClick={()=>setFontIdx(i)} style={{
                      display:"flex",alignItems:"center",gap:"10px",
                      background:fontIdx===i?`${accent}18`:"none",
                      border:`1px solid ${fontIdx===i?accent:"#1A1A1A"}`,
                      borderRadius:"6px",padding:"6px 10px",cursor:"pointer",fontFamily:f.value,transition:"all 0.15s",
                    }}>
                      <div style={{fontSize:"11px",color:fontIdx===i?accent:"#555",flex:1}}>{f.name}</div>
                      {fontIdx===i && <span style={{fontSize:"10px",color:accent}}>✓</span>}
                    </button>
                  ))}
                </div>

                {/* delete all */}
                <HoverBtn onClick={()=>{ setShowSettings(false); playZap(); handleDeleteAll(); }}
                  color="#FF4D4D" border="1px solid #FF4D4D44" bg="#0A0000"
                  style={{width:"100%",justifyContent:"center",padding:"8px",letterSpacing:"1px",fontSize:"10px"}}
                ><Trash2 size={11}/> DELETE ALL DATA</HoverBtn>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div style={{display:"flex",borderBottom:"1px solid #141414",padding:"0 24px",overflowX:"auto"}}>
        {[
          {id:"pomodoro",   label:"Pomodoro",   Icon:Timer},
          {id:"stats",      label:"Statistics", Icon:BarChart2},
          {id:"subjects",   label:"Subjects",   Icon:BookOpen},
          {id:"notes",      label:"Notes",      Icon:FileText},
          {id:"techniques", label:"Techniques", Icon:FlaskConical},
        ].map(({id,label,Icon})=>(
          <button key={id} onClick={()=>setActiveTab(id)} style={{
            background:"none",border:"none",cursor:"pointer",
            padding:"12px 16px",fontSize:"11px",letterSpacing:"1px",whiteSpace:"nowrap",
            color:activeTab===id?modeColor:"#444",
            borderBottom:activeTab===id?`2px solid ${modeColor}`:"2px solid transparent",
            transition:"all 0.2s",fontFamily:"inherit",display:"flex",alignItems:"center",gap:"6px",
          }}>
            <Icon size={13}/> {label}
          </button>
        ))}
      </div>

      <div style={{padding:"24px"}}>

        {/* ══ POMODORO ══ */}
        {activeTab==="pomodoro" && (
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"24px",maxWidth:"900px",margin:"0 auto"}}>
            <div style={{...S.card,border:`1px solid ${timerFinished?"#222":modeColor+"22"}`,display:"flex",flexDirection:"column",alignItems:"center",padding:"28px"}}>
              <div style={{display:"flex",gap:"8px",marginBottom:"28px"}}>
                {Object.values(MODES).map(m=>(
                  <button key={m} onClick={()=>switchMode(m)} style={{
                    background:mode===m?`${MODE_COLORS[m]}22`:"none",
                    border:`1px solid ${mode===m?MODE_COLORS[m]:"#222"}`,
                    color:mode===m?MODE_COLORS[m]:"#444",
                    borderRadius:"6px",padding:"5px 10px",fontSize:"9px",
                    letterSpacing:"1px",cursor:"pointer",fontFamily:"inherit",transition:"all 0.2s",
                  }}>{m}</button>
                ))}
              </div>

              {/* ring */}
              <div style={{position:"relative",width:"210px",height:"210px",marginBottom:"24px"}}>
                <svg width="210" height="210" style={{transform:"rotate(-90deg)"}}>
                  <circle cx="105" cy="105" r="90" fill="none" stroke="#111" strokeWidth="8"/>
                  {primaryFill>0 && (
                    <circle cx="105" cy="105" r="90" fill="none"
                      stroke={ringColor} strokeWidth="8"
                      strokeDasharray={`${primaryDash} ${primaryGap}`}
                      strokeLinecap="round"
                      style={{transition:"stroke-dasharray 0.4s ease,stroke 0.3s"}}/>
                  )}
                  {overtimeFill>0 && (
                    <circle key={`ot-${overtimeFill>0}`} cx="105" cy="105" r="90" fill="none"
                      stroke={theme.secondary} strokeWidth="10"
                      strokeDasharray={`${overtimeDash} ${overtimeGap}`}
                      strokeLinecap="round"
                      style={{transition:"stroke-dasharray 0.4s ease"}}/>
                  )}
                </svg>
                <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                  <div style={{fontSize:"42px",fontWeight:"900",color:timerFinished?"#333":modeColor,letterSpacing:"-2px",transition:"color 0.3s"}}>{fmt(timeLeft)}</div>
                  <div style={{fontSize:"9px",color:"#555",letterSpacing:"1px",marginTop:"4px"}}>
                    {mode==="FOCUS"
                      ? configuredMins===50 ? "FOCUS"
                        : configuredMins<50 ? <span>FOCUS <span style={{color:"#FF4D4D"}}>−{50-configuredMins}m</span></span>
                        : <span>FOCUS <span style={{color:theme.secondary}}>+{configuredMins-50}m</span></span>
                      : mode}
                  </div>
                  {selectedSubject && (
                    <div style={{fontSize:"10px",color:accent,marginTop:"4px",display:"flex",alignItems:"center",gap:"4px"}}>
                      <SubjectIcon name={selectedSubject.icon} size={10} color={accent}/>
                      {selectedSubject.name}
                    </div>
                  )}
                </div>
              </div>

              <div style={{display:"flex",gap:"12px",marginBottom:"20px"}}>
                <button onClick={()=>switchMode(mode)} style={{background:"#111",border:"1px solid #222",color:"#666",borderRadius:"8px",padding:"10px 16px",cursor:"pointer",fontSize:"16px",fontFamily:"inherit"}}>↺</button>
                <button onClick={()=>{
                  if(timerFinished){
                    finishedRef.current = false;
                    setTimeLeft(getDuration(mode));
                    return;
                  }
                  if(running){ playWhistlePause(); } else { playWhistleStart(); }
                  setRunning(r=>!r);
                }} disabled={!selectedSubject&&mode===MODES.FOCUS} style={{
                  background: timerFinished ? "#1A1A1A" : (selectedSubject||mode!==MODES.FOCUS?modeColor:"#1A1A1A"),
                  border: timerFinished ? `1px solid ${modeColor}` : "none",
                  color: timerFinished ? modeColor : "#000", borderRadius:"8px",padding:"10px 32px",
                  cursor:"pointer",
                  fontSize:"13px",fontWeight:"700",letterSpacing:"2px",fontFamily:"inherit",
                }}>{timerFinished ? "RESET" : (running?"PAUSE":"START")}</button>
              </div>

              {subjects.length===0 ? (
                <div style={{fontSize:"11px",color:"#444",textAlign:"center"}}>
                  No subjects — <span onClick={()=>setActiveTab("subjects")} style={{color:theme.secondary,cursor:"pointer",textDecoration:"underline"}}>add one</span>
                </div>
              ) : (
                <div style={{width:"100%"}}>
                  {mode===MODES.FOCUS && <div style={{...S.label}}>STUDYING NOW:</div>}
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px",maxHeight:"200px",overflowY:"auto",
                    pointerEvents:mode===MODES.FOCUS?"auto":"none",
                    opacity:mode===MODES.FOCUS?1:0.35,
                  }}>
                    {subjects.map(s=>{
                      const isSel = selectedSubject?.id===s.id;
                      return (
                        <button key={s.id} onClick={()=>mode===MODES.FOCUS&&setSelectedSubject(s)} style={{
                          background: isSel ? `${s.color}22` : "#0A0A0A",
                          border:`1px solid ${isSel ? s.color : "#1A1A1A"}`,
                          borderRadius:"6px",padding:"6px 8px",
                          cursor:mode===MODES.FOCUS?"pointer":"default",
                          color: isSel ? s.color : "#444",
                          fontSize:"10px",textAlign:"left",fontFamily:"inherit",transition:"all 0.15s",
                          display:"flex",alignItems:"center",gap:"5px",
                        }}><SubjectIcon name={s.icon} size={11} color={isSel?s.color:"#444"}/> {s.name}</button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:"16px"}}>
              <div style={{...S.card}}>
                <div style={{...S.label,color:theme.primary}}>TIMER SETTINGS</div>
                {[
                  {label:"Focus",      val:customFocus, set:setCustomFocus, min:5,  max:120},
                  {label:"Short Break",val:customShort, set:setCustomShort, min:5,  max:20},
                  {label:"Long Break", val:customLong,  set:setCustomLong,  min:5, max:60},
                ].map(cfg=>(
                  <div key={cfg.label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px"}}>
                    <div style={{fontSize:"11px",color:"#666"}}>{cfg.label}</div>
                    <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                      <button onClick={()=>cfg.set(v=>Math.max(cfg.min,v-5))} style={{background:"#111",border:"1px solid #222",color:"#666",borderRadius:"4px",width:"24px",height:"24px",cursor:"pointer",fontSize:"14px",fontFamily:"inherit"}}>−</button>
                      <div style={{fontSize:"13px",color:"#E8E8E0",minWidth:"32px",textAlign:"center"}}>{cfg.val}m</div>
                      <button onClick={()=>cfg.set(v=>Math.min(cfg.max,v+5))} style={{background:"#111",border:"1px solid #222",color:"#666",borderRadius:"4px",width:"24px",height:"24px",cursor:"pointer",fontSize:"14px",fontFamily:"inherit"}}>+</button>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{...S.card,flex:1}}>
                <div style={{...S.label,color:theme.secondary}}>TIME PER SUBJECT</div>
                {subjects.length===0 ? (
                  <div style={{fontSize:"11px",color:"#333",textAlign:"center",padding:"20px 0"}}>No subjects yet</div>
                ) : (() => {
                  const maxSecs = Math.max(...subjects.map(s=>subjectTime[s.id]||0), 1);
                  return subjects.map(s=>{
                    const secs=subjectTime[s.id]||0;
                    const barPct = (secs/maxSecs)*100;
                    return (
                      <div key={s.id} style={{marginBottom:"10px"}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:"3px",alignItems:"center"}}>
                          <div style={{fontSize:"10px",display:"flex",alignItems:"center",gap:"4px",
                            color:secs>0?s.color:"#333",
                          }}>
                            <SubjectIcon name={s.icon} size={10} color={secs>0?s.color:"#333"}/> {s.name}
                          </div>
                          <div style={{fontSize:"10px",color:secs>0?"#E8E8E0":"#333"}}>{fmtHours(secs)}</div>
                        </div>
                        <div style={{background:"#111",borderRadius:"3px",height:"3px"}}>
                          <div style={{background:secs>0?s.color:"#1A1A1A",height:"100%",borderRadius:"3px",width:`${barPct}%`,transition:"width 0.5s"}}/>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        )}

        {/* ══ STATISTICS ══ */}
        {activeTab==="stats" && (
          <div style={{maxWidth:"800px",margin:"0 auto",display:"flex",flexDirection:"column",gap:"20px"}}>
            <div style={{display:"flex",gap:"10px",justifyContent:"flex-end"}}>
              <HoverBtn onClick={()=>{ playZap(); handleReset(); }}  color="#FF4D4D" border="1px solid #FF4D4D33"><Trash2 size={9}/> RESET</HoverBtn>
              <HoverBtn onClick={handleBackup} color={accent}  border={`1px solid ${accent}33`}><Download size={9}/> BACKUP</HoverBtn>
            </div>

            {/* overview */}
            <div style={{...S.card}}>
              <div style={{...S.label,color:theme.primary}}>OVERVIEW</div>
              {sessionLog.length===0 ? (
                <div style={{fontSize:"12px",color:"#444",padding:"10px 0"}}>No sessions yet. Complete a pomodoro to start tracking.</div>
              ) : (
                <div style={{fontSize:"13px",color:"#888",lineHeight:2}}>
                  Total focused: <span style={{color:theme.primary,fontWeight:700}}>{fmtHours(totalStudied)}</span> across <span style={{color:theme.secondary,fontWeight:700}}>{rounds} rounds</span>.
                  Peak hour: <span style={{color:theme.primary,fontWeight:700}}>{peakHour}:00–{peakHour+1}:00</span> ·
                  Peak day: <span style={{color:theme.secondary,fontWeight:700}}>{DAYS[peakDay]}</span> ·
                  Peak month: <span style={{color:theme.primary,fontWeight:700}}>{MONTHS[peakMonth]}</span>
                </div>
              )}
            </div>

            {/* subject bars */}
            <div style={{...S.card}}>
              <div style={{...S.label,color:theme.primary}}>TIME PER SUBJECT</div>
              {subjects.length===0 ? <div style={{fontSize:"12px",color:"#444"}}>No subjects yet.</div>
              : [...subjects].sort((a,b)=>(subjectTime[b.id]||0)-(subjectTime[a.id]||0)).map(s=>{
                const secs=subjectTime[s.id]||0, goal=s.goalMinutes*60;
                const pct=Math.min(100,(secs/goal)*100);
                const barPct=(secs/Math.max(...subjects.map(x=>subjectTime[x.id]||0),1))*100;
                return (
                  <div key={s.id} style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"10px"}}>
                    <div style={{fontSize:"11px",minWidth:"140px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:"5px",
                      color:secs>0?s.color:"#333",
                    }}>
                      <SubjectIcon name={s.icon} size={11} color={secs>0?s.color:"#333"}/> {s.name}
                    </div>
                    <div style={{flex:1,background:"#111",borderRadius:"3px",height:"6px"}}>
                      <div style={{background:secs>0?s.color:"#222",height:"100%",borderRadius:"3px",width:`${barPct}%`,transition:"width 0.5s"}}/>
                    </div>
                    <div style={{fontSize:"10px",color:secs>0?"#E8E8E0":"#333",minWidth:"52px",textAlign:"right"}}>{fmtHours(secs)}</div>
                    <div style={{fontSize:"9px",color:"#444",minWidth:"48px",textAlign:"right"}}>{pct.toFixed(0)}% goal</div>
                  </div>
                );
              })}
            </div>

            {/* time distribution tabs */}
            <div style={{...S.card}}>
              <div style={{display:"flex",gap:"4px",marginBottom:"20px"}}>
                {[{id:"hour",label:"By Hour"},{id:"day",label:"By Day"},{id:"month",label:"By Month"}].map(t=>(
                  <button key={t.id} onClick={()=>setStatsTab(t.id)} style={{
                    background:statsTab===t.id?`${accent}18`:"none",
                    border:`1px solid ${statsTab===t.id?accent:"#222"}`,
                    color:statsTab===t.id?accent:"#555",
                    borderRadius:"6px",padding:"5px 14px",cursor:"pointer",
                    fontSize:"10px",fontFamily:"inherit",letterSpacing:"1px",transition:"all 0.15s",
                  }}>{t.label}</button>
                ))}
              </div>

              {statsTab==="hour" && (
                <div style={{display:"flex",flexDirection:"column",gap:"4px"}}>
                  {Array(24).fill(0).map((_,h)=>{
                    const secs=statsByHour[h], pct=(secs/maxH)*100, isPeak=h===peakHour&&secs>0;
                    return (
                      <div key={h} style={{display:"flex",alignItems:"center",gap:"10px"}}>
                        <div style={{fontSize:"10px",color:isPeak?theme.primary:"#444",minWidth:"40px",textAlign:"right"}}>{String(h).padStart(2,"0")}:00</div>
                        <div style={{flex:1,background:"#0A0A0A",borderRadius:"2px",height:"14px"}}>
                          <div style={{background:isPeak?theme.primary:`${theme.primary}55`,height:"100%",borderRadius:"2px",width:`${pct}%`,transition:"width 0.5s"}}/>
                        </div>
                        <div style={{fontSize:"10px",color:secs>0?(isPeak?theme.primary:"#666"):"#222",minWidth:"52px"}}>{secs>0?fmtHours(secs):"—"}</div>
                      </div>
                    );
                  })}
                  {sessionLog.length>0 && <div style={{marginTop:"10px",fontSize:"11px",color:theme.secondary}}>Peak: <strong>{peakHour}:00–{peakHour+1}:00</strong></div>}
                </div>
              )}

              {statsTab==="day" && (
                <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>
                  {DAYS.map((day,d)=>{
                    const secs=statsByDay[d], pct=(secs/maxD)*100, isPeak=d===peakDay&&secs>0;
                    return (
                      <div key={day} style={{display:"flex",alignItems:"center",gap:"10px"}}>
                        <div style={{fontSize:"10px",color:isPeak?theme.primary:"#444",minWidth:"80px"}}>{day}</div>
                        <div style={{flex:1,background:"#0A0A0A",borderRadius:"2px",height:"16px"}}>
                          <div style={{background:isPeak?theme.primary:`${theme.primary}55`,height:"100%",borderRadius:"2px",width:`${pct}%`,transition:"width 0.5s"}}/>
                        </div>
                        <div style={{fontSize:"10px",color:secs>0?(isPeak?theme.primary:"#666"):"#222",minWidth:"52px"}}>{secs>0?fmtHours(secs):"—"}</div>
                      </div>
                    );
                  })}
                  {sessionLog.length>0 && <div style={{marginTop:"10px",fontSize:"11px",color:theme.secondary}}>Peak: <strong>{DAYS[peakDay]}</strong></div>}
                </div>
              )}

              {statsTab==="month" && (
                <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>
                  {MONTHS.map((month,mo)=>{
                    const secs=statsByMonth[mo], pct=(secs/maxM)*100, isPeak=mo===peakMonth&&secs>0;
                    return (
                      <div key={month} style={{display:"flex",alignItems:"center",gap:"10px"}}>
                        <div style={{fontSize:"10px",color:isPeak?theme.primary:"#444",minWidth:"80px"}}>{month}</div>
                        <div style={{flex:1,background:"#0A0A0A",borderRadius:"2px",height:"16px"}}>
                          <div style={{background:isPeak?theme.primary:`${theme.primary}55`,height:"100%",borderRadius:"2px",width:`${pct}%`,transition:"width 0.5s"}}/>
                        </div>
                        <div style={{fontSize:"10px",color:secs>0?(isPeak?theme.primary:"#666"):"#222",minWidth:"52px"}}>{secs>0?fmtHours(secs):"—"}</div>
                      </div>
                    );
                  })}
                  {sessionLog.length>0 && <div style={{marginTop:"10px",fontSize:"11px",color:theme.secondary}}>Peak: <strong>{MONTHS[peakMonth]}</strong></div>}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ SUBJECTS ══ */}
        {activeTab==="subjects" && (
          <div style={{maxWidth:"800px",margin:"0 auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px"}}>
              <div style={{fontSize:"11px",color:"#555"}}>Manage your subjects, projects or goals.</div>
              <button onClick={openAdd} style={{background:accent,border:"none",color:"#000",borderRadius:"8px",padding:"8px 16px",cursor:"pointer",fontSize:"11px",fontWeight:"700",letterSpacing:"1px",fontFamily:"inherit"}}>+ ADD SUBJECT</button>
            </div>
            {subjects.length===0 ? (
              <div style={{...S.card,border:"1px dashed #1A1A1A",textAlign:"center",padding:"60px 20px"}}>
                <div style={{fontSize:"40px",marginBottom:"16px"}}>📚</div>
                <div style={{fontSize:"14px",color:"#666",marginBottom:"8px"}}>No subjects yet</div>
                <div style={{fontSize:"11px",color:"#444",marginBottom:"20px"}}>Add your first subject to get started.</div>
                <button onClick={openAdd} style={{background:accent,border:"none",color:"#000",borderRadius:"8px",padding:"10px 24px",cursor:"pointer",fontSize:"12px",fontWeight:"700",fontFamily:"inherit"}}>+ ADD YOUR FIRST SUBJECT</button>
              </div>
            ) : (
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:"14px"}}>
                {subjects.map(sub=>(
                  <div key={sub.id} style={{
                    ...S.card,
                    border:`1px solid ${sub.color}22`,
                    position:"relative",overflow:"hidden",
                  }}>
                    <div style={{position:"absolute",top:8,right:8,opacity:0.05,pointerEvents:"none",userSelect:"none"}}><SubjectIcon name={sub.icon} size={48} color={sub.color}/></div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                      <div>
                        <div style={{display:"flex",alignItems:"center",gap:"6px",fontSize:"11px",
                          color:sub.color,
                          letterSpacing:"2px",marginBottom:"4px",
                        }}>
                          <SubjectIcon name={sub.icon} size={12} color={sub.color}/> {sub.difficulty.toUpperCase()}
                        </div>
                        <div style={{fontSize:"15px",fontWeight:"700",marginBottom:"6px"}}><ColorPunct text={sub.name} accent={accent}/></div>
                        <div style={{fontSize:"10px",color:"#555"}}>Daily goal: {sub.goalMinutes} min · Today: {fmtHours(todaySecsById[sub.id]||0)}</div>
                        {/* daily progress bar */}
                        {(() => {
                          const pct = Math.min(100, ((todaySecsById[sub.id]||0) / (sub.goalMinutes*60)) * 100);
                          const done = pct >= 100;
                          return (
                            <div style={{marginTop:"6px"}}>
                              <div style={{background:"#111",borderRadius:"3px",height:"3px",overflow:"hidden"}}>
                                <div style={{
                                  background: sub.color,
                                  height:"100%", borderRadius:"3px",
                                  width:`${pct}%`, transition:"width 0.5s",
                                  boxShadow: done ? `0 0 8px ${sub.color}` : "none",
                                }}/>
                              </div>
                              {done && <div style={{fontSize:"8px",color:sub.color,marginTop:"2px",letterSpacing:"1px"}}>✓ GOAL MET</div>}
                            </div>
                          );
                        })()}
                      </div>
                      <div style={{display:"flex",gap:"6px"}}>
                        <HoverBtn onClick={()=>openEdit(sub)} color="#888" border="1px solid #222"><Edit2 size={11}/></HoverBtn>
                        <HoverBtn onClick={()=>setShowDeleteConfirm(sub.id)} color="#FF4D4D" border="1px solid #FF4D4D33" bg="#0A0000"><Trash2 size={11}/></HoverBtn>
                      </div>
                    </div>
                    {showDeleteConfirm===sub.id && (
                      <div style={{marginTop:"12px",padding:"10px",background:"#0A0000",borderRadius:"8px",border:"1px solid #FF4D4D33"}}>
                        <div style={{fontSize:"10px",color:"#FF4D4D",marginBottom:"8px"}}>Delete this subject and all its time data?</div>
                        <div style={{display:"flex",gap:"8px"}}>
                          <button onClick={()=>setShowDeleteConfirm(null)} style={{background:"#111",border:"1px solid #222",color:"#888",borderRadius:"4px",padding:"4px 10px",cursor:"pointer",fontSize:"10px",fontFamily:"inherit"}}>Cancel</button>
                          <button onClick={()=>{ playZap(); deleteSubject(sub.id); }} style={{background:"#FF4D4D",border:"none",color:"#000",borderRadius:"4px",padding:"4px 10px",cursor:"pointer",fontSize:"10px",fontWeight:"700",fontFamily:"inherit"}}>Delete</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ NOTES ══ */}
        {activeTab==="notes" && (
          <div style={{maxWidth:"800px",margin:"0 auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px"}}>
              <div style={{fontSize:"10px",color:"#444",letterSpacing:"1px"}}>
                <span style={{color:accent}}>Tab</span> indent &nbsp;·&nbsp; <span style={{color:accent}}>Shift+Tab</span> dedent &nbsp;·&nbsp; <span style={{color:accent}}>Enter</span> new line at same level
              </div>
              <div style={{display:"flex",gap:"6px"}}>
                <HoverBtn
                  onClick={()=>{ playCharger(); const lines=loadLS("gt_notes_v2",[]); const text=lines.map(l=>l.indent===0?`• ${l.text}`:`${"  ".repeat(l.indent)}${l.indent}. ${l.text}`).join("\n"); navigator.clipboard.writeText(text).catch(()=>{}); }}
                  color={accent} border={`1px solid ${accent}33`}
                ><Copy size={10}/> COPY</HoverBtn>
                <HoverBtn
                  onClick={()=>{ if(window.confirm("Clear all notes?")){ playZap(); localStorage.removeItem("gt_notes_v2"); setNotesClearKey(k=>k+1); } }}
                  color="#FF4D4D" border="1px solid #FF4D4D33"
                >🗑 CLEAR</HoverBtn>
              </div>
            </div>
            <NotesEditor key={notesClearKey} accent={accent} theme={theme}/>
          </div>
        )}

        {/* ══ TECHNIQUES ══ */}
        {activeTab==="techniques" && (
          <div style={{maxWidth:"700px",margin:"0 auto"}}>
            <div style={{fontSize:"11px",color:"#555",marginBottom:"20px"}}>Evidence-based learning techniques. Click study links for source papers.</div>
            {[
              {
                name:"Spaced Repetition", Icon:IterationCw,
                desc:"Review material at increasing intervals: 1 day → 3 days → 7 days → 14 days. The key is reviewing right before you forget.",
                science:"Ebbinghaus (1885) — reduces forgetting curve by up to 80%",
                links:[{label:"Anki (flashcards)",url:"https://apps.ankiweb.net"},{label:"Original paper",url:"https://en.wikipedia.org/wiki/Spacing_effect"}]
              },
              {
                name:"Retrieval Practice", Icon:Brain,
                desc:"Close the book and try to recall. Attempt exercises without looking at theory first. Self-testing beats re-reading every time.",
                science:"Roediger & Butler (2011) — 50% better long-term retention vs rereading",
                links:[{label:"The Learning Scientists",url:"https://www.learningscientists.org/retrieval-practice"},{label:"Paper",url:"https://doi.org/10.1016/j.tics.2011.07.007"}]
              },
              {
                name:"Interleaving", Icon:GitBranch,
                desc:"Mix different types of problems in a single session. Instead of 20 integrals then 20 derivatives, alternate them randomly.",
                science:"Kornell & Bjork (2008) — improves transfer and discrimination of concepts",
                links:[{label:"Study",url:"https://www.learningscientists.org/interleaving"},{label:"Paper",url:"https://doi.org/10.1037/0278-7393.34.6.1174"}]
              },
              {
                name:"Pomodoro 50/10", Icon:Timer,
                desc:"50 min deep focus + 10 min break. For hard topics do 2 back-to-back then take a 30 min long break. Protect your break — no screens.",
                science:"Optimizes sustained attention without cognitive fatigue (Cirillo, 2006)",
                links:[{label:"Pomodoro Technique",url:"https://francescocirillo.com/pages/pomodoro-technique"},{label:"Focus research",url:"https://doi.org/10.1016/j.cognition.2011.04.007"}]
              },
              {
                name:"Elaboration", Icon:Network,
                desc:"For every formula or concept ask: 'Why does this work? How does it connect to what I know?' Write the answer in your own words.",
                science:"Chi et al. (1989) — deep processing increases comprehension and retention significantly",
                links:[{label:"Study",url:"https://www.learningscientists.org/elaborative-interrogation"},{label:"Paper",url:"https://doi.org/10.1207/s1532690xci0704_1"}]
              },
              {
                name:"Concrete Examples", Icon:Layers,
                desc:"Abstract concepts become concrete when you generate your own examples. After reading a definition, immediately write 2–3 examples from scratch.",
                science:"Schwartz & Bransford (1998) — self-generated examples improve transfer to new problems",
                links:[{label:"Learning Scientists",url:"https://www.learningscientists.org/concrete-examples"}]
              },
            ].map((tech,i)=>(
              <div key={i} style={{...S.card,marginBottom:"10px"}}>
                <div style={{display:"flex",gap:"14px",alignItems:"flex-start"}}>
                  <div style={{color:accent,marginTop:"2px",flexShrink:0}}><tech.Icon size={22}/></div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:"13px",fontWeight:"700",marginBottom:"6px"}}>{tech.name}</div>
                    <div style={{fontSize:"12px",color:"#888",lineHeight:"1.7",marginBottom:"8px"}}>{tech.desc}</div>
                    <div style={{background:`${accent}10`,border:`1px solid ${accent}33`,borderRadius:"6px",padding:"6px 10px",fontSize:"11px",color:accent,marginBottom:"8px"}}>
                      🔬 {tech.science}
                    </div>
                    <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
                      {tech.links.map((l,j)=>(
                        <a key={j} href={l.url} target="_blank" rel="noreferrer" style={{
                          display:"flex",alignItems:"center",gap:"4px",
                          fontSize:"10px",color:theme.secondary,textDecoration:"none",
                          border:`1px solid ${theme.secondary}33`,borderRadius:"4px",padding:"3px 8px",
                          transition:"all 0.15s",
                        }}>
                          <ExternalLink size={9}/> {l.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* ══ SUBJECT MODAL ══ */}
      {showModal && (
        <div style={{position:"fixed",inset:0,background:"#000000DD",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100}}
          onClick={e=>{ if(e.target===e.currentTarget) setShowModal(false); }}>
          <div style={{background:"#0A0A0A",border:"1px solid #222",borderRadius:"16px",padding:"28px",width:"420px",maxWidth:"90vw",maxHeight:"90vh",overflowY:"auto"}}>
            <div style={{fontSize:"14px",fontWeight:"700",marginBottom:"20px"}}>{editingSubject?"✏️ Edit Subject":"➕ New Subject"}</div>
            <div style={{marginBottom:"16px"}}>
              <div style={{...S.label}}>NAME</div>
              <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Calculus II, Python, French..."
                style={{width:"100%",background:"#111",border:"1px solid #222",borderRadius:"8px",padding:"10px 12px",color:"#E8E8E0",fontSize:"12px",fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}/>
            </div>
            <div style={{marginBottom:"16px"}}>
              <div style={{...S.label}}>ICON</div>
              <IconPicker selected={form.icon} onSelect={icon=>setForm(f=>({...f,icon}))} accent={accent}/>
            </div>
            <div style={{marginBottom:"16px"}}>
              <div style={{...S.label}}>COLOR</div>
              <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
                {PRESET_COLORS.map(color=>(
                  <button key={color} onClick={()=>setForm(f=>({...f,color}))}
                    style={{background:color,width:"28px",height:"28px",borderRadius:"50%",
                      border:form.color===color?"3px solid #fff":"3px solid transparent",cursor:"pointer"}}/>
                ))}
              </div>
            </div>
            <div style={{marginBottom:"16px"}}>
              <div style={{...S.label}}>DIFFICULTY</div>
              <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>
                {DIFFICULTY.map(d=>{
                  const isHard = ["I Am Death Incarnate!","Bring 'em On!","Mein Leben!"].includes(d);
                  return (
                    <button key={d} onClick={()=>{ setForm(f=>({...f,difficulty:d})); if(isHard) playGuitarRiff(); }} style={{
                      background:form.difficulty===d?`${DIFF_COLOR[d]}22`:"#111",
                      border:`1px solid ${form.difficulty===d?DIFF_COLOR[d]:"#222"}`,
                      color:form.difficulty===d?DIFF_COLOR[d]:"#555",
                      borderRadius:"6px",padding:"5px 10px",cursor:"pointer",fontSize:"9px",
                      fontFamily:"inherit",textTransform:"uppercase",letterSpacing:"0.5px",
                      transition:"all 0.15s",
                    }}>{d}</button>
                  );
                })}
              </div>
            </div>
            <div style={{marginBottom:"24px"}}>
              <div style={{...S.label}}>DAILY GOAL (MINUTES)</div>
              <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
                <button onClick={()=>setForm(f=>({...f,goalMinutes:Math.max(10,f.goalMinutes-10)}))} style={{background:"#111",border:"1px solid #222",color:"#666",borderRadius:"6px",width:"32px",height:"32px",cursor:"pointer",fontSize:"16px",fontFamily:"inherit"}}>−</button>
                <div style={{fontSize:"18px",fontWeight:"700",color:form.color,minWidth:"60px",textAlign:"center"}}>{form.goalMinutes} min</div>
                <button onClick={()=>setForm(f=>({...f,goalMinutes:Math.min(480,f.goalMinutes+10)}))} style={{background:"#111",border:"1px solid #222",color:"#666",borderRadius:"6px",width:"32px",height:"32px",cursor:"pointer",fontSize:"16px",fontFamily:"inherit"}}>+</button>
              </div>
            </div>
            <div style={{background:"#111",border:`1px solid ${form.color}33`,borderRadius:"8px",padding:"12px 16px",marginBottom:"20px",display:"flex",alignItems:"center",gap:"12px"}}>
              <SubjectIcon name={form.icon} size={22} color={form.color}/>
              <div>
                <div style={{fontSize:"13px",fontWeight:"700",color:form.color}}>{form.name||"Subject name"}</div>
                <div style={{fontSize:"10px",color:"#555",marginTop:"2px"}}>{form.difficulty.toUpperCase()} · {form.goalMinutes} min/day</div>
              </div>
            </div>
            <div style={{display:"flex",gap:"10px"}}>
              <button onClick={()=>setShowModal(false)} style={{flex:1,background:"#111",border:"1px solid #222",color:"#666",borderRadius:"8px",padding:"10px",cursor:"pointer",fontSize:"12px",fontFamily:"inherit"}}>Cancel</button>
              <button onClick={saveSubject} disabled={!form.name.trim()} style={{flex:2,background:form.name.trim()?form.color:"#1A1A1A",border:"none",color:form.name.trim()?"#000":"#444",borderRadius:"8px",padding:"10px",cursor:form.name.trim()?"pointer":"not-allowed",fontSize:"12px",fontWeight:"700",fontFamily:"inherit"}}>{editingSubject?"Save Changes":"Add Subject"}</button>
            </div>
          </div>
        </div>
      )}

      <Confetti active={showConfetti} colors={[theme.primary, theme.secondary, theme.primary+"99", theme.secondary+"99"]} matrix={!!theme.matrix}/>

      {/* ⏳ ZA WARUDO overlay */}
      {zaWarudo && (
        <div style={{
          position:"fixed",inset:0,zIndex:1000,pointerEvents:"none",
          display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
          background:"radial-gradient(ellipse at center, #1a0000cc 0%, #000000ee 100%)",
          animation:"zaFadeIn 0.3s ease",
        }}>
          <div style={{
            fontSize:"clamp(32px,6vw,72px)",fontWeight:"900",letterSpacing:"4px",
            color:"#FFD700",textShadow:"0 0 30px #FFD700, 0 0 60px #FF8C00, 0 0 90px #FF0000",
            animation:"zaText 0.5s ease",fontStyle:"italic",
          }}>ZA WARUDO!</div>
          <div style={{
            fontSize:"clamp(13px,2vw,20px)",color:"#FF4D4D",marginTop:"12px",letterSpacing:"6px",
            textShadow:"0 0 20px #FF4D4D",opacity:0.9,
          }}>TOKI WO TOMARE</div>
          <div style={{
            position:"absolute",inset:0,
            background:"repeating-linear-gradient(0deg,transparent,transparent 60px,rgba(255,215,0,0.015) 60px,rgba(255,215,0,0.015) 61px)",
            pointerEvents:"none",
          }}/>
          {/* ◆ menacing symbols */}
          {["ゴ","ゴ","ゴ","ゴ","ゴ","ゴ"].map((g,i)=>(
            <div key={i} style={{
              position:"absolute",
              top:`${15+Math.floor(i/2)*28}%`,
              left:i%2===0?`${8+i*3}%`:`${75-i*2}%`,
              fontSize:"clamp(18px,3vw,36px)",color:"#FFD70066",fontWeight:"900",
              animation:`menace ${0.8+i*0.15}s ease infinite alternate`,
            }}>{g}</div>
          ))}
        </div>
      )}

      <style>{`
        :root { --accent: ${accent}; }
        @keyframes heartPop { 0%{transform:scale(0.5);opacity:0} 60%{transform:scale(1.3)} 100%{transform:scale(1);opacity:1} }
        @keyframes oneUp { 0%{opacity:1;transform:translateX(-50%) translateY(0);} 70%{opacity:1;transform:translateX(-50%) translateY(-28px) scale(1.15);} 100%{opacity:0;transform:translateX(-50%) translateY(-44px) scale(0.9);} }
        @keyframes zaFadeIn { from{opacity:0} to{opacity:1} }
        @keyframes zaText { 0%{transform:scale(0.3) rotate(-5deg);opacity:0} 60%{transform:scale(1.12) rotate(1deg)} 100%{transform:scale(1) rotate(0deg);opacity:1} }
        @keyframes menace { from{transform:scale(1) rotate(-3deg);opacity:0.4} to{transform:scale(1.15) rotate(3deg);opacity:0.8} }
      `}</style>
    </div>
  );
}