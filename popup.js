document.addEventListener('DOMContentLoaded', () => {
  const startDateInput = document.getElementById('startDate');
  const endDateInput = document.getElementById('endDate');
  const bgColorInput = document.getElementById('bgColor');
  const textColorInput = document.getElementById('textColor');
  const bgImageFileInput = document.getElementById('bgImageFile');
  const bgOpacityInput = document.getElementById('bgOpacity');
  const previewArea = document.getElementById('preview-area');
  const previewBackground = document.getElementById('preview-background');
  const saveButton = document.getElementById('save');

  let backgroundImageData = null;

  // プレビューの更新関数
  function updatePreview() {
    const backgroundColor = bgColorInput.value;
    const opacity = bgOpacityInput.value / 100;
    const textColor = textColorInput.value;

    previewArea.style.backgroundColor = backgroundColor;
    previewArea.querySelector('.preview-text').style.color = textColor;

    if (backgroundImageData) {
      previewBackground.style.backgroundImage = `url('${backgroundImageData}')`;
      previewBackground.style.opacity = opacity;
    }
  }

  // 各入力要素の変更時にプレビューを更新
  bgColorInput.addEventListener('input', updatePreview);
  textColorInput.addEventListener('input', updatePreview);
  bgOpacityInput.addEventListener('input', (event) => {
    updateOpacityLabel(event.target.value);
    updatePreview();
  });

  // Load stored values
  chrome.storage.sync.get(['startDate', 'endDate', 'bgColor', 'textColor', 'bgOpacity'], (result) => {
    startDateInput.value = result.startDate || '';
    endDateInput.value = result.endDate || '';
    bgColorInput.value = result.bgColor || '#f0f0f0';
    textColorInput.value = result.textColor || '#cccccc';
    bgOpacityInput.value = result.bgOpacity || 100;
    updateOpacityLabel(bgOpacityInput.value);
    updatePreview();
  });

  // Load background image from local storage
  chrome.storage.local.get(['backgroundImage'], (result) => {
    if (result.backgroundImage) {
      backgroundImageData = result.backgroundImage;
      updatePreview();
    }
  });

  function updateOpacityLabel(value) {
    const opacityLabel = document.querySelector('.slider-value');
    opacityLabel.textContent = `${value}%`;
  }

  // Handle file selection
  bgImageFileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        backgroundImageData = e.target.result;
        updatePreview();
      };
      reader.readAsDataURL(file);
    }
  });

  // Save settings on button click
  saveButton.addEventListener('click', () => {
    // Save sync storage data
    chrome.storage.sync.set({
      startDate: startDateInput.value,
      endDate: endDateInput.value,
      bgColor: bgColorInput.value,
      textColor: textColorInput.value,
      bgOpacity: bgOpacityInput.value
    });

    // Save background image to local storage
    if (backgroundImageData) {
      chrome.storage.local.set({
        backgroundImage: backgroundImageData
      }, () => {
        alert('保存しました');
      });
    } else {
      alert('保存しました');
    }
  });
});