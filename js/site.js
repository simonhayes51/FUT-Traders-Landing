// Mesh background
const mesh = document.getElementById('mesh');
const mctx = mesh.getContext('2d');
let mw, mh, mt = 0;
function mresize(){ mw = mesh.width = innerWidth; mh = mesh.height = Math.max(innerHeight*0.9, 400); }
mresize(); addEventListener('resize', mresize);
function mloop(){
  mt += 0.005; mctx.clearRect(0,0,mw,mh);
  const spots = [
    {x:.25+.05*Math.sin(mt*1.2), y:.3+.06*Math.cos(mt*1.3), r:260, c:'rgba(155,92,255,0.35)'},
    {x:.85+.08*Math.sin(mt*.9),  y:.7+.05*Math.sin(mt*1.4),  r:300, c:'rgba(43,245,122,0.28)'},
    {x:.55+.07*Math.cos(mt*1.1), y:.15+.05*Math.sin(mt*1.1), r:220, c:'rgba(58,161,255,0.22)'}
  ];
  spots.forEach(s=>{
    const gx=s.x*mw, gy=s.y*mh; const g = mctx.createRadialGradient(gx,gy,0,gx,gy,s.r);
    g.addColorStop(0, s.c); g.addColorStop(1,'rgba(0,0,0,0)');
    mctx.fillStyle=g; mctx.beginPath(); mctx.arc(gx,gy,s.r,0,Math.PI*2); mctx.fill();
  });
  requestAnimationFrame(mloop);
}
mloop();

// Particles
const p = document.getElementById('particles');
const pctx = p.getContext('2d');
let pw, ph; const N = 60;
const pts = [];
function presize(){ pw=p.width=innerWidth; ph=p.height=Math.max(innerHeight*0.9,400); }
function rand(a,b){ return a + Math.random()*(b-a); }
function initPts(){
  pts.length=0;
  for(let i=0;i<N;i++){
    pts.push({x:rand(0,pw), y:rand(0,ph), vx:rand(-.3,.3), vy:rand(-.2,.2), r:rand(1,2.2)});
  }
}
function ploop(){
  pctx.clearRect(0,0,pw,ph);
  pctx.globalCompositeOperation='lighter';
  pts.forEach(pt=>{
    pt.x+=pt.vx; pt.y+=pt.vy;
    if(pt.x<0||pt.x>pw) pt.vx*=-1;
    if(pt.y<0||pt.y>ph) pt.vy*=-1;
    const g = pctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, 18);
    g.addColorStop(0,'rgba(155,92,255,.45)');
    g.addColorStop(1,'rgba(155,92,255,0)');
    pctx.fillStyle=g; pctx.beginPath(); pctx.arc(pt.x, pt.y, 18, 0, Math.PI*2); pctx.fill();
  });
  requestAnimationFrame(ploop);
}
presize(); initPts(); addEventListener('resize', ()=>{presize(); initPts();}); ploop();

// Tilt effect
const tilt = document.querySelector('.tilt');
if (tilt){
  tilt.addEventListener('mousemove', (e)=>{
    const b = tilt.getBoundingClientRect();
    const cx = b.left + b.width/2;
    const cy = b.top + b.height/2;
    const dx = (e.clientX - cx) / b.width;
    const dy = (e.clientY - cy) / b.height;
    tilt.style.transform = `rotateX(${(-dy*6).toFixed(2)}deg) rotateY(${(dx*8).toFixed(2)}deg) translateZ(0)`;
  });
  tilt.addEventListener('mouseleave', ()=>{
    tilt.style.transform = 'rotateX(0) rotateY(0)';
  });
}

// Reveal on scroll
const ro = new IntersectionObserver((entries)=>{
  entries.forEach(ent=>{
    if(ent.isIntersecting){
      ent.target.classList.add('revealed');
      ro.unobserve(ent.target);
    }
  });
},{threshold: 0.14});
document.querySelectorAll('.reveal, .card, .faq').forEach(el=>ro.observe(el));

// Counters
function animateCount(el){
  const target = +el.dataset.count;
  const dur = 1400; let start=null;
  function step(ts){ if(!start) start=ts; const p=Math.min((ts-start)/dur,1); el.textContent = Math.floor(target*p).toLocaleString(); if(p<1) requestAnimationFrame(step); }
  requestAnimationFrame(step);
}
const stats = document.querySelectorAll('.num');
const so = new IntersectionObserver((ents)=>{
  ents.forEach(ent=>{
    if(ent.isIntersecting){ animateCount(ent.target); so.unobserve(ent.target); }
  });
},{threshold: 0.6});
stats.forEach(el=>so.observe(el));

// Typewriter rotating headlines
const lines = [
  'Trade smarter. <span class="accent">Profit faster.</span>',
  'Find flips with <span class="accent">Smart Movers.</span>',
  'Track coins with <span class="accent">Portfolio P&amp;L.</span>',
  'Snipe deals with <span class="accent">Live Console Prices.</span>'
];
const tw = document.getElementById('typewriter');
let li=0, ci=0, erasing=false;
function typeLoop(){
  const text = lines[li];
  if(!erasing){
    ci++;
    tw.innerHTML = text.slice(0,ci);
    if(ci>=text.length){ erasing=true; setTimeout(typeLoop,1200); return; }
    setTimeout(typeLoop, 18);
  }else{
    ci--;
    tw.innerHTML = text.slice(0,ci);
    if(ci<=0){ erasing=false; li=(li+1)%lines.length; setTimeout(typeLoop, 120); return; }
    setTimeout(typeLoop, 12);
  }
}
typeLoop();

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Pricing toggle
const toggle = document.getElementById('yearlyToggle');
if (toggle){
  toggle.addEventListener('change', ()=>{
    document.querySelectorAll('.amount').forEach(el=>{
      const m = el.getAttribute('data-monthly');
      const y = el.getAttribute('data-yearly');
      el.textContent = (toggle.checked ? y : m);
    });
    document.querySelectorAll('.per').forEach(el=> el.textContent = toggle.checked ? '/mo (billed yearly)' : '/mo');
  });
}
