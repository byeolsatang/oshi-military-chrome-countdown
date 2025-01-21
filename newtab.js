document.addEventListener('DOMContentLoaded', () => {
  // Load settings from both sync and local storage
  Promise.all([
    new Promise(resolve => chrome.storage.sync.get(['bgColor', 'textColor', 'bgOpacity'], resolve)),
    new Promise(resolve => chrome.storage.local.get(['backgroundImage'], resolve))
  ]).then(([syncData, localData]) => {
    // Apply background color
    document.body.style.backgroundColor = syncData.bgColor || '#f0f0f0';
    document.body.style.color = syncData.textColor || '#000000';

    // Apply background image if available
    const backgroundWrapper = document.querySelector('.background-wrapper');
    if (localData.backgroundImage) {
      backgroundWrapper.style.backgroundImage = `url('${localData.backgroundImage}')`;
      backgroundWrapper.style.opacity = (syncData.bgOpacity || 100) / 100;
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
    chrome.storage.sync.get(['startDate', 'endDate', 'textColor'], (result) => {
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

      // デバッグ情報の表示
      const debugInfo = `
        Today (KST): ${today.toLocaleDateString('ko-KR')}
        Start (KST): ${start.toLocaleDateString('ko-KR')}
        End (KST): ${end.toLocaleDateString('ko-KR')}
        Days Left: ${daysLeft}
        Percentage: ${percentage}%
      `;
      console.log(debugInfo);

      // 既存のデバッグ要素があれば削除
      const existingDebug = document.getElementById('debug-info');
      if (existingDebug) {
        existingDebug.remove();
      }

      // 新しいデバッグ要素を作成
      const debugElement = document.createElement('pre');
      debugElement.id = 'debug-info';
      debugElement.style.position = 'fixed';
      debugElement.style.bottom = '10px';
      debugElement.style.left = '10px';
      debugElement.style.margin = '0';
      debugElement.style.padding = '10px';
      debugElement.style.backgroundColor = 'transparent';  // 背景を透明に
      debugElement.style.color = result.textColor || '#000000';  // textColorを適用
      debugElement.style.borderRadius = '5px';
      debugElement.style.fontSize = '12px';
      debugElement.style.zIndex = '1000';
      debugElement.textContent = debugInfo;
      document.body.appendChild(debugElement);
    });
  }

  updateCountdown();
  setInterval(updateCountdown, 1000 * 60 * 60 * 24);
});