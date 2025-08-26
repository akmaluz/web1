(function(){
  const cv=document.getElementById('rrCanvas'), ctx=cv.getContext('2d');
  const btnStart=document.getElementById('rrStart'), btnSend=document.getElementById('rrSend'); const scoreEl=document.getElementById('rrScore');
  let ball, plats, speed, running=false, score=0, timer;
  function reset(){
    ball={x:150,y:40,r:8, vx:0};
    plats=[]; for(let i=0;i<7;i++){ plats.push({x:Math.random()*240, y:i*60, w:60}); }
    speed=2; score=0; scoreEl.textContent=score; draw(); running=false;
  }
  function draw(){
    ctx.clearRect(0,0,cv.width,cv.height);
    ctx.fillStyle='rgba(255,255,255,.03)'; ctx.fillRect(0,0,cv.width,cv.height);
    ctx.fillStyle='#6ab4ff'; ctx.beginPath(); ctx.arc(ball.x,ball.y,ball.r,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#3a495a'; plats.forEach(p=>ctx.fillRect(p.x,p.y, p.w,8));
  }
  function step(){
    // move platforms up
    plats.forEach(p=>{ p.y-=speed; if(p.y<-8){ p.y=cv.height; p.x=Math.random()*(cv.width-60); score+=5; scoreEl.textContent=score; } });
    // gravity
    ball.vx *= 0.98; ball.x += ball.vx;
    let onPlat=false;
    plats.forEach(p=>{
      if(ball.x>p.x && ball.x<p.x+p.w && Math.abs(ball.y - p.y) < 9){
        onPlat=true; ball.y=p.y-1;
      }
    });
    if(!onPlat){ ball.y += 3; } else { ball.y -= speed; }
    // bounds
    if(ball.x<ball.r) {ball.x=ball.r; ball.vx*=-0.6}
    if(ball.x>cv.width-ball.r) {ball.x=cv.width-ball.r; ball.vx*=-0.6}
    if(ball.y>cv.height+10){ clearInterval(timer); window.Telegram.WebApp.showToast('Yiqildingiz!'); running=false; }
    draw();
  }
  document.addEventListener('keydown', e=>{const k=e.key.toLowerCase(); if(k==='arrowleft'||k==='a') ball.vx-=1.2; if(k==='arrowright'||k==='d') ball.vx+=1.2;});
  btnStart.addEventListener('click', ()=>{ if(running) return; running=true; clearInterval(timer); timer=setInterval(step,30); });
  window.rrSendScore=function(){ window.Telegram.WebApp.sendData(JSON.stringify({action:'score',game:'rapidroll',score})); };
  btnSend.addEventListener('click', window.rrSendScore);
  reset();
})();