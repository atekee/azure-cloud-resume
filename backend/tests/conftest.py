import pytest
from unittest.mock import MagicMock, patch


@pytest.fixture(autouse=True)
def set_env_vars(monkeypatch):
    # Environment variables must exist to avoid import-time errors
    monkeypatch.setenv("COSMOS_CONNECTION_STRING", "UseMockConnectionString;")
    monkeypatch.setenv("TABLE_NAME", "VisitorTable")


@pytest.fixture()
def mock_table_client():
    """
    Provides a fully mocked TableClient by intercepting
    TableServiceClient.from_connection_string.
    """
    mock_table_client = MagicMock()
    mock_service = MagicMock()
    mock_service.get_table_client.return_value = mock_table_client

    # Patch the full construction path
    with patch(
        "azure.data.tables.TableServiceClient.from_connection_string",
        return_value=mock_service,
    ):
        yield mock_table_client
