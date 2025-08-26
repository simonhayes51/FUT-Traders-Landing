// Animated gradient mesh + tilt + reveal
const canvas = document.getElementById('mesh');
const ctx = canvas.getContext('2d');
let w, h, t = 0;

function resize(){
  w = canvas.width = innerWidth;
  h = canvas.height = Math.max(innerHeight * 0.9, 400);
}
resize();
addEventListener('resize', resize);

function loop(){
  t += 0.005;
  ctx.clearRect(0,0,w,h);
  // soft gradient mesh made of moving radial spots
  const spots = [
    {x: 0.25 + 0.05*Math.sin(t*1.2), y: 0.3 + 0.06*Math.cos(t*1.3), r: 260, c: 'rgba(155,92,255,0.35)'},
    {x: 0.85 + 0.08*Math.sin(t*0.9), y: 0.7 + 0.05*Math.sin(t*1.4), r: 300, c: 'rgba(43,245,122,0.28)'},
    {x: 0.55 + 0.07*Math.cos(t*1.1), y: 0.15 + 0.05*Math.sin(t*1.1), r: 220, c: 'rgba(58,161,255,0.22)'}
  ];
  spots.forEach(s => {
    const gx = s.x * w;
    const gy = s.y * h;
    const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, s.r);
    g.addColorStop(0, s.c);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(gx, gy, s.r, 0, Math.PI*2);
    ctx.fill();
  });
  requestAnimationFrame(loop);
}
loop();

// tilt effect on screenshot
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

// reveal on scroll
const ro = new IntersectionObserver((entries)=>{
  entries.forEach(ent=>{
    if(ent.isIntersecting){
      ent.target.classList.add('revealed');
      ro.unobserve(ent.target);
    }
  });
},{threshold: 0.14});
document.querySelectorAll('.reveal, .card, .faq').forEach(el=>ro.observe(el));

// year
document.getElementById('year').textContent = new Date().getFullYear();
