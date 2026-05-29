export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'bikemaster-wms-jwt-secret-2026',
  expiresIn: 28800, // 8 hours in seconds
};
