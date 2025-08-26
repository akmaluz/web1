(function(){
  const btnStart=document.getElementById('tapStart'), btnSend=document.getElementById('tapSend');
  const big=document.getElementById('tapBig'); const sEl=document.getElementById('tapScore'); const tEl=document.getElementById('tapTime');
  let score=0, t=10.0, timer=null, running=false;
  function reset(){ score=0; t=10.0; sEl.textContent=score; tEl.textContent=t.toFixed(1); clearInterval(timer); running=false; }
  function start(){ if(running) return; running=true; score=0; t=10.0; sEl.textContent=score; tEl.textContent=t.toFixed(1);
    timer=setInterval(()=>{ t=Math.max(0, t-0.1); tEl.textContent=t.toFixed(1); if(t<=0){ clearInterval(timer); running=false; window.Telegram.WebApp.showToast('Tugadi! Ball: '+score);} },100);
  }
  big.addEventListener('click', ()=>{ if(!running) return; score++; sEl.textContent=score; big.style.transform='scale(0.98)'; setTimeout(()=>big.style.transform='scale(1)',70); window.Telegram.WebApp.HapticFeedback?.impactOccurred('light'); });
  btnStart.addEventListener('click', start);
  window.tapSendScore=function(){ window.Telegram.WebApp.sendData(JSON.stringify({action:'score',game:'taprush',score})); };
  btnSend.addEventListener('click', window.tapSendScore);
  reset();
})();