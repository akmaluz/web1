(function(){
  const cv=document.getElementById('brCanvas'), ctx=cv.getContext('2d');
  const btnStart=document.getElementById('brStart'), btnSend=document.getElementById('brSend'); const scoreEl=document.getElementById('brScore');
  let paddle, ball, bricks, running=false, score=0, timer;
  function reset(){
    paddle={x:cv.width/2, y:cv.height-20, w:70, h:10};
    ball={x:cv.width/2, y:cv.height-40, vx:2.4, vy:-2.8, r:6};
    bricks=[]; const rows=5, cols=8, bw=34, bh=14, gap=6, ox=10, oy=40;
    for(let r=0;r<rows;r++) for(let c=0;c<cols;c++) bricks.push({x:ox+c*(bw+gap), y:oy+r*(bh+gap), w:bw, h:bh, alive:true});
    score=0; scoreEl.textContent=score; draw(); running=false;
  }
  function draw(){
    ctx.clearRect(0,0,cv.width,cv.height);
    ctx.fillStyle='rgba(255,255,255,.03)'; ctx.fillRect(0,0,cv.width,cv.height);
    // bricks
    bricks.forEach(b=>{ if(!b.alive) return; ctx.fillStyle='#3a495a'; ctx.fillRect(b.x,b.y,b.w,b.h); });
    // paddle
    ctx.fillStyle='#6ab4ff'; ctx.fillRect(paddle.x-paddle.w/2, paddle.y, paddle.w, paddle.h);
    // ball
    ctx.fillStyle='#e06b3f'; ctx.beginPath(); ctx.arc(ball.x,ball.y,ball.r,0,Math.PI*2); ctx.fill();
  }
  function step(){
    ball.x+=ball.vx; ball.y+=ball.vy;
    if(ball.x<ball.r || ball.x>cv.width-ball.r) ball.vx*=-1;
    if(ball.y<ball.r) ball.vy*=-1;
    if(ball.y>cv.height){ window.Telegram.WebApp.showToast('Yutqazdingiz'); clearInterval(timer); running=false; }
    // paddle
    if(ball.y>paddle.y-ball.r && Math.abs(ball.x - paddle.x) < paddle.w/2){ ball.vy*=-1; ball.y=paddle.y-ball.r; }
    // bricks hit
    bricks.forEach(b=>{
      if(!b.alive) return;
      if(ball.x>b.x && ball.x<b.x+b.w && ball.y>b.y && ball.y<b.y+b.h){
        b.alive=false; score+=5; scoreEl.textContent=score; ball.vy*=-1;
      }
    });
    draw();
  }
  document.addEventListener('mousemove', e=>{ const rect=cv.getBoundingClientRect(); paddle.x=Math.max(40, Math.min(cv.width-40, e.clientX-rect.left));});
  document.addEventListener('keydown', e=>{const k=e.key.toLowerCase(); if(k==='arrowleft'||k==='a') paddle.x-=14; if(k==='arrowright'||k==='d') paddle.x+=14;});
  btnStart.addEventListener('click', ()=>{ if(running) return; running=true; clearInterval(timer); timer=setInterval(step,16); });
  window.brSendScore=function(){ window.Telegram.WebApp.sendData(JSON.stringify({action:'score',game:'breaker',score})); };
  btnSend.addEventListener('click', window.brSendScore);
  reset();
})();