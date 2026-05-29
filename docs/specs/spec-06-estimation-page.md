# Spec 6: Estimation Page

## Description
Feature: Estimation / Job Card Estimation Page
Backend:
- GET /spare-parts/search?q= (with stock qty)
- GET /services/search?q=
- POST/PUT /job-cards/:id/spare-items (bulk upsert)
- POST/PUT /job-cards/:id/service-items (bulk upsert)  
- GET /job-cards/:id/estimate-totals (computed)
- POST /invoices/generate-pdf/:jobCardId
Frontend:
- Tabbed interface: Offers, Complaints, Packages, Spares, Services, Rejected
- Spares tab: live search, quantity, rate dropdown (MRP/batch), tax auto-fill
- Real-time subtotal/tax/net calculation
- "Billed To" overflow column (Customer/Insurance toggle)
- Print estimate: modal with type selector → PDF generation
