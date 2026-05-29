# Spec 8: Invoicing & Payments

## Description
Feature: Invoicing & Payments
Backend:
- POST /invoices (generate from job card)
- GET /invoices/:id/pdf (stream PDF)
- POST /payments (record payment)
- GET /invoices/:id/payment-summary
- POST /credit-debit-notes
Frontend:
- Invoice view with all sections from spec
- Payment entry modal (multi-payment method support)
- Outstanding dues tracking
- Print/Download/Share invoice
- Tax type switcher (inclusive/exclusive)
