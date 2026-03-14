// 1. Hàm cập nhật UI dựa trên dữ liệu hiện tại
function updateUI(connected, ip = "---", ping = "---", isConnecting = false) {
  const statusEl = document.getElementById('status');
  const btnStart = document.getElementById('btn-start');
  const btnStop = document.getElementById('btn-stop');

  if (isConnecting) {
    statusEl.innerText = "Đang kết nối...";
    btnStart.disabled = true;
    btnStop.disabled = true;
  } else {
    statusEl.innerText = connected ? "Đang hoạt động" : "Chưa kết nối";
    statusEl.style.color = connected ? "#4caf50" : "#000";
    btnStart.disabled = connected;
    btnStop.disabled = !connected;
  }
  
  document.getElementById('current-ip').innerText = ip;
  document.getElementById('ping').innerText = ping;
}

// 2. Tự động đồng bộ trạng thái khi mở popup
async function syncState() {
  const data = await chrome.storage.local.get(['isConnected', 'isConnecting', 'lastIp', 'lastPing']);
  updateUI(data.isConnected, data.lastIp, data.lastPing, data.isConnecting);
}

document.addEventListener('DOMContentLoaded', syncState);

// 3. Nút Bắt đầu
document.getElementById('btn-start').addEventListener('click', async () => {
  // Đánh dấu đang kết nối vào storage để dù đóng popup cũng không bị mất trạng thái
  await chrome.storage.local.set({ isConnecting: true, isConnected: false });
  syncState();

  // Gửi lệnh kết nối (Không cần callback phức tạp ở đây)
  chrome.runtime.sendMessage({ action: "connect" });

  // Theo dõi trạng thái hoàn tất từ background (sử dụng polling nhẹ hoặc đợi phản hồi)
  // Trong background.js, khi kết nối xong hãy set isConnecting: false
  // Để đơn giản, ta kiểm tra định kỳ trong popup
  const checkInterval = setInterval(async () => {
    const data = await chrome.storage.local.get(['isConnecting']);
    if (!data.isConnecting) {
      clearInterval(checkInterval);
      syncState();
    }
  }, 500);
});

// 4. Nút Ngắt kết nối
document.getElementById('btn-stop').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: "stop" }, (res) => {
    if (res && res.success) {
      chrome.storage.local.set({ isConnected: false, lastIp: "---", lastPing: "---" });
      syncState();
    }
  });
});