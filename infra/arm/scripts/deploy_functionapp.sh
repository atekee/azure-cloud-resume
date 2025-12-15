## Retrieve the Cosmos DB Connection String
read -s COSMOS_CONN <<< "$(az cosmosdb keys list \
  --name crccosmosdb \
  --resource-group rg-cloudresume-prod \
  --type connection-strings \
  --query "connectionStrings[?description=='Primary Table Connection String'].connectionString" \
  -o tsv)"

## Deploy the Function App using ARM template
az deployment group create \
  --name deployFunctionApp \
  --resource-group rg-cloudresume-prod \
  --template-file infra/arm/functionapp.json \
  --parameters \
      functionAppName=crcresumefunc \
      storageAccountName=stcrcfunclogs \
      cosmosConnectionString="$COSMOS_CONN" \
      location="centralus"
