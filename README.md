# Azure Cloud Resume Challenge
This repository contains my implementation of the **Azure Cloud Resume Challenge**, built to demonstrate real-world cloud engineering practices including static web hosting, serverless APIs, CI/CD automation, and Infrastructure as Code.

**Live site:** https://atabaykadiroglu.com

## Repository Layout
```
.
├── README.md
├── LICENSE
├── .gitignore
├── .editorconfig
├── .pre-commit-config.yaml
│
├── docs/
│   └── architecture-diagram.png
│
├── frontend/
│   ├── README.md
│   ├── index.html
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── main.js
│   │   └── main.mock.js
│   ├── components/
│   │   └── resume.html
│   └── assets/
│       └── images/
│           ├── icon-azure.png
│           ├── icon-github.png
│           ├── icon-linkedin.png
│           └── profile.png
│
├── backend/
│   ├── README.md
│   ├── function_app.py
│   ├── host.json
│   ├── requirements.txt
│   ├── pyproject.toml
│   ├── pytest.ini
│   ├── local.settings.ci.json
│   ├── .python-version
│   ├── uv.lock
│   └── tests/
│       ├── conftest.py
│       ├── test_get_visitor.py
│       └── test_update_visitor.py
│
├── infra/
│   ├── apim/
│   │   ├── policies/
│   │   │   └── visitor-policy.xml
│   │   └── scripts/
│   │       ├── create_apim.sh
│   │       ├── add_operations.sh
│   │       ├── configure_backend.sh
│   │       └── setup_named_values.sh
│   └── arm/
│       ├── templates/
│       │   ├── cosmosdb.json
│       │   └── functionapp.json
│       └── scripts/
│           ├── deploy_cosmosdb.sh
│           ├── deploy_functionapp.sh
│           └── deploy_backend.sh
│
└── .github/
    ├── README.md
    └── workflows/
        ├── backend-ci.yml
        ├── backend-deploy.yml
        └── frontend-deploy.yml

```

## Architecture Diagram
The diagram below shows the full system architecture, including runtime traffic and the out-of-band CI/CD pipeline.

![Architecture Diagram](docs/architecture-diagram.png)

## High-Level Architecture
### Frontend – Static Web Content
Static frontend hosted on Azure Storage and delivered via Cloudflare, responsible for rendering the resume and calling the backend API.
- Hosted on **Azure Storage Static Website**
- Delivered globally via **Cloudflare (DNS + HTTPS + CDN)**
- JavaScript calls a backend API to update and retrieve the visitor counter

**Details:** [Frontend README](frontend/README.md)

### Backend – Serverless API
Serverless HTTPS API built with Azure Functions and API Management to track and persist visitor counts.
- **Azure API Management** handles authentication and CORS
- **Azure Function App** contains business logic
- **Cosmos DB (serverless)** stores the visitor count
- Function performs a **read-modify-write** operation per request

**Details:** [Backend README](backend/README.md)

### CI/CD – GitHub Actions
Automated pipelines for testing, provisioning infrastructure, and deploying frontend and backend components.
- Triggered automatically on `git push`
- Runs unit tests
- Packages application artifacts
- Provisions infrastructure using IaC
- Deploys backend services to Azure

**Details:** [CI/CD Workflows README](.github/workflows/README.md)

## License
This project is licensed under the [Apache 2.0 License](LICENSE).
