(function(){
  const cv=document.getElementById('shCanvas'), ctx=cv.getContext('2d');
  const btnStart=document.getElementById('shStart'), btnSend=document.getElementById('shSend'); const scoreEl=document.getElementById('shScore');
  let ship, bullets, foes, running=false, score=0, timer, tick=0;
  function reset(){
    ship={x:cv.width/2,y:cv.height-30,w:20,h:10};
    bullets=[]; foes=[]; for(let i=0;i<6;i++){ foes.push({x:30+i*45,y:40,w:20,h:14,vy:0.3+Math.random()*0.6}); }
    score=0; scoreEl.textContent=score; draw(); running=false;
  }
  function draw(){
    ctx.clearRect(0,0,cv.width,cv.height);
    ctx.fillStyle='rgba(255,255,255,.03)'; ctx.fillRect(0,0,cv.width,cv.height);
    // ship
    ctx.fillStyle='#6ab4ff'; ctx.fillRect(ship.x-10, ship.y-5, 20, 10);
    // bullets
    ctx.fillStyle='#e06b3f'; bullets.forEach(b=>ctx.fillRect(b.x-2,b.y-6,4,6));
    // foes
    ctx.fillStyle='#91c8ff'; foes.forEach(f=>ctx.fillRect(f.x-10,f.y-7,20,14));
  }
  function step(){
    tick++;
    // bullets
    bullets.forEach(b=> b.y-=4); bullets = bullets.filter(b=> b.y>-10);
    // foes move
    foes.forEach(f=>{ f.y += f.vy; if(f.y>cv.height-40){ f.y=40; } });
    // collisions
    bullets.forEach(b=>{
      foes.forEach(f=>{
        if(Math.abs(b.x-f.x)<12 && Math.abs(b.y-f.y)<12){ f.y=40; score+=1; scoreEl.textContent=score; b.y=-100; }
      });
    });
    draw();
  }
  document.addEventListener('keydown', e=>{
    const k=e.key.toLowerCase();
    if(k==='arrowleft'||k==='a') ship.x=Math.max(14, ship.x-8);
    if(k==='arrowright'||k==='d') ship.x=Math.min(cv.width-14, ship.x+8);
    if(k===' '||k==='arrowup'||k==='w') bullets.push({x:ship.x,y:ship.y-8});
  });
  btnStart.addEventListener('click', ()=>{ if(running) return; running=true; clearInterval(timer); timer=setInterval(step,30); });
  window.shSendScore=function(){ window.Telegram.WebApp.sendData(JSON.stringify({action:'score',game:'shooter',score})); };
  btnSend.addEventListener('click', window.shSendScore);
  reset();
})();