(function(){
  const cv = document.getElementById('bncCanvas'), ctx=cv.getContext('2d');
  const btnStart=document.getElementById('bncStart'), btnSend=document.getElementById('bncSend'); const scoreEl=document.getElementById('bncScore');
  let ball, platforms, coins, keys, door, grav=0.4, running=false, score=0, timer;
  function reset(){
    ball={x:40,y:300,vx:0,vy:0,r:10};
    platforms=[
      {x:0,y:340,w:320,h:20},{x:30,y:290,w:80,h:10},
      {x:140,y:250,w:100,h:10},{x:60,y:200,w:80,h:10},
      {x:200,y:160,w:90,h:10},{x:120,y:120,w:80,h:10},
    ];
    coins=[{x:70,y:270},{x:180,y:230},{x:95,y:180},{x:235,y:140}];
    keys=1; door={x:280,y:95,w:24,h:24,open:false};
    score=0; scoreEl.textContent=score;
    draw(); running=false;
  }
  function draw(){
    ctx.clearRect(0,0,cv.width,cv.height);
    ctx.fillStyle='rgba(255,255,255,.03)'; ctx.fillRect(0,0,cv.width,cv.height);
    // platforms
    ctx.fillStyle='#3a495a'; platforms.forEach(p=>ctx.fillRect(p.x,p.y,p.w,p.h));
    // coins
    ctx.fillStyle='#e6b800'; coins.forEach(c=>{ctx.beginPath(); ctx.arc(c.x,c.y,6,0,Math.PI*2); ctx.fill();});
    // door
    ctx.fillStyle=door.open?'#2aa34a':'#6b2a2a'; ctx.fillRect(door.x,door.y,door.w,door.h);
    // key indicator
    ctx.fillStyle='#ddd'; ctx.fillText('🔑:'+keys, 6, 14);
    // ball
    ctx.fillStyle='#ffa143'; ctx.beginPath(); ctx.arc(ball.x,ball.y,ball.r,0,Math.PI*2); ctx.fill();
  }
  function step(){
    ball.vy+=grav; ball.x+=ball.vx; ball.y+=ball.vy;
    // bounds
    if(ball.x<ball.r) {ball.x=ball.r; ball.vx*=-0.6}
    if(ball.x>cv.width-ball.r){ball.x=cv.width-ball.r; ball.vx*=-0.6}
    if(ball.y>cv.height-ball.r){ball.y=cv.height-ball.r; ball.vy*=-0.6}
    // platforms collision
    platforms.forEach(p=>{
      if(ball.x>p.x-ball.r && ball.x<p.x+p.w+ball.r && ball.y+ball.r>p.y && ball.y+ball.r<p.y+ball.vy+10){
        // top hit
        ball.y=p.y-ball.r; ball.vy*=-0.6;
      }
    });
    // collect coins
    coins = coins.filter(c=>{
      const d = Math.hypot(ball.x-c.x, ball.y-c.y);
      if(d<ball.r+7){ score+=10; scoreEl.textContent=score; return false; }
      return true;
    });
    // key (simulate single key at top-left)
    if(keys && ball.x<20 && ball.y<20){ keys=0; door.open=true; }
    // door reach
    if(door.open && ball.x>door.x && ball.y<door.y+door.h && ball.y>door.y-10){
      stop(); window.Telegram.WebApp.showToast('Darvozadan o‘tdingiz!');
    }
    draw();
  }
  function start(){ if(running) return; running=true; clearInterval(timer); timer=setInterval(step,30); }
  function stop(){ running=false; clearInterval(timer); }
  document.addEventListener('keydown', e=>{
    const k=e.key.toLowerCase(); if(k==='arrowleft'||k==='a') ball.vx-=0.8;
    if(k==='arrowright'||k==='d') ball.vx+=0.8; if(k===' '){ ball.vy-=6; }
  });
  btnStart.addEventListener('click', start);
  window.bncSendScore=function(){ window.Telegram.WebApp.sendData(JSON.stringify({action:'score',game:'bounce',score})); };
  btnSend.addEventListener('click', window.bncSendScore);
  reset();
})();