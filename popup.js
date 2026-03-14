// Khai báo hàm updateUI ở phạm vi toàn cục của file để tránh lỗi ReferenceError
function updateUI(connected, ip = "---", ping = "---") {
  const statusEl = document.getElementById('status');
  statusEl.innerText = connected ? "Đang hoạt động" : "Chưa kết nối";
  statusEl.style.color = connected ? "#4caf50" : "#000";
  
  document.getElementById('current-ip').innerText = ip;
  document.getElementById('ping').innerText = ping;
  
  document.getElementById('btn-start').disabled = connected;
  document.getElementById('btn-stop').disabled = !connected;
}

document.addEventListener('DOMContentLoaded', async () => {
  const data = await chrome.storage.local.get(['isConnected', 'lastIp', 'lastPing']);
  if (data.isConnected) {
    updateUI(true, data.lastIp, data.lastPing);
  }
});

document.getElementById('btn-start').addEventListener('click', async () => {
  const statusEl = document.getElementById('status');
  const btnStart = document.getElementById('btn-start');
  
  statusEl.innerText = "Đang kết nối Proxy...";
  btnStart.disabled = true;

  // 1. Gửi lệnh kết nối proxy
  chrome.runtime.sendMessage({ action: "connect" }, async (res) => {
    if (res && res.success) {
      statusEl.innerText = "Đang xác thực IP mới...";
      
      // 2. Chờ 2 giây để Proxy thực sự có hiệu lực trước khi check IP
      await new Promise(resolve => setTimeout(resolve, 2000));

      try {
        const startTime = Date.now();
        // 3. Fetch với cache: 'no-store' để tránh lấy IP cũ từ cache trình duyệt
        const response = await fetch("https://api.ipify.org?format=json", { cache: 'no-store' });
        const ipData = await response.json();
        const ping = Date.now() - startTime;

        updateUI(true, ipData.ip, ping);
        chrome.storage.local.set({ isConnected: true, lastIp: ipData.ip, lastPing: ping });
      } catch (err) {
        // Trường hợp Proxy sống nhưng không cho phép truy cập ipify
        statusEl.innerText = "Đã kết nối (Không thể check IP)";
        updateUI(true, "Ẩn danh", "---");
      }
    } else {
      alert("Lỗi: " + (res.message || "Không thể kết nối"));
      updateUI(false);
    }
  });
});

document.getElementById('btn-stop').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: "stop" }, (res) => {
    if (res && res.success) {
      updateUI(false);
      chrome.storage.local.set({ isConnected: false });
    }
  });
});