document.addEventListener('DOMContentLoaded', () => {
  const startDateInput = document.getElementById('startDate');
  const endDateInput = document.getElementById('endDate');
  const bgColorInput = document.getElementById('bgColor');
  const textColorInput = document.getElementById('textColor');
  const bgImageInput = document.getElementById('bgImage');
  const saveButton = document.getElementById('save');

  // Load stored values
  chrome.storage.sync.get(['startDate', 'endDate', 'bgColor', 'textColor', 'bgImage'], (result) => {
    startDateInput.value = result.startDate || '';
    endDateInput.value = result.endDate || '';
    bgColorInput.value = result.bgColor || '#f0f0f0';
    textColorInput.value = result.textColor || '#cccccc';
    bgImageInput.value = result.bgImage || '';
  });

  // Save settings on button click
  saveButton.addEventListener('click', () => {
    chrome.storage.sync.set({
      startDate: startDateInput.value,
      endDate: endDateInput.value,
      bgColor: bgColorInput.value,
      textColor: textColorInput.value,
      bgImage: bgImageInput.value
    }, () => {
      alert('保存しました');
    });
  });
});
