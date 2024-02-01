  const timer = {
    lead: 6,
    boulder: 5,
  };
  
  let interval;
  let isStartingAction = true;
  let isKeybordPress = true

  const buttonSound = new Audio('assets/mp3/button-sound.mp3');
  const twoMinLeftSound = new Audio('assets/mp3/2 minutes left.mp3');
  const oneMinLeftSound = new Audio('assets/mp3/1 minutes left.mp3');
  const timeComeSound = new Audio('assets/mp3/time-come.mp3');

  const oneTwoTreeSound = new Audio('assets/mp3/3-2-1.mp3');
  const finishingSound = new Audio('assets/mp3/11-1.mp3');

  const progress = document.getElementById('js-progress');

  const min_num = document.getElementById('js-minutes');
  const sec_num = document.getElementById('js-seconds');

  const refreshButton = document.getElementById('refresh-js-btn')
  refreshButton.addEventListener('click', () => {
    buttonSound.play();
    restTimer();
  });
  
  const modeButtons = document.querySelector('#js-mode-buttons');
  modeButtons.addEventListener('click', handleMode);

  const mainButton = document.getElementById('action-js-btn');
  mainButton.addEventListener('click', () => {
    const { action } = mainButton.dataset;
    buttonSound.play();
    if (action === 'start') {
      // startTimer();
      beforTimer()
    } else {
      stopTimer();
    }
  });

  document.addEventListener('keydown', function(event) {
    if(event.keyCode == 32) {
      // keyPause();
    }
    else if(event.keyCode == 27){
      // stopTimer()
    }
  });

  function keyPause() {
    if (isKeybordPress) {
      stopTimer()
      isKeybordPress = false
    } else {
      startTimer()
      isKeybordPress = true
    }
  }

  starting()

  function starting() {
    if (isStartingAction){
      switchMode('lead');
      isStartingAction = false
    } 
  }
  
  function getRemainingTime(endTime) {
    const currentTime = Date.parse(new Date());
    const difference = endTime - currentTime;
  
    const total = parseInt(difference / 1000);
    const minutes = parseInt((total / 60) % 60);
    const seconds = parseInt(total % 60);
  
    return {
      total,
      minutes,
      seconds,
    };
  }
  
  function updateClock() {
    const { remainingTime } = timer;
    const minutes = `${remainingTime.minutes}`.padStart(2, '0');
    const seconds = `${remainingTime.seconds}`.padStart(2, '0');
    
    min_num.textContent = minutes;
    sec_num.textContent = seconds;

    progress.value = timer[timer.mode] * 60 - timer.remainingTime.total;
  }
  

  function beforTimer(){
    let total = 6;
    const endTime = Date.parse(new Date()) + total * 1000;
  
    mainButton.dataset.action = 'stop';
    mainButton.classList.add('active');
    mainButton.textContent = 'stop';

    refreshButton.style.visibility = 'visible';
  
    interval = setInterval(function() {

      let beforTime = getRemainingTime(endTime);
      updateClock();

      min_num.textContent = '0' + beforTime.minutes;
      sec_num.textContent = '0' + beforTime.seconds;

      if(beforTime.minutes == 0 && beforTime.seconds == 4){
        oneTwoTreeSound.play();
      }
      else if(beforTime.minutes == 0 && beforTime.seconds == 0){
        clearInterval(interval);
        startTimer()
      }

    }, 1000);
  }

  function startTimer() {
    let { total } = timer.remainingTime;
    const endTime = Date.parse(new Date()) + total * 1000;
  
    timeComeSound.play()

    // if (timer.mode === 'lead') timer.sessions++;
  
    // mainButton.dataset.action = 'stop';
    // mainButton.classList.add('active');
    // mainButton.textContent = 'stop';

    // refreshButton.style.visibility = 'visible';
  
    interval = setInterval(function() {
      timer.remainingTime = getRemainingTime(endTime);
      total = timer.remainingTime.total;
      updateClock();

      if (total <= 0) {
        clearInterval(interval);
        restTimer()
  
      //   switch (timer.mode) {
      //     case 'boulder':
      //       if (timer.sessions % timer.longBreakInterval === 0) {
      //         switchMode('lead');
      //       } else {
      //         switchMode('boulder');
      //       }
      //       break;
      //     default:

      //     switchMode('boulder');

      //   }
  
      //   document.querySelector(`[data-sound="${timer.mode}"]`).play();
      //   startTimer();
      }
      else if(timer.remainingTime.minutes == 2 && timer.remainingTime.seconds == 0){
        twoMinLeftSound.play();
      }
      else if(timer.remainingTime.minutes == 1 && timer.remainingTime.seconds == 0){
        oneMinLeftSound.play();
      }
      else if(timer.remainingTime.minutes == 0 && timer.remainingTime.seconds == 11 ){
        finishingSound.play();
      }
      // else if(timer.remainingTime.minutes == 0 && timer.remainingTime.seconds == 0){
      //   restTimer()
      // }

    }, 1000);
  }

  function stopTimer() {
    clearInterval(interval);
    stopAllAudioRecording()
  
    mainButton.dataset.action = 'start';
    mainButton.classList.remove('active');
    mainButton.textContent = 'start';
  }

  function stopAllAudioRecording() {
    twoMinLeftSound.pause()
    twoMinLeftSound.currentTime = 0
    oneMinLeftSound.pause()
    oneMinLeftSound.currentTime = 0
    timeComeSound.pause()
    timeComeSound.currentTime = 0

    oneTwoTreeSound.pause()
    oneTwoTreeSound.currentTime = 0
    finishingSound.pause()
    finishingSound.currentTime = 0
  }

  function restTimer() {
    mode = timer.mode
    timer.remainingTime = {
      total: timer[mode] * 60,
      minutes: timer[mode],
      seconds: 0,
    };

    min_num.textContent = '0' + timer.remainingTime.minutes;
    sec_num.textContent = '0' + timer.remainingTime.seconds;

    refreshButton.style.visibility = 'hidden';

    progress.value = 0

    stopTimer();
  }
  
  function switchMode(mode) {
    timer.mode = mode;
    timer.remainingTime = {
      total: timer[mode] * 60,
      minutes: timer[mode],
      seconds: 0,
    };

    refreshButton.style.visibility = 'hidden';
  
    document
      .querySelectorAll('button[data-mode]')
      .forEach(e => e.classList.remove('active'));

    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');

    document
      .getElementById('js-progress')
      .setAttribute('max', timer.remainingTime.total);
    
    document.body.style.backgroundColor = `var(--${mode})`;
  
    updateClock();
  }
  
  function handleMode(event) {
    const { mode } = event.target.dataset;
  
    if (!mode) return;
  
    timer.sessions = 0;
    switchMode(mode);
    stopTimer();
  }
  