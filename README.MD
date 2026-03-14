# 🧅 Tor Browser VPN - Chrome Extension

**Tor Browser VPN** là một tiện ích mở rộng giúp bạn duyệt web ẩn danh bằng cách điều hướng lưu lượng truy cập qua mạng lưới Proxy Tor bảo mật. Extension tự động lấy cấu hình, thực hiện xác thực và kiểm tra trạng thái kết nối theo thời gian thực.

## ✨ Tính năng chính

* **Kết nối một chạm:** Tự động lấy cấu hình từ API chuyên dụng và thiết lập Proxy qua cổng 443.
* **Xác thực tự động:** Hỗ trợ xử lý thông tin đăng nhập (Username/Password) ngầm định mà không làm phiền người dùng.
* **Kiểm tra IP & Ping:** Tự động xác thực địa chỉ IP mới và đo độ trễ kết nối thông qua dịch vụ `ipify`.
* **Trạng thái thời gian thực:** Hiển thị IP hiện tại, tốc độ phản hồi và tình trạng hoạt động ngay trên giao diện popup.
* **Cảnh báo bảo mật:** Nhắc nhở người dùng sử dụng giao thức an toàn để bảo vệ dữ liệu cá nhân.

## 🛡️ Cảnh báo bảo mật quan trọng

> [!WARNING]
> **Sử dụng HTTPS:** Vì dữ liệu được truyền qua máy chủ proxy trung gian, nhà cung cấp có thể thu thập các thông tin không được mã hóa. Hãy luôn truy cập các trang web bắt đầu bằng **https://** để đảm bảo an toàn dữ liệu cá nhân.

## 🚀 Hướng dẫn cài đặt

1. Tải toàn bộ mã nguồn của extension về máy tính.
2. Mở trình duyệt Chrome và truy cập địa chỉ `chrome://extensions/`.
3. Bật **Chế độ nhà phát triển (Developer mode)** ở góc trên bên phải.
4. Nhấn nút **Tải tiện ích đã giải nén (Load unpacked)**.
5. Chọn thư mục chứa mã nguồn của extension này.

## 🛠 Cách sử dụng

1. Mở popup của extension từ thanh công cụ trình duyệt.
2. Nhấn nút **Bắt đầu kết nối**. Hệ thống sẽ:
* Lấy cấu hình từ máy chủ `goodextensions.mooo.com`.
* Thiết lập đường truyền bảo mật qua cổng 443.
* Kiểm tra IP mới sau khi kết nối thành công.


3. Để quay lại kết nối internet thông thường, nhấn nút **Ngắt kết nối**.

## 📝 Lưu ý kỹ thuật

* **Thời gian bắt tay (Handshake):** Mạng Tor cần thời gian để thiết lập tunnel bảo mật. Popup có thể mất khoảng 2-3 giây để cập nhật IP mới chính xác sau khi bấm kết nối.
* **Lỗi ERR_PROXY_CONNECTION_FAILED:** Thường xảy ra nếu thông tin xác thực bị sai hoặc server proxy tạm thời không phản hồi.

---

**Sản phẩm được phát triển nhằm mục đích hỗ trợ quyền riêng tư trực tuyến.** Nếu bạn gặp vấn đề trong quá trình kết nối, hãy thử ngắt và bắt đầu lại để cập nhật cấu hình mới nhất.