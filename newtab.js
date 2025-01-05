document.addEventListener('DOMContentLoaded', () => {
  // Load settings from both sync and local storage
  Promise.all([
    new Promise(resolve => chrome.storage.sync.get(['bgColor', 'textColor', 'bgOpacity'], resolve)),
    new Promise(resolve => chrome.storage.local.get(['backgroundImage'], resolve))
  ]).then(([syncData, localData]) => {
    // Apply background color and text color
    document.body.style.backgroundColor = syncData.bgColor || '#f0f0f0';
    document.body.style.color = syncData.textColor || '#cccccc';

    // Apply background image if available
    if (localData.backgroundImage) {
      // Create a wrapper div for background image
      const bgWrapper = document.createElement('div');
      bgWrapper.style.position = 'fixed';
      bgWrapper.style.top = '0';
      bgWrapper.style.left = '0';
      bgWrapper.style.width = '100%';
      bgWrapper.style.height = '100%';
      bgWrapper.style.zIndex = '-1';
      bgWrapper.style.backgroundImage = `url('${localData.backgroundImage}')`;
      bgWrapper.style.backgroundSize = 'cover';
      bgWrapper.style.backgroundPosition = 'center';
      bgWrapper.style.backgroundRepeat = 'no-repeat';
      bgWrapper.style.opacity = (syncData.bgOpacity || 100) / 100;
      document.body.prepend(bgWrapper);
    }
  });

  function launchConfetti() {
    confetti({
      particleCount: 100,
      spread: 160,
      startVelocity: 30,
      gravity: 0.5,
      origin: { y: 0.6 }
    });
  }

  function updateCountdown() {
    chrome.storage.sync.get(['startDate', 'endDate'], (result) => {
      const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
      today.setHours(0, 0, 0, 0);
      const start = new Date(result.startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(result.endDate);
      end.setHours(0, 0, 0, 0);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        document.getElementById('countdown').textContent = '期間が設定されていません';
        return;
      }

      let daysLeft, percentage;
      const countdownElement = document.getElementById('countdown');

      if (today < end) {
        daysLeft = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
        percentage = Math.floor(((today - start) / (end - start)) * 100);
        if (percentage < 0) percentage = 0;
        countdownElement.innerHTML = `D-${daysLeft} <span id="percentage">(${percentage}%)</span>`;
      } else if (today.getTime() === end.getTime()) {
        countdownElement.innerHTML = "転役おめでとうございます";
        launchConfetti();
        setInterval(launchConfetti, 10000);
      } else {
        daysLeft = 0;
        percentage = 100;
        countdownElement.innerHTML = `D-${daysLeft} <span id="percentage">(${percentage}%)</span>`;
      }

      const debugInfo = `
        Today (KST): ${today.toLocaleDateString('ko-KR')}
        Start (KST): ${start.toLocaleDateString('ko-KR')}
        End (KST): ${end.toLocaleDateString('ko-KR')}
        Days Left: ${daysLeft}
        Percentage: ${percentage}%
      `;
      console.log(debugInfo);

      const debugElement = document.createElement('pre');
      debugElement.textContent = debugInfo;
      document.body.appendChild(debugElement);
    });
  }

  updateCountdown();
  setInterval(updateCountdown, 1000 * 60 * 60 * 24);
});