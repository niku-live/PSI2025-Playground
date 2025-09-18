# API Reference

Complete reference documentation for all application API endpoints.

## Base URL
```
https://localhost:7039
```

## Weather Forecast API

### Overview
The Weather Forecast API provides full CRUD operations for managing weather forecast data. All endpoints use JSON for request/response bodies unless otherwise specified.

### Endpoints Summary

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/weatherforecast` | Get all weather forecasts | No |
| POST | `/weatherforecast` | Create new weather forecast | No |
| PUT | `/weatherforecast` | Update existing weather forecast | No |
| DELETE | `/weatherforecast` | Delete weather forecast by date | No |
| PATCH | `/weatherforecast` | Generate random weather forecasts | No |

---

### GET /weatherforecast
Retrieves all weather forecasts from the data store.

**Request:**
```http
GET /weatherforecast
Content-Type: application/json
```

**Response:**
```json
[
  {
    "date": "2025-09-19",
    "temperatureC": 25,
    "temperatureF": 77,
    "summary": "Sunny"
  },
  {
    "date": "2025-09-20",
    "temperatureC": 18,
    "temperatureF": 64,
    "summary": "Cool"
  }
]
```

**Status Codes:**
- `200 OK` - Successfully retrieved forecasts
- `500 Internal Server Error` - Server error

---

### POST /weatherforecast
Creates a new weather forecast entry.

**Request:**
```http
POST /weatherforecast
Content-Type: application/json

{
  "date": "2025-09-25",
  "temperatureC": 22,
  "summary": "Partly Cloudy"
}
```

**Request Body Schema:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `date` | string | Yes | Date in YYYY-MM-DD format |
| `temperatureC` | integer | Yes | Temperature in Celsius |
| `summary` | string | Yes | Weather description |

**Response:**
```json
{
  "date": "2025-09-25",
  "temperatureC": 22,
  "temperatureF": 71,
  "summary": "Partly Cloudy"
}
```

**Status Codes:**
- `200 OK` - Successfully created forecast
- `400 Bad Request` - Invalid request data
- `500 Internal Server Error` - Server error

---

### PUT /weatherforecast
Updates an existing weather forecast or creates a new one if it doesn't exist.

**Request:**
```http
PUT /weatherforecast
Content-Type: application/json

{
  "date": "2025-09-25",
  "temperatureC": 28,
  "summary": "Very Sunny"
}
```

**Request Body Schema:**
Same as POST request.

**Response:**
```json
{
  "date": "2025-09-25",
  "temperatureC": 28,
  "temperatureF": 82,
  "summary": "Very Sunny"
}
```

**Status Codes:**
- `200 OK` - Successfully updated/created forecast
- `400 Bad Request` - Invalid request data
- `500 Internal Server Error` - Server error

---

### DELETE /weatherforecast
Deletes a weather forecast by date.

**Request:**
```http
DELETE /weatherforecast?date=2025-09-25
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `date` | string | Yes | Date in YYYY-MM-DD format |

**Response:**
```
200 OK (empty body)
```

**Status Codes:**
- `200 OK` - Successfully deleted forecast
- `404 Not Found` - Forecast with specified date not found
- `400 Bad Request` - Invalid date format
- `500 Internal Server Error` - Server error

---

### PATCH /weatherforecast
Generates random weather forecasts and adds them to the data store.

**Request:**
```http
PATCH /weatherforecast?count=5
```

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `count` | integer | No | 5 | Number of forecasts to generate |

**Response:**
```json
[
  {
    "date": "2025-09-19",
    "temperatureC": 15,
    "temperatureF": 59,
    "summary": "Chilly"
  },
  {
    "date": "2025-09-20",
    "temperatureC": 32,
    "temperatureF": 89,
    "summary": "Hot"
  }
]
```

**Status Codes:**
- `200 OK` - Successfully generated forecasts
- `400 Bad Request` - Invalid count parameter
- `500 Internal Server Error` - Server error

---

## Additional Endpoints

### GET /hello
Simple hello world endpoint for testing connectivity.

**Request:**
```http
GET /hello
```

**Response:**
```
Hello World!
```

**Status Codes:**
- `200 OK` - Success

---

### GET /test
Test endpoint that returns a simple test message.

**Request:**
```http
GET /test
```

**Response:**
```
Test
```

**Status Codes:**
- `200 OK` - Success

---

## Data Models

### WeatherForecast
The main data model for weather forecast information.

```json
{
  "date": "string (YYYY-MM-DD)",
  "temperatureC": "integer",
  "temperatureF": "integer (calculated)",
  "summary": "string"
}
```

**Field Descriptions:**
- `date` - The forecast date in ISO date format
- `temperatureC` - Temperature in Celsius (user input)
- `temperatureF` - Temperature in Fahrenheit (auto-calculated: 32 + (C / 0.5556))
- `summary` - Weather description text

**Sample Summaries:**
The system uses these predefined summaries for generated forecasts:
- "Freezing", "Bracing", "Chilly", "Cool", "Mild"
- "Warm", "Balmy", "Hot", "Sweltering", "Scorching"

---

## Error Handling

### Error Response Format
When an error occurs, the API returns appropriate HTTP status codes. Error details may vary based on the specific endpoint and error type.

### Common Error Scenarios
- **Invalid Date Format**: Dates must be in YYYY-MM-DD format
- **Missing Required Fields**: All required fields must be provided
- **Data Type Mismatches**: Ensure correct data types (integer for temperature, string for summary)
- **Duplicate Dates**: Some operations may conflict with existing data

---

## Usage Examples

### Complete CRUD Workflow
```bash
# 1. Get all forecasts
curl -X GET "https://localhost:7039/weatherforecast"

# 2. Create new forecast
curl -X POST "https://localhost:7039/weatherforecast" \
  -H "Content-Type: application/json" \
  -d '{"date":"2025-09-30","temperatureC":20,"summary":"Pleasant"}'

# 3. Update forecast
curl -X PUT "https://localhost:7039/weatherforecast" \
  -H "Content-Type: application/json" \
  -d '{"date":"2025-09-30","temperatureC":25,"summary":"Very Pleasant"}'

# 4. Delete forecast
curl -X DELETE "https://localhost:7039/weatherforecast?date=2025-09-30"

# 5. Generate random forecasts
curl -X PATCH "https://localhost:7039/weatherforecast?count=3"
```

---

## Testing

For comprehensive API testing, use the included [Postman collection](testing-guide.md) which contains pre-configured requests for all endpoints with automated validation.

---

**Next Steps:**
- Review the [Testing Guide](testing-guide.md) for detailed testing procedures
- Check [Project Structure](project-structure.md) to understand the API implementation
- See [Development Guide](development-guide.md) for extending the API