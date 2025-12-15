## Add operations to the Visitor API in API Management
az apim api operation create \
  --resource-group rg-cloudresume-prod \
  --service-name crcapim \
  --api-id visitor-api \
  --operation-id get-count \
  --display-name "Get Visitor Count" \
  --method GET \
  --url-template "/get"

az apim api operation create \
  --resource-group rg-cloudresume-prod \
  --service-name crcapim \
  --api-id visitor-api \
  --operation-id update-count \
  --display-name "Update Visitor Count" \
  --method POST \
  --url-template "/update"
