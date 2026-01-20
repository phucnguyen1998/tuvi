# Tuvi Engine

Module cung cấp lịch pháp và lập lá số Tử Vi theo chuẩn **Nam Tông / Tử Vi Đẩu Số Tân Biên** (mức cơ bản).

## Cách dùng

```ts
import { generateTuViChart } from "@tuvi/tuvi-engine";

const chart = generateTuViChart(
  new Date(2000, 4, 15),
  { hour: 10, minute: 30 },
  "male"
);
```

## Nội dung đã có

- Chuyển đổi Âm ↔ Dương lịch theo thuật toán Hồ Ngọc Đức.
- Tính Tiết khí bằng kinh độ Mặt Trời.
- Tính Tứ Trụ (Can Chi Giờ/Ngày/Tháng/Năm).
- An 12 cung + phân bổ sao cơ bản (đã có đủ danh sách chính tinh/phụ tinh).

## Giới hạn hiện tại

- An sao Nam Tông/Tân Biên đang ở mức cơ bản, cần bổ sung quy tắc chi tiết cho từng nhóm sao.
- Cục và Mệnh hiện mới theo mapping đơn giản, cần đối chiếu tài liệu chuẩn.
