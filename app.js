
(function(){
"use strict";

/* ======================================================
   0. DATA — mock/illustrative NASA & JAXA combustion set
   ====================================================== */
const EXPERIMENTS = [
  {
    id:"cir", name:"CIR", full:"Combustion Integrated Rack",
    platform:"ISS — Destiny Laboratory", years:"2008–present", year:2008,
    objective:"Provide a reconfigurable, multi-user facility enabling a long series of combustion investigations aboard the ISS.",
    method:"A sealed optics bench and combustion chamber that swaps in different fuel/hardware inserts for each investigation, with diagnostic cameras and gas sensors.",
    fuel:"gas", fuelLabel:"Varies by investigation (gas, liquid, solid)",
    environment:"Microgravity · sealed chamber · controlled oxygen",
    finding:"Established a standardized platform that enabled nearly two decades of repeatable microgravity flame studies, from droplets to solids.",
    relevance:"Baseline infrastructure used to validate the flame-behavior models that inform spacecraft fire-safety design.",
    risk:"Reference", tags:["facility","iss","multi-purpose","platform"], platformKey:"iss"
  },
  {
    id:"flex", name:"FLEX", full:"Flame Extinguishment Experiment",
    platform:"ISS — inside CIR", years:"2009", year:2009,
    objective:"Study how isolated fuel-droplet flames ignite, spread, and extinguish in microgravity to improve spacecraft fire suppression.",
    method:"Single fuel droplets were ignited on a fiber support inside the CIR chamber under varying oxygen and pressure conditions, and filmed with high-speed cameras.",
    fuel:"droplet", fuelLabel:"Heptane and methanol droplets",
    environment:"Microgravity · varied oxygen concentration",
    finding:"Droplet flames sometimes kept burning at much lower temperatures than expected, occasionally with almost no visible light.",
    relevance:"Revealed that the usual visual cue of 'the flame went out' can be unreliable in microgravity, complicating detection and suppression timing.",
    risk:"Moderate", tags:["droplet","suppression","iss","detection-gap"], platformKey:"iss"
  },
  {
    id:"flex2", name:"FLEX-2", full:"Flame Extinguishment Experiment 2",
    platform:"ISS — inside CIR", years:"2013", year:2013,
    objective:"Extend FLEX with a wider range of fuels and larger droplet sizes to probe two-stage 'cool flame' combustion.",
    method:"Larger droplets and additional fuel blends were tested through the same CIR rig, tracking flame radius, temperature, and extinction diameter over time.",
    fuel:"droplet", fuelLabel:"Heptane, methanol, and blended fuels",
    environment:"Microgravity · larger droplet sizes",
    finding:"Larger droplets showed a distinct two-stage burn: a normal hot flame followed by a dim, cooler 'cool flame' phase that can persist after the visible flame disappears.",
    relevance:"Cool flames can continue releasing heat with almost no visible or thermal signature, which is a significant blind spot for smoke and flame detectors.",
    risk:"High", tags:["droplet","cool-flame","detection-gap","iss"], platformKey:"iss"
  },
  {
    id:"bass", name:"BASS / BASS-II", full:"Burning and Suppression of Solids",
    platform:"ISS — inside CIR", years:"2011–2015", year:2013,
    objective:"Examine how flames spread across solid fuel samples and test the effectiveness of suppression agents in microgravity.",
    method:"Thin sheets of cotton, fiberglass-cotton blends, and PMMA were ignited under controlled, adjustable forced airflow, with spread rate tracked optically.",
    fuel:"cellulose", fuelLabel:"Cotton fabric, fiberglass-cotton blends, PMMA sheets",
    environment:"Microgravity · adjustable forced airflow",
    finding:"Flame spread direction and rate were driven almost entirely by imposed airflow rather than the buoyant convection that dominates on Earth.",
    relevance:"Shows that spacecraft ventilation design directly shapes how a fire would spread through a cabin, more so than on Earth.",
    risk:"High", tags:["solid-fuel","suppression","airflow","iss"], platformKey:"iss"
  },
  {
    id:"sofie", name:"SoFIE", full:"Solid Fuel Ignition and Extinction",
    platform:"ISS — Combustion Integrated Rack", years:"2022–present", year:2022,
    objective:"Investigate ignition, flame spread, and extinction limits of solid materials at a larger scale than earlier ISS tests.",
    method:"Larger composite, spacecraft-representative material samples are burned under varied oxygen and pressure to map flammability boundaries.",
    fuel:"composite", fuelLabel:"Composite solid materials, spacecraft-representative samples",
    environment:"Microgravity · controlled oxygen and pressure",
    finding:"Material flammability limits measured at this larger scale shift meaningfully from the results of small-scale Earth-based certification tests.",
    relevance:"Suggests current Earth-based material flammability certification may not fully predict how a material behaves in orbit.",
    risk:"High", tags:["materials","certification","large-scale","iss"], platformKey:"iss"
  },
  {
    id:"saffire", name:"Saffire", full:"Spacecraft Fire Experiment (I–VI)",
    platform:"Uncrewed Cygnus resupply vehicle", years:"2016–2021", year:2018,
    objective:"Study large-scale flame growth inside a realistic spacecraft cabin without putting a crew at risk.",
    method:"After Cygnus departed the ISS, composite panels inside the cargo module were remotely ignited and monitored by onboard sensors and cameras before the vehicle burned up on reentry.",
    fuel:"composite", fuelLabel:"Cotton-fiberglass composite panels",
    environment:"Microgravity · full-scale uncrewed module",
    finding:"Fires grew larger and spread differently at module scale than small ISS-rack tests had predicted, with distinct flame-front and smoke-transport behavior.",
    relevance:"Provided the first large-scale, realistic data on how a fire would actually grow inside a spacecraft interior.",
    risk:"VeryHigh", tags:["large-scale","spacecraft-cabin","uncrewed","spread"], platformKey:"cygnus"
  },
  {
    id:"confined", name:"Confined Combustion", full:"Confined Combustion Experiment",
    platform:"ISS — inside CIR", years:"2019", year:2019,
    objective:"Study how flame spread and extinction change when fuel samples burn inside a partially enclosed duct.",
    method:"Thin solid fuel sheets were ignited inside an adjustable duct, with ventilation direction and confinement geometry varied between runs.",
    fuel:"cellulose", fuelLabel:"Thin solid fuel sheets",
    environment:"Microgravity · confined duct with adjustable ventilation",
    finding:"Depending on duct geometry and airflow direction, confinement could either starve a flame of oxygen or accelerate its spread.",
    relevance:"Directly informs the design of enclosed equipment racks and cable ducting to limit how far a fire could spread.",
    risk:"Moderate-High", tags:["confinement","ducting","spread","iss"], platformKey:"iss"
  },
  {
    id:"flare", name:"JAXA FLARE", full:"Flammability Limit at Reduced-gravity Environment",
    platform:"ISS — Kibo module (JAXA)", years:"2017–2021", year:2019,
    objective:"Determine the flammability limits of common materials at partial-gravity levels representative of the Moon and Mars, not just full microgravity.",
    method:"Solid samples were burned at a range of simulated partial-gravity levels using onboard hardware in JAXA's Kibo module.",
    fuel:"composite", fuelLabel:"Various solid samples",
    environment:"Variable partial gravity, from 0g to Mars-representative levels",
    finding:"Flammability limits varied non-linearly with gravity level, meaning risk at 0.16g or 0.38g cannot simply be interpolated between Earth and microgravity data.",
    relevance:"Directly relevant to predicting fire risk inside future lunar and Martian surface habitats.",
    risk:"High", tags:["partial-gravity","moon","mars","jaxa"], platformKey:"kibo"
  }
];

const PLATFORM_LABELS = {iss:"ISS", cygnus:"Cygnus (uncrewed)", kibo:"Kibo (JAXA)"};
const FUEL_LABELS = {cellulose:"Solid — cellulose/fabric", composite:"Solid — composite", droplet:"Liquid droplet", gas:"Gas"};
const RISK_ORDER = {Reference:0, Low:1, Moderate:2, "Moderate-High":3, High:4, VeryHigh:5};
const RISK_DISPLAY = {Reference:"Reference / Low", Low:"Low", Moderate:"Moderate", "Moderate-High":"Moderate–High", High:"High", VeryHigh:"Very High"};

/* ======================================================
   1. UTILITIES
   ====================================================== */
function $(sel, ctx){ return (ctx||document).querySelector(sel); }
function $all(sel, ctx){ return Array.from((ctx||document).querySelectorAll(sel)); }
function riskClass(r){ return "risk-" + r.replace(/\s|\//g,""); }

function toast(msg){
  const c = $("#toast-container");
  const t = document.createElement("div");
  t.className = "toast glass";
  t.innerHTML = '<span class="td"></span><span>'+msg+'</span>';
  c.appendChild(t);
  setTimeout(()=>{ t.classList.add("fade-out"); setTimeout(()=>t.remove(),300); }, 3200);
}

function scrollToId(id){
  const el = document.getElementById(id);
  if(el){ el.scrollIntoView({behavior:"smooth", block:"start"}); }
}

/* ======================================================
   2. NAVIGATION — top navbar + scroll spy
   ====================================================== */
$all("[data-scroll]").forEach(btn=>{
  btn.addEventListener("click", ()=> scrollToId(btn.dataset.scroll));
});

// Highlight the navbar pill matching the current page / in-view section
function setActiveNavPill(hashOverride){
  const path = (location.pathname.split("/").pop() || "index.html");
  const hash = hashOverride !== undefined ? hashOverride : location.hash;
  $all(".nav-pill").forEach(p=>{
    const href = p.getAttribute("href") || "";
    const [hrefPath, hrefHash] = href.split("#");
    const samePage = (hrefPath || "index.html") === path;
    const wantsHash = !!hrefHash;
    const matches = wantsHash ? (samePage && hash === "#"+hrefHash) : (samePage && !hash);
    p.classList.toggle("current", matches);
  });
}
setActiveNavPill();

const sections = $all("main section[id]");
if(sections.length){
  const spyObserver = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){ setActiveNavPill("#"+entry.target.id); }
    });
  },{ rootMargin:"-40% 0px -55% 0px", threshold:0 });
  sections.forEach(s=> spyObserver.observe(s));
}

const revealObserver = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("in"); revealObserver.unobserve(e.target); } });
},{ threshold:0.08 });
$all(".reveal").forEach(el=> revealObserver.observe(el));

/* mission clock */
const startTime = Date.now();
function tickClock(){
  const s = Math.floor((Date.now()-startTime)/1000);
  const hh = String(Math.floor(s/3600)).padStart(2,"0");
  const mm = String(Math.floor((s%3600)/60)).padStart(2,"0");
  const ss = String(s%60).padStart(2,"0");
  $("#missionClock").textContent = "T+"+hh+":"+mm+":"+ss;
}
setInterval(tickClock,1000); tickClock();

/* animated counters */
const counterObserver = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const el = e.target; const target = parseInt(el.dataset.count,10); let cur = 0;
      const step = Math.max(1, Math.round(target/30));
      const iv = setInterval(()=>{ cur += step; if(cur>=target){ cur=target; clearInterval(iv);} el.textContent = cur; },30);
      counterObserver.unobserve(el);
    }
  });
},{threshold:0.5});
$all(".counter").forEach(el=> counterObserver.observe(el));

/* ======================================================
   3. STARFIELD BACKGROUND (canvas)
   ====================================================== */
(function starfield(){
  const canvas = $("#stars-canvas");
  const ctx = canvas.getContext("2d");
  let stars = [], w, h;
  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = document.documentElement.scrollHeight;
    const count = Math.floor((w*h)/9000);
    stars = Array.from({length: Math.min(count,420)}, ()=>({
      x: Math.random()*w, y: Math.random()*h, r: Math.random()*1.3+0.2,
      tw: Math.random()*Math.PI*2, speed: Math.random()*0.015+0.005
    }));
  }
  let raf;
  function draw(){
    ctx.clearRect(0,0,w,h);
    stars.forEach(s=>{
      s.tw += s.speed;
      const alpha = 0.35 + Math.sin(s.tw)*0.35;
      ctx.beginPath();
      ctx.fillStyle = "rgba(210,230,245,"+Math.max(0,alpha)+")";
      ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fill();
    });
    raf = requestAnimationFrame(draw);
  }
  window.addEventListener("resize", ()=>{ cancelAnimationFrame(raf); resize(); draw(); });
  resize(); draw();
})();

/* ======================================================
   4. FLAME CANVAS RENDERERS (hero + comparison)
   Layered organic silhouettes (noise-driven flicker) + embers,
   rather than plain particle blobs, for a more realistic look.
   ====================================================== */
function drawFlame(canvas, mode){
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  const cx = W/2;
  const seeds = Array.from({length:8}, ()=> Math.random()*1000);
  function noise(t, i){
    const s = seeds[i % seeds.length];
    return Math.sin(t+s)*0.5 + Math.sin(t*2.13+s*1.7)*0.3 + Math.sin(t*4.7+s*0.6)*0.15;
  }

  // ember / soot particles
  const emberCount = mode==="earth" ? 26 : 16;
  let embers = Array.from({length:emberCount}, ()=> spawnEmber());
  function spawnEmber(){
    if(mode==="earth"){
      return { x: cx+(Math.random()-0.5)*20, y: H*0.8, life:Math.random(), speed:0.5+Math.random()*0.7, size:1.5+Math.random()*2.5, drift:(Math.random()-0.5)*0.5 };
    }
    const a = Math.random()*Math.PI*2, r = 20+Math.random()*60;
    return { x: cx+Math.cos(a)*r, y: H*0.55+Math.sin(a)*r*0.9, life:Math.random(), speed:0.15+Math.random()*0.25, angle:a, orbit:r, drift:(Math.random()-0.5)*0.4 };
  }

  let raf, running = true;
  function draw(tRaw){
    if(!running) return;
    const t = tRaw*0.0016;
    ctx.clearRect(0,0,W,H);

    if(mode==="earth"){ drawEarth(t); } else { drawMicro(t); }

    raf = requestAnimationFrame(draw);
  }

  function drawEarth(t){
    const baseY = H*0.87;
    // ambient warm glow, flickers slightly with a fast noise term
    const flicker = 1 + noise(t*3,7)*0.12;
    const glow = ctx.createRadialGradient(cx, baseY-40, 6, cx, baseY-40, 150*flicker);
    glow.addColorStop(0,"rgba(255,150,60,"+(0.28*flicker)+")");
    glow.addColorStop(1,"rgba(255,150,60,0)");
    ctx.fillStyle = glow; ctx.fillRect(0,0,W,H);

    // layered tongues: back(cool/tall) -> front(hot/short, blue-white core)
    const layers = [
      { h:196, w:76, c0:"255,70,30",  c1:"255,120,40",  speed:1.0, seed:0, blur:1.2, alpha:0.85 },
      { h:168, w:60, c0:"255,130,40", c1:"255,180,70",  speed:1.35,seed:2, blur:0.8, alpha:0.85 },
      { h:128, w:42, c0:"255,205,90", c1:"255,235,150", speed:1.75,seed:4, blur:0.5, alpha:0.9  },
      { h:70,  w:22, c0:"140,190,255",c1:"225,240,255", speed:2.3, seed:6, blur:0.4, alpha:0.95 }
    ];
    layers.forEach(L=>{
      ctx.save();
      ctx.filter = "blur("+L.blur+"px)";
      ctx.beginPath();
      const N = 26;
      const pts = [];
      for(let i=0;i<=N;i++){
        const u = i/N;
        const widthFactor = Math.sin(u*Math.PI) * (1-u*0.2);
        const wob = noise(t*L.speed + u*6.2, L.seed) * (0.22+0.18*u);
        const xr = L.w*(widthFactor + wob*0.35);
        const sway = noise(t*L.speed*0.7 + 3, L.seed+1) * 10 * u; // whole tongue sways
        const y = baseY - u*L.h + noise(t*L.speed*0.5+u*3, L.seed+3)*3;
        pts.push([cx+xr+sway, y]);
      }
      for(let i=N;i>=0;i--){
        const u = i/N;
        const widthFactor = Math.sin(u*Math.PI) * (1-u*0.2);
        const wob = noise(t*L.speed + u*6.2 + 12, L.seed) * (0.22+0.18*u);
        const xr = -L.w*(widthFactor + wob*0.35);
        const sway = noise(t*L.speed*0.7 + 3, L.seed+1) * 10 * u;
        const y = baseY - u*L.h + noise(t*L.speed*0.5+u*3+12, L.seed+3)*3;
        pts.push([cx+xr+sway, y]);
      }
      pts.forEach((p,i)=> i===0 ? ctx.moveTo(p[0],p[1]) : ctx.lineTo(p[0],p[1]));
      ctx.closePath();
      const grad = ctx.createLinearGradient(cx, baseY, cx, baseY-L.h);
      grad.addColorStop(0, "rgba("+L.c0+","+L.alpha+")");
      grad.addColorStop(0.55, "rgba("+L.c1+","+(L.alpha*0.75)+")");
      grad.addColorStop(1, "rgba("+L.c1+",0)");
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();
    });

    // rising embers / soot flecks
    embers.forEach(p=>{
      p.life += 0.01*p.speed;
      p.y -= 1.3*p.speed;
      p.x += p.drift + Math.sin(p.life*10)*0.5;
      if(p.life>=1) Object.assign(p, spawnEmber());
      const alpha = (1-p.life)*0.7;
      const size = p.size*(1-p.life*0.4);
      ctx.beginPath();
      ctx.fillStyle = p.life<0.5 ? "rgba(255,200,120,"+alpha+")" : "rgba(90,90,90,"+(alpha*0.6)+")";
      ctx.arc(p.x,p.y,Math.max(size,0.3),0,Math.PI*2);
      ctx.fill();
    });
  }

  function drawMicro(t){
    const cy = H*0.53;
    const breathe = 1 + Math.sin(t*0.55)*0.045; // slow, gentle pulsation — no violent flicker
    const R = Math.min(W,H)*0.225;

    // soft diffuse halo — diffusion-flame edge fades gradually, no sharp boundary
    const halo = ctx.createRadialGradient(cx, cy, 4, cx, cy, R*2.1*breathe);
    halo.addColorStop(0, "rgba(120,210,255,0.22)");
    halo.addColorStop(0.6, "rgba(90,180,240,0.09)");
    halo.addColorStop(1, "rgba(60,150,220,0)");
    ctx.fillStyle = halo; ctx.fillRect(0,0,W,H);

    // near-spherical body, gently wobbling silhouette (low amplitude noise, slow speed)
    ctx.save();
    ctx.filter = "blur(1.4px)";
    ctx.beginPath();
    const N = 48;
    for(let i=0;i<=N;i++){
      const a = (i/N)*Math.PI*2;
      const wob = noise(t*0.7 + a*2.4, 1) * 0.1;
      const r = R*breathe*(0.86+wob);
      const x = cx + Math.cos(a)*r;
      const y = cy + Math.sin(a)*r*0.94;
      if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.closePath();
    const bodyGrad = ctx.createRadialGradient(cx,cy,3,cx,cy,R*breathe*1.05);
    bodyGrad.addColorStop(0,   "rgba(225,248,255,0.95)");
    bodyGrad.addColorStop(0.3, "rgba(150,225,255,0.8)");
    bodyGrad.addColorStop(0.65,"rgba(80,175,230,0.5)");
    bodyGrad.addColorStop(1,   "rgba(50,130,190,0)");
    ctx.fillStyle = bodyGrad;
    ctx.fill();
    ctx.restore();

    // faint hot core, slightly offset toward the (usually unseen) fuel source
    ctx.beginPath();
    const coreR = R*0.3*breathe;
    const coreGrad = ctx.createRadialGradient(cx,cy,1,cx,cy,coreR);
    coreGrad.addColorStop(0,"rgba(255,255,255,0.9)");
    coreGrad.addColorStop(1,"rgba(200,235,255,0)");
    ctx.fillStyle = coreGrad;
    ctx.arc(cx,cy,coreR,0,Math.PI*2);
    ctx.fill();

    // slow-drifting soot flecks orbiting with no buoyant bias
    embers.forEach(p=>{
      p.life += 0.006*p.speed;
      p.angle += 0.003*p.speed;
      const r = p.orbit*breathe;
      p.x = cx + Math.cos(p.angle)*r + noise(t*0.4+p.angle,3)*4;
      p.y = cy + Math.sin(p.angle)*r*0.9 + noise(t*0.4+p.angle+5,5)*4;
      if(p.life>=1) Object.assign(p, spawnEmber());
      const alpha = Math.sin(p.life*Math.PI)*0.4;
      ctx.beginPath();
      ctx.fillStyle = "rgba(160,220,255,"+alpha+")";
      ctx.arc(p.x,p.y,1.6,0,Math.PI*2);
      ctx.fill();
    });
  }

  raf = requestAnimationFrame(draw);
  return ()=>{ running=false; cancelAnimationFrame(raf); };
}

if($("#heroFlameCanvas")) drawFlame($("#heroFlameCanvas"), "micro");
if($("#earthFlameCanvas")) drawFlame($("#earthFlameCanvas"), "earth");
if($("#microFlameCanvas")) drawFlame($("#microFlameCanvas"), "micro");

/* ======================================================
   5. OVERVIEW CARDS
   ====================================================== */
const OVERVIEW_CARDS = [
  { icon:"🛰️", title:"Fire safety is a top spacecraft hazard", body:"With no escape route and a sealed, recirculating atmosphere, an onboard fire is one of the most serious risks a crew can face — detection and suppression have to work correctly the first time." },
  { icon:"🔥", title:"Earth fire vs. microgravity fire", body:"On Earth, hot combustion gases rise, pulling in fresh oxygen and shaping the familiar teardrop flame. In orbit, that buoyant flow is essentially gone." },
  { icon:"🌀", title:"Buoyancy shapes everything", body:"Without buoyancy, oxygen reaches the flame only through slow diffusion. That changes flame shape, temperature, soot production, and how easily a fire spreads or self-extinguishes." },
  { icon:"🌕", title:"Why it matters for the Moon & Mars", body:"Lunar and Martian habitats sit at partial gravity — not 1g, not 0g. Understanding this middle ground is essential to designing safe long-duration surface habitats." }
];
function renderOverview(){
  const grid = $("#overviewGrid");
  grid.innerHTML = OVERVIEW_CARDS.map((c,i)=>`
    <div class="ov-card glass" data-i="${i}">
      <div class="ic" style="font-size:26px;">${c.icon}</div>
      <h3>${c.title}</h3>
      <p>${c.body}</p>
      <div class="expand-hint">TAP TO ${'EXPAND'}</div>
    </div>`).join("");
  $all(".ov-card", grid).forEach(card=>{
    card.addEventListener("click", ()=> card.classList.toggle("open"));
  });
}
if($("#overviewGrid")) renderOverview();

/* ======================================================
   6. EXPERIMENT EXPLORER
   ====================================================== */
function populateFilterSelect(sel, values, labelFn){
  values.forEach(v=>{
    const opt = document.createElement("option");
    opt.value = v; opt.textContent = labelFn ? labelFn(v) : v;
    sel.appendChild(opt);
  });
}
if($("#fuelFilter")) populateFilterSelect($("#fuelFilter"), Object.keys(FUEL_LABELS), v=>FUEL_LABELS[v]);
if($("#platformFilter")) populateFilterSelect($("#platformFilter"), Object.keys(PLATFORM_LABELS), v=>PLATFORM_LABELS[v]);
if($("#riskFilter")) populateFilterSelect($("#riskFilter"), Object.keys(RISK_ORDER), v=>RISK_DISPLAY[v]);

let expState = { q:"", fuel:"", platform:"", risk:"", sort:"relevance" };

function filteredExperiments(){
  let list = EXPERIMENTS.filter(e=>{
    if(expState.fuel && e.fuel!==expState.fuel) return false;
    if(expState.platform && e.platformKey!==expState.platform) return false;
    if(expState.risk && e.risk!==expState.risk) return false;
    if(expState.q){
      const hay = (e.name+" "+e.full+" "+e.objective+" "+e.fuelLabel+" "+e.tags.join(" ")).toLowerCase();
      if(!hay.includes(expState.q.toLowerCase())) return false;
    }
    return true;
  });
  if(expState.sort==="year-desc") list = list.slice().sort((a,b)=>b.year-a.year);
  else if(expState.sort==="year-asc") list = list.slice().sort((a,b)=>a.year-b.year);
  else if(expState.sort==="risk-desc") list = list.slice().sort((a,b)=>RISK_ORDER[b.risk]-RISK_ORDER[a.risk]);
  return list;
}

function renderExperiments(){
  const list = filteredExperiments();
  $("#expMeta").textContent = list.length + " of " + EXPERIMENTS.length + " experiments shown";
  const grid = $("#expGrid");
  if(list.length===0){
    grid.innerHTML = "";
    grid.parentElement.querySelector(".exp-empty")?.remove();
    const empty = document.createElement("div");
    empty.className = "exp-empty";
    empty.textContent = "No experiments match those filters. Try broadening your search.";
    grid.after(empty);
    return;
  }
  grid.parentElement.querySelector(".exp-empty")?.remove();
  grid.innerHTML = list.map(e=>`
    <div class="exp-card glass" data-id="${e.id}">
      <div class="exp-card-top">
        <div><h4>${e.name}</h4><div class="plat">${e.platform}</div></div>
        <div class="risk-chip ${riskClass(e.risk)}">${RISK_DISPLAY[e.risk]}</div>
      </div>
      <p class="obj">${e.objective}</p>
      <div class="exp-tags">${e.tags.map(t=>`<span class="tag">#${t}</span>`).join("")}</div>
    </div>`).join("");
  $all(".exp-card", grid).forEach(card=>{
    card.addEventListener("click", ()=> openExperimentModal(card.dataset.id));
  });
}
if($("#expGrid")){
  $("#expSearch").addEventListener("input", e=>{ expState.q = e.target.value; renderExperiments(); });
  $("#fuelFilter").addEventListener("change", e=>{ expState.fuel = e.target.value; renderExperiments(); });
  $("#platformFilter").addEventListener("change", e=>{ expState.platform = e.target.value; renderExperiments(); });
  $("#riskFilter").addEventListener("change", e=>{ expState.risk = e.target.value; renderExperiments(); });
  $("#sortSelect").addEventListener("change", e=>{ expState.sort = e.target.value; renderExperiments(); });
  renderExperiments();
}

/* ======================================================
   7. EXPERIMENT MODAL
   ====================================================== */
function openExperimentModal(id){
  const e = EXPERIMENTS.find(x=>x.id===id);
  if(!e) return;
  const related = EXPERIMENTS.filter(x=> x.id!==e.id && x.tags.some(t=>e.tags.includes(t))).slice(0,3);
  const root = $("#modal-root");
  root.innerHTML = `
    <div class="modal-scrim" id="expModalScrim">
      <div class="modal-box glass" role="dialog" aria-modal="true">
        <button class="modal-close" id="expModalClose" aria-label="Close">✕</button>
        <div class="modal-top">
          <div>
            <h2>${e.name} <span style="color:var(--text-faint); font-weight:400; font-size:15px;">— ${e.full}</span></h2>
            <div class="modal-plat">${e.platform} · ${e.years}</div>
          </div>
          <div class="risk-chip ${riskClass(e.risk)}">${RISK_DISPLAY[e.risk]}</div>
        </div>
        <div class="modal-sec"><div class="lbl">OBJECTIVE</div><p>${e.objective}</p></div>
        <div class="modal-sec"><div class="lbl">METHOD</div><p>${e.method}</p></div>
        <div class="modal-grid2">
          <div><div class="lbl" style="font-family:var(--font-mono); font-size:10px; color:var(--cyan); margin-bottom:7px;">FUEL</div><div>${e.fuelLabel}</div></div>
          <div><div class="lbl" style="font-family:var(--font-mono); font-size:10px; color:var(--cyan); margin-bottom:7px;">ENVIRONMENT</div><div>${e.environment}</div></div>
        </div>
        <div class="modal-sec"><div class="lbl">KEY OBSERVATION</div><p>${e.finding}</p></div>
        <div class="modal-sec"><div class="lbl">FIRE-SAFETY IMPLICATION</div><p>${e.relevance}</p></div>
        <div class="modal-sec"><div class="lbl">RELATED EXPERIMENTS</div><div class="exp-tags">${related.length ? related.map(r=>`<span class="tag" style="cursor:pointer;" data-rel="${r.id}">${r.name}</span>`).join("") : '<span style="color:var(--text-faint); font-size:12.5px;">None flagged</span>'}</div></div>
        <div class="modal-actions">
          <button class="btn btn-primary btn-sm" id="analyzeWithAiBtn">Analyze with AI →</button>
          <button class="btn btn-ghost btn-sm" id="expModalClose2">Close</button>
        </div>
      </div>
    </div>`;
  const scrim = $("#expModalScrim");
  requestAnimationFrame(()=> scrim.classList.add("show"));
  function close(){ scrim.classList.remove("show"); setTimeout(()=> root.innerHTML="", 220); }
  $("#expModalClose").addEventListener("click", close);
  $("#expModalClose2").addEventListener("click", close);
  scrim.addEventListener("click", ev=>{ if(ev.target===scrim) close(); });
  $all("[data-rel]", scrim).forEach(t=> t.addEventListener("click", ()=>{ close(); setTimeout(()=>openExperimentModal(t.dataset.rel),240); }));
  $("#analyzeWithAiBtn").addEventListener("click", ()=>{
    close();
    sendToAiAnalyst(e);
  });
}

// Stores the scenario in localStorage and navigates to the dedicated
// AI Fire Analyst page, which reads it on load and auto-runs the analysis.
function sendToAiAnalyst(exp){
  const fuelMap = { cellulose:"cellulose", composite:"composite", droplet:"droplet", gas:"gas" };
  const params = { environment:"micro", fuel: fuelMap[exp.fuel] || "composite", oxygen:21, airflow:"low", enclosure:"partial" };
  try{
    localStorage.setItem("fif_last_ai_params", JSON.stringify(params));
    localStorage.setItem("fif_autorun", "1");
    localStorage.setItem("fif_source_exp", exp.name);
  }catch(err){}
  window.location.href = "ai-analyst.html";
}

/* ======================================================
   8. FLAME COMPARISON TABLE
   ====================================================== */
const COMPARE_ROWS = [
  ["Flame shape","Elongated teardrop, pointed upward","Compact and roughly spherical"],
  ["Oxygen supply","Convection pulls in fresh air continuously","Oxygen reaches flame mainly by slow diffusion"],
  ["Heat transfer","Convection-dominated, carries heat upward","Conduction/radiation-dominated, spreads in all directions"],
  ["Soot formation","Often visible yellow soot glow","Can burn cleaner but soot behavior is less predictable"],
  ["Flame temperature","~1,000–1,400°C typical for candle-scale flames","Often several hundred degrees cooler"],
  ["Burning rate","Faster, driven by strong airflow","Slower, diffusion-limited"],
  ["Extinction behavior","Usually a clear, visible extinguishment","Can fade to a dim 'cool flame' that is hard to detect"]
];
function renderCompareTable(){
  const rows = COMPARE_ROWS.map(r=>`<tr><th>${r[0]}</th><td class="earth">${r[1]}</td><td class="micro">${r[2]}</td></tr>`).join("");
  $("#compareTable").innerHTML = `<tr><th></th><th style="color:var(--flame-2);">EARTH — 1g</th><th style="color:var(--cyan);">MICROGRAVITY — ~0g</th></tr>${rows}`;
}
if($("#compareTable")) renderCompareTable();

/* ======================================================
   9. AI FIRE SAFETY ANALYST — local rule-based engine
   ====================================================== */
if($("#f-oxy")) $("#f-oxy").addEventListener("input", e=> $("#v-oxy").textContent = e.target.value+"%");

function analyzeFireScenario(params){
  // params: {environment, fuel, oxygen, airflow, enclosure}
  const gravityScore = { earth:2, lunar:16, martian:12, micro:26 }[params.environment] ?? 20;
  const oxygenScore = Math.max(0,(params.oxygen-21))*1.6;
  const airflowScore = { none:18, low:6, moderate:0, high:15 }[params.airflow] ?? 8;
  const enclosureScore = { open:2, partial:11, sealed:19 }[params.enclosure] ?? 10;
  const fuelScore = { cellulose:9, composite:13, droplet:16, gas:21 }[params.fuel] ?? 10;

  let raw = gravityScore + oxygenScore + airflowScore + enclosureScore + fuelScore;
  const score = Math.max(3, Math.min(98, Math.round(raw)));

  let category, catColor;
  if(score < 28){ category="LOW"; catColor="safe"; }
  else if(score < 52){ category="MODERATE"; catColor="warn"; }
  else if(score < 74){ category="HIGH"; catColor="flame"; }
  else { category="CRITICAL"; catColor="danger"; }

  // predicted behavior
  const envLabel = { earth:"Earth gravity", lunar:"lunar partial gravity (0.16g)", martian:"Martian partial gravity (0.38g)", micro:"microgravity" }[params.environment];
  let behavior;
  if(params.environment==="earth"){
    behavior = "With full buoyant convection present, the flame should form a familiar elongated shape, draw in fresh oxygen continuously, and behave close to standard Earth-based fire models.";
  } else if(params.environment==="micro"){
    behavior = "With buoyancy essentially absent, the flame is likely to develop a more compact, spherical shape, burn cooler than on Earth, and rely on slow gas diffusion to reach fresh oxygen — producing an unpredictable, potentially longer-lived burn.";
  } else {
    behavior = "At "+envLabel+", partial buoyancy will distort the flame into an intermediate shape between Earth's teardrop and microgravity's sphere, with weaker, slower convective airflow than Earth.";
  }

  // hazards
  const hazards = [];
  hazards.push(params.environment==="earth" ? "Rapid flame spread if fuel and airflow both support combustion" : "Reduced or absent buoyant convection alters expected flame growth");
  if(params.airflow==="none") hazards.push("Stagnant air can let heat and combustion products accumulate locally around the fuel");
  if(params.airflow==="high") hazards.push("Strong forced airflow can accelerate flame spread and fan embers toward nearby materials");
  if(params.enclosure==="sealed") hazards.push("A sealed enclosure traps heat, smoke, and combustion gases, raising toxicity and pressure risk");
  if(params.oxygen>=28) hazards.push("Elevated oxygen concentration widens the flammability range and can make normally fire-resistant materials burn");
  if(params.fuel==="droplet") hazards.push("Droplet-style fuel sources can sustain dim, low-temperature 'cool flame' combustion that is hard to detect");
  if(params.fuel==="gas") hazards.push("A gaseous leak can pre-mix with cabin air, creating a risk of rapid, widespread ignition rather than localized burning");
  if(hazards.length<3) hazards.push("Standard microgravity risk: slower self-extinguishment than intuition based on Earth fires would suggest");

  // extinction behavior
  let extinction;
  if(params.environment==="earth" && params.airflow!=="none"){
    extinction = "Likely to extinguish in a visible, relatively fast, predictable manner once fuel or oxygen is removed.";
  } else if(params.oxygen>=28){
    extinction = "Elevated oxygen levels may allow combustion to continue even after typical suppression measures, requiring oxygen concentration to be actively reduced.";
  } else {
    extinction = "May fade gradually through a dim, low-temperature phase rather than a clear extinguishment, so confirmation should rely on gas/thermal sensors rather than visual inspection alone.";
  }

  // safety considerations
  const safety = [];
  safety.push("Confirm true extinguishment with thermal or gas sensors, not visual inspection alone");
  if(params.enclosure!=="open") safety.push("Design suppression systems to work effectively inside partially or fully enclosed racks/modules");
  if(params.airflow==="none"||params.airflow==="low") safety.push("Consider controlled ventilation strategies that starve rather than feed a developing fire");
  if(params.oxygen>=26) safety.push("Monitor and actively regulate cabin oxygen concentration, especially in sealed enclosures");
  safety.push("Select fuel-adjacent materials based on microgravity/partial-gravity flammability data, not Earth-only certification");

  // related experiments — match by fuel + environment context
  const fuelTagMap = { cellulose:"solid-fuel", composite:"materials", droplet:"droplet", gas:"facility" };
  let related = EXPERIMENTS.filter(e=> e.fuel===params.fuel || e.tags.includes(fuelTagMap[params.fuel]));
  if(params.environment==="lunar" || params.environment==="martian") related = related.concat(EXPERIMENTS.filter(e=>e.tags.includes("moon")||e.tags.includes("mars")));
  related = Array.from(new Set(related.map(e=>e.name)));
  if(related.length===0) related = ["CIR","FLEX"];
  related = related.slice(0,4);

  return { score, category, catColor, behavior, hazards, extinction, safety, related, envLabel };
}

function typeWriter(el, text, speed, done){
  el.innerHTML = "";
  const span = document.createElement("span");
  el.appendChild(span);
  const cursor = document.createElement("span");
  cursor.className = "cursor-blink";
  el.appendChild(cursor);
  let i = 0;
  function step(){
    if(i<=text.length){
      span.textContent = text.slice(0,i);
      i += 2;
      requestAnimationFrame(()=> setTimeout(step, speed));
    } else {
      cursor.remove();
      if(done) done();
    }
  }
  step();
}

function runAiAnalysis(scrollAfter){
  const params = {
    environment: $("#f-env").value,
    fuel: $("#f-fuel").value,
    oxygen: parseInt($("#f-oxy").value,10),
    airflow: $("#f-air").value,
    enclosure: $("#f-enc").value
  };
  const result = analyzeFireScenario(params);
  const badge = $("#aiRiskBadge");
  badge.style.display = "inline-block";
  badge.textContent = "FIRE RISK: "+result.category+" ("+result.score+"/100)";
  badge.style.color = "var(--"+result.catColor+")";
  badge.style.borderColor = "var(--"+result.catColor+")";

  const text =
`ENVIRONMENT: ${result.envLabel.toUpperCase()}
FUEL: ${FUEL_LABELS[params.fuel]}  ·  O2: ${params.oxygen}%  ·  AIRFLOW: ${params.airflow}  ·  ENCLOSURE: ${params.enclosure}

PREDICTED FLAME BEHAVIOR
${result.behavior}

PRIMARY HAZARDS
${result.hazards.map(h=>"• "+h).join("\n")}

EXTINCTION BEHAVIOR
${result.extinction}

SAFETY CONSIDERATIONS
${result.safety.map(s=>"• "+s).join("\n")}

RELATED NASA/JAXA EXPERIMENTS
${result.related.join(", ")}

— AI Simulation / Research Assistant. Rule-based, local estimate — not a verified NASA hazard assessment.`;

  typeWriter($("#aiBody"), text, 6);
  try{ localStorage.setItem("fif_last_ai_params", JSON.stringify(params)); }catch(e){}
  toast("AI analysis complete: "+result.category+" risk");
  if(scrollAfter) scrollAfter(result);
}

if($("#runAiBtn")) $("#runAiBtn").addEventListener("click", ()=> runAiAnalysis());

/* ======================================================
   10. RISK RANKING
   ====================================================== */
const RANK_SCENARIOS = [
  { name:"Sealed module · gas leak · high O₂", params:{environment:"micro",fuel:"gas",oxygen:32,airflow:"none",enclosure:"sealed"}, factors:"Confinement · elevated O₂ · stagnant air" },
  { name:"ISS rack · droplet fuel · low airflow", params:{environment:"micro",fuel:"droplet",oxygen:24,airflow:"low",enclosure:"partial"}, factors:"Cool-flame risk · limited ventilation" },
  { name:"Lunar habitat · composite panel · sealed", params:{environment:"lunar",fuel:"composite",oxygen:30,airflow:"low",enclosure:"sealed"}, factors:"Partial gravity · sealed habitat · elevated O₂" },
  { name:"Martian habitat · cellulose · moderate flow", params:{environment:"martian",fuel:"cellulose",oxygen:26,airflow:"moderate",enclosure:"partial"}, factors:"Partial gravity · moderate ventilation" },
  { name:"ISS open bay · solid fuel · forced airflow", params:{environment:"micro",fuel:"cellulose",oxygen:21,airflow:"high",enclosure:"open"}, factors:"Forced ventilation · open bay" },
  { name:"Earth baseline · cellulose · ambient", params:{environment:"earth",fuel:"cellulose",oxygen:21,airflow:"moderate",enclosure:"open"}, factors:"Full buoyancy · reference case" }
];
function renderRiskRanking(){
  const scored = RANK_SCENARIOS.map(s=> Object.assign({}, s, analyzeFireScenario(s.params)));
  scored.sort((a,b)=> b.score-a.score);
  $("#rankList").innerHTML = scored.map(s=>`
    <div class="rank-row glass">
      <div>
        <div class="rank-row-top">
          <h4>${s.name}</h4>
          <span class="rank-cat" style="color:var(--${s.catColor});">${s.category}</span>
        </div>
        <div class="bar-track"><div class="bar-fill" data-w="${s.score}"></div></div>
        <div class="rank-factors">${s.factors}</div>
      </div>
      <div class="rank-score">${s.score}<span>/ 100</span></div>
    </div>`).join("");
  requestAnimationFrame(()=>{
    $all(".bar-fill").forEach(b=> setTimeout(()=> b.style.width = b.dataset.w+"%", 80));
  });
}
if($("#rankList")) renderRiskRanking();

/* ======================================================
   11. RESEARCH INSIGHTS
   ====================================================== */
const INSIGHTS = [
  { q:"Microgravity removes buoyancy-driven convection.", rel:"cir" },
  { q:"Flames can become more spherical and compact without gravity pulling gas upward.", rel:"flex" },
  { q:"Some flames may continue burning at lower, harder-to-detect temperatures.", rel:"flex2" },
  { q:"Fire behavior inside a spacecraft can differ significantly from an equivalent fire on Earth.", rel:"saffire" },
  { q:"Confinement can either accelerate or starve flame spread depending on duct geometry.", rel:"confined" },
  { q:"Flammability limits shift with gravity level, not just with the presence or absence of gravity.", rel:"flare" }
];
function renderInsights(){
  $("#insightGrid").innerHTML = INSIGHTS.map(i=>{
    const exp = EXPERIMENTS.find(e=>e.id===i.rel);
    return `<div class="insight-card glass" data-rel="${i.rel}">
      <span class="qmark">"</span>
      <p>${i.q}</p>
      <div class="rel">→ ${exp.name} experiment</div>
    </div>`;
  }).join("");
  $all(".insight-card").forEach(c=> c.addEventListener("click", ()=>{
    scrollToId("experiments");
    setTimeout(()=> openExperimentModal(c.dataset.rel), 500);
  }));
}
if($("#insightGrid")) renderInsights();

/* ======================================================
   12. DATA VISUALIZATION — canvas charts
   ====================================================== */
const VIZ_TABS = [
  {id:"temp", label:"Temperature"}, {id:"burn", label:"Burning Rate"}, {id:"oxy", label:"O₂ vs Behavior"},
  {id:"radar", label:"Risk Radar"}, {id:"exp", label:"Experiment Risk"}, {id:"timeline", label:"Timeline"}
];
function renderVizTabs(){
  $("#vizTabs").innerHTML = VIZ_TABS.map((t,i)=> `<button class="pill-btn ${i===0?'active':''}" data-viz="${t.id}">${t.label}</button>`).join("");
  $all("[data-viz]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      $all("[data-viz]").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      $all(".viz-single").forEach(v=>v.classList.remove("show"));
      $("#viz-"+btn.dataset.viz).classList.add("show");
    });
  });
}
if($("#vizTabs")) renderVizTabs();

function hiDPICanvas(canvas){
  const ctx = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();
  const cssW = rect.width || canvas.width;
  const cssH = canvas.height * (cssW/canvas.width);
  const dpr = window.devicePixelRatio||1;
  canvas.style.height = cssH+"px";
  return ctx;
}

function drawBarChart(canvas, labels, series, opts){
  opts = opts||{};
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0,0,W,H);
  const padL=54, padR=20, padT=24, padB=46;
  const chartW = W-padL-padR, chartH = H-padT-padB;
  const maxVal = opts.max || Math.max(...series.flatMap(s=>s.data))*1.15;
  // gridlines
  ctx.strokeStyle = "rgba(126,178,219,0.12)"; ctx.lineWidth=1; ctx.font="11px IBM Plex Mono"; ctx.fillStyle="#7d93ab";
  for(let g=0; g<=4; g++){
    const y = padT + chartH - (chartH*g/4);
    ctx.beginPath(); ctx.moveTo(padL,y); ctx.lineTo(W-padR,y); ctx.stroke();
    ctx.fillText(Math.round(maxVal*g/4)+(opts.unit||""), 6, y+4);
  }
  const groupW = chartW/labels.length;
  const barGap = 10;
  const barW = (groupW - barGap*(series.length+1))/series.length;
  labels.forEach((lab,li)=>{
    series.forEach((s,si)=>{
      const val = s.data[li];
      const bh = (val/maxVal)*chartH;
      const x = padL + li*groupW + barGap + si*(barW+barGap);
      const y = padT+chartH-bh;
      const grad = ctx.createLinearGradient(0,y,0,padT+chartH);
      grad.addColorStop(0, s.color); grad.addColorStop(1, s.color2||s.color);
      ctx.fillStyle = grad;
      ctx.beginPath();
      const r=4;
      ctx.moveTo(x,y+r); ctx.arcTo(x,y,x+r,y,r); ctx.lineTo(x+barW-r,y); ctx.arcTo(x+barW,y,x+barW,y+r,r);
      ctx.lineTo(x+barW,padT+chartH); ctx.lineTo(x,padT+chartH); ctx.closePath(); ctx.fill();
      ctx.fillStyle="#c9d8e6"; ctx.font="600 11px IBM Plex Mono"; ctx.textAlign="center";
      ctx.fillText(Math.round(val), x+barW/2, y-7);
    });
    ctx.fillStyle="#93a8bf"; ctx.font="11px IBM Plex Sans"; ctx.textAlign="center";
    ctx.fillText(lab, padL+li*groupW+groupW/2, H-18);
  });
  ctx.textAlign="left";
}

function drawLineChart(canvas, labels, series, opts){
  opts=opts||{};
  const ctx = canvas.getContext("2d");
  const W=canvas.width, H=canvas.height;
  ctx.clearRect(0,0,W,H);
  const padL=54,padR=20,padT=24,padB=46;
  const chartW=W-padL-padR, chartH=H-padT-padB;
  const maxVal = opts.max || Math.max(...series.flatMap(s=>s.data))*1.15;
  ctx.strokeStyle="rgba(126,178,219,0.12)"; ctx.lineWidth=1; ctx.font="11px IBM Plex Mono"; ctx.fillStyle="#7d93ab";
  for(let g=0;g<=4;g++){
    const y = padT+chartH-(chartH*g/4);
    ctx.beginPath(); ctx.moveTo(padL,y); ctx.lineTo(W-padR,y); ctx.stroke();
    ctx.fillText(Math.round(maxVal*g/4), 6, y+4);
  }
  series.forEach(s=>{
    ctx.beginPath();
    s.data.forEach((v,i)=>{
      const x = padL + (chartW/(labels.length-1))*i;
      const y = padT+chartH-(v/maxVal)*chartH;
      if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    });
    ctx.strokeStyle = s.color; ctx.lineWidth=2.5; ctx.lineJoin="round"; ctx.stroke();
    s.data.forEach((v,i)=>{
      const x = padL + (chartW/(labels.length-1))*i;
      const y = padT+chartH-(v/maxVal)*chartH;
      ctx.beginPath(); ctx.arc(x,y,3.5,0,Math.PI*2); ctx.fillStyle=s.color; ctx.fill();
    });
  });
  ctx.fillStyle="#93a8bf"; ctx.font="11px IBM Plex Sans"; ctx.textAlign="center";
  labels.forEach((lab,i)=>{
    const x = padL + (chartW/(labels.length-1))*i;
    ctx.fillText(lab, x, H-18);
  });
  ctx.textAlign="left";
}

function drawRadarChart(canvas, axes, series){
  const ctx = canvas.getContext("2d");
  const W=canvas.width, H=canvas.height;
  ctx.clearRect(0,0,W,H);
  const cx=W/2, cy=H/2-10, R=Math.min(W,H)*0.32;
  const n = axes.length;
  ctx.strokeStyle="rgba(126,178,219,0.18)"; ctx.fillStyle="#93a8bf"; ctx.font="11px IBM Plex Mono"; ctx.textAlign="center";
  for(let ring=1; ring<=4; ring++){
    ctx.beginPath();
    for(let i=0;i<=n;i++){
      const a = -Math.PI/2 + i*(2*Math.PI/n);
      const r = R*ring/4;
      const x = cx+Math.cos(a)*r, y = cy+Math.sin(a)*r;
      if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.stroke();
  }
  for(let i=0;i<n;i++){
    const a = -Math.PI/2 + i*(2*Math.PI/n);
    const x = cx+Math.cos(a)*R, y = cy+Math.sin(a)*R;
    ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(x,y); ctx.strokeStyle="rgba(126,178,219,0.18)"; ctx.stroke();
    const lx = cx+Math.cos(a)*(R+26), ly = cy+Math.sin(a)*(R+26);
    ctx.fillText(axes[i], lx, ly);
  }
  series.forEach(s=>{
    ctx.beginPath();
    s.data.forEach((v,i)=>{
      const a = -Math.PI/2 + i*(2*Math.PI/n);
      const r = R*(v/100);
      const x = cx+Math.cos(a)*r, y = cy+Math.sin(a)*r;
      if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    });
    ctx.closePath();
    ctx.fillStyle = s.fill; ctx.fill();
    ctx.strokeStyle = s.color; ctx.lineWidth=2; ctx.stroke();
  });
  ctx.textAlign="left";
}

function drawTimeline(canvas, items){
  const ctx = canvas.getContext("2d");
  const W=canvas.width, H=canvas.height;
  ctx.clearRect(0,0,W,H);
  const padL=40, padR=40, y=H/2;
  const minY=2007, maxY=2023;
  ctx.strokeStyle="rgba(126,178,219,0.3)"; ctx.beginPath(); ctx.moveTo(padL,y); ctx.lineTo(W-padR,y); ctx.stroke();
  items.forEach((it,i)=>{
    const x = padL + ((it.year-minY)/(maxY-minY))*(W-padL-padR);
    const up = i%2===0;
    const ly = up ? y-46 : y+46;
    ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x,ly); ctx.strokeStyle="rgba(126,178,219,0.25)"; ctx.stroke();
    ctx.beginPath(); ctx.arc(x,y,5,0,Math.PI*2); ctx.fillStyle="#5ad7ff"; ctx.fill();
    ctx.fillStyle="#e9f2f9"; ctx.font="600 12px Space Grotesk"; ctx.textAlign="center";
    ctx.fillText(it.name, x, up? ly-10 : ly+20);
    ctx.fillStyle="#7d93ab"; ctx.font="10px IBM Plex Mono";
    ctx.fillText(it.year, x, up? ly-24 : ly+34);
  });
  ctx.textAlign="left";
}

function renderCharts(){
  drawBarChart($("#chartTemp"), ["Candle (baseline)","Solid fuel","Droplet fuel"],
    [ {data:[1350,900,1180], color:"#ffb454", color2:"#ff6a3d"}, {data:[780,540,640], color:"#5ad7ff", color2:"#2f8fb8"} ],
    {unit:"°"});
  const tempLegend = `<div class="legend"><span><i style="background:#ff6a3d;"></i>Earth (1g)</span><span><i style="background:#2f8fb8;"></i>Microgravity</span></div>`;
  $("#viz-temp .viz-card").insertAdjacentHTML("beforeend", tempLegend);

  drawBarChart($("#chartBurn"), ["Cellulose","Composite","Droplet"],
    [ {data:[100,72,88], color:"#ffb454", color2:"#ff6a3d"}, {data:[54,38,61], color:"#5ad7ff", color2:"#2f8fb8"} ]);
  $("#viz-burn .viz-card").insertAdjacentHTML("beforeend", tempLegend);

  drawLineChart($("#chartOxy"), ["16%","21%","26%","30%","35%","40%","45%"],
    [ {data:[20,35,58,74,86,93,97], color:"#ff6a3d"} ], {max:100});
  $("#viz-oxy .viz-card").insertAdjacentHTML("beforeend", `<div class="legend"><span><i style="background:#ff6a3d;"></i>Flame stability / risk index (0–100)</span></div>`);

  drawRadarChart($("#chartRadar"), ["Ignition","Spread","O₂ demand","Heat accum.","Detectability risk","Extinction difficulty"],
    [
      {data:[55,70,60,40,25,35], color:"#ffb454", fill:"rgba(255,180,84,0.12)"},
      {data:[42,38,30,58,72,66], color:"#5ad7ff", fill:"rgba(90,215,255,0.14)"}
    ]);
  $("#viz-radar .viz-card").insertAdjacentHTML("beforeend", `<div class="legend"><span><i style="background:#ffb454;"></i>Earth</span><span><i style="background:#5ad7ff;"></i>Microgravity</span></div>`);

  const expScores = EXPERIMENTS.map(e=>({name:e.name, score: (RISK_ORDER[e.risk]/5)*100}));
  drawBarChart($("#chartExp"), expScores.map(e=>e.name), [ {data:expScores.map(e=>e.score), color:"#5ad7ff", color2:"#ff6a3d"} ], {max:100});

  drawTimeline($("#chartTimeline"), EXPERIMENTS.map(e=>({name:e.name, year:e.year})));
}
if($("#chartTemp")){
  renderCharts();
  window.addEventListener("resize", ()=>{ clearTimeout(window.__vizrt); window.__vizrt=setTimeout(renderCharts,200); });
}

/* ======================================================
   13. MOON VS MARS
   ====================================================== */
function runMMAnalysis(planet){
  const oxySel = $(`.mm-select[data-planet="${planet}"][data-var="oxy"]`);
  const encSel = $(`.mm-select[data-planet="${planet}"][data-var="enc"]`);
  const params = {
    environment: planet==="moon" ? "lunar" : "martian",
    fuel: "composite",
    oxygen: parseInt(oxySel.value,10),
    airflow: "low",
    enclosure: encSel.value
  };
  const result = analyzeFireScenario(params);
  const target = $(planet==="moon" ? "#moonResult" : "#marsResult");
  target.innerHTML = `<b style="color:var(--${result.catColor});">${result.category} RISK — ${result.score}/100</b><br><br>${result.behavior}<br><br><strong style="color:var(--text);">Top hazard:</strong> ${result.hazards[0]}<br><strong style="color:var(--text);">Related research:</strong> ${result.related.join(", ")}`;
  toast((planet==="moon"?"Lunar":"Martian")+" habitat analysis updated");
}
if($all(".mm-run").length) $all(".mm-run").forEach(btn=> btn.addEventListener("click", ()=> runMMAnalysis(btn.dataset.planet)));

/* ======================================================
   14. KNOWLEDGE MAP (SVG force-ish network)
   ====================================================== */
const MAP_NODES = [
  {id:"micro", label:"Microgravity", group:"effect", x:450, y:70, info:"The absence of significant gravity removes buoyancy-driven convection, the root cause of nearly every difference in this dashboard."},
  {id:"nofire", label:"No Buoyancy", group:"effect", x:280, y:150, info:"Without buoyancy, hot combustion gases don't rise — oxygen reaches the flame only by slow diffusion."},
  {id:"shape", label:"Spherical Flames", group:"effect", x:620, y:150, info:"Diffusion-limited combustion tends to produce compact, roughly spherical flame shapes instead of Earth's teardrop."},
  {id:"coolflame", label:"Cool Flames", group:"hazard", x:150, y:260, info:"Some fuels continue low-temperature combustion after the visible flame appears to go out — a major detection blind spot."},
  {id:"detect", label:"Detection Gap", group:"hazard", x:80, y:370, info:"Standard visual/thermal detection can miss cool flames or dim microgravity flames entirely."},
  {id:"spread", label:"Confinement & Spread", group:"hazard", x:730, y:260, info:"Confined ducts and enclosures can either starve or accelerate flame spread depending on geometry and airflow."},
  {id:"solutions", label:"Safety Solutions", group:"solution", x:450, y:430, info:"Gas/thermal sensing, engineered ventilation, and revised material certification address the hazards above."},
  {id:"cir", label:"CIR", group:"experiment", x:450, y:190, info:"CIR — the multi-user facility that hosted most of the ISS combustion investigations in this dashboard."},
  {id:"flex", label:"FLEX", group:"experiment", x:230, y:210, info:"FLEX — first showed droplet flames extinguishing at unexpectedly low, hard-to-see temperatures."},
  {id:"flex2", label:"FLEX-2", group:"experiment", x:130, y:300, info:"FLEX-2 — identified the two-stage 'cool flame' phase in larger droplets."},
  {id:"bass", label:"BASS", group:"experiment", x:560, y:330, info:"BASS/BASS-II — showed airflow, not buoyancy, controls solid-fuel flame spread in microgravity."},
  {id:"saffire", label:"Saffire", group:"experiment", x:700, y:350, info:"Saffire — full-scale, realistic spacecraft-cabin fire growth data from an uncrewed Cygnus vehicle."},
  {id:"sofie", label:"SoFIE", group:"experiment", x:400, y:330, info:"SoFIE — large-scale material flammability limits that differ from small Earth-based tests."},
  {id:"confined", label:"Confined Combustion", group:"experiment", x:640, y:220, info:"Confined Combustion — duct geometry can starve or accelerate a spreading flame."},
  {id:"flare", label:"JAXA FLARE", group:"experiment", x:330, y:430, info:"JAXA FLARE — flammability limits at partial gravity, directly relevant to the Moon and Mars."},
  {id:"moon", label:"Moon Missions", group:"destination", x:250, y:490, info:"Lunar habitats sit at 0.16g — partial buoyancy distorts flames between Earth and microgravity behavior."},
  {id:"mars", label:"Mars Missions", group:"destination", x:600, y:490, info:"Martian habitats sit at 0.38g — more buoyancy returns than on the Moon, but still far below Earth."}
];
const MAP_LINKS = [
  ["micro","nofire"],["micro","shape"],["nofire","coolflame"],["coolflame","detect"],
  ["shape","spread"],["micro","cir"],["cir","flex"],["flex","flex2"],["flex2","coolflame"],
  ["cir","bass"],["cir","sofie"],["bass","spread"],["cir","confined"],["confined","spread"],
  ["saffire","spread"],["cir","saffire"],["sofie","flare"],["flare","moon"],["flare","mars"],
  ["detect","solutions"],["spread","solutions"],["solutions","moon"],["solutions","mars"],
];
const GROUP_COLORS = { effect:"#5ad7ff", hazard:"#ff5468", solution:"#4ade80", experiment:"#ffb454", destination:"#c9cfe0" };
const GROUP_LABELS = { effect:"Microgravity Effect", hazard:"Fire Hazard", solution:"Safety Solution", experiment:"NASA/JAXA Experiment", destination:"Mission Destination" };

function renderKnowledgeMap(){
  const svg = $("#knowledge-svg");
  const NS = "http://www.w3.org/2000/svg";
  svg.innerHTML = "";
  const linkGroup = document.createElementNS(NS,"g");
  const nodeGroup = document.createElementNS(NS,"g");
  const byId = {}; MAP_NODES.forEach(n=> byId[n.id]=n);

  MAP_LINKS.forEach(([a,b])=>{
    const na=byId[a], nb=byId[b];
    const line = document.createElementNS(NS,"line");
    line.setAttribute("x1",na.x); line.setAttribute("y1",na.y);
    line.setAttribute("x2",nb.x); line.setAttribute("y2",nb.y);
    line.setAttribute("class","map-link");
    line.dataset.a=a; line.dataset.b=b;
    linkGroup.appendChild(line);
  });

  MAP_NODES.forEach(n=>{
    const g = document.createElementNS(NS,"g");
    g.setAttribute("class","map-node");
    g.dataset.id = n.id;
    const r = n.group==="effect" ? 26 : n.group==="experiment" ? 22 : 20;
    const circle = document.createElementNS(NS,"circle");
    circle.setAttribute("cx",n.x); circle.setAttribute("cy",n.y); circle.setAttribute("r",r);
    circle.setAttribute("fill", GROUP_COLORS[n.group]+"26");
    circle.setAttribute("stroke", GROUP_COLORS[n.group]);
    circle.setAttribute("stroke-width","1.6");
    g.appendChild(circle);
    const text = document.createElementNS(NS,"text");
    text.setAttribute("x",n.x); text.setAttribute("y", n.y+r+16);
    text.setAttribute("text-anchor","middle");
    text.setAttribute("fill","#c9d8e6");
    text.setAttribute("font-size","10.5");
    text.textContent = n.label;
    g.appendChild(text);
    g.addEventListener("click", ()=> selectMapNode(n.id));
    g.addEventListener("mouseenter", ()=> highlightMapNode(n.id));
    nodeGroup.appendChild(g);
  });

  svg.appendChild(linkGroup);
  svg.appendChild(nodeGroup);
}
function highlightMapNode(id){
  $all(".map-link").forEach(l=>{
    const active = l.dataset.a===id || l.dataset.b===id;
    l.style.stroke = active ? "rgba(90,215,255,0.75)" : "rgba(126,178,219,0.18)";
    l.style.strokeWidth = active ? "2" : "1.2";
  });
}
function selectMapNode(id){
  highlightMapNode(id);
  const n = MAP_NODES.find(x=>x.id===id);
  const info = $("#mapInfo");
  info.classList.add("show");
  info.innerHTML = `<h5>${n.label} <span style="color:${GROUP_COLORS[n.group]}; font-family:var(--font-mono); font-size:9.5px;">· ${GROUP_LABELS[n.group]}</span></h5><p>${n.info}</p>`;
  if(n.group==="experiment"){
    const exp = EXPERIMENTS.find(e=>e.id===id);
    if(exp){
      const link = document.createElement("div");
      link.style.marginTop="10px";
      link.innerHTML = `<button class="btn btn-ghost btn-sm" id="mapOpenExp">View full experiment →</button>`;
      info.appendChild(link);
      $("#mapOpenExp").addEventListener("click", ()=>{ scrollToId("experiments"); setTimeout(()=>openExperimentModal(id),400); });
    }
  }
}
function renderMapLegend(){
  $("#mapLegend").innerHTML = Object.keys(GROUP_LABELS).map(g=>`<span><i style="background:${GROUP_COLORS[g]};"></i>${GROUP_LABELS[g]}</span>`).join("");
}
if($("#knowledge-svg")){ renderKnowledgeMap(); renderMapLegend(); }

/* ======================================================
   15. SOURCES SECTION
   ====================================================== */
function renderSourcesList(){
  const items = [
    {lbl:"NASA Physical Sciences Informatics — Combustion Science", note:"Repository referenced for the general subject of ISS combustion investigations (CIR, FLEX/FLEX-2, BASS/BASS-II, SoFIE)."},
    {lbl:"NASA Saffire Mission Overview", note:"Referenced for the general concept of large-scale, uncrewed Cygnus fire-safety demonstrations."},
    {lbl:"JAXA Kibo Utilization — FLARE", note:"Referenced for the general concept of partial-gravity flammability testing aboard Kibo."},
    {lbl:"NASA Fire Safety Research overviews", note:"General background on why fire behaves differently without buoyant convection."}
  ];
  $("#srcNasa").innerHTML = items.map(i=>`<li><span class="lbl">${i.lbl}</span>${i.note}</li>`).join("");
}
if($("#srcNasa")) renderSourcesList();

/* ======================================================
   15b. TEAM SECTION (sources.html)
   ====================================================== */
const TEAM = [
  { name:"Mahadi Mugdho", role:"Team Lead · Data Visualization", init:"MM", color:"#5ad7ff", bio:"" },
  { name:"Zabid Mustaque", role:"Co-Lead & Researcher", init:"ZM", color:"#ffb454", bio:"" },
  { name:"Nafisa Nawar", role:"Combustion Research Lead", init:"NN", color:"#4ade80", bio:"" },
  { name:"Mubtaseem Abrar Habib", role:"Graphics Design", init:"MAH", color:"#ff6a3d", bio:"" },
  { name:"Subaita Rahman", role:"Tech Assistant & Management", init:"SR", color:"#c9cfe0", bio:"" },
  { name:"NO Info", role:"NO Info", init:"NI", color:"#ff5468", bio:"" }
];
function renderTeam(){
  $("#teamGrid").innerHTML = TEAM.map(m=>`
    <div class="team-card glass">
      <div class="team-avatar" style="background:${m.color}33; border:1.5px solid ${m.color}; color:${m.color};">${m.init}</div>
      <h4>${m.name}</h4>
      <div class="team-role">${m.role}</div>
      <p class="team-bio">${m.bio}</p>
    </div>`).join("");
}
if($("#teamGrid")) renderTeam();

/* ======================================================
   16. INIT — restore last AI params from localStorage
   ====================================================== */
if($("#f-env")){
  (function restoreState(){
    try{
      const saved = localStorage.getItem("fif_last_ai_params");
      const sourceExp = localStorage.getItem("fif_source_exp");
      const autorun = localStorage.getItem("fif_autorun");
      if(saved){
        const p = JSON.parse(saved);
        if(p.environment) $("#f-env").value = p.environment;
        if(p.fuel) $("#f-fuel").value = p.fuel;
        if(p.oxygen){ $("#f-oxy").value = p.oxygen; $("#v-oxy").textContent = p.oxygen+"%"; }
        if(p.airflow) $("#f-air").value = p.airflow;
        if(p.enclosure) $("#f-enc").value = p.enclosure;
      }
      if(autorun==="1"){
        localStorage.removeItem("fif_autorun");
        if(sourceExp) toast("Loaded scenario from "+sourceExp);
        setTimeout(()=> $("#runAiBtn") && runAiAnalysis(), 350);
      }
    }catch(e){}
  })();
}

/* keyboard: Esc closes modal */
document.addEventListener("keydown", e=>{
  if(e.key==="Escape"){
    const scrim = $("#expModalScrim");
    if(scrim) scrim.classList.remove("show");
    if(scrim) setTimeout(()=> $("#modal-root").innerHTML="", 220);
  }
});

/* ======================================================
   17. MIKOJIN — guide mascot (appears on every page)
   ====================================================== */
(function mikojinGuide(){
  const page = (location.pathname.split("/").pop() || "index.html");
  const IMG = { happy:"mikojin-happy.png", worried:"mikojin-worried.png", reading:"mikojin-reading.png" };
  const TIPS = [
    { page:"any",             mood:"happy",   text:"Hi, I'm MikoJin! I'll help you get around the Flame in Freefall mission console." },
    { page:"index.html",      mood:"happy",   text:"Start with Mission Overview, then explore 8 real NASA/JAXA experiments below." },
    { page:"index.html",      mood:"worried", text:"Watch the Flame Comparison closely — in microgravity a flame can keep burning at a temperature too low to see!" },
    { page:"index.html",      mood:"happy",   text:"Try the Knowledge Map near the bottom — click any node to trace how the research connects." },
    { page:"index.html",      mood:"reading", text:"Curious about the fine print? The Sources & Team page shows exactly what's real data vs. illustrative." },
    { page:"ai-analyst.html", mood:"reading", text:"Set your mission conditions on the left, then hit Run AI Analysis — I'll estimate the fire risk instantly." },
    { page:"ai-analyst.html", mood:"worried", text:"Remember: this is a local rule-based simulation, not a certified NASA hazard assessment." },
    { page:"sources.html",    mood:"reading", text:"This page separates real NASA/JAXA research from prototype data and AI-generated interpretation." },
    { page:"sources.html",    mood:"happy",   text:"That's the crew behind this project — six of us built this for the Space Apps Challenge." }
  ];
  const pool = TIPS.filter(t=> t.page==="any" || t.page===page);
  if(!pool.length) return;
  let idx = 0;

  const wrap = document.createElement("div");
  wrap.id = "mikojinGuide";
  wrap.innerHTML =
    '<div class="mikojin-bubble" id="mikojinBubble">' +
      '<button class="mikojin-close" id="mikojinClose" aria-label="Close">✕</button>' +
      '<div class="mikojin-name">MIKOJIN · GUIDE</div>' +
      '<p id="mikojinText"></p>' +
      '<button class="mikojin-next" id="mikojinNext">Next tip →</button>' +
    '</div>' +
    '<button class="mikojin-avatar" id="mikojinAvatar" aria-label="Open MikoJin, your guide">' +
      '<img id="mikojinImg" src="" alt="MikoJin">' +
    '</button>';
  document.body.appendChild(wrap);

  function render(){
    const tip = pool[idx % pool.length];
    $("#mikojinText").textContent = tip.text;
    $("#mikojinImg").src = IMG[tip.mood];
  }
  render();

  const bubble = $("#mikojinBubble");
  $("#mikojinAvatar").addEventListener("click", ()=> bubble.classList.toggle("show"));
  $("#mikojinClose").addEventListener("click", ()=> bubble.classList.remove("show"));
  $("#mikojinNext").addEventListener("click", ()=>{ idx++; render(); });

  try{
    if(!sessionStorage.getItem("fif_mikojin_seen")){
      setTimeout(()=> bubble.classList.add("show"), 900);
      sessionStorage.setItem("fif_mikojin_seen","1");
    }
  }catch(e){}
})();

toast("Mission console initialized — data link nominal");

})();
