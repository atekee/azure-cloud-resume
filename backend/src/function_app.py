import os
import logging
import azure.functions as func
from azure.data.tables import TableServiceClient, UpdateMode
from azure.core.exceptions import ResourceNotFoundError

app = func.FunctionApp(http_auth_level=func.AuthLevel.FUNCTION)

# -----------------------------
# Cosmos DB Table Configuration
# -----------------------------
COSMOS_CONN_STR = os.getenv("COSMOS_CONNECTION_STRING")
TABLE_NAME = os.getenv("TABLE_NAME")

if not COSMOS_CONN_STR:
    raise ValueError(
        "COSMOS_CONNECTION_STRING is not set in the Function App configuration."
    )

# Create TableServiceClient
table_service = TableServiceClient.from_connection_string(conn_str=COSMOS_CONN_STR)
table_client = table_service.get_table_client(table_name=TABLE_NAME)


# -----------------------------
# Helper: Get or Create Visitor Row
# -----------------------------
def get_or_create_visitor_row():
    """
    Retrieves the visitor counter entity or creates it with count=0.
    """
    try:
        entity = table_client.get_entity(partition_key="resume", row_key="1")
        return entity
    except ResourceNotFoundError:
        # Create the entity if not found
        new_entity = {"PartitionKey": "resume", "RowKey": "1", "count": 0}
        table_client.create_entity(entity=new_entity)
        return new_entity


# -----------------------------
# GET Visitor Count
# -----------------------------
@app.function_name(name="GetVisitorCount")
@app.route(route="visitor/get", methods=["GET"], auth_level=func.AuthLevel.FUNCTION)
def get_visitor_count(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("Processing GET visitor count request.")

    entity = get_or_create_visitor_row()
    count = entity.get("count", 0)

    return func.HttpResponse(
        body=f'{{"count": {count}}}', mimetype="application/json", status_code=200
    )


# -----------------------------
# UPDATE Visitor Count (Increment)
# -----------------------------
@app.function_name(name="UpdateVisitorCount")
@app.route(route="visitor/update", methods=["POST"], auth_level=func.AuthLevel.FUNCTION)
def update_visitor_count(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("Processing UPDATE visitor count request.")

    entity = get_or_create_visitor_row()
    current_count = int(entity.get("count", 0))
    new_count = current_count + 1

    entity["count"] = new_count

    table_client.update_entity(mode=UpdateMode.REPLACE, entity=entity)

    return func.HttpResponse(
        body=f'{{"count": {new_count}}}', mimetype="application/json", status_code=200
    )
