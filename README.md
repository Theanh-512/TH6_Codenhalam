# Product Management System - TH6 Codenhalam

Dự án quản lý sản phẩm hoàn thiện với Backend ASP.NET Core Web API và Frontend Angular (CellphoneS UI Concept).

## 🛠 Yêu cầu hệ thống (Prerequisites)
- [.NET SDK 8.0+](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (Phiên bản LTS)
- [Angular CLI](https://angular.io/cli) (`npm install -g @angular/cli@latest`)

---

## 🚀 Hướng dẫn cài đặt và chạy dự án (Setup Guide)

### Bước 1: Clone dự án
```bash
git clone https://github.com/Theanh-512/TH6_Codenhalam.git
cd TH6_Codenhalam
```

### Bước 2: Chạy Backend (ASP.NET Core API)
Mở terminal tại thư mục gốc của dự án:
```bash
# Cấu hình thư mục lưu ảnh (nếu chưa có)
mkdir wwwroot/images -Force

# Khôi phục các gói NuGet
dotnet restore

# Chạy Server
dotnet run
```
*Mặc định Server sẽ chạy tại: `http://localhost:5185`*

### Bước 3: Chạy Frontend (Angular)
Mở một terminal **mới** tại thư mục `Frontend`:
```bash
cd Frontend

# Cài đặt các thư viện Node.js
npm install

# Chạy ứng dụng Angular
npm start
```
*Mặc định Frontend sẽ chạy tại: `http://localhost:4200`*

---

## 📌 Lưu ý quan trọng
1. **Database**: Hệ thống sử dụng SQL Server LocalDB. Khi chạy lần đầu, `EnsureCreated()` sẽ tự động tạo cơ sở dữ liệu mới (`ProductDb_New`). Không cần chạy Migration thủ công.
2. **Hình ảnh**: Ảnh tải lên sẽ được lưu trong `wwwroot/images/`. Nếu bạn Pull code về mà bị lỗi hiển thị ảnh cũ, hãy kiểm tra thư mục này.
3. **Cổng (Ports)**: 
   - Backend: **5185**
   - Frontend: **4200**
   - Đảm bảo các cổng này không bị chiếm bởi ứng dụng khác.

---

## 🎨 Giao diện (Features)
- [x] Quản lý Sản phẩm (Thêm, Xóa, Sửa, Đọc)
- [x] Tìm kiếm sản phẩm thời gian thực
- [x] Upload hình ảnh cục bộ
- [x] Giao diện Red/White PhoneS Concept hiện đại
