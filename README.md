# Location Management API

A RESTful API system that allows users to perform CRUD operations on locations, with support for hierarchical location tree structures.

## Features

- **RESTful API** using NestJS & TypeScript
- **PostgreSQL Database** with TypeORM for data persistence
- **Tree Structure** support for location hierarchy
- **Validation** for all requests
- **Exception Handling** with detailed error responses
- **Logging** using Winston logger
- **Clean Code** with proper documentation
- **Docker Support** for easy deployment and development

## Database Schema

The system is designed to store location data in a tree structure with the following attributes:

- Building identifier (A, B, etc.)
- Levels/floors (Level 1, Level 5, etc.)
- Rooms/areas within levels
- Location numbers (e.g., A-01, B-05-11)
- Area measurements (in m²)

## Prerequisites

- Node.js (v16.x or later)
- PostgreSQL (v12 or later)
- npm or yarn
- Docker and Docker Compose (optional, for containerized deployment)

## Installation

### Option 1: Local Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/location-management-api.git
   cd location-management-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp example.env .env
   ```
   Edit the `.env` file and update the database connection details.

4. Start PostgreSQL and create a database named `location_management`.

### Option 2: Docker Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/location-management-api.git
   cd location-management-api
   ```

2. Build and start the containers:
   ```bash
   docker-compose up -d
   ```

   This will:
   - Build the API container
   - Start a PostgreSQL container
   - Set up the necessary environment variables
   - Create a persistent volume for the database

## Running the Application

### Local Development

1. Development mode:
   ```bash
   npm run start:dev
   ```

2. Production mode:
   ```bash
   npm run build
   npm run start:prod
   ```

3. Seed the database with sample data:
   ```bash
   npm run seed
   ```

### Docker Development

1. Start the application:
   ```bash
   docker-compose up -d
   ```

2. View logs:
   ```bash
   docker-compose logs -f
   ```

3. Stop the application:
   ```bash
   docker-compose down
   ```

4. Rebuild containers (after making changes):
   ```bash
   docker-compose up -d --build
   ```

## API Endpoints

### Locations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/locations` | Get all locations (flat list) |
| GET | `/api/locations/tree` | Get all locations as a tree structure |
| GET | `/api/locations/:id` | Get a specific location by ID |
| GET | `/api/locations/:id/with-children` | Get a location with its children |
| POST | `/api/locations` | Create a new location |
| PATCH | `/api/locations/:id` | Update an existing location |
| DELETE | `/api/locations/:id` | Delete a location (fails if it has children) |

## Request Examples

### Create a Location

```bash
curl -X POST http://localhost:3000/api/locations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Meeting Room 2",
    "locationNumber": "A-01-01-M2",
    "area": 25.5,
    "parentId": "uuid-of-parent-location",
    "building": "A",
    "level": "1",
    "type": "Meeting Room"
  }'
```

### Update a Location

```bash
curl -X PATCH http://localhost:3000/api/locations/location-uuid \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Meeting Room Name",
    "area": 30.0
  }'
```

### Get All Locations (Flat List)

```bash
# Get all locations
curl http://localhost:3000/api/locations

# Get all locations with pretty print
curl http://localhost:3000/api/locations | json_pp

# Get all locations and save to file
curl http://localhost:3000/api/locations > locations.json
```

### Get Location Tree Structure

```bash
# Get complete location tree
curl http://localhost:3000/api/locations/tree

# Get location tree with pretty print
curl http://localhost:3000/api/locations/tree | json_pp

# Get location tree and save to file
curl http://localhost:3000/api/locations/tree > location_tree.json
```

### Get Specific Location

```bash
# Get location by ID
curl http://localhost:3000/api/locations/location-uuid

# Get location with pretty print
curl http://localhost:3000/api/locations/location-uuid | json_pp

# Get location with its children
curl http://localhost:3000/api/locations/location-uuid/with-children
```

### Delete a Location

```bash
# Delete a location by ID
curl -X DELETE http://localhost:3000/api/locations/location-uuid
```

## Project Structure

```
src/
├── common/
│   ├── exceptions/
│   │   └── http-exception.filter.ts
│   └── logging/
│       ├── logger.module.ts
│       └── logger.service.ts
├── config/
│   ├── database.config.ts
│   └── env.config.ts
├── database/
│   └── seed.ts
├── locations/
│   ├── dtos/
│   │   ├── create-location.dto.ts
│   │   └── update-location.dto.ts
│   ├── entities/
│   │   └── location.entity.ts
│   ├── locations.controller.ts
│   ├── locations.module.ts
│   └── locations.service.ts
├── app.module.ts
└── main.ts
```

## Future Improvements

- Add user authentication and authorization
- Implement pagination for the list endpoints
- Add more comprehensive logging and monitoring
- Add unit and integration tests
- Use database migrations for production deployment
- Add OpenAPI/Swagger documentation

## License

This project is licensed under the [MIT License](LICENSE).
