# Booking API

A RESTful API for property booking management built with Node.js, Express, TypeScript, and Sequelize.

## Features

- Property management with availability tracking
- Booking creation with conflict validation
- Date range availability queries
- Comprehensive validation and error handling
- Pagination support
- Rate limiting

## API Documentation

Full API documentation is available on [Postman](https://documenter.getpostman.com/view/26276921/2sB3BEoAF8).

## API Endpoints

### Properties

#### Get All Properties

```
GET /v1/properties
```

Query Parameters:

- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10)
- `availableFrom` (string, optional): Filter by availability start date (YYYY-MM-DD)
- `availableTo` (string, optional): Filter by availability end date (YYYY-MM-DD)

#### Get Property by ID

```
GET /v1/properties/:id
```

#### Get Property Availability

```
GET /v1/properties/:id/availability
```

Returns available date ranges and existing bookings for a property.

#### Create Property (Admin)

```
POST /v1/properties
```

Body:

```json
{
  "title": "Beautiful Beach House",
  "description": "A stunning beachfront property...",
  "pricePerNight": 250.0,
  "availablFrom": "2024-01-01",
  "availableTo": "2024-12-31"
}
```

### Bookings

#### Get All Bookings

```
GET /v1/bookings
```

Query Parameters:

- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10)

#### Get Booking by ID

```
GET /v1/bookings/:id
```

#### Create Booking

```
POST /v1/bookings
```

Body:

```json
{
  "propertyId": "uuid-here",
  "username": "john_doe",
  "startDate": "2024-06-01",
  "endDate": "2024-06-07"
}
```

#### Update Booking

```
PUT /v1/bookings/:id
```

Body (partial update allowed):

```json
{
  "startDate": "2024-06-02",
  "endDate": "2024-06-08"
}
```

#### Cancel Booking

```
DELETE /v1/bookings/:id
```

### Health Check

```
GET /v1/health
```

## Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Optional success message"
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description"
}
```

### Paginated Response

```json
{
  "success": true,
  "data": {
    "properties": [...],
    "pagination": {
      "currentPage": 1,
      "totalItems": 50,
      "totalPages": 5,
      "itemsPerPage": 10
    }
  }
}
```

## Validation Rules

### Property

- `title`: Required, string (max 150 characters)
- `description`: Required, text
- `pricePerNight`: Required, positive decimal
- `availablFrom`: Required, date (YYYY-MM-DD)
- `availableTo`: Required, date (YYYY-MM-DD), must be after availablFrom

### Booking

- `propertyId`: Required, valid UUID
- `username`: Required, string (2-100 characters)
- `startDate`: Required, date (YYYY-MM-DD), must be in the future
- `endDate`: Required, date (YYYY-MM-DD), must be after startDate
- No conflicting bookings for the same property and date range

## Business Rules

1. **Future Bookings Only**: Bookings can only be made for future dates
2. **No Overlapping Bookings**: Each property can have only one booking per date
3. **Property Availability**: Bookings must fall within the property's available date range
4. **Cancellation Policy**: Bookings can be cancelled up to 24 hours before the start date
5. **Rate Limiting**: 50 requests per minute per IP address

## Error Codes

- `400` - Bad Request (validation errors, invalid data)
- `404` - Not Found (property/booking doesn't exist)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

## Development

### Prerequisites

- Node.js 20+
- PostgreSQL database
- pnpm package manager

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

### Environment Variables

Duplicate the `.env.example` file to create a `.env` file with:

```
DB_NAME=booking_app
DB_USER=horlakz
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432
```
