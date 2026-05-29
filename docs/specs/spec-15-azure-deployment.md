# Spec 15: Production Deployment on Azure

## Description
Feature: Production Deployment on Azure
- Dockerfile for Next.js (standalone output)
- Dockerfile for NestJS
- Azure App Service deployment via GitHub Actions CI/CD
- Environment variable management (Azure Key Vault)
- PostgreSQL connection pooling (PgBouncer / Prisma pool config)
- Redis session store config
- Azure Blob Storage integration (multer + @azure/storage-blob)
- Health check endpoints
- Sentry error tracking integration
- Application Insights monitoring
- Database backup strategy (Azure automated backups)
- SSL termination at App Service level
