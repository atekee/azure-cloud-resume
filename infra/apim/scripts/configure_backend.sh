## Configure the backend service URL for the Visitor API in API Management
az apim api update \
  --resource-group rg-cloudresume-prod \
  --service-name crcapim \
  --api-id visitor-api \
  --set serviceUrl="https://crcresumefunc.azurewebsites.net/api/visitor"
