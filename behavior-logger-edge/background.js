// 记录页面导航（URL变化）
chrome.webNavigation.onCommitted.addListener((details) => {
  // 只记录主框架的导航，忽略 iframe
  if (details.frameType !== "outermost_frame") return;

  const logEntry = {
    type: "navigation",
    url: details.url,
    timestamp: new Date().toISOString(),
    transitionType: details.transitionType
  };

  saveLog(logEntry);
});

// 接收来自 content.js 的点击记录
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "click") {
    saveLog(request.data);
  }
});

// 公共保存函数（本地存储，最多保留 2000 条）
function saveLog(entry) {
  chrome.storage.local.get({ logs: [] }, (result) => {
    let logs = result.logs;
    logs.push(entry);
    if (logs.length > 2000) logs.shift(); // 防止超出存储限制
    chrome.storage.local.set({ logs: logs });
  });
}