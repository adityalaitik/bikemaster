# Spec 12: Business Intelligence Dashboard

## Description
Feature: Business Intelligence Dashboard
Backend:
- GET /analytics/kpis?garageId=&from=&to=
- GET /analytics/revenue-by-location
- GET /analytics/daily-revenue
- GET /analytics/vehicle-brand-service-count
- GET /analytics/customer-retention
- GET /analytics/technician-tat
- (all 35+ charts from spec)
Frontend:
- Full-screen BI dashboard
- Date range filter with presets (1m/3m/6m/YTD/1y)
- Recharts components for each chart type
- KPI cards with trend indicators
- Drill-down capability on charts
