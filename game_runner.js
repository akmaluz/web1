(function(){
  const cv=document.getElementById('rnCanvas'), ctx=cv.getContext('2d');
  const btnStart=document.getElementById('rnStart'), btnSend=document.getElementById('rnSend'); const scoreEl=document.getElementById('rnScore');
  let y=140, vy=0, g=0.7, onGround=true, obs=[], t=0, score=0, timer, running=false;
  function reset(){ y=140; vy=0; onGround=true; obs=[]; t=0; score=0; scoreEl.textContent=score; draw(); running=false; }
  function draw(){
    ctx.clearRect(0,0,cv.width,cv.height);
    ctx.fillStyle='rgba(255,255,255,.03)'; ctx.fillRect(0,0,cv.width,cv.height);
    // ground
    ctx.strokeStyle='#3a495a'; ctx.beginPath(); ctx.moveTo(0,160); ctx.lineTo(cv.width,160); ctx.stroke();
    // player
    ctx.fillStyle='#6ab4ff'; ctx.fillRect(40,y-20,16,20);
    // obstacles
    ctx.fillStyle='#e06b3f'; obs.forEach(o=>ctx.fillRect(o.x,160-o.h,o.w,o.h));
    // score
  }
  function step(){
    t++; if(t%50===0) obs.push({x:cv.width, w:12+Math.random()*16, h:10+Math.random()*30});
    obs.forEach(o=> o.x-=4);
    obs = obs.filter(o=> o.x>-40);
    // gravity
    vy += g; y += vy; if(y>140){ y=140; vy=0; onGround=true; }
    // collision
    obs.forEach(o=>{
      if(40+16>o.x && 40<o.x+o.w && y>160-o.h){ window.Telegram.WebApp.showToast('To‘siqqa urildingiz!'); clearInterval(timer); running=false; }
    });
    if(running){ score += 1; scoreEl.textContent = score; }
    draw();
  }
  function jump(){ if(onGround){ vy = -12; onGround=false; } }
  document.addEventListener('keydown', e=>{ if(e.key===' '||e.key.toLowerCase()==='arrowup'||e.key.toLowerCase()==='w') jump(); });
  cv.addEventListener('click', jump);
  btnStart.addEventListener('click', ()=>{ if(running) return; running=true; clearInterval(timer); timer=setInterval(step,30); });
  window.rnSendScore=function(){ window.Telegram.WebApp.sendData(JSON.stringify({action:'score',game:'runner',score})); };
  btnSend.addEventListener('click', window.rnSendScore);
  reset();
})();