function updateCountdown() {
  chrome.storage.sync.get(['startDate', 'endDate'], (result) => {
    const today = new Date();
    const start = new Date(result.startDate);
    const end = new Date(result.endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      document.getElementById('countdown').textContent = '兵役期間が設定されていません';
      return;
    }

    if (today < start) {
      const daysLeft = Math.ceil((start - today) / (1000 * 60 * 60 * 24));
      const percentage = Math.round((today - start) / (end - start) * 100);
      document.getElementById('countdown').textContent = `D-${daysLeft} (${percentage}%)`;
    } else if (today > end) {
      document.getElementById('countdown').textContent = '兵役終了 (100%)';
    } else {
      const daysLeft = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
      const percentage = Math.round((today - start) / (end - start) * 100);
      document.getElementById('countdown').textContent = `D-${daysLeft} (${percentage}%)`;
    }
  });
}

updateCountdown();
setInterval(updateCountdown, 1000 * 60 * 60 * 24); // 24時間ごとに更新