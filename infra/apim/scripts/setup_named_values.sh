## Retrieve the Function Key from the Azure Function App
read -s FUNCTION_KEY <<< "$(az functionapp keys list \
  --name crcresumefunc \
  --resource-group rg-cloudresume-prod \
  --query 'functionKeys.default' \
  -o tsv)"

## Create a secured named value for the Function Key
az apim nv create \
  --resource-group rg-cloudresume-prod \
  --service-name crcapim \
  --display-name "FunctionKey" \
  --named-value-id function-key \
  --secret true \
  --value "$FUNCTION_KEY"

## Generate a random Public API Key (for demonstration purposes)
openssl rand -hex 20

## Create a secured named value for the Public API Key
az apim nv create \
  --resource-group rg-cloudresume-prod \
  --service-name crcapim \
  --display-name "PublicApiKey" \
  --named-value-id public-api-key \
  --value "YOUR_PUBLIC_API_KEY"
