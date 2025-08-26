(function(){
  const tg = window.Telegram.WebApp; tg.expand(); tg.ready();
  const backBtn = document.getElementById('backBtn');
  const helpBtn = document.getElementById('helpBtn');
  const subtitle = document.getElementById('subtitle');
  const user = tg.initDataUnsafe?.user || {};
  subtitle.textContent = user.username ? '@' + user.username : (user.first_name || 'Foydalanuvchi');

  function showScreen(id){
    document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
    document.getElementById('screen-'+id).classList.add('active');
    if(id==='home'){ tg.MainButton.hide(); tg.BackButton.hide(); }
    else{ tg.BackButton.show(); tg.MainButton.setText('Natijani yuborish'); tg.MainButton.show(); }
  }
  showScreen('home');

  document.querySelectorAll('.card').forEach(c=>{
    c.addEventListener('click', ()=>{
      if(c.classList.contains('soon')){
        tg.showToast('Tez orada qo‘shamiz');
        return;
      }
      const sc = c.dataset.screen;
      window.currentGame = sc;
      showScreen(sc);
    });
  });

  backBtn.addEventListener('click', ()=>{ showScreen('home'); window.currentGame=null; });
  tg.BackButton.onClick(()=>{ showScreen('home'); window.currentGame=null; });
  helpBtn.addEventListener('click', ()=> tg.showPopup({title:'Yordam', message:'O‘yin tanlang. Tugaganda “Natijani yuborish” bosing va bot reytingga qo‘shadi.', buttons:[{type:'ok'}]}));

  tg.MainButton.onClick(function(){
    const g = window.currentGame;
    if(!g){ tg.showToast('Avval o‘yin tanlang'); return; }
    const fns = {
      snake: window.snakeSendScore,
      bounce: window.bncSendScore,
      rapidroll: window.rrSendScore,
      shooter: window.shSendScore,
      breaker: window.brSendScore,
      runner: window.rnSendScore,
      memory: window.memSendScore,
      taprush: window.tapSendScore,
    };
    (fns[g]||(()=>tg.showToast('Bu o‘yinda yuborish yo‘q')))();
  });
})();