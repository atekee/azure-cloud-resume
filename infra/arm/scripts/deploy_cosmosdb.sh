## Deploy the Cosmos DB Account using ARM template
az deployment group create \
  --name deployCosmos \
  --resource-group rg-cloudresume-prod \
  --template-file infra/arm/cosmosdb.json \
  --parameters cosmosAccountName=crccosmosdb
