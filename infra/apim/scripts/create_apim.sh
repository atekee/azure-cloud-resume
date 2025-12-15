## Create Azure API Management instance
az apim create \
  --name crcapim \
  --resource-group rg-cloudresume-prod \
  --location eastus \
  --publisher-email atabay.kadiroglu@outlook.com \
  --publisher-name "Atabay Kadiroglu" \
  --sku-name Consumption

## Create API within the API Management instance
az apim api create \
  --resource-group rg-cloudresume-prod \
  --service-name crcapim \
  --api-id visitor-api \
  --display-name "Visitor API" \
  --path visitor \
  --protocols https
