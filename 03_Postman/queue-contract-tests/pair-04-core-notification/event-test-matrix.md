# Event Test Matrix — Pair 04 (Core Business → Notification)

## 1. Thông tin chung
- **Dependency:** Pair 04 (Core Business → Notification)[cite: 2, 7, 20]
- **Cơ chế:** Queue async[cite: 7, 20]
- **Event trọng tâm:** `alert.created`, `alert.escalated`, `alert.resolved`[cite: 7]

## 2. Ma trận kiểm thử (Test Matrix)

| Mã | Tình huống kiểm thử | Mô tả chi tiết / Dữ liệu | Kỳ vọng Lab 03 (Expected Behavior) |
|:---|:---|:---|:---|
| **Q01** | Event hợp lệ, đủ field, đúng type | Payload tiêu chuẩn (`alert-created-valid-standard.json`)[cite: 20] | Schema PASS (Đã xác thực tự động bằng Ajv)[cite: 20] |
| **Q02** | Thiếu field bắt buộc | Thiếu `event_id` hoặc `correlationId`[cite: 20] | Schema FAIL (Bắt lỗi thiếu trường bắt buộc)[cite: 20] |
| **Q03** | Sai enum, type hoặc format | Sai định dạng `timestamp` hoặc sai giá trị `severity`[cite: 20] | Schema FAIL (Bắt lỗi sai cấu trúc dữ liệu/format)[cite: 20] |
| **Q04** | `eventType` hoặc `source` không đúng contract | `source` khác `"core-business"` hoặc sai tên event[cite: 20] | Schema FAIL (Từ chối nguồn dữ liệu không hợp lệ)[cite: 20] |
| **Q05** | Cùng `event_id` xuất hiện hai lần | Gửi lặp lại cùng một thông điệp sự kiện[cite: 20] | Consumer (Notification) phải có cơ chế **idempotency**, kiểm tra khóa trùng để không gửi thông báo lặp lại cho người dùng[cite: 14, 20]. |
| **Q06** | Consumer xử lý lỗi khi gọi dịch vụ bên thứ 3 | API Telegram/Email sập hoặc timeout tạm thời[cite: 19, 20] | Consumer tự động **retry** nội bộ (tối đa 3 lần với chiến lược back-off)[cite: 19, 20]. |
| **Q07** | Retry hết giới hạn cho phép | Lỗi hệ thống kéo dài không khắc phục được[cite: 19, 20] | Chuyển message lỗi vào **Dead-Letter Queue (DLQ)** để xử lý thủ công hoặc điều tra sau (cấu hình chi tiết ở Lab 05)[cite: 19, 20]. |
| **Q08** | `eventVersion` không hỗ trợ | Event gửi lên mang phiên bản cũ/mới chưa được định nghĩa | Từ chối hoặc xử lý theo quy tắc versioning đã thỏa thuận (tạm bỏ qua hoặc log warning)[cite: 20]. |
| **Q09** | Event đến trễ hoặc out-of-order | Các event `alert.created`, `alert.resolved` đến không đúng thứ tự thời gian | Xử lý dựa trên mốc `timestamp` của từng event độc lập hoặc ghi nhận thời điểm xảy ra (`occurredAt`)[cite: 20]. |

## 3. Ghi chú thực thi
- Các test case từ **Q01 đến Q04** đã được hiện thực hóa và kiểm thử tự động thành công thông qua script `test-event-contract.js` kết hợp với thư viện Ajv[cite: 20].
- Các kịch bản từ **Q05 đến Q09** là các ràng buộc ngữ nghĩa (semantic rules) đã được hai nhóm Core Business và Notification thống nhất phương án xử lý, làm tiền đề để triển khai code logic và hạ tầng Message Broker hoàn chỉnh ở Lab 05[cite: 20].