# Spec 4: Customer & Vehicle Registration

## Description
Feature: New Customer Registration
Backend:
- GET /vehicles/search?q=OD05 (typeahead, min 3 chars)
- POST /customers + POST /vehicles + POST /job-cards (atomic transaction)
- GET /vehicle-brands, GET /vehicle-models?brandId=
- POST /vehicle-brands, POST /vehicle-models (inline creation)
- POST /customer-sources
- POST /employees (technician/supervisor inline creation)
Frontend:
- Registration modal with typeahead vehicle search
- Auto-populate form on vehicle selection
- Inline modals for new brand/model/category/source/technician
- Zod validation schema matching all required fields
- On success: redirect to estimation page
