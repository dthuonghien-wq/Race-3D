const $=id=>document.getElementById(id);
const wrap=$('wrap'),ov=$('ov'),msg=$('msg'),stB=$('st'),sc=$('sc'),bs=$('bs'),lvE=$('lv'),lfE=$('lf'),lvB=$('lvb'),mu=$('mu'),psB=$('ps'),fl=$('fl'),vg=$('vg'),pwE=$('pw'),garE=$('gar'),lbls=$('lbls'),nitB=$('nit'),nitF=$('nitf'),spdE=$('spd'),bbW=$('bb'),bbF=$('bbf'),bbN=$('bbn'),coinE=$('coin');
let best=0,muted=false,bank=0,owned=[0],carSel=0;try{best=+localStorage.getItem('raceBest')||0;muted=localStorage.getItem('raceMute')==='1';bank=+localStorage.getItem('raceCoins')||0;owned=JSON.parse(localStorage.getItem('raceOwned')||'[0]');carSel=+localStorage.getItem('raceCar')||0}catch(e){}
if(!owned.includes(carSel))carSel=0;
bs.textContent=best;mu.textContent=muted?'🔇':'🔊';
mu.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();muted=!muted;mu.textContent=muted?'🔇':'🔊';try{localStorage.setItem('raceMute',muted?'1':'0')}catch(e){}if(muted)engStop()});

let AC=null,NB=null;
function unlockAudio(){try{if(navigator.audioSession)navigator.audioSession.type='playback'}catch(e){}
if(!AC){const A=window.AudioContext||window.webkitAudioContext;if(A)AC=new A()}
if(AC&&AC.state!=='running')AC.resume().catch(()=>{});
if(AC&&!NB){NB=AC.createBuffer(1,AC.sampleRate,AC.sampleRate);const d=NB.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}
if(AC&&!unlockAudio.done){unlockAudio.done=true;try{const b=AC.createBuffer(1,1,22050),s=AC.createBufferSource();s.buffer=b;s.connect(AC.destination);s.start(0)}catch(e){}
try{const n=2205,buf=new ArrayBuffer(44+n*2),v=new DataView(buf),w=(o,str)=>{for(let i=0;i<str.length;i++)v.setUint8(o+i,str.charCodeAt(i))};w(0,'RIFF');v.setUint32(4,36+n*2,true);w(8,'WAVE');w(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,22050,true);v.setUint32(28,44100,true);v.setUint16(32,2,true);v.setUint16(34,16,true);w(36,'data');v.setUint32(40,n*2,true);
const au=new Audio(URL.createObjectURL(new Blob([buf],{type:'audio/wav'})));au.loop=true;au.setAttribute('playsinline','');au.play().catch(()=>{});unlockAudio.au=au}catch(e){}}}
['touchend','click','keydown'].forEach(ev=>document.addEventListener(ev,unlockAudio,{passive:true}));
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&AC&&AC.state!=='running')AC.resume().catch(()=>{})});
function snd(f1,f2,d,type,vol){if(muted||!AC)return;const t=AC.currentTime,o=AC.createOscillator(),gn=AC.createGain();o.type=type;o.frequency.setValueAtTime(f1,t);o.frequency.exponentialRampToValueAtTime(f2,t+d);gn.gain.setValueAtTime(vol,t);gn.gain.exponentialRampToValueAtTime(0.001,t+d);o.connect(gn);gn.connect(AC.destination);o.start(t);o.stop(t+d)}
const seq=(fs,vol,gap,type)=>fs.forEach((f,i)=>setTimeout(()=>snd(f,f*1.01,0.14,type||'triangle',vol),i*(gap||80)));
function noise(t,d,vol,hp){if(!NB||muted)return;const s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();s.buffer=NB;f.type='highpass';f.frequency.value=hp;g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(0.0001,t+d);s.connect(f);f.connect(g);g.connect(AC.destination);s.start(t);s.stop(t+d+0.02)}
const sAbsorb=n=>{const k=Math.min(6,1+Math.floor(Math.log2(n+1)));for(let i=0;i<k;i++)setTimeout(()=>snd(600+i*120,1200+i*160,0.07,'sine',0.07),i*45)};
const sGateGood=()=>seq([784,988,1175,1568],0.07,60),sGateBad=()=>seq([523,392,311,233],0.07,70,'square');
const sBite=()=>{snd(180,60,0.18,'square',0.09);if(AC)noise(AC.currentTime,0.08,0.12,1500)},sRam=()=>{snd(120,40,0.25,'sawtooth',0.14);if(AC)noise(AC.currentTime,0.15,0.2,300)};
const sGiant=()=>{snd(110,440,0.5,'sawtooth',0.07);setTimeout(()=>seq([392,523,659,784],0.06,70),250)},sForm=()=>snd(500,900,0.12,'triangle',0.06);
const sEatBig=()=>{snd(220,50,0.5,'sawtooth',0.14);setTimeout(()=>seq([523,659,784,1047,1319],0.08,70),250)},sPower=()=>seq([523,784,1047,1568,2093],0.07,60);
const sHurt=()=>snd(300,60,0.4,'sawtooth',0.13),sDie=()=>snd(400,45,0.9,'sawtooth',0.15),sLife=()=>seq([659,880,1319],0.08);
const sSiren=()=>{for(let i=0;i<3;i++)setTimeout(()=>{snd(440,880,0.25,'square',0.06);setTimeout(()=>snd(880,440,0.25,'square',0.06),250)},i*500)},sZone=()=>seq([523,659,784,1047,1319,1568],0.08,90);
const sNet=()=>{if(AC)noise(AC.currentTime,0.5,0.25,600);snd(300,100,0.5,'sawtooth',0.08)},sZap=()=>{snd(1800,300,0.12,'square',0.05);if(AC)noise(AC.currentTime,0.06,0.1,4000)};
const mtof=m=>440*Math.pow(2,(m-69)/12);
const sCoin=n=>{snd(1300+Math.min(n,10)*80,2100+Math.min(n,10)*100,0.08,'square',0.03);setTimeout(()=>snd(2000+Math.min(n,10)*80,2600,0.06,'sine',0.035),50)};
const sCrash=()=>{snd(160,40,0.6,'sawtooth',0.16);if(AC){noise(AC.currentTime,0.7,0.35,200);noise(AC.currentTime+0.05,0.4,0.2,2500)}};
const sWhoosh=()=>{if(AC)noise(AC.currentTime,0.35,0.12,1800);snd(900,300,0.3,'sine',0.04)};
const sNitro=()=>{if(AC)noise(AC.currentTime,1,0.15,400);snd(100,400,1,'sawtooth',0.07)};
const sJump=()=>snd(300,900,0.35,'triangle',0.08),sLand=()=>{snd(150,60,0.2,'square',0.1);if(AC)noise(AC.currentTime,0.15,0.15,600)};
const sHorn=()=>{snd(440,440,0.25,'square',0.035);snd(554,554,0.25,'square',0.03)};
const sBoom=()=>{snd(120,30,0.9,'sawtooth',0.16);if(AC)noise(AC.currentTime,1,0.35,120)};
// ---- Tiếng động cơ: dao động theo tốc độ ----
let eng=null;
function engStart(){if(!AC||muted||eng)return;const o1=AC.createOscillator(),o2=AC.createOscillator(),f=AC.createBiquadFilter(),g=AC.createGain();o1.type='sawtooth';o2.type='square';f.type='lowpass';f.frequency.value=600;g.gain.value=0.0001;
o1.connect(f);o2.connect(f);f.connect(g);g.connect(AC.destination);o1.start();o2.start();g.gain.exponentialRampToValueAtTime(0.03,AC.currentTime+0.4);eng={o1,o2,f,g}}
function engSet(s,n){if(!eng)return;const t=AC.currentTime,fr=45+s*1.9+(n?30:0);eng.o1.frequency.setTargetAtTime(fr,t,0.08);eng.o2.frequency.setTargetAtTime(fr*0.501,t,0.08);eng.f.frequency.setTargetAtTime(400+s*14+(n?900:0),t,0.1)}
function engStop(){if(!eng)return;const e=eng;eng=null;try{e.g.gain.setTargetAtTime(0.0001,AC.currentTime,0.1);setTimeout(()=>{e.o1.stop();e.o2.stop()},400)}catch(er){}}
// ---- Nhạc nền: trống + bass + giai điệu, mỗi chặng một bài ----
const SONGS=[[[57,60,64],[53,57,60],[55,59,62],[52,55,59]],[[50,53,57],[46,50,53],[48,52,55],[45,48,52]],[[60,64,67],[57,60,64],[53,57,60],[55,59,62]],[[52,55,59],[48,52,55],[50,53,57],[47,50,54]],
[[49,52,56],[45,49,52],[47,51,54],[44,47,51]],[[45,48,52],[44,48,51],[43,46,50],[41,45,48]],[[55,59,62],[52,55,59],[48,52,55],[50,54,57]],[[54,57,61],[50,54,57],[52,56,59],[49,52,56]]];
let nextNote=0,step16=0;
function note(f,t,d,type,vol){const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+0.01);g.gain.exponentialRampToValueAtTime(0.0001,t+d);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+d+0.02)}
function kick(t){const o=AC.createOscillator(),g=AC.createGain();o.frequency.setValueAtTime(140,t);o.frequency.exponentialRampToValueAtTime(45,t+0.15);g.gain.setValueAtTime(0.16,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.18);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+0.2)}
setInterval(()=>{if(!AC||muted||!running||paused){nextNote=0;return}const song=SONGS[(zone-1)%SONGS.length],spb=60/(118+Math.min(zone-1,8)*3)/4,ev=!!event;
if(nextNote<AC.currentTime)nextNote=AC.currentTime+0.05;
while(nextNote<AC.currentTime+0.2){const i=step16%16,ch=song[Math.floor(step16/16)%4],t=nextNote;
if(i%4===0)kick(t);if(i%4===2)noise(t,0.04,0.05,7000);if(i===4||i===12)noise(t,0.12,0.09,1500);
if(i%2===0)note(mtof(ch[0]-24+(i%8===6?12:0)),t,spb*1.8,'sawtooth',0.035);
if(i%4===1||i%8===6)note(mtof(ch[(i>>1)%3]+12),t,spb*1.5,'square',0.014);
if(ev&&i%2===1)note(mtof(ch[2]+24),t,spb*0.8,'square',0.01);
step16++;nextNote+=spb}},50);

if(typeof THREE==='undefined'){msg.textContent='Không tải được đồ hoạ 3D, hãy mở lại khi có mạng';stB.style.display='none';throw new Error('THREE missing')}

// ================= KHUNG CẢNH =================
const R=new THREE.WebGLRenderer({antialias:true});R.setPixelRatio(Math.min(devicePixelRatio,2));wrap.prepend(R.domElement);
const S=new THREE.Scene(),cam=new THREE.PerspectiveCamera(55,1,0.5,500);
function fit(){const w=wrap.clientWidth||340,h=wrap.clientHeight||w*1.4;R.setSize(w,h);cam.aspect=w/h;cam.updateProjectionMatrix()}
fit();window.addEventListener('resize',fit);
function canvasTex(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);return new THREE.CanvasTexture(c)}
const radT=canvasTex(128,128,(g)=>{const gr=g.createRadialGradient(64,64,0,64,64,64);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(0.4,'rgba(255,255,255,.35)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,128,128)});
const gsC={};function glowSp(c,s,op){const k=c+'_'+(op||0.7);const m=gsC[k]||(gsC[k]=new THREE.SpriteMaterial({map:radT,color:c,transparent:true,opacity:op||0.7,blending:THREE.AdditiveBlending,depthWrite:false}));const sp=new THREE.Sprite(m);sp.scale.set(s,s,1);return sp}
function skyTex(a,b){return canvasTex(2,256,g=>{const gr=g.createLinearGradient(0,0,0,256);gr.addColorStop(0,a);gr.addColorStop(1,b);g.fillStyle=gr;g.fillRect(0,0,2,256)})}
function noiseTex(size,base,amp,draw){const t=canvasTex(size,size,g=>{g.fillStyle=base;g.fillRect(0,0,size,size);const d=g.getImageData(0,0,size,size);for(let i=0;i<d.data.length;i+=4){const n=(Math.random()-0.5)*amp;d.data[i]+=n;d.data[i+1]+=n;d.data[i+2]+=n}g.putImageData(d,0,0);if(draw)draw(g,size)});t.wrapS=t.wrapT=THREE.RepeatWrapping;return t}
const rp=(a,b)=>a+Math.random()*(b-a),rnd=n=>Math.floor(Math.random()*n);
const matC={};const mat=(c,o)=>{const k=c+JSON.stringify(o||'');return matC[k]||(matC[k]=new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:0.5},o||{})))};
const addC={};const addM=c=>addC[c]||(addC[c]=new THREE.MeshBasicMaterial({color:c,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));
const cyl=(r1,r2,h,c,o)=>new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,8),mat(c,o));
const cone=(r,h,c,seg,o)=>new THREE.Mesh(new THREE.ConeGeometry(r,h,seg||8),mat(c,o));
const ball=(r,c,o)=>new THREE.Mesh(new THREE.SphereGeometry(r,14,10),mat(c,o));


// ================= KẾT XUẤT ĐIỆN ẢNH: tone mapping, bóng đổ, phản chiếu môi trường =================
R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=1;R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;
const pmrem=new THREE.PMREMGenerator(R);let envRT=null;
function buildEnv(Z){const es=new THREE.Scene(),c=document.createElement('canvas');c.width=4;c.height=256;const g=c.getContext('2d'),gr=g.createLinearGradient(0,0,0,256);
gr.addColorStop(0,Z.sky[0]);gr.addColorStop(0.48,Z.sky[1]);gr.addColorStop(0.52,'#'+new THREE.Color(Z.fog).getHexString());gr.addColorStop(1,Z.night?'#050508':'#3a3a3a');g.fillStyle=gr;g.fillRect(0,0,4,256);
const t=new THREE.CanvasTexture(c);es.add(new THREE.Mesh(new THREE.SphereGeometry(50,32,16),new THREE.MeshBasicMaterial({map:t,side:THREE.BackSide,color:new THREE.Color(0.42,0.42,0.42)})));
const sunM=new THREE.MeshBasicMaterial({color:new THREE.Color(Z.sun).multiplyScalar(Z.night?3:14)}),s=new THREE.Mesh(new THREE.SphereGeometry(Z.night?2:4,16,8),sunM);s.position.set(-20,28,-30);es.add(s);
if(Z.night){for(let i=0;i<26;i++){const l=new THREE.Mesh(new THREE.SphereGeometry(rp(0.6,1.6),8,6),new THREE.MeshBasicMaterial({color:new THREE.Color([0xFF4FD8,0x36F0FF,0xFFE9A0,0xFF7A1A][i%4]).multiplyScalar(5)}));const a=rp(0,6.28);l.position.set(Math.cos(a)*45,rp(-2,10),Math.sin(a)*45);es.add(l)}}
else{for(let i=0;i<8;i++){const l=new THREE.Mesh(new THREE.SphereGeometry(rp(5,9),8,6),new THREE.MeshBasicMaterial({color:new THREE.Color(0xffffff).multiplyScalar(0.9)}));const a=rp(0,6.28);l.position.set(Math.cos(a)*44,rp(12,24),Math.sin(a)*44);l.scale.y=0.4;es.add(l)}}
if(envRT)envRT.dispose();envRT=pmrem.fromScene(es,0.015);S.environment=envRT.texture;t.dispose()}
// ================= HẠT KHÓI / LỬA / TIA LỬA (sprite mềm) =================
const smokeT=canvasTex(128,128,g=>{for(let i=0;i<14;i++){const x=64+rp(-24,24),y=64+rp(-24,24),r=rp(20,40),gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,'rgba(255,255,255,.35)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,128,128)}});
const flameT=canvasTex(64,128,g=>{const gr=g.createRadialGradient(32,96,2,32,80,70);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(0.25,'rgba(255,255,255,.8)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.beginPath();g.moveTo(32,0);g.quadraticCurveTo(64,90,32,128);g.quadraticCurveTo(0,90,32,0);g.fill()});
const sparkT=canvasTex(16,64,g=>{const gr=g.createLinearGradient(0,0,0,64);gr.addColorStop(0,'rgba(255,255,255,0)');gr.addColorStop(0.7,'rgba(255,255,255,1)');gr.addColorStop(1,'rgba(255,255,255,.2)');g.fillStyle=gr;g.fillRect(5,0,6,64)});
const SPP=[],SPA=[];for(let i=0;i<260;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:smokeT,transparent:true,depthWrite:false}));s.visible=false;S.add(s);SPP.push(s)}
function puff(x,y,z,vx,vy,vz,s0,s1,life,col,op,add,tex,drag){const s=SPP.pop();if(!s)return;const m=s.material;m.map=tex||smokeT;m.color.setHex(col);m.blending=add?THREE.AdditiveBlending:THREE.NormalBlending;m.opacity=op;m.rotation=rp(0,6.28);m.needsUpdate=true;
s.position.set(x,y,z);s.scale.set(s0,s0,1);s.visible=true;SPA.push({s,vx,vy,vz,s0,s1,life,max:life,op,rot:rp(-1.5,1.5),drag:drag===undefined?1.5:drag,str:tex===sparkT})}
function updPuffs(dt){for(let i=SPA.length-1;i>=0;i--){const p=SPA[i];p.life-=dt;if(p.life<=0){p.s.visible=false;SPP.push(p.s);SPA.splice(i,1);continue}const q=1-p.life/p.max,k=Math.max(0,1-p.drag*dt);p.vx*=k;p.vz*=k;p.vy*=k;
p.s.position.x+=p.vx*dt;p.s.position.y+=p.vy*dt;p.s.position.z+=p.vz*dt;const sc=p.s0+(p.s1-p.s0)*q;if(p.str)p.s.scale.set(sc*0.25,sc,1);else{p.s.scale.set(sc,sc,1);p.s.material.rotation+=p.rot*dt}p.s.material.opacity=p.op*Math.pow(1-q,1.4)}}
function smoke(x,y,z,n,col,sz){for(let i=0;i<n;i++)puff(x+rp(-0.4,0.4),y,z+rp(-0.4,0.4),rp(-1.5,1.5),rp(0.8,2.5),rp(1,4),sz||1.2,(sz||1.2)*3.2,rp(0.8,1.4),col||0xBBBBBB,0.55)}
function sparks(x,y,z,n,col){for(let i=0;i<n;i++){const a=rp(0,6.28),v=rp(6,14);puff(x,y,z,Math.cos(a)*v,rp(2,8),Math.sin(a)*v,rp(0.8,1.4),0.3,rp(0.25,0.5),col||0xFFC060,1,true,sparkT,0.5)}}
function fireball(x,y,z,n){for(let i=0;i<n;i++)puff(x+rp(-1,1),y+rp(0,1),z+rp(-1,1),rp(-4,4),rp(2,7),rp(-4,4),rp(1.5,2.5),rp(4,7),rp(0.5,0.9),[0xFF7A1A,0xFFD23F,0xFF3A1A][i%3],0.95,true);smoke(x,y+1,z,Math.ceil(n/2),0x333333,2)}
// ================= MÂY & LÓA SÁNG MẶT TRỜI =================
const cloudT=canvasTex(256,128,g=>{for(let i=0;i<26;i++){const x=rp(40,216),y=rp(50,90)-Math.abs(x-128)*0.15,r=rp(22,44),gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,'rgba(255,255,255,.55)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,256,128)}});
const clouds=[];for(let i=0;i<9;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:cloudT,transparent:true,opacity:0.9,depthWrite:false,fog:false}));s.scale.set(rp(90,160),rp(40,60),1);S.add(s);clouds.push({s,ox:rp(-260,260),oz:rp(-480,-300),y:rp(70,120),v:rp(1,3)})}
const flareE=document.createElement('div');flareE.id='flare';const FL=[[0,170,'rgba(255,240,200,.35)'],[0.35,40,'rgba(255,200,120,.25)'],[0.6,22,'rgba(160,220,255,.3)'],[0.85,70,'rgba(255,160,220,.14)'],[1.2,34,'rgba(160,255,200,.2)'],[1.5,110,'rgba(255,220,160,.1)']];
FL.forEach(()=>{const d=document.createElement('i');flareE.appendChild(d)});
function updFlare(on,sx,sy){flareE.style.opacity=on;if(on<=0.01)return;const cx=50,cy=45;[...flareE.children].forEach((d,i)=>{const[t,s,c]=FL[i];d.style.left=(sx+(cx-sx)*t)+'%';d.style.top=(sy+(cy-sy)*t)+'%';d.style.width=d.style.height=s+'px';d.style.background='radial-gradient(circle,'+c+' 0,'+c.replace(/[\d.]+\)$/,'0)')+' 70%)'})}
// ================= ĐỒNG HỒ TỐC ĐỘ & BANNER =================
function gaugeHTML(){return'<svg viewBox="0 0 120 120"><defs><linearGradient id="gg" x1="0" x2="1"><stop offset="0" stop-color="#2ACB9A"/><stop offset=".55" stop-color="#FFD23F"/><stop offset="1" stop-color="#FF3344"/></linearGradient></defs>'+
'<path d="M20 95 A48 48 0 1 1 100 95" fill="none" stroke="rgba(255,255,255,.14)" stroke-width="9" stroke-linecap="round"/><path id="gfill" d="M20 95 A48 48 0 1 1 100 95" fill="none" stroke="url(#gg)" stroke-width="9" stroke-linecap="round" stroke-dasharray="226" stroke-dashoffset="226"/>'+
[...Array(11)].map((_,i)=>{const a=(-225+i*27)*Math.PI/180;return'<line x1="'+(60+Math.cos(a)*36)+'" y1="'+(60+Math.sin(a)*36)+'" x2="'+(60+Math.cos(a)*41)+'" y2="'+(60+Math.sin(a)*41)+'" stroke="rgba(255,255,255,.5)" stroke-width="2"/>'}).join('')+
'<line id="gnd" x1="60" y1="60" x2="60" y2="22" stroke="#FF5A3A" stroke-width="3" stroke-linecap="round"/><circle cx="60" cy="60" r="5" fill="#FF5A3A"/></svg><b id="gkm">0</b><small>KM/H</small><i id="gdist">0 m</i>'}
function setGauge(kmh,d){const f=Math.min(1,kmh/420);const gf=document.getElementById('gfill');if(!gf)return;gf.setAttribute('stroke-dashoffset',(226*(1-f)).toFixed(1));document.getElementById('gnd').setAttribute('transform','rotate('+(-135+f*270)+' 60 60)');document.getElementById('gkm').textContent=kmh;document.getElementById('gdist').textContent=Math.round(d)+' m'}
const rbx=document.createElement('div');rbx.id='rbx';
function banner(t,sub,col){const d=document.createElement('div');d.className='rb';d.style.setProperty('--c',col||'#FF6A1A');d.innerHTML='<b>'+t+'</b>'+(sub?'<span>'+sub+'</span>':'');rbx.prepend(d);while(rbx.children.length>3)rbx.lastChild.remove();setTimeout(()=>d.classList.add('out'),1300);setTimeout(()=>d.remove(),1700)}
const splE=document.createElement('div');splE.id='spl';
wrap.appendChild(splE);wrap.appendChild(flareE);wrap.appendChild(rbx);


// ================= UỐN CONG THẾ GIỚI (đường cong + đồi dốc, chỉ hình ảnh) =================
const BEND={value:new THREE.Vector2(0,0)};
THREE.Material.prototype.onBeforeCompile=function(sh){if(this.isShaderMaterial||this.isMeshDepthMaterial||this.isMeshDistanceMaterial)return;sh.uniforms.uBend=BEND;
 const b='mvPosition.x+=uBend.x*mvPosition.z*mvPosition.z;mvPosition.y+=uBend.y*mvPosition.z*mvPosition.z;';
 if(this.isSpriteMaterial)sh.vertexShader='uniform vec2 uBend;\n'+sh.vertexShader.replace('gl_Position = projectionMatrix * mvPosition;',b+'gl_Position = projectionMatrix * mvPosition;');
 else sh.vertexShader='uniform vec2 uBend;\n'+sh.vertexShader.replace('#include <project_vertex>','#include <project_vertex>\n'+b+'gl_Position = projectionMatrix * mvPosition;')};
function scrB(x,y,z){const v=new THREE.Vector3(x,y,z).applyMatrix4(cam.matrixWorldInverse);v.x+=BEND.value.x*v.z*v.z;v.y+=BEND.value.y*v.z*v.z;const vis=v.z<0;v.applyMatrix4(cam.projectionMatrix);return[(v.x+1)*50,(1-v.y)*50,vis]}
// ================= HẬU KỲ: BLOOM, LÀM MỜ TỐC ĐỘ, TÁCH MÀU, VIỀN TỐI =================
const W2=R.capabilities.isWebGL2,hf=W2&&(R.extensions.get('EXT_color_buffer_float')||R.extensions.get('EXT_color_buffer_half_float'));
let POST=!!(W2&&hf);const pq={bloom:1,ca:0,blur:0,vig:1};
const fsCam=new THREE.OrthographicCamera(-1,1,1,-1,0,1),fsGeo=new THREE.PlaneGeometry(2,2),fsScene=new THREE.Scene(),fsMesh=new THREE.Mesh(fsGeo);fsMesh.frustumCulled=false;fsScene.add(fsMesh);
const VS='varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}';
const brightM=new THREE.ShaderMaterial({uniforms:{t:{value:null},th:{value:1.25}},vertexShader:VS,fragmentShader:'uniform sampler2D t;uniform float th;varying vec2 vUv;void main(){vec3 c=texture2D(t,vUv).rgb;float l=max(c.r,max(c.g,c.b));gl_FragColor=vec4(c*smoothstep(th,th+0.6,l),1.);}',depthTest:false,depthWrite:false});
const blurM=new THREE.ShaderMaterial({uniforms:{t:{value:null},d:{value:new THREE.Vector2()}},vertexShader:VS,fragmentShader:'uniform sampler2D t;uniform vec2 d;varying vec2 vUv;void main(){vec3 c=texture2D(t,vUv).rgb*0.227;c+=(texture2D(t,vUv+d*1.385).rgb+texture2D(t,vUv-d*1.385).rgb)*0.316;c+=(texture2D(t,vUv+d*3.231).rgb+texture2D(t,vUv-d*3.231).rgb)*0.07;gl_FragColor=vec4(c,1.);}',depthTest:false,depthWrite:false});
const compM=new THREE.ShaderMaterial({uniforms:{t:{value:null},b1:{value:null},b2:{value:null},ex:{value:1},bs:{value:0.9},blur:{value:0},ca:{value:0},vig:{value:1},sat:{value:1.12}},vertexShader:VS,
fragmentShader:`uniform sampler2D t,b1,b2;uniform float ex,bs,blur,ca,vig,sat;varying vec2 vUv;
vec3 rrt(vec3 v){vec3 a=v*(v+0.0245786)-0.000090537;vec3 b=v*(0.983729*v+0.4329510)+0.238081;return a/b;}
vec3 aces(vec3 c){c/=0.6;c=mat3(0.59719,0.07600,0.02840,0.35458,0.90834,0.13383,0.04823,0.01566,0.83777)*c;c=rrt(c);c=mat3(1.60475,-0.10208,-0.00327,-0.53108,1.10813,-0.07276,-0.07367,-0.00605,1.07602)*c;return clamp(c,0.,1.);}
void main(){vec2 c=vec2(0.5,0.56),dv=vUv-c;float r=length(dv);vec3 col;
 if(blur>0.001){col=vec3(0.);float k=blur*smoothstep(0.3,0.8,r)*(1.-smoothstep(0.4,0.,length((vUv-vec2(0.5,0.25))*vec2(1.,1.6))));for(int i=0;i<6;i++){col+=texture2D(t,vUv-dv*k*float(i)*0.035).rgb;}col/=6.;}else col=texture2D(t,vUv).rgb;
 if(ca>0.001){vec2 o=dv*ca*0.02;col.r=mix(col.r,texture2D(t,vUv+o).r,0.85);col.b=mix(col.b,texture2D(t,vUv-o).b,0.85);}
 col+=(texture2D(b1,vUv).rgb*0.9+texture2D(b2,vUv).rgb*0.7)*bs;
 col=aces(col*ex);float g=dot(col,vec3(0.299,0.587,0.114));col=mix(vec3(g),col,sat);col=clamp((col-0.5)*1.06+0.5,0.,1.);
 col*=mix(1.,smoothstep(0.95,0.32,r),vig*0.55);gl_FragColor=vec4(col,1.);}`,depthTest:false,depthWrite:false});
let rtM=null,rtA=null,rtB=null,rtC=null,rtD=null,rtE=null;
function mkRT(w,h,ms){const o={type:THREE.HalfFloatType,minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter,depthBuffer:!!ms};const r=ms&&W2?new THREE.WebGLMultisampleRenderTarget(w,h,o):new THREE.WebGLRenderTarget(w,h,o);if(ms&&W2)r.samples=4;return r}
function postSize(){if(!POST)return;[rtM,rtA,rtB,rtC,rtD,rtE].forEach(r=>r&&r.dispose());const v=new THREE.Vector2();R.getDrawingBufferSize(v);const w=Math.max(2,v.x),h=Math.max(2,v.y);
rtM=mkRT(w,h,true);rtA=mkRT(w>>1,h>>1);rtB=mkRT(w>>2,h>>2);rtC=mkRT(w>>2,h>>2);rtD=mkRT(w>>3,h>>3);rtE=mkRT(w>>3,h>>3)}
function pass(m,src,dst){fsMesh.material=m;m.uniforms.t.value=src.texture||src;R.setRenderTarget(dst);R.render(fsScene,fsCam)}
function blur2(src,a,b){blurM.uniforms.d.value.set(1/a.width,0);pass(blurM,src,a);blurM.uniforms.d.value.set(0,1/a.height);pass(blurM,a,b)}
function renderFrame(sc,cm){sc=sc||S;cm=cm||cam;if(!POST){R.setRenderTarget(null);R.render(sc,cm);return}
R.setRenderTarget(rtM);R.render(sc,cm);pass(brightM,rtM,rtA);blur2(rtA,rtB,rtC);blur2(rtC,rtD,rtE);blur2(rtE,rtD,rtE);
const u=compM.uniforms;u.b1.value=rtC.texture;u.b2.value=rtE.texture;u.ex.value=pq.ex||R.toneMappingExposure;u.bs.value=pq.bloom;u.blur.value=pq.blur;u.ca.value=pq.ca;u.vig.value=pq.vig;pass(compM,rtM,null)}
if(POST){R.setPixelRatio(Math.min(devicePixelRatio,1.75));fit();postSize();window.addEventListener('resize',()=>setTimeout(postSize,50))}
// Tự hạ chất lượng nếu máy chậm
let perfAcc=0,perfN=0,perfChecked=0;function perfWatch(dt){if(!POST||!running||perfChecked>3)return;perfAcc+=dt;perfN++;if(perfAcc>2.5){const avg=perfAcc/perfN;perfAcc=0;perfN=0;perfChecked++;
 if(avg>0.034){if(R.getPixelRatio()>1.2){R.setPixelRatio(1.1);fit();postSize()}else{POST=false;[rtM,rtA,rtB,rtC,rtD,rtE].forEach(r=>r&&r.dispose())}}}}


// ================= ÁNH SÁNG & BẦU TRỜI =================
const hemi=new THREE.HemisphereLight(0xffffff,0x405030,0.85);S.add(hemi);
const sun=new THREE.DirectionalLight(0xffffff,0.9);sun.position.set(-20,40,10);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-26,right:26,top:34,bottom:-34,near:1,far:120});sun.shadow.bias=-0.0006;sun.shadow.normalBias=0.03;S.add(sun);S.add(sun.target);
const headL=new THREE.PointLight(0xFFF2C8,0,40,1.4);S.add(headL);
S.fog=new THREE.Fog(0x9FD8FF,60,260);
const sunSp=new THREE.Sprite(new THREE.SpriteMaterial({map:radT,color:0xFFF2C0,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,fog:false}));S.add(sunSp);
// ================= MẶT ĐƯỜNG =================
const ROADW=13,LANES=[-4.5,-1.5,1.5,4.5],XMAX=5.3,ROADL=420;
function roadTex(night,fut){return canvasTex(512,1024,(g,w,h)=>{g.fillStyle=fut?'#0a0f22':night?'#24252c':'#47494f';g.fillRect(0,0,w,h);const d=g.getImageData(0,0,w,h);for(let i=0;i<d.data.length;i+=4){const n=(Math.random()-0.5)*(fut?12:34)+(Math.random()<0.02?-30:0);d.data[i]+=n;d.data[i+1]+=n;d.data[i+2]+=n}g.putImageData(d,0,0);
 if(!fut){for(let k=0;k<4;k++)[-0.2,0.2].forEach(o=>{const x=(k+0.5+o)*w/4,gr=g.createLinearGradient(x-16,0,x+16,0);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(0.5,'rgba(0,0,0,.22)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(x-16,0,32,h)});
  for(let i=0;i<5;i++){g.fillStyle='rgba(20,20,24,'+rp(0.15,0.3)+')';g.fillRect(rp(30,w-120),rp(0,h-150),rp(40,110),rp(60,150))}
  g.strokeStyle='rgba(15,15,18,.6)';g.lineWidth=1.5;for(let i=0;i<10;i++){let x=rp(20,w-20),y=rp(0,h);g.beginPath();g.moveTo(x,y);for(let j=0;j<6;j++){x+=rp(-14,14);y+=rp(6,22);g.lineTo(x,y)}g.stroke()}}
 const lc=fut?'#36F0FF':'#F4F4F0',ec=fut?'#FF4FD8':'#F4F4F0';g.fillStyle=ec;g.fillRect(14,0,10,h);g.fillRect(w-24,0,10,h);g.fillStyle=lc;[1,2,3].forEach(k=>{const x=k*w/4-5;g.fillRect(x,0,10,h*0.45)});
 g.globalAlpha=0.18;g.fillStyle='#000';for(let i=0;i<80;i++)g.fillRect(rp(0,w),rp(0,h),rp(2,6),rp(2,6));g.globalAlpha=1;
 if(fut){g.globalAlpha=0.25;g.fillStyle='#36F0FF';for(let y=0;y<h;y+=128)g.fillRect(0,y,w,3);g.globalAlpha=1}})}
const catT=canvasTex(512,1024,(g,w,h)=>{g.fillStyle='#000';g.fillRect(0,0,w,h);[1,2,3].forEach(k=>{const x=k*w/4;[0.5,0.97].forEach(y=>{g.fillStyle='#fff';g.beginPath();g.arc(x,y*h,7,0,7);g.fill()})});g.fillStyle='#FF3A1A';[19,w-19].forEach(x=>{g.beginPath();g.arc(x,h*0.25,6,0,7);g.fill()})});catT.wrapS=catT.wrapT=THREE.RepeatWrapping;catT.repeat.set(1,ROADL/12);
const roadTs=[roadTex(false),roadTex(true),roadTex(true,true)];roadTs.forEach(t=>{t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(1,ROADL/12);t.anisotropy=4});
const roadM=new THREE.MeshStandardMaterial({map:roadTs[0],roughness:0.78,metalness:0.05,emissiveMap:catT,emissive:0x000000});const road=new THREE.Mesh(new THREE.PlaneGeometry(ROADW+1.2,ROADL,1,140),roadM);road.rotation.x=-Math.PI/2;road.receiveShadow=true;S.add(road);
const curbT=canvasTex(64,16,(g,w,h)=>{g.fillStyle='#E53935';g.fillRect(0,0,w/2,h);g.fillStyle='#F4F4F0';g.fillRect(w/2,0,w/2,h)});curbT.wrapS=THREE.RepeatWrapping;curbT.repeat.set(ROADL/3,1);
const curbs=[-1,1].map(s=>{const m=new THREE.Mesh(new THREE.BoxGeometry(0.7,0.14,ROADL,1,1,140),[mat(0xC8C8C8),mat(0xC8C8C8),new THREE.MeshStandardMaterial({map:curbT,roughness:0.6}),mat(0xC8C8C8),mat(0xC8C8C8),mat(0xC8C8C8)]);m.position.set(s*(ROADW/2+0.25),0.07,0);m.receiveShadow=true;S.add(m);return m});
const groundM=new THREE.MeshStandardMaterial({roughness:1});const ground=new THREE.Mesh(new THREE.PlaneGeometry(600,ROADL,12,140),groundM);ground.rotation.x=-Math.PI/2;ground.position.y=-0.05;ground.receiveShadow=true;S.add(ground);
// Lan can 2 bên
const railT=canvasTex(64,32,(g,w,h)=>{g.fillStyle='#C8CCD4';g.fillRect(0,0,w,h);g.fillStyle='#8A9098';g.fillRect(0,12,w,8);g.fillStyle='#5A6068';g.fillRect(0,0,6,h)});railT.wrapS=THREE.RepeatWrapping;railT.repeat.set(ROADL/4,1);
const railM=new THREE.MeshStandardMaterial({map:railT,color:0x9AA0AA,metalness:0.5,roughness:0.5});const rails=[-1,1].map(s=>{const r=new THREE.Mesh(new THREE.BoxGeometry(0.25,0.8,ROADL,1,1,140),railM);r.position.set(s*(ROADW/2+0.7),0.4,0);S.add(r);return r});
// Mặt biển (chặng biển)
const seaT=canvasTex(128,128,(g,w,h)=>{g.fillStyle='#1E90C8';g.fillRect(0,0,w,h);g.strokeStyle='rgba(255,255,255,.35)';g.lineWidth=2;for(let i=0;i<30;i++){const x=Math.random()*w,y=Math.random()*h;g.beginPath();g.arc(x,y,rp(4,10),Math.PI*1.1,Math.PI*1.9);g.stroke()}});seaT.wrapS=seaT.wrapT=THREE.RepeatWrapping;seaT.repeat.set(20,40);
const sea=new THREE.Mesh(new THREE.PlaneGeometry(300,ROADL,6,140),new THREE.MeshStandardMaterial({map:seaT,roughness:0.2,metalness:0.3,transparent:true,opacity:0.95}));sea.rotation.x=-Math.PI/2;sea.position.y=0.02;sea.visible=false;S.add(sea);
// Núi xa (dải bóng)
const mtnT=canvasTex(512,128,(g,w,h)=>{g.fillStyle='#fff';g.beginPath();g.moveTo(0,h);let y=h*0.6;for(let x=0;x<=w;x+=8){y=Math.max(h*0.1,Math.min(h*0.9,y+rp(-14,14)));g.lineTo(x,y)}g.lineTo(w,h);g.fill()});
const mtnM=new THREE.MeshBasicMaterial({map:mtnT,transparent:true,color:0x6A8AA8,fog:false,depthWrite:false});const mtn=new THREE.Mesh(new THREE.PlaneGeometry(900,110),mtnM);S.add(mtn);
// ================= 8 CHẶNG =================
const ZONES=[
{n:'🏙️ Thành phố',sky:['#4FA8E8','#CFEFFF'],fog:0xBFE4FF,gr:'#5E8E3E',sun:0xFFF2C0,hemi:0.85,road:0,deco:['bld','bld','tree','tree','sign'],mt:0x7A9AB8},
{n:'🏜️ Hẻm núi Sa mạc',sky:['#F2A65A','#FFE2B0'],fog:0xF6D2A0,gr:'#D8A868',sun:0xFFD890,hemi:0.9,road:0,deco:['mesa','cactus','cactus','rock'],mt:0xC0703A},
{n:'🌴 Đường biển Nhiệt đới',sky:['#2EC4F0','#D8FAFF'],fog:0xC8F4FF,gr:'#F0DCA0',sun:0xFFFFE0,hemi:0.95,road:0,deco:['palm','palm','hut','rock'],sea:1,mt:0x5AA0A8},
{n:'🏔️ Núi tuyết',sky:['#8AB0D8','#EEF6FF'],fog:0xE8F2FF,gr:'#F4F8FF',sun:0xFFFFFF,hemi:0.95,road:0,deco:['pine','pine','pine','cabin','srock'],snow:1,mt:0xC8D8E8},
{n:'🌃 Phố đêm Neon',sky:['#0A0420','#2A0A40'],fog:0x1A0A30,gr:'#1A1A24',sun:0x8A7AFF,hemi:0.35,road:1,night:1,deco:['neon','neon','neon','lampx'],rain:1,mt:0x2A1A4A},
{n:'🌋 Núi lửa',sky:['#2A0804','#8A2A0A'],fog:0x4A1A0A,gr:'#2A1A16',sun:0xFF7A3A,hemi:0.5,road:1,night:1,deco:['vrock','vrock','lava','vrock'],ember:1,mt:0x3A100A},
{n:'🍂 Rừng mùa thu',sky:['#F0B070','#FFE8C8'],fog:0xF8DCB8,gr:'#A8A040',sun:0xFFD8A0,hemi:0.9,road:0,deco:['atree','atree','atree','fence','hay'],leaf:1,mt:0xA8683A},
{n:'🚀 Xa lộ Tương lai',sky:['#02030F','#101A48'],fog:0x0A1030,gr:'#060818',sun:0x6FD8FF,hemi:0.45,road:2,night:1,deco:['pylon','holo','pylon','orb'],stars:1,mt:0x1A2A6A}];
const groundTs={};function groundTex(c,z){if(groundTs[c])return groundTs[c];const t=noiseTex(128,c,22,(g,s)=>{if(z.n.includes('Tương lai')){g.strokeStyle='rgba(54,240,255,.5)';g.lineWidth=2;for(let i=0;i<=s;i+=32){g.beginPath();g.moveTo(i,0);g.lineTo(i,s);g.stroke();g.beginPath();g.moveTo(0,i);g.lineTo(s,i);g.stroke()}}});t.repeat.set(60,40);return groundTs[c]=t}
// ================= CẢNH VẬT 2 BÊN ĐƯỜNG =================
const adTs=['SIÊU TỐC','NITRO','TURBO 3D','ĐUA XE'].map((t,i)=>canvasTex(256,110,(g,w,h)=>{const cs=[['#FF3A1A','#FFD23F'],['#1E6AFF','#36F0FF'],['#7A3CFF','#FF4FD8'],['#111','#FF6A1A']][i];const gr=g.createLinearGradient(0,0,w,h);gr.addColorStop(0,cs[0]);gr.addColorStop(1,cs[1]);g.fillStyle=gr;g.fillRect(0,0,w,h);g.fillStyle='#fff';g.font='italic 900 44px sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(t,w/2,h/2+3);g.strokeStyle='#fff';g.lineWidth=5;g.strokeRect(4,4,w-8,h-8)}));
const winT=canvasTex(64,128,(g,w,h)=>{g.fillStyle='#8A9AAA';g.fillRect(0,0,w,h);for(let y=6;y<h;y+=14)for(let x=5;x<w;x+=14){g.fillStyle=Math.random()<0.5?'#BFE4FF':'#5A7088';g.fillRect(x,y,9,9)}});
const winNT=canvasTex(64,128,(g,w,h)=>{g.fillStyle='#14121E';g.fillRect(0,0,w,h);for(let y=6;y<h;y+=14)for(let x=5;x<w;x+=14){g.fillStyle=Math.random()<0.45?['#FFE9A0','#FF4FD8','#36F0FF'][rnd(3)]:'#1E1A2E';g.fillRect(x,y,9,9)}});
const FAC=[0,1,2,3].map(k=>canvasTex(128,256,(g,w,h)=>{const base=['#7FA8C8','#D8CBB0','#9A5A44','#E8ECF0'][k];g.fillStyle=base;g.fillRect(0,0,w,h);
 if(k===0){for(let y=0;y<h;y+=16)for(let x=0;x<w;x+=16){const l=rp(0.25,0.7);g.fillStyle='rgba('+[60,120,170].map(v=>Math.round(v+l*80)).join(',')+',1)';g.fillRect(x+1,y+1,14,14)}g.fillStyle='rgba(30,40,55,.9)';for(let x=0;x<w;x+=16)g.fillRect(x,0,1.5,h)}
 else if(k===3){for(let y=10;y<h-30;y+=18){g.fillStyle='rgba(40,60,80,.85)';g.fillRect(0,y,w,10)}}
 else{for(let y=8;y<h-36;y+=20)for(let x=8;x<w-8;x+=20){g.fillStyle='rgba(0,0,0,.35)';g.fillRect(x-1,y-1,13,15);g.fillStyle=Math.random()<0.15?'#FFE9A8':['#5A7894','#6E8AA4','#48627A'][rnd(3)];g.fillRect(x,y,11,13)}}
 g.fillStyle=['#C62828','#1565C0','#2E7D32','#F9A825'][rnd(4)];g.fillRect(0,h-34,w,8);g.fillStyle='rgba(20,30,40,.9)';g.fillRect(4,h-24,w-8,24);g.fillStyle='rgba(255,240,200,.7)';g.fillRect(8,h-20,w*0.4,14)}));
const leafG=[0,1,2].map(k=>{const g=new THREE.IcosahedronGeometry(1,1),p=g.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),s=1+Math.sin(x*5+k)*0.12+Math.cos(z*4+y*3+k)*0.12;p.setXYZ(i,x*s,y*s*0.85,z*s)}g.computeVertexNormals();return g});
const SPAN=360,decor=[];
function decoItem(t){const g=new THREE.Group();let m;
if(t==='bld'){const h=rp(10,36),w=rp(7,13),k=rnd(4),glass=k===0,m=new THREE.MeshStandardMaterial({map:FAC[k],roughness:glass?0.12:0.75,metalness:glass?0.75:0.05,envMapIntensity:glass?1.4:0.8}),b=new THREE.Mesh(new THREE.BoxGeometry(w,h,w),m);
 FAC[k].wrapS=FAC[k].wrapT=THREE.RepeatWrapping;b.geometry.attributes.uv.array.forEach((v,i,a)=>{});b.position.y=h/2;b.castShadow=true;b.receiveShadow=true;g.add(b);
 const r=new THREE.Mesh(new THREE.BoxGeometry(w*1.02,0.5,w*1.02),mat(0x5A5E66));r.position.y=h+0.25;g.add(r);if(Math.random()<0.6){const tk=cyl(0.9,0.9,1.6,0x8A8A8A);tk.position.set(rp(-w/4,w/4),h+1.3,rp(-w/4,w/4));g.add(tk)}
 if(Math.random()<0.5){const an=cyl(0.05,0.05,4,0xaaaaaa);an.position.set(w/4,h+2.5,w/4);g.add(an);const bl=glowSp(0xFF2A2A,1.2,0.9);bl.position.set(w/4,h+4.6,w/4);g.add(bl);g.blink=bl}
 if(Math.random()<0.35){const bb=new THREE.Mesh(new THREE.BoxGeometry(w*0.8,w*0.35,0.2),new THREE.MeshStandardMaterial({map:adTs[rnd(adTs.length)],emissive:0xffffff,emissiveMap:adTs[0],emissiveIntensity:0.15}));bb.material.emissiveMap=bb.material.map;bb.position.set(0,h*0.7,w/2+0.15);g.add(bb)}}
else if(t==='tree'){const tr=cyl(0.22,0.35,2.6,0x5A3A20);tr.position.y=1.3;tr.castShadow=true;g.add(tr);const cm=mat([0x3E8E41,0x4CAF50,0x2E7D32,0x558B2F][rnd(4)],{flatShading:true,roughness:0.9});
 for(let i=0;i<3;i++){const c2=new THREE.Mesh(leafG[rnd(3)],cm);c2.scale.setScalar(rp(1.1,1.7));c2.position.set(rp(-0.7,0.7),3.2+i*0.7,rp(-0.7,0.7));c2.castShadow=true;g.add(c2)}
 for(let i=0;i<3;i++){const bu=new THREE.Mesh(leafG[rnd(3)],cm);bu.scale.setScalar(rp(0.5,0.8));bu.position.set(rp(-2.5,2.5),0.4,rp(-2,2));g.add(bu)}}
else if(t==='sign'){const p=cyl(0.15,0.15,6,0x8A9098);p.position.y=3;g.add(p);const b=new THREE.Mesh(new THREE.BoxGeometry(5,2.5,0.3),mat([0x2E7D32,0x1565C0][rnd(2)]));b.position.y=6.5;g.add(b)}
else if(t==='mesa'){const h=rp(6,18),r=rp(5,12);for(let i=0;i<3;i++){const c=new THREE.Mesh(new THREE.CylinderGeometry(r*(1-i*0.12),r*(1-i*0.1),h/3,7),mat([0xC0602A,0xD8783A,0xA8502A][i],{flatShading:true}));c.position.y=h/6+i*h/3;g.add(c)}}
else if(t==='cactus'){const m2=mat(0x3E8E41,{flatShading:true}),c=cyl(0.35,0.4,3.5,0x3E8E41);c.position.y=1.75;g.add(c);[-1,1].forEach(s=>{const a=cyl(0.22,0.22,1.4,0x3E8E41);a.position.set(s*0.7,2.2+s*0.3,0);g.add(a);const j=cyl(0.22,0.22,0.6,0x3E8E41);j.rotation.z=Math.PI/2;j.position.set(s*0.4,1.6+s*0.3,0);g.add(j)})}
else if(t==='rock'||t==='srock'||t==='vrock'){const c=new THREE.Mesh(new THREE.DodecahedronGeometry(rp(1,3),0),mat(t==='vrock'?0x2A1A16:t==='srock'?0xE8F0F8:0x9A8070,{flatShading:true}));c.position.y=0.6;c.rotation.set(rp(0,3),rp(0,3),0);g.add(c);if(t==='vrock'){const gl=glowSp(0xFF5A1A,5,0.35);gl.position.y=0.5;g.add(gl)}}
else if(t==='palm'){let y=0,x=0;const n=6;for(let i=0;i<n;i++){const s=cyl(0.25,0.3,1.1,0x9A7A4A);s.position.set(x,y+0.55,0);s.rotation.z=-0.08*i;g.add(s);y+=1.05;x+=0.09*i}
 for(let i=0;i<7;i++){const l=new THREE.Mesh(new THREE.ConeGeometry(0.5,3.4,4),mat(0x3EA040,{flatShading:true}));l.scale.z=0.2;const a=i/7*6.28;l.position.set(x+Math.cos(a)*1.2,y-0.2,Math.sin(a)*1.2);l.rotation.set(Math.sin(a)*1.6,0,-Math.cos(a)*1.6);g.add(l)}}
else if(t==='hut'){const b=new THREE.Mesh(new THREE.BoxGeometry(3,2,3),mat(0xC8A070));b.position.y=1;g.add(b);const r=cone(2.8,1.8,0xD8B860,4);r.position.y=2.9;r.rotation.y=Math.PI/4;g.add(r)}
else if(t==='pine'){const tr=cyl(0.2,0.3,1.2,0x5A3A1A);tr.position.y=0.6;g.add(tr);for(let i=0;i<3;i++){const c=cone(1.8-i*0.45,2,i===2?0xF4F8FF:0x2E5A3A,7);c.position.y=1.8+i*1.2;g.add(c);const s=cone(1.2-i*0.3,0.6,0xF4F8FF,7);s.position.y=2.6+i*1.2;g.add(s)}}
else if(t==='cabin'){const b=new THREE.Mesh(new THREE.BoxGeometry(4,2.5,3.5),mat(0x7A4A2A));b.position.y=1.25;g.add(b);const r=new THREE.Mesh(new THREE.ConeGeometry(3.2,1.6,4),mat(0xF4F8FF));r.position.y=3.3;r.rotation.y=Math.PI/4;g.add(r);const w=new THREE.Mesh(new THREE.PlaneGeometry(0.9,0.9),new THREE.MeshBasicMaterial({color:0xFFD27A}));w.position.set(0,1.4,1.76);g.add(w)}
else if(t==='neon'){const h=rp(12,34),w=rp(6,11),b=new THREE.Mesh(new THREE.BoxGeometry(w,h,w),new THREE.MeshStandardMaterial({map:winNT,emissiveMap:winNT,emissive:0xffffff,emissiveIntensity:0.9,roughness:0.5}));b.position.y=h/2;g.add(b);
 const c=[0xFF4FD8,0x36F0FF,0xFFE14D,0x7CFF6B][rnd(4)],s=new THREE.Mesh(new THREE.BoxGeometry(w*0.8,1.6,0.3),new THREE.MeshBasicMaterial({color:c}));s.position.set(0,rp(5,h-3),w/2+0.2);g.add(s);const gl=glowSp(c,9,0.45);gl.position.copy(s.position);g.add(gl)}
else if(t==='lampx'){const p=cyl(0.12,0.12,7,0x2A2A34);p.position.y=3.5;g.add(p);const gl=glowSp(0xFF4FD8,4,0.7);gl.position.y=7;g.add(gl)}
else if(t==='lava'){const p=new THREE.Mesh(new THREE.PlaneGeometry(rp(6,12),rp(14,30)),new THREE.MeshBasicMaterial({color:0xFF5A10}));p.rotation.x=-Math.PI/2;p.position.y=0.05;g.add(p);const gl=glowSp(0xFF7A1A,14,0.5);gl.position.y=1;g.add(gl)}
else if(t==='atree'){const tr=cyl(0.25,0.35,2.6,0x5A3A1A);tr.position.y=1.3;g.add(tr);const c=new THREE.Mesh(new THREE.IcosahedronGeometry(2,1),mat([0xE8701A,0xD84315,0xFFB300,0xC62828][rnd(4)],{flatShading:true}));c.position.y=3.9;g.add(c)}
else if(t==='fence'){for(let i=0;i<5;i++){const p=new THREE.Mesh(new THREE.BoxGeometry(0.15,1.2,0.15),mat(0x8A5A2A));p.position.set(0,0.6,i*1.5-3);g.add(p)}const r=new THREE.Mesh(new THREE.BoxGeometry(0.1,0.15,6.2),mat(0x8A5A2A));r.position.y=0.9;g.add(r)}
else if(t==='hay'){const h=cyl(1,1,1.6,0xE8C050);h.rotation.z=Math.PI/2;h.position.y=1;g.add(h)}
else if(t==='pylon'){const p=new THREE.Mesh(new THREE.BoxGeometry(0.6,rp(10,20),0.6),new THREE.MeshStandardMaterial({color:0x1A2040,emissive:0x36F0FF,emissiveIntensity:0.25}));p.position.y=p.geometry.parameters.height/2;g.add(p);const gl=glowSp(0x36F0FF,5,0.7);gl.position.y=p.geometry.parameters.height;g.add(gl)}
else if(t==='holo'){const r=new THREE.Mesh(new THREE.TorusGeometry(4,0.15,8,36),new THREE.MeshBasicMaterial({color:[0xFF4FD8,0x36F0FF][rnd(2)],transparent:true,opacity:0.8}));r.position.y=5;g.add(r);g.spin=r}
else if(t==='orb'){const o=new THREE.Mesh(new THREE.IcosahedronGeometry(1.5,1),new THREE.MeshStandardMaterial({color:0x7A3CFF,emissive:0x7A3CFF,emissiveIntensity:0.6,flatShading:true}));o.position.y=rp(4,9);g.add(o);g.add(glowSp(0x9A6AFF,6,0.4));g.children[1].position.y=o.position.y;g.spin=o}
return g}
// Cột đèn đường cách đều
const lamps=[];for(let i=0;i<14;i++){const g=new THREE.Group(),p=cyl(0.12,0.15,7,0x70757E);p.position.y=3.5;g.add(p);const a=cyl(0.08,0.08,2.2,0x70757E);a.rotation.z=Math.PI/2;a.position.set(-1,7,0);g.add(a);
const h=new THREE.Mesh(new THREE.BoxGeometry(0.8,0.2,0.4),new THREE.MeshBasicMaterial({color:0xFFF2C8}));h.position.set(-2,6.9,0);g.add(h);const gl=glowSp(0xFFE9A0,4,0.6);gl.position.set(-2,6.7,0);g.add(gl);g.gl=gl;
const s=i%2?1:-1;g.position.set(s*(ROADW/2+1.4),0,-i*30);g.scale.x=s;S.add(g);lamps.push(g)}
let curZ=null,zoneIdx=0;
function setZone(zi,instant){const Z=ZONES[(zi-1)%ZONES.length];curZ=Z;zoneIdx=zi;if(!Z.skyT)Z.skyT=skyTex(Z.sky[0],Z.sky[1]);S.background=Z.skyT;S.fog.color.setHex(Z.fog);S.fog.near=Z.night?95:115;S.fog.far=Z.night?340:330;
groundM.map=groundTex(Z.gr,Z);groundM.needsUpdate=true;roadM.map=roadTs[Z.road];roadM.roughness=Z.rain?0.25:0.8;roadM.metalness=Z.rain?0.35:0.05;roadM.needsUpdate=true;
hemi.intensity=Z.hemi*0.35;sun.intensity=Z.night?0.35:0.95;sun.color.setHex(Z.sun);sunSp.material.color.setHex(Z.night?0xDDE6FF:Z.sun);headL.intensity=Z.night?2.2:0;roadM.emissive.setHex(Z.night?0xffffff:0x000000);roadM.emissiveIntensity=Z.night?0.9:0;R.toneMappingExposure=Z.night?1.25:Z.snow?0.72:0.88;buildEnv(Z);clouds.forEach(c=>{c.s.visible=!Z.night;c.s.material.color.setHex(Z.n.includes('Sa mạc')?0xFFE0C0:Z.n.includes('thu')?0xFFE8D0:0xffffff)});sea.visible=!!Z.sea;mtnM.color.setHex(Z.mt);
lamps.forEach(l=>{l.gl.visible=!!Z.night;l.visible=!Z.n.includes('Tương lai')});if(instant)decor.forEach(d=>refreshDeco(d,true))}
function refreshDeco(d,force){if(!force&&d.zi===zoneIdx)return;if(d.m){S.remove(d.m);d.m.traverse(o=>{if(o.geometry&&!o.isSprite)o.geometry.dispose()})}const Z=curZ,t=Z.deco[rnd(Z.deco.length)];d.m=decoItem(t);d.zi=zoneIdx;
let x=d.side*rp(t==='bld'||t==='mesa'?14:t==='neon'?11:10,t==='lava'?30:t==='neon'?32:45);if(Z.sea&&d.side>0)x=d.side*rp(9,11);d.m.position.set(x,0,d.z);d.m.traverse(o=>o.frustumCulled=false);d.m.rotation.y=rp(0,6.28);if(t==='fence'||t==='sign')d.m.rotation.y=0;S.add(d.m)}
for(let i=0;i<70;i++)decor.push({z:-i*SPAN/70-10,side:i%2?1:-1,m:null,zi:-1});
// Thời tiết
const WN=300,wP=new Float32Array(WN*3),wG=new THREE.BufferGeometry();for(let i=0;i<WN;i++){wP[i*3]=rp(-30,30);wP[i*3+1]=rp(0,25);wP[i*3+2]=rp(-80,10)}wG.setAttribute('position',new THREE.BufferAttribute(wP,3));
const wM=new THREE.PointsMaterial({map:radT,size:0.4,transparent:true,opacity:0.85,depthWrite:false,color:0xffffff}),weather=new THREE.Points(wG,wM);weather.frustumCulled=false;S.add(weather);
const starsP=(()=>{const n=400,p=new Float32Array(n*3);for(let i=0;i<n;i++){const a=rp(0,6.28),e=rp(0.05,1.2);p[i*3]=Math.cos(a)*Math.cos(e)*400;p[i*3+1]=Math.sin(e)*400;p[i*3+2]=Math.sin(a)*Math.cos(e)*400}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(p,3));
const s=new THREE.Points(g,new THREE.PointsMaterial({map:radT,size:3,transparent:true,depthWrite:false,fog:false,blending:THREE.AdditiveBlending}));s.frustumCulled=false;S.add(s);return s})();

// ================= HIỆU ỨNG =================
const pG=new THREE.BoxGeometry(0.15,0.15,0.15),bubG=new THREE.SphereGeometry(0.12,8,6),parts=[],fx=[];
function part(x,y,z,m,v,s,decay,grav,geo){const p=new THREE.Mesh(geo||pG,m);p.position.set(x,y,z);p.v=v;p.s0=s;p.decay=decay;p.grav=grav===undefined?6:grav;p.life=1;p.scale.setScalar(s);S.add(p);parts.push(p)}
function burst(x,z,c,n,pw,y){pw=pw||1;for(let i=0;i<n;i++){const a=Math.random()*6.28,sp=(2+Math.random()*3)*pw;part(x,y||1.2,z,addM(c),new THREE.Vector3(Math.cos(a)*sp,rp(1,4)*pw,Math.sin(a)*sp),rp(0.6,1.3),1.4,3)}}
function bubbles(x,z,n){for(let i=0;i<n;i++)part(x+rp(-0.5,0.5),rp(0.8,1.6),z+rp(-0.5,0.5),addM(0xCFF6FF),new THREE.Vector3(rp(-0.5,0.5),rp(2,4),rp(-0.5,0.5)),rp(0.8,1.6),0.6,-1,bubG)}
const ringG=new THREE.RingGeometry(0.85,1,48);
function ring(x,z,c,size,y,life){const m=new THREE.Mesh(ringG,new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:0.85,depthWrite:false,side:THREE.DoubleSide}));m.rotation.x=-Math.PI/2;m.position.set(x,y||0.2,z);S.add(m);fx.push({m,life:life||0.6,max:life||0.6,g0:0.5,g1:size||4,op:0.85})}
function flash(c,op){fl.style.transition='none';fl.style.background=c;fl.style.opacity=op;requestAnimationFrame(()=>requestAnimationFrame(()=>{fl.style.transition='opacity .45s';fl.style.opacity=0}))}
const pv=new THREE.Vector3();
function scr(x,y,z){pv.set(x,y,z).project(cam);return[(pv.x+1)/2*100,(1-pv.y)/2*100,pv.z<1]}
function pop(txt,x,y,z,col,size){const[a,b]=scr(x,y,z);const d=document.createElement('div');d.className='pp';d.textContent=txt;d.style.left=a+'%';d.style.top=b+'%';if(col)d.style.color=col;if(size)d.style.fontSize=size+'px';wrap.appendChild(d);setTimeout(()=>d.remove(),1000)}
function showLv(t,ms){lvB.innerHTML='<div>'+t+'</div>';lvB.style.opacity=1;lvB.style.transform='scale(1)';clearTimeout(showLv.t);showLv.t=setTimeout(()=>{lvB.style.opacity=0;lvB.style.transform='scale(0.8)'},ms||1700)}
const HEX=c=>'#'+c.toString(16).padStart(6,'0'),RB=[0xFF4D4D,0xFF9F1C,0xFFE14D,0x4DFF88,0x4DC3FF,0xB04DFF];
function firework(){const c=RB[rnd(6)],x=P.x+rp(-12,12),z=P.z-rp(6,14),y=rp(8,14);for(let i=0;i<40;i++){const a=Math.random()*6.28,e=Math.acos(2*Math.random()-1),sp=rp(4,7);part(x,y,z,addM(i%2?c:0xffffff),new THREE.Vector3(Math.sin(e)*Math.cos(a)*sp,Math.cos(e)*sp,Math.sin(e)*Math.sin(a)*sp),1.4,0.9,2)}snd(900,150,0.35,'triangle',0.05)}
// Nhãn số trên đầu các đàn
const lbPool=[];let lbUsed=0;
function label(txt,x,y,z,cls){let d=lbPool[lbUsed];if(!d){d=document.createElement('div');lbls.appendChild(d);lbPool.push(d)}lbUsed++;const[a,b,vis]=scr(x,y,z);if(!vis||a<-10||a>110||b<-10||b>110){d.style.display='none';return}
if(d._t!==txt){d.textContent=txt;d._t=txt}if(d._c!==cls){d.className='lb '+cls;d._c=cls}d.style.display='block';d.style.left=a+'%';d.style.top=b+'%'}



// ================= XE =================
const shadowT=canvasTex(64,64,g=>{const gr=g.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'rgba(0,0,0,.6)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(0,0,64,64)});
const shadowM=new THREE.MeshBasicMaterial({map:shadowT,transparent:true,depthWrite:false});const shadowG=new THREE.PlaneGeometry(1,1);shadowG.rotateX(-Math.PI/2);
const glassM=new THREE.MeshPhysicalMaterial({color:0x101820,metalness:0.9,roughness:0.05,clearcoat:1,envMapIntensity:1.6});
const wheelG=new THREE.CylinderGeometry(1,1,1,20);wheelG.rotateZ(Math.PI/2);const tireM=mat(0x1A1A1E,{roughness:0.8}),rimM=mat(0xC8CCD4,{metalness:0.8,roughness:0.2});
function chaikin(p,n){for(let k=0;k<n;k++){const q=[];for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length];q.push([a[0]*0.75+b[0]*0.25,a[1]*0.75+b[1]*0.25],[a[0]*0.25+b[0]*0.75,a[1]*0.25+b[1]*0.75])}p=q}return p}
function ext(pts,depth,m,bev){pts=chaikin(pts,2);const s=new THREE.Shape();pts.forEach((p,i)=>i?s.lineTo(p[0],p[1]):s.moveTo(p[0],p[1]));const g=new THREE.ExtrudeGeometry(s,{depth,bevelEnabled:true,bevelThickness:bev||0.08,bevelSize:bev||0.08,bevelSegments:2,curveSegments:4});g.translate(0,0,-depth/2);g.rotateY(Math.PI/2);return new THREE.Mesh(g,m)}
const PROF={sedan:{b:[[-2.1,0.3],[2.1,0.3],[2.2,0.72],[2.0,0.9],[-2.0,0.95],[-2.2,0.75]],c:[[-1.3,0.9],[0.9,0.9],[0.35,1.5],[-0.95,1.5],[-1.5,0.95]],w:1.75,cw:1.5,r:0.36,wb:1.35},
sport:{b:[[-2.2,0.25],[2.25,0.25],[2.35,0.5],[1.2,0.72],[-2.1,0.8],[-2.3,0.6]],c:[[-1.1,0.72],[0.7,0.72],[0.1,1.18],[-0.8,1.2],[-1.4,0.78]],w:1.85,cw:1.4,r:0.34,wb:1.4,sp:1},
jeep:{b:[[-2,0.45],[2,0.45],[2.05,1.05],[1.9,1.15],[-2,1.15],[-2.05,1.0]],c:[[-1.8,1.1],[0.7,1.1],[0.45,1.85],[-1.8,1.85]],w:1.85,cw:1.7,r:0.5,wb:1.3},
van:{b:[[-2.3,0.35],[2.3,0.35],[2.4,0.9],[2.1,1.1],[-2.3,1.1]],c:[[-2.3,1.05],[1.4,1.05],[1.0,2.1],[-2.3,2.1]],w:1.9,cw:1.86,r:0.4,wb:1.5,box:1},
f1:{b:[[-2.3,0.2],[2.4,0.2],[2.5,0.35],[1.0,0.55],[-1.6,0.7],[-2.3,0.55]],c:[[-0.9,0.55],[0.4,0.55],[0.0,0.95],[-0.6,0.95]],w:1.7,cw:0.8,r:0.4,wb:1.5,sp:1}};
const plateT=canvasTex(128,40,(g,w,h)=>{g.fillStyle='#F4F4F0';g.fillRect(0,0,w,h);g.strokeStyle='#222';g.lineWidth=3;g.strokeRect(2,2,w-4,h-4);g.fillStyle='#1a1a2a';g.font='bold 24px sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('51A-'+(100+rnd(899)),w/2,h/2+1)});
const darkM=mat(0x15161A,{roughness:0.6}),chromeM=new THREE.MeshStandardMaterial({color:0xE8ECF0,metalness:1,roughness:0.12}),tailM=new THREE.MeshStandardMaterial({color:0x8A0000,emissive:0xFF1010,emissiveIntensity:1.4,roughness:0.3}),headM=new THREE.MeshStandardMaterial({color:0xffffff,emissive:0xFFF6E0,emissiveIntensity:1.2,roughness:0.1}),caliM=mat(0xD81B1B,{roughness:0.4});
const spokeG=new THREE.BoxGeometry(0.06,0.85,0.12);
function paint(col,o){return new THREE.MeshPhysicalMaterial({color:col,metalness:o&&o.matte?0.1:0.35,roughness:o&&o.matte?0.6:0.35,clearcoat:0.8,clearcoatRoughness:0.12,envMapIntensity:0.55})}
function makeCar(type,col,o){o=o||{};const g=new THREE.Group(),pf=PROF[type]||PROF.sedan,bm=paint(col,o),W=pf.w,fz=-pf.b[2][0],bz=-pf.b[0][0],top=pf.b[3][1];
const b=ext(pf.b,W-0.16,bm,0.1);b.castShadow=true;g.add(b);const c=ext(pf.c,pf.cw-0.1,bm,0.07);c.castShadow=true;g.add(c);
if(pf.box){const wnd=ext([[0.6,1.1],[1.38,1.1],[1.0,1.95],[0.6,1.95]],pf.cw+0.02,glassM,0.02);g.add(wnd);const rw=new THREE.Mesh(new THREE.BoxGeometry(pf.cw*0.8,0.6,0.04),glassM);rw.position.set(0,1.6,bz+0.03);g.add(rw)}
else{const ys=pf.c.map(p=>p[1]),y0=Math.min(...ys),cx=pf.c.reduce((a,p)=>a+p[0],0)/pf.c.length,gp=pf.c.map(([x,y])=>[cx+(x-cx)*0.9,y0+0.08+(y-y0)*0.78]);g.add(ext(gp,pf.cw-0.02,glassM,0.05))}
// cản trước/sau, ốp sườn, gương, ống xả, biển số
[[fz-0.02,1],[bz+0.02,-1]].forEach(([z,s])=>{const bp=new THREE.Mesh(new THREE.BoxGeometry(W*0.98,0.22,0.18),darkM);bp.position.set(0,0.32,z+s*0.04);g.add(bp)});
const gr=new THREE.Mesh(new THREE.BoxGeometry(W*0.45,0.18,0.06),darkM);gr.position.set(0,0.55,fz-0.06);g.add(gr);const grc=new THREE.Mesh(new THREE.BoxGeometry(W*0.47,0.03,0.07),chromeM);grc.position.set(0,0.65,fz-0.06);g.add(grc);
[-1,1].forEach(s=>{const sk=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.12,pf.wb*1.4),darkM);sk.position.set(s*(W/2+0.01),0.32,0);g.add(sk);
 const mr=new THREE.Mesh(new THREE.BoxGeometry(0.22,0.12,0.14),bm);mr.position.set(s*(pf.cw/2+0.12),pf.c[0][1]+0.12,pf.c[1]?-pf.c[1][0]+0.1:-0.6);g.add(mr);
 const ex=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.07,0.25,10),chromeM);ex.rotation.x=Math.PI/2;ex.position.set(s*W*0.28,0.3,bz+0.12);if(type==='sport'||type==='f1'||s<0)g.add(ex)});
const pl=new THREE.Mesh(new THREE.PlaneGeometry(0.52,0.16),new THREE.MeshStandardMaterial({map:plateT,roughness:0.5}));pl.position.set(0,0.5,bz+0.11);g.add(pl);
// đèn hậu dạng thanh + đèn pha
const tl=new THREE.Mesh(new THREE.BoxGeometry(W*(type==='sport'||type==='f1'?0.92:0.3),0.1,0.06),tailM);tl.position.set(0,top-0.12,bz+0.06);g.add(tl);
if(!(type==='sport'||type==='f1'))[-1,1].forEach(s=>{const t=new THREE.Mesh(new THREE.BoxGeometry(0.38,0.14,0.06),tailM);t.position.set(s*W*0.34,top-0.12,bz+0.06);g.add(t)});
g.tail=[];[-1,1].forEach(s=>{const gl=glowSp(0xFF2A1A,0.9,0.55);gl.position.set(s*W*0.34,top-0.12,bz+0.2);g.add(gl);g.tail.push(gl);const h=new THREE.Mesh(new THREE.BoxGeometry(0.42,0.12,0.06),headM);h.position.set(s*W*0.33,pf.b[2][1]-0.08,fz-0.05);g.add(h)});
// bánh xe có nan & phanh
g.wheels=[];[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([sx,sz])=>{const w=new THREE.Group(),sp=new THREE.Group(),t=new THREE.Mesh(wheelG,tireM);t.scale.set(0.3,pf.r,pf.r);t.castShadow=true;sp.add(t);const r=new THREE.Mesh(wheelG,chromeM);r.scale.set(0.32,pf.r*0.62,pf.r*0.62);sp.add(r);
 const hub=new THREE.Mesh(wheelG,darkM);hub.scale.set(0.34,pf.r*0.18,pf.r*0.18);sp.add(hub);for(let k=0;k<5;k++){const s=new THREE.Mesh(spokeG,darkM);s.scale.y=pf.r*0.62;s.rotation.x=k/5*Math.PI*2;s.position.x=sx*0.155;sp.add(s)}
 w.add(sp);if(type==='sport'||type==='f1'){const cl=new THREE.Mesh(new THREE.BoxGeometry(0.1,pf.r*0.5,pf.r*0.4),caliM);cl.position.set(sx*0.1,pf.r*0.25,0);w.add(cl)}w.spin=sp;w.position.set(sx*W/2,pf.r,sz*pf.wb);g.add(w);g.wheels.push(w)});
if(pf.sp||o.spoiler){const sp=new THREE.Mesh(new THREE.BoxGeometry(W*1.02,0.06,0.45),bm);sp.position.set(0,top+0.35,bz-0.25);sp.castShadow=true;g.add(sp);[-1,1].forEach(s=>{const l=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.32,0.12),darkM);l.position.set(s*W*0.35,top+0.17,bz-0.25);g.add(l)})}
if(o.taxi){const s=new THREE.Mesh(new THREE.BoxGeometry(0.7,0.25,0.3),new THREE.MeshStandardMaterial({color:0xFFF6A0,emissive:0xFFE060,emissiveIntensity:0.6}));s.position.set(0,pf.c[2][1]+0.12,-0.2);g.add(s)}
if(o.police){g.siren=[];[-1,1].forEach(s=>{const l=new THREE.Mesh(new THREE.BoxGeometry(0.4,0.16,0.25),new THREE.MeshBasicMaterial({color:s<0?0xFF2020:0x2060FF}));l.position.set(s*0.22,pf.c[2][1]+0.1,-0.2);g.add(l);const gl=glowSp(s<0?0xFF2020:0x2060FF,3,0.85);gl.position.copy(l.position);g.add(gl);g.siren.push(gl)});
 const st=new THREE.Mesh(new THREE.BoxGeometry(W+0.02,0.18,2.4),paint(0xffffff));st.position.y=0.62;g.add(st)}
if(o.hover){g.wheels.forEach(w=>{w.spin.visible=false;const gl=glowSp(0x36F0FF,1.6,0.9);w.add(gl);const rg=new THREE.Mesh(new THREE.TorusGeometry(pf.r*0.8,0.05,6,20),new THREE.MeshBasicMaterial({color:0x36F0FF}));rg.rotation.x=Math.PI/2;w.add(rg)});const und=glowSp(0x36F0FF,6,0.45);und.position.y=0.1;g.add(und)}
if(o.stripe){[-0.22,0.22].forEach(x=>{const s=new THREE.Mesh(new THREE.BoxGeometry(0.16,0.02,4.3),paint(o.stripe));s.position.set(x,top+0.06,0);g.add(s)})}
const sh=new THREE.Mesh(shadowG,shadowM);sh.scale.set(W*1.5,1,5.4);sh.position.y=0.03;g.add(sh);g.pf=pf;g.L=4.4;g.W=W;return g}
function makeBus(col){const g=new THREE.Group(),m=new THREE.MeshStandardMaterial({color:col,metalness:0.3,roughness:0.4}),b=new THREE.Mesh(new THREE.BoxGeometry(2.4,2.6,9),m);b.position.y=1.7;g.add(b);
const w=new THREE.Mesh(new THREE.BoxGeometry(2.45,0.9,8),glassM);w.position.y=2.1;g.add(w);const f=new THREE.Mesh(new THREE.BoxGeometry(2.2,1.2,0.05),glassM);f.position.set(0,2,-4.52);g.add(f);
g.wheels=[];[[-1,-3],[1,-3],[-1,3],[1,3]].forEach(([sx,sz])=>{const t=new THREE.Mesh(wheelG,tireM);t.scale.set(0.35,0.5,0.5);t.position.set(sx*1.15,0.5,sz);g.add(t);g.wheels.push(t)});
[-1,1].forEach(s=>{const t=new THREE.Mesh(new THREE.BoxGeometry(0.4,0.3,0.06),new THREE.MeshBasicMaterial({color:0xFF2020}));t.position.set(s*0.8,0.9,4.52);g.add(t)});const sh=new THREE.Mesh(shadowG,shadowM);sh.scale.set(3.4,1,10.5);sh.position.y=0.03;g.add(sh);g.L=9;g.W=2.4;return g}
function makeTruck(col,big){const g=new THREE.Group(),cm=new THREE.MeshStandardMaterial({color:col,metalness:0.4,roughness:0.35}),cab=new THREE.Mesh(new THREE.BoxGeometry(2.4,2.4,2.4),cm);cab.position.set(0,1.6,-4);g.add(cab);
const ws=new THREE.Mesh(new THREE.BoxGeometry(2.2,1,0.05),glassM);ws.position.set(0,2.2,-5.22);g.add(ws);const tr=new THREE.Mesh(new THREE.BoxGeometry(2.5,3,7.2),new THREE.MeshStandardMaterial({map:canvasTex(64,64,(gg,w,h)=>{gg.fillStyle='#E8E8EE';gg.fillRect(0,0,w,h);gg.fillStyle=HEX(col);gg.fillRect(0,h*0.35,w,h*0.3)}),roughness:0.6}));tr.position.set(0,2,0.8);g.add(tr);
g.wheels=[];[[-1,-4],[1,-4],[-1,2],[1,2],[-1,3.4],[1,3.4]].forEach(([sx,sz])=>{const t=new THREE.Mesh(wheelG,tireM);t.scale.set(0.4,0.55,0.55);t.position.set(sx*1.15,0.55,sz);g.add(t);g.wheels.push(t)});
[-1,1].forEach(s=>{const t=new THREE.Mesh(new THREE.BoxGeometry(0.4,0.3,0.06),new THREE.MeshBasicMaterial({color:0xFF2020}));t.position.set(s*0.9,0.8,4.42);g.add(t)});const sh=new THREE.Mesh(shadowG,shadowM);sh.scale.set(3.4,1,11);sh.position.y=0.03;g.add(sh);g.L=10.4;g.W=2.5;return g}
const TCOL=[0xE53935,0x1E88E5,0xFFFFFF,0x43A047,0xFDD835,0x8E24AA,0x37474F,0xFB8C00,0x90A4AE,0x00ACC1];
function makeTraffic(){const r=Math.random();if(r<0.07)return makeBus([0xFDD835,0xE53935,0x1E88E5][rnd(3)]);if(r<0.15)return makeTruck(TCOL[rnd(TCOL.length)]);if(r<0.27)return makeCar('van',TCOL[rnd(TCOL.length)]);
if(r<0.37)return makeCar('sedan',0xFDD835,{taxi:1});if(r<0.47)return makeCar('sport',TCOL[rnd(TCOL.length)]);if(r<0.55)return makeCar('jeep',TCOL[rnd(TCOL.length)]);return makeCar('sedan',TCOL[rnd(TCOL.length)])}
// ---- Garage: 6 xe ----
const CARS=[{n:'🚗 Mini',p:0,sp:1,hd:1,hp:3,ni:1,b:()=>makeCar('sedan',0x1E88E5)},{n:'🚕 Taxi vàng',p:600,sp:1.05,hd:1.1,hp:3,ni:1,coin:1.25,d:'+25% xu',b:()=>makeCar('sedan',0xFDD835,{taxi:1})},
{n:'🚙 Jeep địa hình',p:1500,sp:1.03,hd:0.95,hp:5,ni:1,b:()=>makeCar('jeep',0x558B2F)},{n:'🏎️ Thể thao',p:3000,sp:1.15,hd:1.25,hp:3,ni:1.25,b:()=>makeCar('sport',0xE53935,{stripe:0xffffff})},
{n:'🚓 Cảnh sát',p:5000,sp:1.2,hd:1.15,hp:4,ni:1.2,b:()=>makeCar('sedan',0x0D1B4A,{police:1})},{n:'🛸 Xe bay',p:9000,sp:1.3,hd:1.4,hp:4,ni:1.5,b:()=>makeCar('f1',0x7A3CFF,{hover:1,stripe:0x36F0FF})}];
// ---- Chướng ngại ----
const stripeT=canvasTex(64,16,(g,w,h)=>{for(let i=0;i<8;i++){g.fillStyle=i%2?'#E53935':'#ffffff';g.beginPath();g.moveTo(i*8,0);g.lineTo(i*8+8,0);g.lineTo(i*8,h);g.lineTo(i*8-8,h);g.fill()}});
const ystripeT=canvasTex(64,16,(g,w,h)=>{for(let i=0;i<9;i++){g.fillStyle=i%2?'#222':'#FFD23F';g.beginPath();g.moveTo(i*8,0);g.lineTo(i*8+8,0);g.lineTo(i*8,h);g.lineTo(i*8-8,h);g.fill()}});
function makeBarrier(n){const g=new THREE.Group(),bm=new THREE.MeshStandardMaterial({map:stripeT,roughness:0.5});const w=n*3-0.4,b=new THREE.Mesh(new THREE.BoxGeometry(w,0.5,0.2),bm);b.position.y=0.9;g.add(b);
[-1,1].forEach(s=>{const l=new THREE.Mesh(new THREE.BoxGeometry(0.12,1,0.6),mat(0x8A8A8A));l.position.set(s*(w/2-0.3),0.5,0);g.add(l)});g.lights=[];
[-1,1].forEach(s=>{const gl=glowSp(0xFFA020,1.6,0.9);gl.position.set(s*(w/2-0.3),1.3,0);g.add(gl);g.lights.push(gl)});
for(let i=0;i<n*2;i++){const c=cone(0.25,0.75,0xFF6A00,10);c.position.set(-w/2+0.5+i*(w-1)/(n*2-1||1),0.37,-1.4);g.add(c);const s2=cyl(0.17,0.21,0.12,0xffffff);s2.position.set(c.position.x,0.45,-1.4);g.add(s2)}return g}
function makeOil(){const g=new THREE.Group(),m=new THREE.Mesh(new THREE.CircleGeometry(1.4,20),new THREE.MeshStandardMaterial({color:0x050508,metalness:0.9,roughness:0.05}));m.rotation.x=-Math.PI/2;m.position.y=0.04;m.scale.set(1,1.5,1);g.add(m);
const sh=new THREE.Mesh(new THREE.CircleGeometry(0.5,12),new THREE.MeshBasicMaterial({color:0x7A3CFF,transparent:true,opacity:0.35}));sh.rotation.x=-Math.PI/2;sh.position.set(0.3,0.05,0.2);g.add(sh);return g}
function makeRamp(){const g=new THREE.Group(),s=new THREE.Shape();s.moveTo(0,0);s.lineTo(5,0);s.lineTo(5,1.3);s.lineTo(4.6,1.3);s.lineTo(0,0.02);const geo=new THREE.ExtrudeGeometry(s,{depth:2.8,bevelEnabled:false});geo.translate(0,0,-1.4);geo.rotateY(Math.PI/2);
const r=new THREE.Mesh(geo,[new THREE.MeshStandardMaterial({map:ystripeT}),new THREE.MeshStandardMaterial({color:0xFFD23F})]);r.position.z=0;g.add(r);g.add(Object.assign(glowSp(0xFFD23F,4,0.3),{}));return g}
function makePad(){const g=new THREE.Group(),t=canvasTex(64,128,(gg,w,h)=>{gg.fillStyle='rgba(0,0,0,0)';gg.clearRect(0,0,w,h);gg.fillStyle='#36F0FF';for(let i=0;i<3;i++){gg.beginPath();gg.moveTo(w/2,i*40+4);gg.lineTo(w-6,i*40+34);gg.lineTo(w-20,i*40+34);gg.lineTo(w/2,i*40+18);gg.lineTo(20,i*40+34);gg.lineTo(6,i*40+34);gg.fill()}});
const p=new THREE.Mesh(new THREE.PlaneGeometry(2.4,4.5),new THREE.MeshBasicMaterial({map:t,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));p.rotation.x=-Math.PI/2;p.position.y=0.05;g.add(p);g.pad=p;return g}
function makeBarrel(){const g=new THREE.Group(),b=cyl(0.55,0.55,1.2,[0xE53935,0x1E88E5,0xFB8C00][rnd(3)],{metalness:0.4});b.position.y=0.6;g.add(b);[0.25,0.95].forEach(y=>{const r=new THREE.Mesh(new THREE.TorusGeometry(0.56,0.04,4,16),mat(0x333333));r.rotation.x=Math.PI/2;r.position.y=y;g.add(r)});g.body=b;return g}
function makeHeli(){const g=new THREE.Group(),m=mat(0x2E3A2E,{metalness:0.4,roughness:0.4}),b=new THREE.Mesh(new THREE.SphereGeometry(1.4,16,12),m);b.scale.set(1,0.8,1.5);g.add(b);
const gl=new THREE.Mesh(new THREE.SphereGeometry(0.9,14,10),glassM);gl.scale.set(1,0.7,0.9);gl.position.set(0,0.2,-1.2);g.add(gl);const t=cyl(0.2,0.35,4,0x2E3A2E);t.rotation.x=Math.PI/2;t.position.set(0,0.3,3);g.add(t);
const rot=new THREE.Group();for(let i=0;i<4;i++){const bl=new THREE.Mesh(new THREE.BoxGeometry(0.25,0.05,5),mat(0x111111));bl.rotation.y=i*Math.PI/2;bl.position.z=0;rot.add(bl)}rot.position.y=1.4;g.add(rot);g.rot=rot;
const tr=new THREE.Group();for(let i=0;i<2;i++){const bl=new THREE.Mesh(new THREE.BoxGeometry(0.05,1.4,0.15),mat(0x111111));bl.rotation.x=i*Math.PI/2;tr.add(bl)}tr.position.set(0.25,0.4,4.8);g.add(tr);g.trot=tr;
[-1,1].forEach(s=>{const sk=new THREE.Mesh(new THREE.BoxGeometry(0.08,0.08,2.6),mat(0x333333));sk.position.set(s*0.9,-1.2,-0.2);g.add(sk)});const lt=glowSp(0xFF2020,1.5,0.9);lt.position.set(0,-0.9,0);g.add(lt);g.blink=lt;return g}
// ---- Vật phẩm ----
const coinG=new THREE.CylinderGeometry(0.45,0.45,0.1,18);coinG.rotateX(Math.PI/2);const coinM=mat(0xFFC93C,{metalness:0.8,roughness:0.25,emissive:0x6a4500,emissiveIntensity:0.6});
function makeCoin(){const g=new THREE.Group(),c=new THREE.Mesh(coinG,coinM);g.add(c);g.c=c;g.add(glowSp(0xFFD700,1.4,0.45));return g}
function makeNitro(){const g=new THREE.Group(),b=cyl(0.35,0.35,1,0x1E88E5,{metalness:0.7,roughness:0.2});b.position.y=0;g.add(b);const t=cyl(0.15,0.2,0.3,0xC8CCD4,{metalness:0.8});t.position.y=0.62;g.add(t);
const l=new THREE.Mesh(new THREE.BoxGeometry(0.72,0.35,0.05),new THREE.MeshBasicMaterial({color:0x36F0FF}));l.position.set(0,0,0.34);g.add(l);g.add(glowSp(0x36F0FF,2.4,0.5));return g}
const PW={shield:{c:0x4FC3F7,e:'🛡️',n:'Khiên!'},magnet:{c:0xE24B4A,e:'🧲',n:'Hút xu!'},star:{c:0xFFD700,e:'⭐',n:'Siêu sao!'},double:{c:0xF4C430,e:'x2',n:'Nhân đôi điểm!'},repair:{c:0x7CFF6B,e:'🔧',n:'Sửa xe +1 ❤️'}};
const POOL=['shield','magnet','star','double','repair','shield','magnet','double'];
const orbG=new THREE.SphereGeometry(0.6,20,14);
Object.values(PW).forEach(p=>{p.tex=canvasTex(128,128,g=>{g.textAlign='center';g.textBaseline='middle';g.fillStyle='#fff';g.font=(p.e==='x2'?'bold 70px':'86px')+' sans-serif';g.fillText(p.e,64,70)});p.om=new THREE.MeshBasicMaterial({color:p.c,transparent:true,opacity:0.3,depthWrite:false})});
function makePower(k){const p=PW[k],g=new THREE.Group();g.add(new THREE.Mesh(orbG,p.om));const s=new THREE.Sprite(new THREE.SpriteMaterial({map:p.tex,depthWrite:false}));s.scale.set(1.2,1.2,1);g.add(s);g.add(glowSp(p.c,3,0.5));return g}
function makeGate(n){const g=new THREE.Group(),pm=mat(0xE53935,{metalness:0.3});[-1,1].forEach(s=>{const p=new THREE.Mesh(new THREE.BoxGeometry(0.8,9,0.8),pm);p.position.set(s*(ROADW/2+1),4.5,0);g.add(p);
 for(let i=0;i<3;i++){const b=new THREE.Mesh(new THREE.SphereGeometry(0.7,12,10),mat(RB[(i+(s>0?3:0))%6],{roughness:0.3}));b.position.set(s*(ROADW/2+1.2)+rp(-0.5,0.5),9.4+i*0.9,rp(-0.5,0.5));g.add(b)}});
const ban=new THREE.Mesh(new THREE.BoxGeometry(ROADW+3,2,0.4),new THREE.MeshStandardMaterial({map:canvasTex(512,80,(gg,w,h)=>{gg.fillStyle='#E53935';gg.fillRect(0,0,w,h);gg.fillStyle='#fff';gg.font='bold 46px sans-serif';gg.textAlign='center';gg.textBaseline='middle';gg.fillText('CHẶNG '+n+' 🏁',w/2,h/2+3)})}));ban.position.y=8;g.add(ban);
const ck=canvasTex(64,64,(gg)=>{for(let y=0;y<8;y++)for(let x=0;x<8;x++){gg.fillStyle=(x+y)%2?'#111':'#fff';gg.fillRect(x*8,y*8,8,8)}});ck.wrapS=THREE.RepeatWrapping;ck.repeat.set(6,1);
const ln=new THREE.Mesh(new THREE.PlaneGeometry(ROADW,1.2),new THREE.MeshBasicMaterial({map:ck}));ln.rotation.x=-Math.PI/2;ln.position.y=0.06;g.add(ln);return g}


// ================= TRẠNG THÁI =================
const ZL=2500;
const P={x:0,z:0,y:0,vy:0,tx:0,txs:0,lv:0,v:0,yaw:0};
let car=CARS[carSel],pc=null,running=false,paused=false,T=0,shake=0,score=0,dist=0,zone=1,lives=3,inv=0,coins=0,startBest=0,annBest=false,st={};
let traffic=[],obs=[],coinsA=[],items=[],fly=[],targets=[],gate=null,event=null,police=[],truck=null,heli=null;
let nitro=0,nitroOn=0,boostT=0,slipT=0,spinT=0,slowK=1,shieldT=0,magT=0,starT=0,dblT=0,air=0,onRamp=null,combo=0,comboT=0,coinStreak=0,coinStreakT=0;
let segZ=0,itemD=0,hudT=0,hudS='',nextEvD=0,lastZoneD=0,camFov=62,vgT=0,dangerS=0,warnPrev=0;
const gain=n=>{n=Math.round(n*(dblT>0?2:1));score+=n;return n};
const NMAX=()=>100*car.ni;
function setCar(){car=CARS[carSel];if(pc)S.remove(pc);pc=car.b();S.add(pc);const fl=[-1,1].map(s=>{const f=new THREE.Sprite(new THREE.SpriteMaterial({map:radT,color:0x36A0FF,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));f.position.set(s*0.4,0.42,2.55);f.scale.setScalar(0.01);pc.add(f);return f});pc.flames=fl;
const pool=new THREE.Mesh(new THREE.PlaneGeometry(9,20),new THREE.MeshBasicMaterial({map:beamT,color:0xFFF2C8,transparent:true,opacity:0.55,blending:THREE.AdditiveBlending,depthWrite:false}));pool.rotation.x=-Math.PI/2;pool.position.set(0,0.07,-13);pc.add(pool);
[-1,1].forEach(s=>{const g=glowSp(0xFFF6D8,1.6,0.9);g.position.set(s*0.6,0.65,-2.3);pool.parent.add(g)});pc.beams=pool}
const beamT=canvasTex(64,128,g=>{const gr=g.createRadialGradient(32,120,4,32,90,90);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(0.5,'rgba(255,255,255,.35)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.beginPath();g.moveTo(26,128);g.lineTo(38,128);g.lineTo(64,0);g.lineTo(0,0);g.fill()});
// ================= GARAGE =================
function stat(v,mx){return'<i style="width:'+Math.round(v/mx*100)+'%"></i>'}
function renderGarage(){garE.innerHTML='<small>🪙 '+bank+' xu · Garage</small><div class="cars">'+CARS.map((c,i)=>{const own=owned.includes(i);return'<div class="cd'+(i===carSel?' on':'')+'" data-i="'+i+'"><b>'+c.n+'</b>'+
 '<div class="sb"><span>Tốc độ</span><p>'+stat(c.sp,1.3)+'</p></div><div class="sb"><span>Lái</span><p>'+stat(c.hd,1.4)+'</p></div><div class="sb"><span>Bền</span><p>'+stat(c.hp,5)+'</p></div><div class="sb"><span>Nitro</span><p>'+stat(c.ni,1.5)+'</p></div>'+(c.d?'<em>'+c.d+'</em>':'')+
 '<button>'+(i===carSel?'✔ Đang dùng':own?'Chọn':'🪙 '+c.p)+'</button></div>'}).join('')+'</div>';
garE.querySelectorAll('.cd').forEach(d=>d.querySelector('button').addEventListener('click',e=>{e.stopPropagation();const i=+d.dataset.i,c=CARS[i];
 if(!owned.includes(i)){if(bank<c.p){flash('#E24B4A',0.25);sHurt();return}bank-=c.p;owned.push(i);sPower();try{localStorage.setItem('raceOwned',JSON.stringify(owned))}catch(er){}}
 carSel=i;try{localStorage.setItem('raceCar',i);localStorage.setItem('raceCoins',bank)}catch(er){}setCar();renderGarage();if(typeof showCar==='function'){showCar();revSound();flash('#ffffff',0.25)}}))}
// ================= SINH ĐỐI TƯỢNG =================
function laneFree(z,lane){return!traffic.some(t=>Math.abs(t.z-z)<9&&Math.abs(t.x-LANES[lane])<1.5)&&!obs.some(o=>Math.abs(o.z-z)<8&&o.lanes&&o.lanes.includes(lane))}
function addTraffic(lane,z){const m=makeTraffic();S.add(m);const t={m,x:LANES[lane],z,lane,v:P.v*rp(0.35,0.6),L:m.L,W:m.W,passed:false,lc:0};m.position.set(t.x,0,z);traffic.push(t);
if(zone>=2&&Math.random()<0.18+zone*0.02){t.lcT=rp(1,3);t.lc=lane===0?1:lane===3?-1:Math.random()<0.5?-1:1}return t}
function addCoins(lane,z,n,arc){for(let i=0;i<n;i++){const m=makeCoin(),zz=z-i*3.2,y=arc?Math.sin(i/(n-1)*Math.PI)*4.2+1:1;m.position.set(LANES[lane],y,zz);S.add(m);coinsA.push({m,x:LANES[lane],z:zz,y})}}
function addObs(kind,lane,z,n){let m,o={kind,z,x:LANES[lane]};if(kind==='bar'){m=makeBarrier(n);o.x=(LANES[lane]+LANES[lane+n-1])/2;o.w=n*3-0.4;o.lanes=[];for(let i=0;i<n;i++)o.lanes.push(lane+i);o.d=0.6}
else if(kind==='oil'){m=makeOil();o.w=2.4;o.d=4;o.lanes=[lane]}else if(kind==='ramp'){m=makeRamp();o.w=2.8;o.d=5;o.lanes=[lane]}else if(kind==='pad'){m=makePad();o.w=2.4;o.d=4.5;o.lanes=[lane]}
else if(kind==='barrel'){m=makeBarrel();o.w=1.1;o.d=1.1;o.lanes=[lane]}o.m=m;m.position.set(o.x,0,z);S.add(m);obs.push(o);return o}
function spawnRow(){const z=P.z-rp(170,200),k=Math.min(1,dist/6000),ev=!!event;let used=[];const r=Math.random();
const nCar=ev?(Math.random()<0.5?1:0):Math.random()<0.25+k*0.35?2:1;const lanes=[0,1,2,3].sort(()=>Math.random()-0.5);
for(let i=0;i<nCar;i++){const l=lanes[i];if(laneFree(z,l)){addTraffic(l,z-rp(0,6));used.push(l)}}
const free=lanes.filter(l=>!used.includes(l));if(!free.length)return;const f=free[0];
if(r<0.3)addCoins(f,z-4,6+rnd(4));
else if(r<0.42&&dist>300&&!ev&&free.length>1){const n=Math.random()<0.5||free.length<3?1:2;const l=free.slice().sort((a,b)=>a-b);let st0=l[0];if(n===2&&l.includes(st0+1))addObs('bar',st0,z-12,2);else addObs('bar',l[0],z-12,1)}
else if(r<0.52&&dist>200){addObs('ramp',f,z-10);addCoins(f,z-17,7,true)}
else if(r<0.6&&dist>500)addObs('oil',f,z-8);
else if(r<0.68)addObs('pad',f,z-8);
else if(r<0.75){const m=makeNitro();m.position.set(LANES[f],1,z-6);S.add(m);items.push({m,k:'nitro',x:LANES[f],z:z-6})}
else if(r<0.8){const k2=POOL[rnd(POOL.length)],m=makePower(k2);m.position.set(LANES[f],1.2,z-6);S.add(m);items.push({m,k:k2,x:LANES[f],z:z-6})}
else addCoins(f,z-4,5)}
// ================= SỰ KIỆN (TRÙM) =================
const EVN=['police','truck','heli'];
function startEvent(){const t=EVN[(zone-1)%3];event={t,T:24,hp:0,max:0,rew:500*zone};sSiren();vgT=1.4;bbW.style.display='block';bbF.style.width='100%';
if(t==='police'){for(let i=0;i<2;i++){const m=makeCar('sedan',0x0D1B4A,{police:1});S.add(m);police.push({m,x:LANES[i?3:0],z:P.z+28+i*8,v:0,st:'chase',stT:0,tx:0})}bbN.textContent='🚓 Cảnh sát truy đuổi! Sống sót 24 giây';showLv('🚨 CẢNH SÁT TRUY ĐUỔI! 🚨<br><span style="font-size:15px">Né cú húc · dụ họ đâm vào xe khác!</span>',2400)}
else if(t==='truck'){const m=makeTruck(0x37474F);m.scale.setScalar(1.25);S.add(m);truck={m,x:LANES[1]+1.5,z:P.z-90,tx:0,dropT:2,sw:0};event.hp=event.max=3;bbN.textContent='🚚 Xe tải khổng lồ · Húc bằng NITRO 🔥 3 lần!';showLv('🚚 XE TẢI KHỔNG LỒ! 🚚<br><span style="font-size:15px">Né thùng phi · bật <b>NITRO</b> húc đuôi xe 3 lần!</span>',2600)}
else{const m=makeHeli();S.add(m);heli={m,x:0,z:P.z-60,dropT:2};bbN.textContent='🚁 Trực thăng ném bom! Sống sót 24 giây';showLv('🚁 TRỰC THĂNG TẤN CÔNG! 🚁<br><span style="font-size:15px">Né vòng tròn đỏ trên đường!</span>',2400)}}
function endEvent(win,txt){if(!event)return;const g=gain(event.rew*(win?1:0.5));sZone();for(let i=0;i<4;i++)setTimeout(firework,i*200);pop((txt||'🏆 Thoát hiểm!')+' +'+g,P.x,3,P.z-8,'#FFE36B',26);bbW.style.display='none';
police.forEach(p=>p.st='leave');if(truck)truck.leave=1;if(heli)heli.leave=1;event=null;st.events++}
// ================= VA CHẠM =================
function smash(o,txt,pts){if(o.dead)return;o.dead=1;const m=o.m;fly.push({m,vx:(o.x-P.x||rp(-1,1))*3+rp(-4,4),vy:rp(7,11),vz:-P.v*0.3,rx:rp(-6,6),rz:rp(-6,6),t:2});sCrash();shake=Math.max(shake,0.45);
sparks(o.x,0.8,o.z,16);smoke(o.x,0.8,o.z,5,0x777777,1.4);for(let i=0;i<6;i++)part(o.x,1,o.z,mat([0x333333,0x8A8A8A,0xE53935][i%3]),new THREE.Vector3(rp(-7,7),rp(3,9),rp(-6,4)),rp(0.25,0.5),0.6,18);const g=gain(pts||150);if(pts!==0)banner(txt||'💥 HÚC VĂNG','+'+g,'#FF3A1A')}
function crash(o,src){if(inv>0)return;if(starT>0||nitroOn>0){smash(o);return}
if(shieldT>0){shieldT=0;smash(o,'🛡️ Khiên đỡ!',50);inv=1;return}
lives--;lfE.textContent='❤️'+Math.max(0,lives);sCrash();flash('#E24B4A',0.5);shake=0.9;spinT=0.8;slowK=0.4;inv=2.2;combo=0;smash(o,'💥',0);
smoke(P.x,1,P.z,8,0x666666,1.6);sparks(P.x,0.8,P.z-1,14);
if(lives<=0)die();else pop('-1 ❤️ '+(src||''),P.x,3,P.z-4,'#ff8080',24)}
function hitBox(o,w,d){return Math.abs(o.x-P.x)<w/2+0.85&&Math.abs(o.z-P.z)<d/2+2.1}
// ================= BẮT ĐẦU / KẾT THÚC =================
function clearAll(){[...traffic,...obs,...coinsA,...items,...police,...targets].forEach(o=>S.remove(o.m));fly.forEach(f=>S.remove(f.m));[truck,heli,gate].forEach(o=>{if(o)S.remove(o.m||o)});
traffic=[];obs=[];coinsA=[];items=[];police=[];targets=[];fly=[];truck=heli=gate=null;event=null;parts.forEach(p=>S.remove(p));parts.length=0;fx.forEach(f=>S.remove(f.m));fx.length=0;wrap.querySelectorAll('.pp').forEach(d=>d.remove());bbW.style.display='none'}
function reset(){clearAll();setCar();P.x=LANES[1];P.z=0;P.y=0;P.vy=0;P.tx=LANES[1];P.txs=LANES[1];P.lv=0;P.v=20;P.yaw=0;score=0;dist=0;zone=1;lives=car.hp;inv=1.5;coins=0;nitro=40;nitroOn=0;boostT=slipT=spinT=0;slowK=1;shieldT=magT=starT=dblT=0;air=0;onRamp=null;combo=0;
startBest=best;annBest=false;st={near:0,smash:0,events:0,air:0};segZ=-40;nextEvD=ZL*0.45;lastZoneD=0;sc.textContent=0;lvE.textContent='1';lfE.textContent='❤️'+lives;hudS='';
decor.forEach((d,i)=>{d.z=-i*SPAN/70-10});setZone(1,true)}
let cdT=0;const lightsE=document.createElement('div');lightsE.id='lights';lightsE.innerHTML='<i></i><i></i><i></i>';wrap.appendChild(lightsE);
function start(){unlockAudio();reset();paused=false;ov.style.display='none';ov.classList.add('res');psB.style.display='block';nitB.style.display='flex';spdE.style.display='block';running=true;engStart();cdT=3.3;P.v=0;lightsE.className='l4';
setTimeout(()=>{if(running)banner('🏁 '+ZONES[0].n,'Kéo ngang để lái · lượn sát xe để SUÝT CHẠM','#FF5A1A')},3600)}
function saveAll(){try{localStorage.setItem('raceBest',best);localStorage.setItem('raceCoins',bank)}catch(e){}}
function die(){running=false;engStop();sDie();bank+=coins;saveAll();nitB.style.display='none';spdE.style.display='none';bbW.style.display='none';lvB.style.opacity=0;
fireball(P.x,1,P.z,22);sparks(P.x,1,P.z,24);sBoom();
const nb=score>startBest&&score>0;msg.innerHTML=(nb?'🎉 KỶ LỤC MỚI! 🎉':'💥 Xe đã hỏng!')+'<br><b style="font-size:32px">'+score+'</b> điểm<br><small>🛣️ '+Math.round(dist)+' m · tới '+curZ.n+'<br>😱 Suýt chạm: '+st.near+' · 💥 Húc văng: '+st.smash+' · 🏆 Sự kiện: '+st.events+'<br>🪙 +'+coins+' xu (tổng '+bank+')</small>';
setTimeout(()=>{renderGarage();showCar();garE.style.display='block';psB.style.display='none';stB.textContent='Chơi lại';ov.style.display='flex'},900)}
function pause(){if(!running||paused)return;paused=true;engStop();msg.innerHTML='Tạm dừng ⏸';garE.style.display='none';stB.textContent='Tiếp tục';ov.style.display='flex';psB.style.display='none'}
function resume(){paused=false;ov.style.display='none';psB.style.display='block';last=performance.now();engStart()}
stB.onclick=e=>{e.stopPropagation();if(paused)resume();else start()};
psB.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();pause()});
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause()});
function useNitro(){if(!running||paused||nitroOn>0)return;if(nitro<25){pop('Chưa đủ nitro!',P.x,2.5,P.z-6,'#9FE8FF',16);return}nitroOn=nitro/NMAX()*4;sNitro();flash('#36A0FF',0.3);shake=0.3}
nitB.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();useNitro()});
const keys={};document.addEventListener('keydown',e=>{if(!keys[e.key]){if(e.key==='ArrowLeft'||e.key==='a')laneStep(-1);if(e.key==='ArrowRight'||e.key==='d')laneStep(1)}keys[e.key]=1;if(e.key===' '||e.key==='ArrowUp'){e.preventDefault();useNitro()}});document.addEventListener('keyup',e=>{keys[e.key]=0});
// Điều khiển: kéo ngang ở bất kỳ đâu
let tId=null,tx0=0,tTx=0,tt0=0,tMoved=0;
const nearLane=x=>LANES.reduce((b,v,j)=>Math.abs(v-x)<Math.abs(LANES[b]-x)?j:b,0);
function laneStep(d){const l=Math.max(0,Math.min(3,nearLane(P.tx)+d));P.tx=LANES[l];if(running&&!paused)snd(500+l*60,700+l*60,0.06,'sine',0.025)}
function dragTo(cx){const dx=cx-tx0;tMoved=Math.max(tMoved,Math.abs(dx));P.tx=Math.max(-XMAX,Math.min(XMAX,tTx+dx/(wrap.clientWidth||360)*13))}
function release(cx){const dx=cx-tx0,dtm=performance.now()-tt0;if(dtm<230&&Math.abs(dx)>22){P.tx=tTx;laneStep(dx>0?1:-1)}else{const l=nearLane(P.tx);if(Math.abs(LANES[l]-P.tx)<1.1)P.tx=LANES[l]}}
wrap.addEventListener('touchstart',e=>{if(e.target.closest('button')||!running||paused)return;const t=e.changedTouches[0];tId=t.identifier;tx0=t.clientX;tTx=P.tx;tt0=performance.now();tMoved=0},{passive:true});
document.addEventListener('touchmove',e=>{e.preventDefault();for(const t of e.changedTouches)if(t.identifier===tId)dragTo(t.clientX)},{passive:false});
document.addEventListener('touchend',e=>{for(const t of e.changedTouches)if(t.identifier===tId){tId=null;release(t.clientX)}});
let mDown=false;wrap.addEventListener('mousedown',e=>{if(e.target.closest('button')||!running)return;mDown=true;tx0=e.clientX;tTx=P.tx;tt0=performance.now()});document.addEventListener('mousemove',e=>{if(mDown)dragTo(e.clientX)});document.addEventListener('mouseup',e=>{if(mDown){mDown=false;release(e.clientX)}});
// Mũi tên chỉ hướng
const indPool=[];let indUsed=0;
function ind(x,y,z,cls,ic,dist){const[a,b,vis]=scr(x,y,z),m=8;if(vis&&a>m&&a<100-m&&b>m+5&&b<100-m)return false;let d=indPool[indUsed];
if(!d){d=document.createElement('div');d.innerHTML='<b>➤</b><span></span><i></i>';lbls.appendChild(d);indPool.push(d)}indUsed++;let ex,ey,ang;
if(!vis){ex=Math.max(m,Math.min(100-m,100-a));ey=100-m-4;ang=Math.PI/2}else{const W=wrap.clientWidth||1,H=wrap.clientHeight||1;let dx=(a-50)*W,dy=(b-50)*H;const k=Math.min((50-m)*W/Math.abs(dx||1e-6),(50-m-2)*H/Math.abs(dy||1e-6));ex=50+dx*k/W;ey=50+dy*k/H;ang=Math.atan2(dy,dx)}
if(d._c!==cls){d.className='ind '+cls;d._c=cls}d.style.display='block';d.style.left=ex+'%';d.style.top=ey+'%';d.firstChild.style.transform='rotate('+ang+'rad) translateX(24px)';if(d._i!==ic){d.children[1].textContent=ic;d._i=ic}const t=dist?Math.round(dist)+'m':'';if(d._t!==t){d.children[2].textContent=t;d._t=t}return true}


// ================= PHÒNG TRƯNG BÀY XE (màn hình chính) =================
const SR=new THREE.Scene();SR.fog=new THREE.Fog(0x020203,16,40);SR.background=new THREE.Color(0x020203);
const srCam=new THREE.PerspectiveCamera(38,1,0.3,200);
{const es=new THREE.Scene();es.add(new THREE.Mesh(new THREE.SphereGeometry(40,24,12),new THREE.MeshBasicMaterial({color:0x020204,side:THREE.BackSide})));
 const box=(w,h,x,y,z,c,k)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color:new THREE.Color(c).multiplyScalar(k),side:THREE.DoubleSide}));m.position.set(x,y,z);m.lookAt(0,0,0);es.add(m)};
 box(26,6,0,28,0,0xffffff,1.6);box(14,8,-26,8,6,0xffffff,1.2);box(14,8,24,9,-8,0xffffff,1);box(2,30,-18,4,-22,0xFF2A8A,5);box(2,30,20,4,-20,0x2AD8FF,5);box(40,1.5,0,-1,26,0xFF7A1A,3);
 SR.environment=pmrem.fromScene(es,0.02).texture}
const srFloor=new THREE.Mesh(new THREE.CircleGeometry(40,64),new THREE.MeshStandardMaterial({color:0x040406,metalness:0.35,roughness:0.3,envMapIntensity:0.6}));srFloor.rotation.x=-Math.PI/2;srFloor.receiveShadow=true;SR.add(srFloor);
const gridT=canvasTex(256,256,(g,w,h)=>{g.strokeStyle='rgba(255,120,40,.5)';g.lineWidth=2;for(let i=0;i<=w;i+=32){g.beginPath();g.moveTo(i,0);g.lineTo(i,h);g.stroke();g.beginPath();g.moveTo(0,i);g.lineTo(w,i);g.stroke()}});gridT.wrapS=gridT.wrapT=THREE.RepeatWrapping;gridT.repeat.set(10,10);
const grid=new THREE.Mesh(new THREE.CircleGeometry(40,64),new THREE.MeshBasicMaterial({map:gridT,transparent:true,opacity:0.18,blending:THREE.AdditiveBlending,depthWrite:false}));grid.rotation.x=-Math.PI/2;grid.position.y=0.01;SR.add(grid);
const turn=new THREE.Group();SR.add(turn);
{const t=new THREE.Mesh(new THREE.CylinderGeometry(3.6,3.8,0.22,72),new THREE.MeshStandardMaterial({color:0x14161c,metalness:0.9,roughness:0.25}));t.position.y=0.11;t.receiveShadow=true;turn.add(t);
 const r=new THREE.Mesh(new THREE.TorusGeometry(3.7,0.05,8,96),new THREE.MeshBasicMaterial({color:new THREE.Color(0xFF6A1A).multiplyScalar(3)}));r.rotation.x=Math.PI/2;r.position.y=0.2;turn.add(r);
 for(let i=0;i<24;i++){const d=new THREE.Mesh(new THREE.BoxGeometry(0.12,0.03,0.4),new THREE.MeshBasicMaterial({color:new THREE.Color(i%2?0x2AD8FF:0xFF2A8A).multiplyScalar(2.5)}));const a=i/24*Math.PI*2;d.position.set(Math.cos(a)*3.3,0.23,Math.sin(a)*3.3);d.rotation.y=-a;turn.add(d)}}
// Tường neon phía sau
const neon=[];for(let i=0;i<9;i++){const a=-1.25+i*0.31,c=[0xFF2A8A,0xFF7A1A,0x2AD8FF][i%3],m=new THREE.Mesh(new THREE.BoxGeometry(0.18,rp(4,8),0.18),new THREE.MeshBasicMaterial({color:new THREE.Color(c).multiplyScalar(3.5)}));
 m.position.set(Math.sin(a)*16,m.geometry.parameters.height/2,-Math.cos(a)*16);SR.add(m);neon.push(m);const p=new THREE.PointLight(c,0.6,14);p.position.copy(m.position);if(i%3===1)SR.add(p)}
const ban=new THREE.Mesh(new THREE.PlaneGeometry(12,2.2),new THREE.MeshBasicMaterial({map:canvasTex(512,96,(g,w,h)=>{g.fillStyle='#000';g.fillRect(0,0,w,h);g.font='italic 900 70px sans-serif';g.textAlign='center';g.textBaseline='middle';const gr=g.createLinearGradient(0,0,w,0);gr.addColorStop(0,'#FF3A1A');gr.addColorStop(0.5,'#FFD23F');gr.addColorStop(1,'#FF3A1A');g.fillStyle=gr;g.fillText('SIÊU TỐC',w/2,h/2+4)}),blending:THREE.AdditiveBlending,transparent:true,color:new THREE.Color(1.6,1.6,1.6)}));
// Ánh sáng studio
SR.add(new THREE.HemisphereLight(0x8090ff,0x100808,0.25));
const spot=new THREE.SpotLight(0xfff4e8,3,40,0.42,0.55,1.2);spot.position.set(0,14,4);spot.castShadow=true;spot.shadow.mapSize.set(1024,1024);spot.shadow.bias=-0.0005;SR.add(spot);SR.add(spot.target);
const rimA=new THREE.PointLight(0xFF2A8A,3.5,16);rimA.position.set(-6,2.5,-4);SR.add(rimA);const rimB=new THREE.PointLight(0x2AD8FF,3.5,16);rimB.position.set(6,2.5,-4);SR.add(rimB);
const beam=new THREE.Mesh(new THREE.ConeGeometry(5,14,48,1,true),new THREE.MeshBasicMaterial({map:canvasTex(16,128,g=>{const gr=g.createLinearGradient(0,0,0,128);gr.addColorStop(0,'rgba(255,255,255,.0)');gr.addColorStop(0.2,'rgba(255,255,255,.08)');gr.addColorStop(1,'rgba(255,255,255,.22)');g.fillStyle=gr;g.fillRect(0,0,16,128)}),transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));beam.position.set(0,7,0);SR.add(beam);
const srDust=(()=>{const n=220,p=new Float32Array(n*3);for(let i=0;i<n;i++){const a=rp(0,6.28),r=Math.sqrt(Math.random())*4.5;p[i*3]=Math.cos(a)*r;p[i*3+1]=rp(0,12);p[i*3+2]=Math.sin(a)*r}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(p,3));
 const m=new THREE.Points(g,new THREE.PointsMaterial({map:radT,size:0.12,transparent:true,opacity:0.7,depthWrite:false,blending:THREE.AdditiveBlending,color:0xFFE9C8}));SR.add(m);return m})();
let srCar=null,srSpin=0;
function showCar(){if(srCar)turn.remove(srCar);srCar=CARS[carSel].b();srCar.traverse(o=>{if(o.isMesh)o.castShadow=true});srCar.scale.setScalar(1);srCar.position.y=0.22;turn.add(srCar);srSpin=3}
function revSound(){if(!AC)return;snd(80,320,0.5,'sawtooth',0.07);setTimeout(()=>snd(320,140,0.5,'sawtooth',0.05),450)}
function updShow(dt){srSpin*=1-Math.min(1,dt*1.5);turn.rotation.y+=dt*(0.35+srSpin);const a=T*0.12;srCam.aspect=cam.aspect;const hf=2*Math.atan(Math.tan(srCam.fov*Math.PI/360)*srCam.aspect),R2=Math.max(8,2.9/Math.tan(hf/2));srCam.position.set(Math.sin(a)*R2,2.4+R2*0.12+Math.sin(T*0.3)*0.3,Math.cos(a)*R2);srCam.lookAt(0,-R2*0.075,0);srCam.updateProjectionMatrix();
 neon.forEach((n,i)=>n.material.color.setScalar(0).add(new THREE.Color([0xFF2A8A,0xFF7A1A,0x2AD8FF][i%3]).multiplyScalar(2.5+Math.sin(T*3+i)*1.2)));
 const pa=srDust.geometry.attributes.position.array;for(let i=1;i<pa.length;i+=3){pa[i]+=dt*0.25;if(pa[i]>12)pa[i]=0}srDust.geometry.attributes.position.needsUpdate=true;
 if(srCar&&srCar.wheels)srCar.wheels.forEach(w=>(w.spin||w).rotation.x-=dt*srSpin*4);if(srCar&&srCar.siren)srCar.siren.forEach((s,k)=>s.visible=Math.floor(T*6+k)%2===0)}
showCar();


// ================= VÒNG LẶP =================
reset();running=false;renderGarage();spdE.innerHTML=gaugeHTML();let tvLast=0;
let last=performance.now(),camX=0,tilt=0;
const streakG=new THREE.BoxGeometry(0.04,0.04,5),skidM=new THREE.MeshBasicMaterial({color:0x111111,transparent:true,opacity:0.5,depthWrite:false}),skidG=new THREE.PlaneGeometry(0.3,1.2);skidG.rotateX(-Math.PI/2);
function loop(now){const dt=Math.min((now-last)/1000,0.05);last=now;T+=dt;const act=running&&!paused;lbUsed=0;indUsed=0;
if(act&&cdT>0){const pv=Math.ceil(cdT);cdT-=dt;const nv=Math.ceil(cdT);if(nv!==pv&&nv>0){snd(660,660,0.18,'square',0.06);showLv('<span style="font-size:90px;font-style:italic;color:'+['#7CFF6B','#FFD23F','#FF3A1A'][nv-1]+'">'+nv+'</span>',700);lightsE.className='l'+nv}
 if(cdT<=0){snd(1320,1320,0.4,'square',0.07);showLv('<span style="font-size:80px;font-style:italic;color:#7CFF6B">GO!</span>',700);lightsE.className='go';setTimeout(()=>lightsE.className='',900);P.v=22;nitroOn=0.6;sNitro();flash('#ffffff',0.3);shake=0.4}engSet(18+Math.random()*6,false)}
else if(act){perfWatch(dt);
// ---- Tốc độ ----
const base=(24+Math.min(dist/110,36))*car.sp;if(nitroOn>0){nitroOn-=dt;nitro=Math.max(0,nitro-NMAX()/4*dt)}if(boostT>0)boostT-=dt;slowK+=(1-slowK)*Math.min(1,dt*0.8);
const tv=base*(nitroOn>0?1.45:1)*(boostT>0?1.3:1)*slowK;tvLast=P.v;P.v+=(tv-P.v)*Math.min(1,dt*(nitroOn>0?3:1.6));
P.z-=P.v*dt;dist=-P.z;score+=0;const dS=Math.floor(dist)-Math.floor(dist-P.v*dt);if(dS>0)score+=dS*(dblT>0?2:1);
// ---- Lái ----

P.txs+=(P.tx-P.txs)*Math.min(1,dt*14);let tgt=P.txs;if(slipT>0){slipT-=dt;tgt+=Math.sin(T*9)*2.5}const dx=tgt-P.x,kS=(26+P.v*0.28)*car.hd*(air>0?0.35:1),cS=2*Math.sqrt(kS)*0.92,lvMax=(11+P.v*0.16)*car.hd;
P.lv+=(dx*kS-P.lv*cS)*dt;P.lv=Math.max(-lvMax,Math.min(lvMax,P.lv));P.x+=P.lv*dt;if(Math.abs(P.x)>XMAX){P.x=Math.sign(P.x)*XMAX;P.lv*=-0.25}const mv=P.lv*dt;
P.yaw+=((-P.lv)*0.026-P.yaw)*Math.min(1,dt*9);if(Math.abs(P.x)>=XMAX-0.01&&Math.abs(dx)>0.3&&Math.random()<0.6){sparks(P.x+Math.sign(P.x)*0.95,0.45,P.z+0.5,3);if(Math.random()<0.1)sZap()}
// ---- Nhảy dốc ----
if(air>0||P.y>0){P.vy-=24*dt;P.y+=P.vy*dt;air+=dt;if(P.y<=0){P.y=0;sLand();shake=Math.max(shake,0.3);smoke(P.x,0.3,P.z+1,7,curZ.snow?0xffffff:0xCFC6B8,1.1);sparks(P.x,0.2,P.z+1.5,8);
 if(air>0.5){const g=gain(Math.round(air*150));st.air++;banner('🛫 BAY '+air.toFixed(1)+'s','+'+g,'#1E8AFF');nitro=Math.min(NMAX(),nitro+12)}air=0}}
// ---- Bộ đếm ----
if(inv>0)inv-=dt;if(spinT>0)spinT-=dt;if(shieldT>0)shieldT-=dt;if(magT>0)magT-=dt;if(starT>0)starT-=dt;if(dblT>0)dblT-=dt;if(comboT>0){comboT-=dt;if(comboT<=0)combo=0}if(coinStreakT>0){coinStreakT-=dt;if(coinStreakT<=0)coinStreak=0}
if(score>best){best=score;bs.textContent=best;if(!annBest&&startBest>0){annBest=true;pop('🏆 KỶ LỤC MỚI!',P.x,4,P.z-8,'#FFE36B',26);seq([784,988,1175,1568],0.06,60)}}
// ---- Chặng & sự kiện ----
const zEnd=zone*ZL;if(!gate&&dist>zEnd-190){gate=makeGate(zone+1);gate.position.z=-zEnd;S.add(gate)}
if(dist>=zEnd){zone++;lvE.textContent=zone;setZone(zone);decor.forEach(d=>{if(d.m&&d.m.blink)d.m.blink.visible=Math.floor(T*1.3+d.z)%2===0;if(d.z<P.z-110)refreshDeco(d)});flash('#ffffff',0.6);sZone();for(let i=0;i<5;i++)setTimeout(firework,i*180);const g=gain(300*zone);
 for(let i=0;i<60;i++)part(P.x+rp(-6,6),rp(4,9),P.z-rp(2,10),addM(RB[i%6]),new THREE.Vector3(rp(-4,4),rp(-1,4),rp(-3,3)),rp(0.8,1.4),0.6,4);
 showLv('🏁 Chặng '+zone+(zone>ZONES.length?' · Vòng '+Math.ceil(zone/ZONES.length):'')+'<br><span style="font-size:28px">'+curZ.n+'</span><br><span style="font-size:14px">+'+g+' điểm · tốc độ tăng!</span>',2600);nextEvD=(zone-1)*ZL+ZL*0.45}
if(!event&&dist>nextEvD){nextEvD=Infinity;startEvent()}
if(gate&&gate.position.z>P.z+20){S.remove(gate);gate=null}
// ---- Sinh ----
if(P.z<segZ){spawnRow();segZ=P.z-rp(24,34)*Math.max(0.7,1-zone*0.04)}
// ---- Xe trên đường ----
for(let i=traffic.length-1;i>=0;i--){const t=traffic[i];t.z-=t.v*dt;
 if(t.lcT!==undefined){t.lcT-=dt;const bl=t.m.children;if(t.lcT<1.2&&t.lcT>0&&!t.bl){t.bl=[-1,1].map(s=>{const g=glowSp(0xFFA020,1.2,0.9);g.position.set(t.lc*t.W/2,0.8,s*t.L*0.45);t.m.add(g);return g})}if(t.bl)t.bl.forEach(b=>b.visible=Math.floor(T*6)%2===0);
  if(t.lcT<=0){const nl=t.lane+t.lc;if(nl>=0&&nl<=3&&laneFree(t.z,nl)){t.lane=nl}t.lcT=undefined;if(t.bl){t.bl.forEach(b=>t.m.remove(b));t.bl=null}}}
 const lx=LANES[t.lane];t.x+=(lx-t.x)*Math.min(1,dt*1.5);t.m.position.set(t.x,0,t.z);t.m.rotation.y=(lx-t.x)*-0.08;if(t.m.wheels)t.m.wheels.forEach(w=>(w.spin||w).rotation.x-=t.v*dt/0.4);
 if(!t.dead&&P.y<1.3&&hitBox(t,t.W,t.L))crash(t,'🚗');
 if(!t.passed&&t.z>P.z+t.L/2+2){t.passed=true;if(!t.dead&&P.y<1.5){const gap=Math.abs(t.x-P.x)-(t.W/2+0.9);if(gap<1.15){combo++;comboT=3;st.near++;const g=gain(40*Math.min(combo,8));nitro=Math.min(NMAX(),nitro+8);sWhoosh();if(Math.random()<0.4)sHorn();
   banner('SUÝT CHẠM!','+'+g+(combo>1?'  ·  COMBO x'+combo:''),combo>2?'#FFB020':'#FF5A1A');for(let j=0;j<10;j++)part((t.x+P.x)/2,1,P.z,addM(0xffffff),new THREE.Vector3(rp(-2,2),rp(0,2),rp(4,10)),0.6,2,0,streakG)}}}
 if(t.z>P.z+25||t.z<P.z-320){if(!t.dead)S.remove(t.m);traffic.splice(i,1)}}
for(let i=obs.length-1;i>=0;i--){const o=obs[i];
 if(o.kind==='bar'){o.m.lights.forEach((l,k)=>l.visible=Math.floor(T*5+k)%2===0);if(!o.dead&&P.y<1.2&&hitBox(o,o.w,o.d))crash(o,'🚧')}
 else if(o.kind==='oil'){if(P.y<0.3&&hitBox(o,o.w,o.d)&&slipT<=0&&starT<=0){slipT=1.1;pop('🛢️ Trơn trượt!',P.x,2.5,P.z-5,'#C8A0FF',20);snd(600,200,0.6,'triangle',0.06)}}
 else if(o.kind==='pad'){o.m.pad.material.opacity=0.6+Math.sin(T*10)*0.4;if(P.y<0.5&&hitBox(o,o.w,o.d)&&boostT<1){boostT=1.6;sNitro();banner('⏩ TĂNG TỐC','','#00B8D4');nitro=Math.min(NMAX(),nitro+6)}}
 else if(o.kind==='ramp'){if(Math.abs(o.x-P.x)<1.9&&P.z<o.z&&P.z>o.z-5&&air<=0){P.y=Math.max(P.y,(o.z-P.z)/5*1.3);onRamp=o}else if(onRamp===o&&P.z<=o.z-5){onRamp=null;P.vy=7+P.v*0.09;P.y=1.3;air=0.01;sJump()}}
 else if(o.kind==='barrel'){if(o.vz)o.z+=o.vz*dt;o.m.position.z=o.z;o.m.body.rotation.x+=dt*4;if(!o.dead&&P.y<1.1&&hitBox(o,o.w,o.d))crash(o,'🛢️')}
 if(o.z>P.z+20){if(!o.dead)S.remove(o.m);obs.splice(i,1)}}
for(let i=coinsA.length-1;i>=0;i--){const c=coinsA[i];c.m.rotation.y+=dt*5;if(magT>0&&Math.abs(c.z-P.z)<30){c.x+=(P.x-c.x)*Math.min(1,dt*6);c.z+=(P.z-c.z)*Math.min(1,dt*4);c.m.position.set(c.x,c.y,c.z)}
 if(Math.abs(c.x-P.x)<1.4&&Math.abs(c.z-P.z)<2&&Math.abs(c.y-(P.y+0.8))<1.8){coinStreak++;coinStreakT=1.2;const v=Math.round((car.coin||1)*(dblT>0?2:1));coins+=v;gain(10);sCoin(coinStreak);for(let j=0;j<6;j++)part(c.x,c.y,c.z,addM(0xFFD700),new THREE.Vector3(rp(-2,2),rp(1,4),rp(-1,2)),0.5,2,4);S.remove(c.m);coinsA.splice(i,1);continue}
 if(c.z>P.z+10){S.remove(c.m);coinsA.splice(i,1)}}
for(let i=items.length-1;i>=0;i--){const it=items[i];it.m.rotation.y+=dt*2;it.m.position.y=1.2+Math.sin(T*3+i)*0.25;
 if(Math.abs(it.x-P.x)<1.6&&Math.abs(it.z-P.z)<2.2){S.remove(it.m);items.splice(i,1);sPower();
  if(it.k==='nitro'){nitro=Math.min(NMAX(),nitro+35);banner('⛽ NITRO','+35%','#1E6AFF');flash('#36A0FF',0.2)}else{const p=PW[it.k];banner(p.e+' '+p.n.replace('!','').toUpperCase(),'',HEX(p.c));flash(HEX(p.c),0.25);
   if(it.k==='shield')shieldT=15;else if(it.k==='magnet')magT=9;else if(it.k==='star')starT=6;else if(it.k==='double')dblT=12;else if(it.k==='repair'){lives=Math.min(car.hp+2,lives+1);lfE.textContent='❤️'+lives;sLife()}}continue}
 if(it.z>P.z+10){S.remove(it.m);items.splice(i,1)}}
// ---- Sự kiện ----
if(event){event.T-=dt;if(event.t!=='truck')bbF.style.width=Math.max(0,event.T/24*100)+'%';if(event.T<=0)endEvent(event.t==='truck'?false:true,event.t==='police'?'🚓 Cắt đuôi cảnh sát!':event.t==='heli'?'🚁 Thoát khỏi trực thăng!':'🚚 Xe tải bỏ chạy!')}
for(let i=police.length-1;i>=0;i--){const p=police[i];p.m.siren.forEach((s,k)=>s.visible=Math.floor(T*(p.st==='ram'?14:7)+k)%2===0);
 if(p.st==='leave'){p.v+=(P.v*0.6-p.v)*dt;p.z-=p.v*dt;if(p.z>P.z+40){S.remove(p.m);police.splice(i,1);continue}}
 else{const tz=P.z+3+i*2.5;p.v=P.v+Math.max(-8,Math.min(14,(p.z-tz)*1.2));p.z-=p.v*dt;p.stT-=dt;
  if(p.st==='chase'){p.x+=((P.x+(i?2.8:-2.8))-p.x)*Math.min(1,dt*1.5);if(Math.abs(p.z-P.z)<6&&p.stT<=0){p.st='warn';p.stT=0.7;p.tx=P.x;pop('⚠️',p.x,2.5,p.z,'#FF5A5A',26)}}
  else if(p.st==='warn'){p.x+=Math.sin(T*30)*0.03;if(p.stT<=0){p.st='ram';p.stT=0.8;p.tx=P.x;sHorn()}}
  else if(p.st==='ram'){p.x+=(p.tx-p.x)*Math.min(1,dt*5);if(p.stT<=0){p.st='chase';p.stT=rp(2,3.5)}}
  p.x=Math.max(-XMAX,Math.min(XMAX,p.x));
  if(!p.dead&&P.y<1.3&&hitBox(p,1.8,4.4)){if(starT>0||nitroOn>0){smash(p,'🚓 Húc văng cảnh sát!',400);police.splice(i,1);st.smash++;continue}crash({x:p.x,z:p.z,m:new THREE.Group()},'🚓');p.z+=6;p.st='chase';p.stT=2}
  for(const t of traffic)if(!t.dead&&Math.abs(t.x-p.x)<t.W/2+0.9&&Math.abs(t.z-p.z)<t.L/2+2.2){smash(p,'🚓💥 Cảnh sát đâm xe!',350);police.splice(i,1);st.smash++;t.dead=1;S.remove(t.m);break}
  if(!police.includes(p))continue}
 p.m.position.set(p.x,0,p.z);p.m.rotation.y=(p.tx-p.x)*(p.st==='ram'?-0.1:0);p.m.wheels.forEach(w=>(w.spin||w).rotation.x-=p.v*dt/0.36)}
if(event&&event.t==='police'&&!police.length)endEvent(true,'🚓 Hạ hết cảnh sát!');
if(truck){const k=truck;if(k.leave){k.z-=(P.v+20)*dt;if(k.z<P.z-260){S.remove(k.m);truck=null}}else{const tz=P.z-38;k.z+=((tz-k.z)*1.5-P.v)*dt;k.sw-=dt;if(k.sw<=0){k.sw=rp(1.5,3);k.tx=[-3,0,3][rnd(3)]}k.x+=(k.tx-k.x)*Math.min(1,dt*1.2);
  k.dropT-=dt;if(k.dropT<=0&&event){k.dropT=rp(0.8,1.3);const l=LANES.reduce((b,v,j)=>Math.abs(v-k.x)<Math.abs(LANES[b]-k.x)?j:b,0)+rnd(2)*(Math.random()<0.5?-1:1),ln=Math.max(0,Math.min(3,l));const o=addObs('barrel',ln,k.z+7.5);o.vz=rp(2,5);o.m.position.y=1.5;snd(200,80,0.2,'square',0.05)}
  if(P.y<1.6&&Math.abs(k.x-P.x)<2.2&&Math.abs(k.z-P.z)<7&&inv<=0){if(nitroOn>0||starT>0){event.hp--;bbF.style.width=(event.hp/event.max*100)+'%';sCrash();shake=0.8;inv=0.8;P.v*=0.7;k.z-=12;fireball(k.x,2,k.z+6,10);sparks(k.x,2,k.z+6,20);
    banner('💥 HÚC XE TẢI','còn '+event.hp+' lần','#FF3A1A');if(event.hp<=0){sBoom();flash('#FF8A3A',0.6);fireball(k.x,2,k.z,24);sparks(k.x,2,k.z,30);fly.push({m:k.m,vx:rp(-3,3),vy:10,vz:-5,rx:rp(-2,2),rz:rp(-2,2),t:2.5});truck=null;st.smash++;endEvent(true,'🚚 HẠ GỤC XE TẢI!')}}
   else{crash({x:k.x,z:k.z,m:new THREE.Group()},'🚚');P.v*=0.5}}}
 if(truck){k.m.position.set(k.x,0,k.z);k.m.wheels.forEach(w=>w.rotation.x-=P.v*dt/0.55)}}
if(heli){const h=heli;if(h.leave){h.z-=(P.v+30)*dt;h.m.position.y+=dt*6;if(h.z<P.z-300){S.remove(h.m);heli=null}}else{h.z=P.z-50;h.x=Math.sin(T*0.6)*4;h.dropT-=dt;
  if(h.dropT<=0&&event){h.dropT=rp(0.7,1.1);const tx=Math.random()<0.55?P.x+rp(-1,1):LANES[rnd(4)],tz=P.z-rp(55,75),m=new THREE.Mesh(new THREE.RingGeometry(1.6,2.2,32),new THREE.MeshBasicMaterial({color:0xFF2020,transparent:true,opacity:0.7,side:THREE.DoubleSide,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.set(tx,0.08,tz);S.add(m);
   const dot=new THREE.Mesh(new THREE.CircleGeometry(2.2,24),new THREE.MeshBasicMaterial({color:0xFF2020,transparent:true,opacity:0.2,depthWrite:false}));dot.rotation.x=-Math.PI/2;dot.position.y=0.01;m.add(dot);targets.push({m,x:tx,z:tz,bomb:null})}}
 if(heli){h.m.position.set(h.x,h.leave?h.m.position.y:12,h.z);h.m.rot.rotation.y+=dt*25;h.m.trot.rotation.x+=dt*30;h.m.rotation.z=Math.sin(T*0.6)*0.15;h.m.blink.visible=Math.floor(T*3)%2===0}}
for(let i=targets.length-1;i>=0;i--){const t=targets[i],d=t.z-P.z;t.m.material.opacity=0.4+Math.abs(Math.sin(T*10))*0.5;t.m.scale.setScalar(1+Math.sin(T*8)*0.08);
 if(d>-14&&!t.bomb){const b=new THREE.Mesh(new THREE.SphereGeometry(0.5,10,8),mat(0x222222));b.position.set(t.x,12,t.z);S.add(b);t.bomb=b}
 if(t.bomb){t.bomb.position.y=Math.max(0.5,12*Math.min(1,Math.max(0,(-d-2)/12)))}
 if(d>-2){sBoom();shake=Math.max(shake,0.6);fireball(t.x,0.8,t.z,16);sparks(t.x,0.5,t.z,18);ring(t.x,t.z,0xFF8A3A,6,0.2,0.5);
  if(Math.abs(t.x-P.x)<2.4&&Math.abs(d)<4&&P.y<2)crash({x:t.x,z:t.z,m:new THREE.Group()},'💣');S.remove(t.m);if(t.bomb)S.remove(t.bomb);targets.splice(i,1)}}
// ---- Cảnh báo ----
{let warn=0;police.forEach(p=>{if(p.st==='warn'||p.st==='ram')warn=Math.max(warn,0.9)});targets.forEach(t=>{if(Math.abs(t.x-P.x)<2.6&&t.z-P.z>-25)warn=Math.max(warn,0.8)});
 traffic.forEach(t=>{if(t.bl&&Math.abs(t.z-P.z)<12&&Math.abs(LANES[Math.max(0,Math.min(3,t.lane+t.lc))]-P.x)<1.6)warn=Math.max(warn,0.6)});
 if(warn>0.45&&warnPrev<=0.45&&dangerS<=0&&inv<=0){dangerS=2;snd(880,660,0.12,'square',0.04);setTimeout(()=>snd(880,660,0.12,'square',0.04),160)}if(dangerS>0)dangerS-=dt;warnPrev=warn;
 let vo=warn*0.5*(0.75+Math.sin(T*10)*0.25);if(lives===1)vo=Math.max(vo,0.18+Math.sin(T*4)*0.1);if(vgT>0){vgT-=dt;vo=Math.max(vo,0.55)}vg.style.opacity=vo.toFixed(2)}
// ---- HUD ----
hudT-=dt;if(hudT<=0){hudT=0.08;sc.textContent=score;setGauge(Math.round(P.v*3.6),dist);nitF.style.height=(nitro/NMAX()*100)+'%';nitB.classList.toggle('rd',nitro>=25&&nitroOn<=0);nitB.classList.toggle('on',nitroOn>0);
 let h='<span>🪙 '+coins+'</span>';if(combo>1)h+='<span>😱 x'+combo+'</span>';[['🛡️',shieldT],['🧲',magT],['⭐',starT],['x2',dblT]].forEach(([e,t])=>{if(t>0)h+='<span>'+e+' '+Math.ceil(t)+'s</span>'});if(h!==hudS){hudS=h;pwE.innerHTML=h}}
engSet(P.v,nitroOn>0)}
// ================= HIỆU ỨNG XE =================
pc.position.set(P.x,P.y,P.z);pc.rotation.y=P.yaw+(spinT>0?Math.sin(spinT*12)*0.6:0);pc.rotation.z=-P.yaw*0.6;pc.rotation.x=air>0?Math.max(-0.25,Math.min(0.2,-P.vy*0.02)):0;
pc.visible=!(inv>0&&inv<2&&Math.floor(T*12)%2&&running);pc.wheels.forEach((w,i)=>{(w.spin||w).rotation.x-=P.v*dt/0.36;if(i<2)w.rotation.y=P.yaw*3});
const nOn=nitroOn>0;pc.flames.forEach(f=>{const k=nOn?rp(1.1,1.5):boostT>0?0.8:0.01;f.scale.set(k,k,1);f.material.color.setHex(nOn?(Math.random()<0.5?0x36A0FF:0xBFEFFF):0xFF9A3A)});
pc.beams.visible=!!(curZ&&curZ.night);if(pc.siren)pc.siren.forEach((s,k)=>s.visible=Math.floor(T*6+k)%2===0);
if(act){if(nOn)[-1,1].forEach(s=>{puff(P.x+s*0.4,0.45+P.y,P.z+2.5,rp(-0.4,0.4),rp(0,0.4),rp(9,15),0.9,0.2,0.25,Math.random()<0.5?0x36A0FF:0xBFEFFF,0.9,true,radT,0)});
 else if(Math.random()<0.08)puff(P.x-0.5,0.35+P.y,P.z+2.4,0,0.5,3,0.3,1.2,0.6,0xAAAAAA,0.25);
 if(slipT>0||spinT>0)[-1,1].forEach(s=>puff(P.x+s*0.9,0.3,P.z+1.4,rp(-1,1),rp(0.5,1.5),rp(2,5),0.8,3,1,0xDDDDDD,0.5));
 if(P.v>45||nOn||boostT>0){const n=nOn?4:2;for(let j=0;j<n;j++){const a=rp(0,6.28),r=rp(3,7);part(P.x+Math.cos(a)*r,2+Math.sin(a)*r*0.6,P.z-rp(10,25),addM(0xffffff),new THREE.Vector3(0,0,P.v*1.4),1,3,0,streakG)}}
 if(starT>0&&Math.random()<0.7)part(P.x+rp(-1,1),rp(0.5,1.5),P.z+rp(-2,2),addM(RB[rnd(6)]),new THREE.Vector3(0,1,P.v*0.5),0.7,1.5,0);
 if(slipT>0&&Math.random()<0.6){const s=new THREE.Mesh(skidG,skidM);s.position.set(P.x+rp(-0.8,0.8),0.05,P.z+1.5);s.rotation.y=P.yaw;S.add(s);fx.push({m:s,life:2,max:2,g0:1,g1:1,op:0.5})}
 
 if(lives===1&&Math.random()<0.4)puff(P.x,1.1,P.z-1.6,rp(-0.5,0.5),rp(1.5,2.5),rp(4,7),0.6,2.4,1,0x444444,0.6)}
 if(pc.tail){const br=slowK<0.9||spinT>0||P.v<tvLast-1;pc.tail.forEach(g=>g.scale.setScalar(br?1.9:1))}
// Bóng khiên
if(!pc.sh){pc.sh=new THREE.Mesh(new THREE.SphereGeometry(3,20,14),new THREE.MeshBasicMaterial({color:0x6fd8ff,transparent:true,opacity:0.18,depthWrite:false,blending:THREE.AdditiveBlending}));pc.sh.scale.set(0.9,0.6,1.1);pc.sh.position.y=0.8;pc.add(pc.sh)}pc.sh.visible=shieldT>0||starT>0;if(starT>0)pc.sh.material.color.setHSL((T*0.8)%1,1,0.6);else pc.sh.material.color.setHex(0x6fd8ff);
// ================= THẾ GIỚI =================
for(let i=fly.length-1;i>=0;i--){const f=fly[i];f.t-=dt;f.vy-=22*dt;f.m.position.x+=f.vx*dt;f.m.position.y=Math.max(0,f.m.position.y+f.vy*dt);f.m.position.z+=f.vz*dt;f.m.rotation.x+=f.rx*dt;f.m.rotation.z+=f.rz*dt;if(f.t<=0||f.m.position.z>P.z+30){S.remove(f.m);fly.splice(i,1)}}
const rz=P.z-ROADL/2+30;road.position.z=rz;ground.position.z=rz;rails.forEach(r=>r.position.z=rz);sea.position.set(ROADW/2+150+1.5,0.02,rz);
roadM.map.offset.y=(-rz/12)%1;if(groundM.map)groundM.map.offset.y=(-rz/ROADL*40)%1;railT.offset.x=(rz/4)%1;seaT.offset.set(T*0.02,(-rz/ROADL*40+T*0.03)%1);
lamps.forEach(l=>{while(l.position.z>P.z+15)l.position.z-=14*30});
decor.forEach(d=>{if(d.m&&d.m.blink)d.m.blink.visible=Math.floor(T*1.3+d.z)%2===0;if(d.z>P.z+15||!d.m){if(d.m)while(d.z>P.z+15)d.z-=SPAN;refreshDeco(d,d.zi!==zoneIdx||!d.m)}if(d.m.position.z!==d.z)d.m.position.z=d.z;if(d.m.spin)d.m.spin.rotation.y+=dt})
mtn.position.set(P.x*0.5,24,P.z-300);sunSp.position.set(P.x-60,90,P.z-330);sunSp.scale.setScalar(curZ&&curZ.night?40:90);starsP.visible=!!(curZ&&(curZ.stars||curZ.night));starsP.position.set(P.x,0,P.z);
{const Z=curZ,pa=wG.attributes.position.array,mode=Z.snow?1:Z.rain?2:Z.ember?3:Z.leaf?4:0;weather.visible=mode>0;if(mode){wM.color.setHex(mode===1?0xffffff:mode===2?0x9FC8FF:mode===3?0xFF7A1A:0xE8701A);wM.size=mode===2?0.25:0.45;wM.blending=mode===3?THREE.AdditiveBlending:THREE.NormalBlending;
 const vy=mode===1?-4:mode===2?-28:mode===3?3:-2.5;for(let i=0;i<WN;i++){const j=i*3;pa[j+1]+=vy*dt;pa[j]+=(mode===4?Math.sin(T*2+i)*2:mode===1?Math.sin(T+i)*0.6:0)*dt;if(pa[j+1]<0)pa[j+1]+=25;if(pa[j+1]>25)pa[j+1]-=25;if(pa[j+2]-P.z>10)pa[j+2]-=90;if(pa[j+2]-P.z<-80)pa[j+2]+=90}wG.attributes.position.needsUpdate=true}}
updPuffs(dt);clouds.forEach(c=>{c.ox+=c.v*dt;if(c.ox>280)c.ox-=560;c.s.position.set(P.x+c.ox,c.y,P.z+c.oz)});
{const[a,b,vis]=scrB(sunSp.position.x,sunSp.position.y,sunSp.position.z);const on=vis&&!curZ.night&&running?Math.max(0,1-Math.hypot(a-50,b-45)/75):0;updFlare(on,a,b)}
splE.style.opacity=running&&!paused?Math.max(0,Math.min(0.85,(P.v*3.6-190)/170+(nitroOn>0?0.45:0)+(boostT>0?0.25:0))).toFixed(2):0;splE.style.transform='rotate('+(T*40%3)+'deg)';
for(let i=parts.length-1;i>=0;i--){const p=parts[i];p.v.y-=p.grav*dt;p.position.addScaledVector(p.v,dt);p.life-=dt*p.decay;p.scale.setScalar(Math.max(p.life*p.s0,0.01));if(p.life<=0){S.remove(p);parts.splice(i,1)}}
for(let i=fx.length-1;i>=0;i--){const f=fx[i];f.life-=dt;const q=1-f.life/f.max;f.m.scale.setScalar(f.g0+(f.g1-f.g0)*q);f.m.material.opacity=f.op*(1-q);if(f.life<=0){S.remove(f.m);if(f.m.material!==skidM)f.m.material.dispose();fx.splice(i,1)}}
if(act){police.forEach(p=>{if(p.st!=='leave')ind(p.x,1,p.z,'boss','🚓',Math.abs(p.z-P.z))});if(truck&&!truck.leave)ind(truck.x,2,truck.z,'boss','🚚',Math.abs(truck.z-P.z))}
for(let i=indUsed;i<indPool.length;i++)indPool[i].style.display='none';for(let i=lbUsed;i<lbPool.length;i++)lbPool[i].style.display='none';
// ---- Camera ----
if(running&&cdT>0){const q=1-Math.max(0,cdT)/3.3,a=Math.PI*(1-q)*1.2+0.0001,r=7.5+q*1;cam.fov=55;cam.updateProjectionMatrix();cam.position.set(P.x+Math.sin(a)*r,1.6+q*2,P.z+Math.cos(a)*r);cam.lookAt(P.x,0.8,P.z-q*6);camX=P.x}
else if(running||paused){camX+=(P.x*0.7-camX)*Math.min(1,dt*4);const sk=shake;if(shake>0)shake=Math.max(0,shake-dt);const fv=62+Math.min(18,(P.v-24)*0.35)+(nitroOn>0?10:0);camFov+=(fv-camFov)*Math.min(1,dt*3);cam.fov=camFov;cam.updateProjectionMatrix();
 cam.position.set(camX+(Math.random()-0.5)*sk,3.6+P.y*0.6+(Math.random()-0.5)*sk,P.z+8.5);cam.lookAt(camX*0.9+P.x*0.1,1+P.y*0.4,P.z-14);cam.rotateZ(-BEND.value.x*28)}
else{const a=T*0.35;cam.fov=50;cam.updateProjectionMatrix();cam.position.set(P.x+Math.sin(a)*8,2.6,P.z+Math.cos(a)*8);cam.lookAt(P.x,0.8,P.z);pc.wheels.forEach(w=>w.rotation.y=0)}
sun.position.set(P.x-18,40,P.z+2);sun.target.position.set(P.x,0,P.z-14);headL.position.set(P.x,3,P.z-10);
{const k=running&&cdT<=0?1:0,cz=curZ&&curZ.road===2?1.6:1,cx=(Math.sin(dist/520)*0.0011+Math.sin(dist/190+1)*0.00045)*cz*k,cy=(Math.sin(dist/430+2)*0.0005-0.00012)*k;BEND.value.x+=(cx-BEND.value.x)*Math.min(1,dt*2);BEND.value.y+=(cy-BEND.value.y)*Math.min(1,dt*2);
 pq.blur=running?Math.max(0,Math.min(0.55,(P.v-42)/45))+(nitroOn>0?0.45:0)+(boostT>0?0.2:0):0;pq.ca=nitroOn>0?0.55:spinT>0?0.5:0;pq.bloom=curZ&&curZ.night?0.9:0.3}
const menu=!running&&!paused;if(menu){updShow(dt);pq.ex=1;pq.bloom=1.5;pq.blur=0;pq.ca=0}else pq.ex=0;
renderFrame(menu?SR:S,menu?srCam:cam);requestAnimationFrame(loop)}
requestAnimationFrame(loop);
