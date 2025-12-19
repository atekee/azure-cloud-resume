import json
from function_app import get_visitor_count


def test_get_visitor_count_returns_existing(monkeypatch, mock_table_client):
    # Mock existing entity returned from Cosmos
    mock_entity = {"PartitionKey": "resume", "RowKey": "1", "count": 10}
    mock_table_client.get_entity.return_value = mock_entity

    # Fake HttpRequest
    class FakeReq:
        pass

    response = get_visitor_count(FakeReq())
    body = json.loads(response.get_body().decode())

    assert response.status_code == 200
    assert body["count"] == 10
    mock_table_client.get_entity.assert_called_once()


def test_get_visitor_creates_new_if_missing(monkeypatch, mock_table_client):
    # If get_entity raises ResourceNotFoundError → create_entity should be called
    from azure.core.exceptions import ResourceNotFoundError

    mock_table_client.get_entity.side_effect = ResourceNotFoundError("not found")
    mock_table_client.create_entity.return_value = {
        "PartitionKey": "resume",
        "RowKey": "1",
        "count": 0,
    }

    class FakeReq:
        pass

    response = get_visitor_count(FakeReq())
    body = json.loads(response.get_body().decode())

    assert response.status_code == 200
    assert body["count"] == 0
    mock_table_client.create_entity.assert_called_once()
