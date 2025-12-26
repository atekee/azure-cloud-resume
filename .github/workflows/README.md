# CI/CD – GitHub Actions
This directory contains the **CI/CD pipelines** for the Azure Cloud Resume Challenge project.
GitHub Actions is used to automate testing, infrastructure provisioning, and deployment of both frontend and backend components.

All pipelines are **event-driven**, **fully automated**, and run independently of user traffic.

## Workflow Structure
```text
.github/workflows/
├── backend-ci.yml         # Runs backend unit tests and validation
├── backend-deploy.yml     # Deploys backend infrastructure and function code
└── frontend-deploy.yml    # Deploys static frontend assets
```

## Overview
The CI/CD system is responsible for:
- Validating backend code with unit tests
- Packaging application artifacts
- Provisioning and updating Azure infrastructure using IaC
- Deploying frontend and backend components automatically

CI/CD pipelines are triggered **only on code changes** and do not participate in runtime request handling.
