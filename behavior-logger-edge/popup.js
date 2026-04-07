document.addEventListener('DOMContentLoaded', () => {
  const consentPanel = document.getElementById('consent-panel');
  const dataPanel = document.getElementById('data-panel');
  const consentBtn = document.getElementById('consent-btn');
  const exportJsonBtn = document.getElementById('export-json');
  const exportCsvBtn = document.getElementById('export-csv');
  const clearDataBtn = document.getElementById('clear-data');
  const logCountSpan = document.getElementById('log-count');

  // 检查是否已经同意
  chrome.storage.local.get(['consented'], (result) => {
    if (result.consented) {
      consentPanel.style.display = 'none';
      dataPanel.style.display = 'block';
      updateLogCount();
    }
  });

  consentBtn.addEventListener('click', () => {
    chrome.storage.local.set({ consented: true }, () => {
      consentPanel.style.display = 'none';
      dataPanel.style.display = 'block';
    });
  });

  exportJsonBtn.addEventListener('click', () => {
    exportData('json');
  });

  exportCsvBtn.addEventListener('click', () => {
    exportData('csv');
  });

  clearDataBtn.addEventListener('click', () => {
    if (confirm('确定要删除所有记录的行为数据吗？此操作不可撤销。')) {
      chrome.storage.local.set({ logs: [] }, () => {
        updateLogCount();
        alert('数据已清空');
      });
    }
  });

  function updateLogCount() {
    chrome.storage.local.get({ logs: [] }, (result) => {
      logCountSpan.textContent = result.logs.length;
    });
  }

  function exportData(format) {
    chrome.storage.local.get({ logs: [] }, (result) => {
      const logs = result.logs;
      if (logs.length === 0) {
        alert('没有数据可导出');
        return;
      }

      let content, filename;
      if (format === 'json') {
        content = JSON.stringify(logs, null, 2);
        filename = `behavior_logs_${new Date().toISOString()}.json`;
      } else if (format === 'csv') {
        const headers = Object.keys(logs[0]).join(',');
        const rows = logs.map(log => {
          return Object.values(log).map(value => `"${String(value).replace(/"/g, '""')}"`).join(',');
        });
        content = [headers, ...rows].join('\n');
        filename = `behavior_logs_${new Date().toISOString()}.csv`;
      }

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    });
  }
});