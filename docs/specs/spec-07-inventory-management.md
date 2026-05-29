# Spec 7: Inventory Management

## Description
Feature: Inventory Management
Backend:
- CRUD /spare-parts
- CRUD /inventory-batches
- POST /inventory-transactions (issue, purchase, return, transfer)
- GET /inventory/stock-levels?garageId= (current stock per part)
- GET /inventory/low-stock-alerts
- POST /inventory/transfer (garage-to-garage)
Frontend:
- Spare parts master list with search/filter
- Batch management per part
- Stock movement history
- Low stock alerts dashboard widget
- Inter-garage transfer form
