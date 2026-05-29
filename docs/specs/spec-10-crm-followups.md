# Spec 10: CRM & Follow-ups

## Description
Feature: CRM & Follow-ups
Backend:
- GET /crm/followups (my followups, all)
- POST/PATCH /crm/followups
- GET /crm/upcoming-services (vehicles due for service)
- GET /crm/dropout-customers (not visited in X days)
- POST /crm/send-message (SMS/WhatsApp template)
Frontend:
- Followup list with filters
- Bulk action: send reminder messages
- Customer ageing view
- Follow-up scheduler
