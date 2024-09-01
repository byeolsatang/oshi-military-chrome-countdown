document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(['bgColor', 'textColor', 'bgImage'], (result) => {
    // 背景色と文字色を適用
    document.body.style.backgroundColor = result.bgColor || '#f0f0f0';
    document.body.style.color = result.textColor || '#cccccc';

    // 背景画像を適用
    if (result.bgImage) {
      document.body.style.backgroundImage = `url('${result.bgImage}')`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundRepeat = 'no-repeat';
      document.body.style.backgroundAttachment = 'fixed';
    }
  });

  function launchConfetti() {
    confetti({
      particleCount: 100,
      spread: 160, // コンフェッティが広がる角度を広げる
      startVelocity: 30, // 初速を速くする
      gravity: 0.5, // 重力を軽減する
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
        launchConfetti(); // 初回のコンフェッティ
        setInterval(launchConfetti, 10000); // 10秒ごとにコンフェッティを繰り返す
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
  setInterval(updateCountdown, 1000 * 60 * 60 * 24); // 24時間ごとに更新
});
