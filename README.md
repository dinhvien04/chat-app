# Chat App - Ứng dụng Chat Thời Gian Thực

**Chat App** là một dự án ứng dụng chat thời gian thực được phát triển bằng React, TypeScript, Vite và tích hợp với công nghệ backend Ollama. Dự án mang đến một nền tảng giao tiếp hiện đại, nhanh chóng và thân thiện.

## Công nghệ sử dụng

### Frontend
- **React**: Thư viện JavaScript mạnh mẽ để xây dựng giao diện người dùng.
- **TypeScript**: Ngôn ngữ nâng cao của JavaScript, giúp tăng tính bảo trì và ổn định của mã nguồn.
- **Vite**: Công cụ build hiện đại, nhanh chóng, hỗ trợ HMR (Hot Module Replacement) để cải thiện hiệu quả phát triển.
- **CSS/HTML**: Dùng để thiết kế giao diện đẹp mắt, tối ưu hóa trải nghiệm người dùng.

### Backend
- **Ollama**: Nền tảng backend mạnh mẽ, hỗ trợ xử lý và quản lý dữ liệu, đảm bảo hiệu năng và khả năng mở rộng.

## Tính năng nổi bật

- **Giao tiếp thời gian thực**: Cho phép người dùng gửi và nhận tin nhắn ngay lập tức.
- **Tích hợp frontend và backend hiện đại**: Sử dụng Ollama để xử lý backend, đảm bảo giao tiếp dữ liệu ổn định và nhanh chóng.
- **Giao diện hiện đại**: Xây dựng với React, mang lại trải nghiệm sử dụng mượt mà và tối ưu.
- **Hiệu suất cao**: Kết hợp giữa Vite và Ollama để đảm bảo hiệu năng cao cho cả frontend và backend.
- **Kiểm tra mã nghiêm ngặt**: Sử dụng ESLint và các plugin mở rộng để đảm bảo chất lượng mã nguồn.

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
