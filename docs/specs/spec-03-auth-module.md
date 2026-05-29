# Spec 3: Auth Module

## Description
NestJS Auth Module:
- JWT access token (15min) + refresh token (7 days) in httpOnly cookie
- Passport.js JWT strategy
- Login endpoint with bcrypt password verification
- Refresh token rotation
- Logout (invalidate refresh token)
- Forgot password (OTP via email)
- Role-based guards: @Roles('garage_manager', 'technician')
- Tenant guard: extract garage_id from JWT, validate user has access
- Next.js: Auth context, login page, protected routes via middleware
