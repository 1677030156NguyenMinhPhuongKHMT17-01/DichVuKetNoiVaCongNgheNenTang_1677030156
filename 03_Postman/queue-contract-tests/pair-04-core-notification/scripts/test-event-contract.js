const fs = require("fs");
const path = require("path");
const Ajv2020 = require("ajv/dist/2020");
const addFormats = require("ajv-formats");

// 1. Cấu hình đường dẫn thư mục
const root = path.resolve(__dirname, "..");
const schemaPath = path.join(root, "schema", "alert.created.schema.json");
const validDir = path.join(root, "samples", "valid");
const invalidDir = path.join(root, "samples", "invalid");

// 2. Khởi tạo JSON Schema Validator (Ajv) và thêm module kiểm tra format (như date-time)
const ajv = new Ajv2020({ allErrors: true });
addFormats(ajv);

// 3. Biên dịch Schema
const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
const validate = ajv.compile(schema);
let failed = 0;

// Hàm hỗ trợ đọc file JSON
function readJson(file) {
    return JSON.parse(fs.readFileSync(file, "utf8"));
}

console.log("==================================================");
console.log("BẮT ĐẦU KIỂM THỬ: VALID SAMPLES (EXPECTED PASS)");
console.log("==================================================");

// 4. Quét và kiểm tra các file hợp lệ (Valid)
for (const name of fs.readdirSync(validDir)) {
    if (!name.endsWith(".json")) continue;
    
    const ok = validate(readJson(path.join(validDir, name)));
    console.log(ok ? `[PASS] ${name}` : `[FAIL] ${name}`);
    
    if (!ok) { 
        console.log("  -> LỖI CHI TIẾT:", validate.errors); 
        failed++; 
    }
}

console.log("\n==================================================");
console.log("BẮT ĐẦU KIỂM THỬ: INVALID SAMPLES (EXPECTED FAIL)");
console.log("==================================================");

// 5. Quét và kiểm tra các file không hợp lệ (Invalid)
for (const name of fs.readdirSync(invalidDir)) {
    if (!name.endsWith(".json")) continue;
    
    const ok = validate(readJson(path.join(invalidDir, name)));
    
    // Nếu ok = true (tức là file sai mà lại lọt qua schema) thì bị tính là FAIL
    console.log(!ok ? `[PASS expected-invalid] ${name}` : `[FAIL unexpected-valid] ${name}`);
    
    if (ok) {
        console.log(`  -> LỖI: Schema đã cho lọt file không hợp lệ ${name}`);
        failed++;
    }
}

console.log("\n==================================================");
console.log(`TỔNG KẾT: SỐ CASE THẤT BẠI = ${failed}`);
console.log("==================================================");

// 6. Trả mã exit code (0 = Thành công toàn bộ, 1 = Có lỗi để CI GitHub Actions bắt được)
process.exitCode = failed === 0 ? 0 : 1;