# Chat App - Trợ lý AI thời gian thực

**Chat App** một ứng dụng trò chuyện thời gian thực, nơi người dùng có thể tương tác trực tiếp với một trợ lý AI thông minh thông qua giao diện web hiện đại. Giao diện được thiết kế theo phong cách dark mode, tối giản, dễ nhìn, tạo trải nghiệm tự nhiên như đang trò chuyện với một người thật.

## Công nghệ sử dụng

### Frontend
- **React**: Thư viện JavaScript mạnh mẽ để xây dựng giao diện người dùng.
- **TypeScript**: Ngôn ngữ nâng cao của JavaScript, giúp tăng tính bảo trì và ổn định của mã nguồn.
- **Vite**: Công cụ build hiện đại, nhanh chóng, hỗ trợ HMR (Hot Module Replacement) để cải thiện hiệu quả phát triển.
- **CSS/HTML**: Dùng để thiết kế giao diện đẹp mắt, tối ưu hóa trải nghiệm người dùng.

### Backend
- **Ollama**: Nền tảng backend mạnh mẽ, hỗ trợ xử lý và quản lý dữ liệu, đảm bảo hiệu năng và khả năng mở rộng.

## Tính năng nổi bật

- **Giao tiếp tự nhiên**:  Người dùng nhập câu hỏi bằng tiếng Việt, AI phản hồi tự động với nội dung thân thiện và chính xác.
- **Xử lý phía client bằng React + TypeScript**: Giao diện phản hồi nhanh, xử lý mượt mà.
- **Tích hợp AI Backend (Ollama)**: Backend sử dụng mô hình ngôn ngữ lớn (LLM) để phân tích và phản hồi câu hỏi.
- **Thiết kế đẹp mắt, bố cục gọn gàng**: Tin nhắn được hiển thị phân biệt rõ giữa người dùng và AI, với phong cách màu sắc khác nhau.
- **Hỗ trợ responsive**:  Có thể sử dụng được trên nhiều thiết bị (desktop, tablet, mobile).
## Giao diện
- Phần trên hiển thị tên trợ lý: AI Chat Assistant
- Khung chat ở giữa, hiển thị các tin nhắn từ người dùng (màu xanh) và từ AI (màu xám)
- Input message phía dưới có placeholder "Nhập câu hỏi của bạn..." và nút gửi hình mũi tên
## Cấu hình và mở rộng

Dự án đi kèm với cấu hình ESLint mạnh mẽ, cho phép mở rộng dễ dàng khi cần:
1. **Mở rộng quy tắc ESLint**: Có thể áp dụng các quy tắc nghiêm ngặt hơn hoặc thêm các quy tắc kiểu dáng mã.
2. **Thêm plugin hữu ích**: Tích hợp các plugin như `eslint-plugin-react-x` và `eslint-plugin-react-dom` để cải thiện kiểm tra mã nguồn.

## Hướng dẫn cài đặt

1. Clone repository này về máy:
   ```bash
   git clone https://github.com/dinhvien04/chat-app.git
   cd chat-app
    ```
2. Cài đặt gói phù thuộc
   ```
   npm install
   ```
3. Chạy ứng dụng ở môi trường phát triển
  ```
  npm run dev
  ```
4. Nếu cần khởi chạy backend Ollama, đảm bảo đã thiết lập môi trường backend theo tài liệu hướng dẫn. Đảm bảo bạn đã:
  - Cài đặt Ollama trên máy chủ hoặc máy cục bộ.
  - Cấu hình các endpoint API phù hợp với ứng dụng frontend.
5. Mở trình duyệt và truy cập ứng dụng tại:
  ```
  http://localhost:5173
  ```
