// 记录用户点击行为
document.addEventListener('click', (event) => {
  const target = event.target;
  const logEntry = {
    type: "click",
    timestamp: new Date().toISOString(),
    tagName: target.tagName,
    text: target.innerText ? target.innerText.substring(0, 100) : "",
    id: target.id || "",
    className: target.className || "",
    pageUrl: window.location.href
  };

  chrome.runtime.sendMessage({ type: "click", data: logEntry });
});