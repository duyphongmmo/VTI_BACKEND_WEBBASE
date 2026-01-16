-- Initial data for DKT-Report system
-- Admin user: username=admin, password=snp1234567

INSERT INTO "tbl_users" ("id", "username", "password", "code", "email", "full_name", "date_of_birth", "phone", "status", "deleted_at", "otp_code", "expire", "created_by", "status_notification") VALUES
	(1, 'admin', '$2a$10$QZ5iqL6WHCHWqO4sXPEHTOUXycocVCLnnUkm4rTo9m6rN7FBUuuZ6', '000000001', 'admin@ajinomoto.com.vn', 'Admin', NULL, NULL, 1, NULL, NULL, NULL, NULL, 'true');

INSERT INTO "tbl_user_role_settings" ("id", "name", "description", "code") VALUES (1, 'Admin', 'Quản trị viên', '01');

INSERT INTO "tbl_users_user_role_settings_tbl_user_role_settings" ("tbl_users_id", "tbl_user_role_settings_id") VALUES (1, 1);

-- Group permission settings
INSERT INTO "tbl_group_permission_settings" ("code", "name", "status") VALUES
	('USER_USER_GROUP', 'Quản lý người dùng', 1),
	('USER_USER_ROLE_SETTING_GROUP', 'Quản lý vai trò', 1),
	('USER_PERMISSION_GROUP', 'Quản lý phân quyền', 1),
	('DASHBOARD_GROUP', 'Quản lý dashboard', 1);
	
-- Permission settings
INSERT INTO "tbl_permission_settings" ("code", "name", "status", "group_permission_setting_code") VALUES
	-- User permissions
	('USER_CREATE_USER', 'Tạo người dùng', 1, 'USER_USER_GROUP'),
	('USER_UPDATE_USER', 'Sửa người dùng', 1, 'USER_USER_GROUP'),
	('USER_DELETE_USER', 'Xóa người dùng', 1, 'USER_USER_GROUP'),
	('USER_DETAIL_USER', 'Chi tiết người dùng', 1, 'USER_USER_GROUP'),
	('USER_LIST_USER', 'Danh sách người dùng', 1, 'USER_USER_GROUP'),
	('USER_SEARCH_USER', 'Tìm kiếm người dùng', 1, 'USER_USER_GROUP'),
	('USER_IMPORT_USER', 'Import người dùng', 1, 'USER_USER_GROUP'),
	('USER_EXPORT_USER', 'Export người dùng', 1, 'USER_USER_GROUP'),
	('USER_CHANGE_PASSWORD_USER', 'Đổi mật khẩu', 1, 'USER_USER_GROUP'),
	
	-- User role permissions
	('USER_CREATE_USER_ROLE_SETTING', 'Tạo vai trò', 1, 'USER_USER_ROLE_SETTING_GROUP'),
	('USER_UPDATE_USER_ROLE_SETTING', 'Sửa vai trò', 1, 'USER_USER_ROLE_SETTING_GROUP'),
	('USER_DELETE_USER_ROLE_SETTING', 'Xóa vai trò', 1, 'USER_USER_ROLE_SETTING_GROUP'),
	('USER_DETAIL_USER_ROLE_SETTING', 'Chi tiết vai trò', 1, 'USER_USER_ROLE_SETTING_GROUP'),
	('USER_LIST_USER_ROLE_SETTING', 'Danh sách vai trò', 1, 'USER_USER_ROLE_SETTING_GROUP'),
	('USER_SEARCH_USER_ROLE_SETTING', 'Tìm kiếm vai trò', 1, 'USER_USER_ROLE_SETTING_GROUP'),
	('USER_IMPORT_USER_ROLE_SETTING', 'Import vai trò', 1, 'USER_USER_ROLE_SETTING_GROUP'),
	('USER_EXPORT_USER_ROLE_SETTING', 'Export vai trò', 1, 'USER_USER_ROLE_SETTING_GROUP'),
	('USER_CHANGE_STATUS_USER_ROLE_SETTING', 'Đổi trạng thái vai trò', 1, 'USER_USER_ROLE_SETTING_GROUP'),
	
	-- Permission management
	('USER_SET_PERMISSION_USER', 'Phân quyền cho người dùng', 1, 'USER_PERMISSION_GROUP'),
	('USER_LIST_PERMISSION_USER', 'Danh sách quyền', 1, 'USER_PERMISSION_GROUP'),
	('USER_SEARCH_PERMISSION_USER', 'Tìm kiếm quyền', 1, 'USER_PERMISSION_GROUP'),
	
	-- Dashboard permissions
	('DASHBOARD_VIEW', 'Xem dashboard', 1, 'DASHBOARD_GROUP'),
	('DASHBOARD_EXPORT', 'Export dashboard', 1, 'DASHBOARD_GROUP');

-- Grant all permissions to Admin role
INSERT INTO "tbl_user_role_permission_settings" ("user_role_id", "permission_setting_code", "status")
SELECT 1, code, 1 FROM "tbl_permission_settings";



