import pytest
import sys
import os

# Add parent directory to path to import app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_health_check(client):
    """Test the base API endpoint."""
    rv = client.get('/api/')
    json_data = rv.get_json()
    assert rv.status_code == 200
    assert json_data['success'] is True
    assert 'SparkNet API' in json_data['message']

def test_get_devices(client):
    """Test getting solar devices list."""
    rv = client.get('/api/devices')
    json_data = rv.get_json()
    assert rv.status_code == 200
    assert json_data['success'] is True
    assert len(json_data['devices']) == 5

def test_market_data(client):
    """Test getting market pricing data."""
    rv = client.get('/api/market/data')
    json_data = rv.get_json()
    assert rv.status_code == 200
    assert json_data['success'] is True
    assert 'current_price_inr' in json_data['market_data']

def test_analytics_summary(client):
    """Test the enhanced analytics summary endpoint."""
    rv = client.get('/api/analytics/summary')
    json_data = rv.get_json()
    assert rv.status_code == 200
    assert json_data['success'] is True
    assert 'total_capacity_kw' in json_data['summary']
    assert 'capacity_utilization' in json_data['summary']

def test_price_history(client):
    """Test the new price history endpoint."""
    rv = client.get('/api/price-history?limit=10')
    json_data = rv.get_json()
    assert rv.status_code == 200
    assert json_data['success'] is True
    assert len(json_data['history']) <= 10
