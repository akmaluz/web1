(function(){
  const cv = document.getElementById('snakeCanvas'), ctx=cv.getContext('2d');
  const scoreEl = document.getElementById('snakeScore');
  const btnStart = document.getElementById('snakeStart'), btnSend = document.getElementById('snakeSend');
  let grid=15, size=cv.width/grid, snake, dir, food, score, timer, running=false;
  function reset(){ snake=[{x:7,y:10}]; dir={x:1,y:0}; spawnFood(); score=0; scoreEl.textContent=score; draw(); running=false; }
  function spawnFood(){ food={x:Math.floor(Math.random()*grid), y:Math.floor(Math.random()*grid)}; }
  function drawCell(x,y,color){ ctx.fillStyle=color; ctx.fillRect(x*size, y*size, size-1, size-1); }
  function draw(){ ctx.clearRect(0,0,cv.width,cv.height); ctx.fillStyle='rgba(255,255,255,.03)'; for(let i=0;i<grid;i++)for(let j=0;j<grid;j++)ctx.fillRect(i*size,j*size,size-1,size-1); drawCell(food.x,food.y,'#e06b3f'); snake.forEach((s,i)=>drawCell(s.x,s.y,i? '#91c8ff':'#6ab4ff')); }
  function step(){ const head={x:snake[0].x+dir.x,y:snake[0].y+dir.y}; if(head.x<0||head.y<0||head.x>=grid||head.y>=grid||snake.some(s=>s.x===head.x&&s.y===head.y)){ running=false; clearInterval(timer); window.Telegram.WebApp.showToast('Game over'); return; } snake.unshift(head); if(head.x===food.x&&head.y===food.y){ score+=5; scoreEl.textContent=score; spawnFood(); } else snake.pop(); draw(); }
  function start(){ if(running) return; running=true; clearInterval(timer); timer=setInterval(step,120); }
  function setDir(x,y){ if((x!==0&&dir.x!==0)||(y!==0&&dir.y!==0)) return; dir={x,y}; }
  document.addEventListener('keydown',e=>{const k=e.key.toLowerCase(); if(k==='arrowup'||k==='w')setDir(0,-1); if(k==='arrowdown'||k==='s')setDir(0,1); if(k==='arrowleft'||k==='a')setDir(-1,0); if(k==='arrowright'||k==='d')setDir(1,0);});
  document.querySelector('#screen-snake .dpad').addEventListener('click',e=>{const b=e.target.closest('button'); if(!b)return; const d=b.dataset.dir; if(d==='up')setDir(0,-1); if(d==='down')setDir(0,1); if(d==='left')setDir(-1,0); if(d==='right')setDir(1,0);});
  btnStart.addEventListener('click',start);
  window.snakeSendScore=function(){ window.Telegram.WebApp.sendData(JSON.stringify({action:'score',game:'snake',score})); };
  btnSend.addEventListener('click',window.snakeSendScore);
  reset();
})();