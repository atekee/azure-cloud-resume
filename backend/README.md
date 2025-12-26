# Backend – Serverless API
This directory contains the **serverless backend** for the Azure Cloud Resume Challenge.
The backend exposes a simple HTTPS API used by the frontend to retrieve and update a visitor counter.

## Folder Structure
```
backend/
├── function_app.py             # Azure Function entry point and request handler
├── host.json                   # Azure Functions host configuration
├── requirements.txt            # Runtime Python dependencies
├── pyproject.toml              # Project metadata and tool configuration
├── pytest.ini                  # Pytest configuration
├── local.settings.ci.json      # CI-safe local settings (no secrets)
├── .python-version             # Python version pin for local and CI environments
├── uv.lock                     # Locked dependency versions
└── tests/                      # Unit tests
    ├── conftest.py             # Shared test fixtures and mocks
    ├── test_get_visitor.py     # Tests for retrieving the visitor count
    └── test_update_visitor.py  # Tests for incrementing the visitor count
```
```
infra/
├── apim/                         # API Management setup
│   ├── policies/
│   │   └── visitor-policy.xml    # APIM policy (CORS, routing, security)
│   └── scripts/
│       ├── create_apim.sh        # Creates the APIM instance
│       ├── add_operations.sh     # Adds API operations/endpoints
│       ├── configure_backend.sh  # Connects APIM to Function App
│       └── setup_named_values.sh # Sets APIM named values (config)
└── arm/                          # ARM templates and deployment scripts
    ├── templates/
    │   ├── cosmosdb.json         # Cosmos DB ARM template
    │   └── functionapp.json      # Function App ARM template
    └── scripts/
        ├── deploy_cosmosdb.sh    # Deploys Cosmos DB resources
        ├── deploy_functionapp.sh # Deploys Function App resources
        └── deploy_backend.sh     # Deploys function code
```


## Overview
- Implemented using **Azure Functions (Python)**
- Fronted by **Azure API Management** for authentication and CORS handling
- Persists data in **Azure Cosmos DB (serverless)**
- Deployed automatically via **GitHub Actions**
- Tested using **unit tests**

The backend performs a **read-modify-write** operation on each request to ensure the visitor count is updated safely and consistently.

**Request flow:**
1. Frontend JavaScript sends an HTTPS request to API Management
2. API Management validates the request and forwards it to the Function App
3. Azure Function:
   - Reads the current visitor count from Cosmos DB
   - Increments the count
   - Writes the updated value back
4. The updated count is returned to the client as JSON

The frontend never communicates directly with the database.

## Infrastructure & Deployment
Backend infrastructure is provisioned using Infrastructure as Code (IaC) and deployment scripts located in the infra/ directory.
Each component is deployed in a defined order to satisfy dependencies and avoid manual configuration.

### Azure Cosmos DB (Visitor Counter Storage)
- Stores the visitor counter used by the backend API
- Uses serverless capacity mode for low operational cost
- Defined using an ARM template `infra/arm/templates/cosmosdb.json`
- Deployed via shell script `infra/arm/scripts/deploy_cosmosdb.sh`
- Database and container are created as part of deployment
- The backend function reads and updates a single logical record
- No direct client access is allowed

### Azure Function App (Serverless Backend)
- Hosts the Python-based Azure Function
- Implements the visitor counter logic
- Handles all database interaction
- Defined using an ARM template `infra/arm/templates/functionapp.json`
- Deployed via shell script `infra/arm/scripts/deploy_functionapp.sh`
- Function code is deployed separately after provisioning `infra/arm/scripts/deploy_backend.sh`
- Runs on a consumption-based serverless plan
- Environment variables are injected at deployment time
- No secrets are committed to source control

### Azure API Management (API Gateway)
- Acts as a gateway in front of the Function App
- Handles authentication, routing, and CORS
- Prevents direct public access to the Function App
- Created using shell scripts `infra/apim/scripts/create_apim.sh`
- API operations are added via `infra/apim/scripts/add_operations.sh`
- Backend routing is configured via `infra/apim/scripts/configure_backend.sh`
- Named values (configuration settings) are set via `infra/apim/scripts/setup_named_values.sh`
- API policies are defined in XML `infra/apim/policies/visitor-policy.xml`
