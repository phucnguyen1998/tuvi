# Giả định (ASSUMPTIONS)

- Thuật toán an sao hiện là mô phỏng: đã tính Can Chi năm, vị trí Mệnh/Thân và gán sao theo seed cố định để dữ liệu ổn định, chưa thay thế công thức tử vi chuẩn.
- CMS dùng NextAuth Credentials, seed tạo sẵn tài khoản:
  - admin@tuvi.local / admin123 (role: admin)
  - staff@tuvi.local / staff123 (role: staff)
- Rate limit cho tạo AI reading áp dụng theo IP trong memory, phù hợp chạy local. Khi lên production cần thay bằng Redis rate limit.
- Ứng dụng chạy local mặc định timezone Asia/Ho_Chi_Minh.
