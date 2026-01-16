# DKT-Report Service - Tài liệu tổng quan

## 📋 Mục lục
1. [Tổng quan hệ thống](#tổng-quan-hệ-thống)
2. [Cấu trúc Database](#cấu-trúc-database)
3. [API Endpoints](#api-endpoints)
4. [Xác thực & Phân quyền](#xác-thực--phân-quyền)
5. [Cấu trúc thư mục](#cấu-trúc-thư-mục)
6. [Cấu hình hệ thống](#cấu-hình-hệ-thống)
7. [Hướng dẫn triển khai](#hướng-dẫn-triển-khai)

---

## 🎯 Tổng quan hệ thống

### Mô tả
DKT-Report là hệ thống backend quản lý báo cáo được xây dựng trên NestJS framework, sử dụng TypeORM để quản lý database PostgreSQL.

### Công nghệ sử dụng
- **Framework**: NestJS (Fastify adapter)
- **Language**: TypeScript
- **Database**: PostgreSQL 13
- **ORM**: TypeORM
- **Authentication**: JWT (JSON Web Token)
- **Container**: Docker
- **Export**: ExcelJS
- **Validation**: class-validator, class-transformer
- **i18n**: nestjs-i18n (hỗ trợ en, jp, vi)

### Đặc điểm chính
- ✅ Quản lý báo cáo (Reports)
- ✅ Dashboard với thống kê
- ✅ Phân quyền chi tiết (Role-based Access Control)
- ✅ Export dữ liệu ra Excel
- ✅ Quản lý người dùng và vai trò
- ✅ Hỗ trợ đa ngôn ngữ
- ✅ Migration-based schema management

---

## 🗄️ Cấu trúc Database

### Schema Tables

#### 1. **tbl_users** - Bảng người dùng
```sql
- id: integer (PK)
- username: varchar(255) UNIQUE
- password: varchar(255)
- code: varchar(255) UNIQUE
- email: varchar(255)
- full_name: varchar(255)
- date_of_birth: timestamp
- phone: varchar(50)
- status: integer (0: Inactive, 1: Active)
- status_notification: varchar(10)
- otp_code: varchar(10)
- expire: timestamp
- created_by: varchar(255)
- created_at: timestamp
- updated_at: timestamp
- deleted_at: timestamp (soft delete)
```

#### 2. **tbl_user_role_settings** - Bảng vai trò
```sql
- id: integer (PK)
- name: varchar(255)
- description: text
- code: varchar(50) UNIQUE
```

#### 3. **tbl_users_user_role_settings_tbl_user_role_settings** - Bảng liên kết User-Role (Many-to-Many)
```sql
- tbl_users_id: integer (FK -> tbl_users)
- tbl_user_role_settings_id: integer (FK -> tbl_user_role_settings)
```

#### 4. **tbl_group_permission_settings** - Nhóm quyền
```sql
- code: varchar(255) (PK)
- name: varchar(255)
- status: integer
```

#### 5. **tbl_permission_settings** - Quyền chi tiết
```sql
- code: varchar(255) (PK)
- name: varchar(255)
- status: integer
- group_permission_setting_code: varchar(255) (FK)
```

#### 6. **tbl_user_role_permission_settings** - Phân quyền cho vai trò
```sql
- id: integer (PK)
- user_role_id: integer (FK -> tbl_user_role_settings)
- permission_setting_code: varchar(255) (FK)
- status: integer
```

#### 7. **tbl_reports** - Bảng báo cáo
```sql
- id: integer (PK)
- title: varchar(255)
- description: text
- report_type: varchar(50)
- report_date: date
- user_id: integer (FK -> tbl_users)
- total_value: decimal(15,2)
- quantity: integer
- status: integer (0: Draft, 1: Active, 2: Completed, 3: Cancelled)
- created_by: integer
- updated_by: integer
- created_at: timestamp
- updated_at: timestamp
- deleted_at: timestamp
```

#### 8. **tbl_mail_history** - Lịch sử gửi mail
```sql
- id: integer (PK)
- subject: varchar(255)
- content: text
- to_email: varchar(255)
- status: integer
- created_at: timestamp
```

#### 9. **system_log** - Log hệ thống
```sql
- id: integer (PK)
- action: varchar(255)
- user_id: integer
- ip_address: varchar(50)
- created_at: timestamp
```

#### 10. **migrations** - Lịch sử migration
```sql
- id: integer (PK)
- timestamp: bigint
- name: varchar(255)
```

### Relationships
```
User (1) -----> (N) Reports
User (N) <----> (N) UserRoleSettings
UserRoleSettings (1) -----> (N) UserRolePermissionSettings
PermissionSettings (1) -----> (N) UserRolePermissionSettings
GroupPermissionSettings (1) -----> (N) PermissionSettings
```

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:32793/api/v1
```

### Authentication Endpoints

#### POST `/auth/login`
Đăng nhập hệ thống

**Request Body:**
```json
{
  "username": "admin",
  "password": "snp1234567",
  "type": 0  // Optional: 0=SYSTEM, 1=AZURE, 2=MOBILE (default: 0)
}
```

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "userInfo": {
      "dateOfBirth": null
    },
    "accessToken": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": "1800000s"
    },
    "refreshToken": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": "1800000s"
    }
  },
  "message": "Success"
}
```

#### POST `/auth/login-mobile`
Đăng nhập cho mobile app

#### GET `/auth/token/refresh`
Refresh access token

### User Endpoints

#### GET `/users/me`
Lấy thông tin user hiện tại (cần JWT)

#### GET `/users/list`
Danh sách người dùng (có phân trang)

**Query Parameters:**
- `page`: Số trang (default: 1)
- `limit`: Số lượng/trang (default: 10)

#### POST `/users/create`
Tạo người dùng mới

#### PUT `/users/:id`
Cập nhật thông tin người dùng

#### DELETE `/users/:id`
Xóa người dùng (soft delete)

#### PUT `/users/change-password`
Đổi mật khẩu

### Dashboard Endpoints

#### GET `/dashboard`
Lấy dữ liệu dashboard với thống kê

**Query Parameters:**
- `page`: integer (default: 1)
- `limit`: integer (default: 10)
- `startDate`: string (YYYY-MM-DD) - Optional
- `endDate`: string (YYYY-MM-DD) - Optional
- `reportType`: string - Optional (PRODUCTION, SALES, INVENTORY, QUALITY, etc.)

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "reports": [
      {
        "id": 1,
        "title": "Báo cáo sản xuất tháng 1",
        "reportType": "PRODUCTION",
        "reportDate": "2025-01-15",
        "totalValue": "125000.50",
        "quantity": 1500,
        "status": 1,
        "createdAt": "2025-12-31T02:46:24.740Z"
      }
    ],
    "stats": {
      "totalReports": 95,
      "totalValue": 24377523,
      "totalQuantity": 65530,
      "avgValue": 256605.51
    },
    "total": 95
  },
  "message": "Thành công"
}
```

### Export Endpoints

#### POST `/export`
Export dữ liệu dashboard ra Excel

**Request Body:**
```json
{
  "type": 0  // 0: DASHBOARD
}
```

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "type": "Buffer",
    "data": [80, 75, 3, 4, 20, 0, 8, 0, ...]
  },
  "fileName": "Dashboard_Report_2025-12-31T10-30-45.xlsx",
  "message": "Success"
}
```

### User Role Settings Endpoints

#### GET `/users/user-role-settings/list`
Danh sách vai trò

#### POST `/users/user-role-settings`
Tạo vai trò mới

#### PUT `/users/user-role-settings/:id`
Cập nhật vai trò

#### DELETE `/users/user-role-settings/:id`
Xóa vai trò

#### POST `/users/user-role-settings/set-permissions`
Phân quyền cho vai trò

---

## 🔐 Xác thực & Phân quyền

### Authentication Flow
1. User gửi `username` và `password` đến `/auth/login`
2. Server xác thực và trả về `accessToken` + `refreshToken`
3. Client lưu token và gửi kèm trong header cho các request tiếp theo:
   ```
   Authorization: Bearer <accessToken>
   ```
4. Server verify token và kiểm tra permissions
5. Token hết hạn → dùng refreshToken để lấy token mới

### Permission System

#### Nhóm quyền (Permission Groups)
- `USER_USER_GROUP`: Quản lý người dùng
- `USER_USER_ROLE_SETTING_GROUP`: Quản lý vai trò
- `USER_PERMISSION_GROUP`: Quản lý phân quyền
- `DASHBOARD_GROUP`: Quản lý dashboard

#### Quyền chi tiết (Permissions)
**User Management:**
- `USER_CREATE_USER`: Tạo người dùng
- `USER_UPDATE_USER`: Sửa người dùng
- `USER_DELETE_USER`: Xóa người dùng
- `USER_DETAIL_USER`: Chi tiết người dùng
- `USER_LIST_USER`: Danh sách người dùng
- `USER_SEARCH_USER`: Tìm kiếm người dùng
- `USER_IMPORT_USER`: Import người dùng
- `USER_EXPORT_USER`: Export người dùng
- `USER_CHANGE_PASSWORD_USER`: Đổi mật khẩu

**Role Management:**
- `USER_CREATE_USER_ROLE_SETTING`: Tạo vai trò
- `USER_UPDATE_USER_ROLE_SETTING`: Sửa vai trò
- `USER_DELETE_USER_ROLE_SETTING`: Xóa vai trò
- `USER_DETAIL_USER_ROLE_SETTING`: Chi tiết vai trò
- `USER_LIST_USER_ROLE_SETTING`: Danh sách vai trò

**Dashboard:**
- `DASHBOARD_VIEW`: Xem dashboard
- `DASHBOARD_EXPORT`: Export dashboard

### Default Admin Account
```
Username: admin
Password: snp1234567
Role: Admin (có tất cả quyền)
```

---

## 📁 Cấu trúc thư mục

```
be/
├── db/                                 # Database scripts
│   ├── DatabaseStructure.sql          # Schema structure (deprecated)
│   ├── InititialData.sql              # Initial seed data (admin user, roles, permissions)
│   └── sample-reports.sql             # Sample report data (100 records)
│
├── src/
│   ├── main.ts                        # Application entry point
│   ├── app.module.ts                  # Root module
│   │
│   ├── common/                        # Common constants
│   │   └── index.ts
│   │
│   ├── config/                        # Configuration
│   │   ├── config.service.ts          # Environment config
│   │   ├── database.config.ts         # Database connection
│   │   └── mail.config.ts             # Mail settings
│   │
│   ├── constant/                      # App constants
│   │   ├── common.ts
│   │   ├── error-message.enum.ts
│   │   ├── response-code.enum.ts
│   │   └── import.constant.ts
│   │
│   ├── core/                          # Core framework components
│   │   ├── abstracts/                 # Abstract base classes
│   │   ├── decorator/                 # Custom decorators
│   │   ├── dto/                       # Base DTOs
│   │   ├── entity/                    # Base entities
│   │   ├── guards/                    # Auth guards
│   │   ├── interceptors/              # Interceptors
│   │   ├── middleware/                # Middleware
│   │   ├── pipe/                      # Custom pipes
│   │   └── repository/                # Base repository
│   │
│   ├── database/                      # TypeORM migrations
│   │   ├── 1697902580075-migrations.ts        # Core tables (users, roles, permissions)
│   │   ├── 1767093780000-create-reports-table.ts  # Reports table
│   │   └── 1767094200000-drop-old-tables.ts      # Cleanup old tables
│   │
│   ├── entities/                      # TypeORM entities
│   │   ├── user/
│   │   │   └── user.entity.ts
│   │   ├── user-role/
│   │   │   └── user-role.entity.ts
│   │   ├── user-role-setting/
│   │   │   └── user-role-setting.entity.ts
│   │   ├── group-permission-setting/
│   │   │   └── group-permission-setting.entity.ts
│   │   ├── permission-setting/
│   │   │   └── permission-setting.entity.ts
│   │   ├── user-role-permission-setting/
│   │   │   └── user-role-permission-setting.entity.ts
│   │   ├── report/
│   │   │   └── report.entity.ts
│   │   └── mail/
│   │       └── mail-history.entity.ts
│   │
│   ├── repositories/                  # Repository implementations
│   │   ├── user.repository.ts
│   │   ├── user-role.repository.ts
│   │   ├── user-role-setting.repository.ts
│   │   ├── permission-setting.repository.ts
│   │   ├── group-permission-setting.repository.ts
│   │   ├── user-role-permission-setting.repository.ts
│   │   ├── system-log.repository.ts
│   │   ├── report/
│   │   │   └── report.repository.ts
│   │   └── mail/
│   │       └── mail-history.repository.ts
│   │
│   ├── components/                    # Feature modules
│   │   │
│   │   ├── auth/                      # Authentication module
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.guard.ts
│   │   │   ├── auth.constant.ts
│   │   │   ├── dto/
│   │   │   │   ├── request/
│   │   │   │   │   ├── login-request.dto.ts
│   │   │   │   │   └── login-mobile-request.dto.ts
│   │   │   │   └── response/
│   │   │   │       └── login-sucessfully-response.dto.ts
│   │   │   └── interface/
│   │   │       └── auth.service.interface.ts
│   │   │
│   │   ├── user/                      # User management module
│   │   │   ├── user.module.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   ├── user.constant.ts
│   │   │   ├── dto/
│   │   │   │   ├── request/
│   │   │   │   └── response/
│   │   │   │       └── user.response.dto.ts
│   │   │   └── interface/
│   │   │       ├── user.service.interface.ts
│   │   │       └── user.repository.interface.ts
│   │   │
│   │   ├── dashboard/                 # Dashboard module
│   │   │   ├── dashboard.module.ts
│   │   │   ├── dashboard.controller.ts
│   │   │   ├── dashboard.service.ts
│   │   │   ├── dto/
│   │   │   │   ├── request/
│   │   │   │   │   └── get-dashboard.request.dto.ts
│   │   │   │   └── response/
│   │   │   │       └── dashboard.response.dto.ts
│   │   │   └── interface/
│   │   │       └── dashboard.service.interface.ts
│   │   │
│   │   ├── export/                    # Export module
│   │   │   ├── export.module.ts
│   │   │   ├── export.controller.ts
│   │   │   ├── export.service.ts
│   │   │   ├── export.constant.ts
│   │   │   ├── dto/
│   │   │   │   └── request/
│   │   │   │       └── export.request.dto.ts
│   │   │   └── interface/
│   │   │       └── export.service.interface.ts
│   │   │
│   │   ├── settings/                  # Settings modules
│   │   │   └── user-role-setting/
│   │   │       ├── user-role-setting.module.ts
│   │   │       ├── user-role-setting.controller.ts
│   │   │       └── user-role-setting.service.ts
│   │   │
│   │   └── mail/                      # Mail module
│   │       ├── mail.module.ts
│   │       ├── mail.controller.ts
│   │       ├── mail.service.ts
│   │       └── mail.constant.ts
│   │
│   ├── helper/                        # Helper utilities
│   │   └── string.helper.ts
│   │
│   ├── utils/                         # Utility classes
│   │   ├── api.error.ts
│   │   ├── common.request.dto.ts
│   │   ├── common.ts
│   │   ├── constant.ts
│   │   ├── helper.ts
│   │   ├── pagination.query.ts
│   │   ├── paging.response.ts
│   │   ├── response-builder.ts
│   │   ├── response-payload.ts
│   │   └── success.response.dto.ts
│   │
│   └── i18n/                          # Internationalization
│       ├── en/                        # English translations
│       ├── jp/                        # Japanese translations
│       └── vi/                        # Vietnamese translations
│
├── test/                              # E2E tests
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
│
├── docker-compose.yml                 # Docker compose config
├── Dockerfile                         # Docker image definition
├── package.json                       # NPM dependencies
├── tsconfig.json                      # TypeScript config
├── nest-cli.json                      # NestJS CLI config
└── README.md                          # Project documentation
```

---

## ⚙️ Cấu hình hệ thống

### Environment Variables
Tạo file `.env` với nội dung:

```env
# Application
NODE_ENV=development
HTTP_PORT=3001

# Database
DB_HOST=docker-postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=DKT-report

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=1800000s

# CORS
CORS_ORIGIN=*

# Mail (Optional)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-password
```

### Docker Configuration

#### docker-compose.yml
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:13
    container_name: docker-postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: DKT-report
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  app:
    build: .
    container_name: dkt-report-service
    ports:
      - "32793:3001"
    depends_on:
      - postgres
    environment:
      DB_HOST: docker-postgres
    volumes:
      - .:/app
      - /app/node_modules

volumes:
  postgres_data:
```

### TypeORM Configuration (app.module.ts)
```typescript
TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'DKT-report',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false,           // ❗ MUST be false in production
  migrationsRun: true,          // Auto-run migrations on startup
  migrations: ['/database/*.{ts,js}'],
  logging: ['query', 'error'],
})
```

---

## 🚀 Hướng dẫn triển khai

### 1. Prerequisites
- Node.js >= 16.x
- Docker & Docker Compose
- PostgreSQL 13 (nếu không dùng Docker)

### 2. Installation

```bash
# Clone repository
git clone <repository-url>
cd be

# Install dependencies
npm install --legacy-peer-deps

# Setup environment
cp .env.example .env
# Edit .env với thông tin của bạn
```

### 3. Database Setup

#### Sử dụng Docker (Recommended)
```bash
# Start PostgreSQL container
docker-compose up -d postgres

# Hoặc sử dụng container có sẵn
docker start docker-postgres
```

#### Load Initial Data
```bash
# Load admin user, roles, permissions
docker exec -i docker-postgres psql -U postgres -d "DKT-report" < db/InititialData.sql

# Load sample reports (Optional)
docker exec -i docker-postgres psql -U postgres -d "DKT-report" < src/database/sample-reports.sql
```

### 4. Run Application

#### Development Mode
```bash
npm run start:dev
```

#### Production Mode
```bash
npm run build
npm run start:prod
```

#### Docker Mode
```bash
docker-compose up -d
```

### 5. Verify Installation

```bash
# Health check
curl http://localhost:32793/api/v1/users/ping

# Login test
curl -X POST http://localhost:32793/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"snp1234567"}'
```

### 6. Access Swagger Documentation
```
http://localhost:32793/api/v1/dkt-report/swagger-docs
```

---

## 📊 Database Migration

### Tạo Migration mới
```bash
npm run migration:create -- src/database/MigrationName
```

### Chạy Migrations
```bash
npm run migration:run
```

### Rollback Migration
```bash
npm run migration:revert
```

### Show Migrations
```bash
npm run migration:show
```

---

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Test Coverage
```bash
npm run test:cov
```

---

## 📝 Sample Use Cases

### 1. Login và lấy Dashboard data
```bash
# Step 1: Login
TOKEN=$(curl -X POST http://localhost:32793/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"snp1234567"}' \
  | jq -r '.data.accessToken.token')

# Step 2: Get Dashboard
curl -X GET "http://localhost:32793/api/v1/dashboard?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

### 2. Export Dashboard to Excel
```bash
curl -X POST http://localhost:32793/api/v1/export \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"type":0}' \
  --output dashboard_export.xlsx
```

### 3. Tạo User mới
```bash
curl -X POST http://localhost:32793/api/v1/users/create \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "password": "password123",
    "email": "newuser@example.com",
    "fullName": "New User",
    "code": "USR001"
  }'
```

---

## 🔧 Troubleshooting

### Issue: Migration không chạy
**Solution:**
- Kiểm tra path trong `app.module.ts`: `migrations: ['/database/*.{ts,js}']`
- Đảm bảo `migrationsRun: true`
- Restart application

### Issue: JWT token invalid
**Solution:**
- Kiểm tra JWT_SECRET trong .env
- Token có thể đã hết hạn, login lại để lấy token mới

### Issue: Database connection failed
**Solution:**
- Kiểm tra PostgreSQL đang chạy: `docker ps | grep postgres`
- Verify connection string trong .env
- Check firewall/network settings

### Issue: Permission denied
**Solution:**
- Đảm bảo user có role Admin hoặc đã được phân quyền phù hợp
- Kiểm tra bảng `tbl_user_role_permission_settings`

---

## 📞 Support

- **Email**: admin@ajinomoto.com.vn
- **Documentation**: `/api/v1/dkt-report/swagger-docs`

---

## 📄 License

Private - All rights reserved

---

**Last Updated**: December 31, 2025
**Version**: 1.0.0
