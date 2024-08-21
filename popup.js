document.addEventListener('DOMContentLoaded', () => {
  const startDateInput = document.getElementById('startDate');
  const endDateInput = document.getElementById('endDate');
  const saveButton = document.getElementById('save');

  chrome.storage.sync.get(['startDate', 'endDate'], (result) => {
    startDateInput.value = result.startDate || '';
    endDateInput.value = result.endDate || '';
  });

  saveButton.addEventListener('click', () => {
    chrome.storage.sync.set({
      startDate: startDateInput.value,
      endDate: endDateInput.value
    }, () => {
      alert('保存しました');
    });
  });
});