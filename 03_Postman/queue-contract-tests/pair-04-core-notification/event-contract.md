# Event Contract sơ bộ — dùng cho dependency Queue async

> File này chỉ dùng cho các cặp Queue async ở Lab 02 để ghi nhận thỏa thuận ban đầu. Đặc tả chi tiết bằng AsyncAPI sẽ chuyển sang Lab 03.

## 1. Thông tin dependency

- Dependency số: 04 (Core Business → Notification)
- Producer: Core Business (Nhóm A6/B6)
- Consumer: Notification (Nhóm A7/B7)
- Cơ chế: Queue async
- Event/topic dự kiến: alert.created, alert.escalated, alert.resolved
- Người ghi: Nguyễn Minh Phượng
- Ngày: 2026-08-13

## 2. Mục đích nghiệp vụ

Event này được sinh ra khi Core Business phát hiện một sự kiện bất thường (ví dụ: truy cập trái phép, nhiệt độ vượt ngưỡng) và ra quyết định tạo cảnh báo (Alert). Consumer (Notification Service) sẽ lắng nghe event này để lấy thông tin và thực hiện việc gửi thông báo đa kênh (như Telegram, Email, SMS) tới người hoặc nhóm phụ trách tương ứng.

## 3. Event name / topic

| Mục | Giá trị |
|---|---|
| Event name | `alert.created` |
| Topic/queue | `campus.core.alerts` |
| Producer | `core-business` |
| Consumer | `notification-service` |

## 4. Payload tối thiểu

```json
{
  "eventId": "123e4567-e89b-12d3-a456-426614174000",
  "eventType": "alert.created",
  "occurredAt": "2026-08-13T08:35:00Z",
  "correlationId": "req-0196fb3d-4ad7-7d1e-9f49-5d5148d2babc",
  "source": "core-business",
  "data": {
    "alertId": "ALT-2026-001",
    "severity": "high",
    "message": "Phát hiện truy cập trái phép tại cổng chính",
    "targetChannels": ["telegram", "email"]
  }
}
```

## 5. Ràng buộc cần thống nhất

| Vấn đề | Quyết định tạm thời |
|---|---|
| Event id có bắt buộc không? | Có |
| Có cần correlationId không? | Có |
| Có cho phép gửi trùng event không? | Có thể, consumer phải idempotent |
| Retry khi lỗi | Nếu API Telegram/Email sập, Notification Service sẽ tự retry nội bộ 3 lần trước khi đẩy vào Dead-letter. |
| Dead-letter queue | Các event sai định dạng JSON hoặc không thể gửi sau nhiều lần retry sẽ bị đẩy vào queue campus.core.alerts.dlq. |

## 6. Issue chuyển sang Lab 03

1. Cần viết đặc tả chi tiết bằng AsyncAPI cho cả 3 event (alert.created, alert.escalated, alert.resolved).
2. Cần cấu hình và code thực tế cơ chế Retry/Dead-letter queue trên nền tảng message broker (RabbitMQ hoặc Kafka).
3. Thống nhất cơ chế bảo mật (Auth) khi kết nối vào Message Broker.
