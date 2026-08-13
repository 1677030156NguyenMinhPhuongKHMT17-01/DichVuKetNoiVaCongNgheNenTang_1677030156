# Pair 04: Core Business → Notification (Queue Async Contract Testing)

Học phần: **FIT4110 – Dịch vụ kết nối và Công nghệ nền tảng**  
Lab: **Lab 03 — Event Contract & Schema Testing**  
Hệ thống: **Smart Campus Operations Platform**

---

## 1. Tổng quan thư mục
Thư mục này chứa toàn bộ các artefact kiểm thử hợp đồng sự kiện (Event Contract) cho cặp tích hợp bất đồng bộ giữa **Core Business (Producer)** và **Notification Service (Consumer)** đối với các sự kiện trọng tâm như `alert.created`, `alert.escalated`, `alert.resolved`[cite: 2, 7, 20].

Cấu trúc thư mục:
```text
pair-04-core-notification/
├── schema/
│   └── alert.created.schema.json      # JSON Schema kiểm tra cấu trúc event
├── samples/
│   ├── valid/                         # Dữ liệu mẫu hợp lệ (Expected PASS)
│   └── invalid/                       # Dữ liệu mẫu sai contract (Expected FAIL)
├── scripts/
│   └── test-event-contract.js         # Script tự động chạy kiểm thử bằng Ajv
├── reports/
│   └── event-contract-test.txt        # File báo cáo kết quả thực thi test
├── event-contract.md                  # Văn bản hợp đồng sự kiện sơ bộ
├── event-test-matrix.md               # Ma trận kiểm thử các tình huống ngữ nghĩa
├── producer-consumer-handshake.md     # Biên bản xác nhận giữa Producer và Consumer
└── README.md                          # Tài liệu hướng dẫn sử dụng