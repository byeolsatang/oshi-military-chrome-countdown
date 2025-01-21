// Service Workerとしての初期化
chrome.runtime.onInstalled.addListener(() => {
  // 初期設定の保存
  chrome.storage.sync.set({
    startDate: '',
    endDate: '',
    bgColor: '#f0f0f0',
    textColor: '#cccccc',
    bgOpacity: 100
  });
});