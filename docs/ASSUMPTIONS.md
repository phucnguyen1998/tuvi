# Giả định (ASSUMPTIONS)

- Dữ liệu thuật toán an sao, can chi, đại vận chưa đủ chuẩn nên module `tuvi-engine` trả về snapshot skeleton cố định theo cấu trúc đúng, có TODO để mở rộng. 
- CMS dùng NextAuth Credentials, seed tạo sẵn tài khoản:
  - admin@tuvi.local / admin123 (role: admin)
  - staff@tuvi.local / staff123 (role: staff)
- Rate limit cho tạo AI reading áp dụng theo IP trong memory, phù hợp chạy local. Khi lên production cần thay bằng Redis rate limit.
- Ứng dụng chạy local mặc định timezone Asia/Ho_Chi_Minh.
