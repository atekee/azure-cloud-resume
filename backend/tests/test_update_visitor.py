import json
from function_app import update_visitor_count


def test_update_visitor_increments_value(mock_table_client):
    # Pretend the DB has count=5
    mock_table_client.get_entity.return_value = {
        "PartitionKey": "resume",
        "RowKey": "1",
        "count": 5,
    }

    class FakeReq:
        pass

    response = update_visitor_count(FakeReq())
    body = json.loads(response.get_body().decode())

    assert response.status_code == 200
    assert body["count"] == 6  # incremented
    mock_table_client.update_entity.assert_called_once()
