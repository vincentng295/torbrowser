let proxyAuth = { username: "", password: "" };

// 1. Lắng nghe yêu cầu đăng nhập từ Proxy
chrome.webRequest.onAuthRequired.addListener(
  (details) => {
    if (details.isProxy && proxyAuth.username) {
      return {
        authCredentials: {
          username: proxyAuth.username,
          password: proxyAuth.password
        }
      };
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);

const TOR_UA = "Mozilla/5.0 (Windows NT 10.0; rv:109.0) Gecko/20100101 Firefox/115.0";

async function setTorUserAgent() {
  await chrome.declarativeNetRequest.updateDynamicRules({
    addRules: [{
      id: 1,
      priority: 1,
      action: {
        // Đổi "modifyHeader" thành "modifyHeaders" (thêm chữ s)
        type: "modifyHeaders", 
        requestHeaders: [{ 
          header: "user-agent", 
          operation: "set", 
          value: TOR_UA 
        }]
      },
      condition: { 
        urlFilter: "*", 
        resourceTypes: ["main_frame", "sub_frame", "xmlhttprequest", "script", "image"] 
      }
    }],
    removeRuleIds: [1]
  });
}

async function removeTorUserAgent() {
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [1]
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "connect") {
    setTorUserAgent().then(() => {
      handleConnect(sendResponse);
    });
    return true;
  } else if (request.action === "stop") {
    removeTorUserAgent().then(() => {
      proxyAuth = { username: "", password: "" };
      chrome.proxy.settings.clear({ scope: 'regular' }, () => {
        sendResponse({ success: true });
      });
    });
    return true;
  }
});

async function handleConnect(sendResponse) {
  try {
    const response = await fetch("https://goodextensions.mooo.com/ext/tor-browser/torconfig.php");
    const config = await response.json();

    if (!config.url) throw new Error("Cấu hình trống");

    // Lưu thông tin đăng nhập để dùng trong onAuthRequired
    proxyAuth.username = config.aun;
    proxyAuth.password = config.aup;

    const proxyConfig = {
      mode: "fixed_servers",
      rules: {
        singleProxy: {
          scheme: "https", // Sử dụng HTTPS cho cổng 443
          host: config.url,
          port: 443
        }
      }
    };

    // 1. Áp dụng Proxy
    chrome.proxy.settings.set({ value: proxyConfig, scope: 'regular' }, async () => {
      // 2. Chờ một chút để kết nối ổn định
      await new Promise(r => setTimeout(r, 2000));

      // 3. Thực hiện kiểm tra IP và Ping từ background
      try {
        const start = Date.now();
        const res = await fetch("https://api.ipify.org?format=json", { cache: 'no-store' });
        const data = await res.json();
        const ping = Date.now() - start;

        // 4. Lưu thông tin đã kiểm tra vào storage
        await chrome.storage.local.set({ 
          isConnected: true, 
          isConnecting: false, 
          lastIp: data.ip, 
          lastPing: ping 
        });
      } catch (e) {
        // Nếu không check được IP nhưng proxy đã set xong
        await chrome.storage.local.set({ isConnected: true, isConnecting: false });
      }
      
      if (sendResponse) sendResponse({ success: true });
    });

  } catch (error) {
    await chrome.storage.local.set({ isConnecting: false, isConnected: false });
    if (sendResponse) sendResponse({ success: false, message: error.message });
  }
}