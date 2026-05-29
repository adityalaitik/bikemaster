# Spec 5: Service Queue

## Description
Feature: Service Queue (Main Dashboard)
Backend:
- GET /job-cards?status=&garageId=&date=&search= (paginated)
- Status count aggregation endpoint
- PATCH /job-cards/:id/status
Frontend:
- Filterable job card grid (status pills, search, date, branch)
- Job card component with all fields from spec
- Circular progress component
- Slide-in detail panel (480px) with tabs
- Real-time status update (optimistic UI)
- Action buttons: History modal, Quick Pay, Discount, Invoice
