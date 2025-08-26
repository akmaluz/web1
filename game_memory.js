(function(){
  const grid=document.getElementById('memGrid'); const movesEl=document.getElementById('memMoves');
  const btnStart=document.getElementById('memStart'), btnSend=document.getElementById('memSend');
  const EMO=['🍎','🍋','🍇','🍉','🍓','🍒','🍍','🥝'];
  let cards=[], first=null, lock=false, moves=0, matched=0;
  function newDeck(){ const pair=EMO.slice(0,8); const deck=[...pair, ...pair].sort(()=>Math.random()-0.5); cards = deck.map((v,i)=>({id:i,v,rev:false,mat:false})); }
  function render(){ grid.innerHTML=''; cards.forEach(c=>{ const el=document.createElement('div'); el.className='mem-card'+(c.rev?' revealed':'')+(c.mat?' matched':''); el.textContent = (c.rev||c.mat)? c.v : '❓'; el.addEventListener('click',()=>pick(c)); grid.appendChild(el); }); movesEl.textContent=moves; }
  function pick(c){ if(lock||c.mat||c.rev) return; c.rev=true; render(); if(!first){ first=c; return; } moves++; lock=true; if(c.v===first.v){ c.mat=first.mat=true; first=null; lock=false; matched+=2; render(); } else { setTimeout(()=>{ c.rev=false; first.rev=false; first=null; lock=false; render(); }, 600); } }
  function reset(){ moves=0; matched=0; first=null; lock=false; newDeck(); render(); }
  btnStart.addEventListener('click', reset);
  window.memSendScore=function(){ const score=Math.max(0, 200 - moves*10); window.Telegram.WebApp.sendData(JSON.stringify({action:'score',game:'memory',score,moves})); };
  btnSend.addEventListener('click', window.memSendScore);
  reset();
})();