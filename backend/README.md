# Wedding Planning System - Spring Boot API

This is a Spring Boot RESTful API for a wedding planning system. The system allows users (couples, vendors, and admins) to manage weddings, services, bookings, and tasks.

## Project Structure

The project follows a standard Spring Boot architecture with the following layers:

- **Model**: Contains all domain entities
- **Repository**: Contains data access objects that interact with JSON files
- **Service**: Contains business logic
- **Controller**: Contains API endpoints

## Features


### User Management
- User registration and authentication
- Different user roles: Couple, Vendor, Admin
- User profile management

### Couple Features
- Create and manage wedding details
- Browse vendors
- Book services
- Track wedding planning tasks
- Submit reviews for vendors

### Vendor Features
- Manage service offerings
- Update availability
- Respond to booking requests
- Submit portfolio
- View and respond to reviews

### Admin Features
- Manage users (couples, vendors, admins)
- Approve/reject vendors
- View system statistics
- Manage disputes
- Monitor system activity

### Data Persistence
- All data is stored in JSON files in `src/main/resources/data/`

## API Endpoints

### User Endpoints
- `GET /api/user` - Get all users
- `POST /api/user` - Create a new user
- `PUT /api/user/{id}` - Update a user
- `DELETE /api/user/{id}` - Delete a user

### Couple Endpoints
- `GET /api/couple` - Get all couples
- `GET /api/couple/{id}` - Get a couple by ID
- `POST /api/couple` - Create a new couple
- `PUT /api/couple/{id}` - Update a couple
- `DELETE /api/couple/{id}` - Delete a couple

### Vendor Endpoints
- `GET /api/vendor` - Get all vendors
- `GET /api/vendor/{id}` - Get a vendor by ID
- `POST /api/vendor` - Create a new vendor
- `PUT /api/vendor/{id}` - Update a vendor
- `DELETE /api/vendor/{id}` - Delete a vendor

### Wedding Endpoints
- `GET /api/wedding` - Get all weddings
- `GET /api/wedding/{id}` - Get a wedding by ID
- `POST /api/wedding/profile` - Create a new wedding with tasks (consolidated API)
- `PUT /api/wedding/{id}` - Update a wedding
- `DELETE /api/wedding/{id}` - Delete a wedding

### Booking Endpoints
- `GET /api/booking` - Get all bookings
- `GET /api/booking/{id}` - Get a booking by ID
- `POST /api/booking` - Create a new booking
- `PUT /api/booking/{id}` - Update a booking
- `PUT /api/booking/{id}/confirm` - Confirm a booking
- `PUT /api/booking/{id}/cancel` - Cancel a booking
- `DELETE /api/booking/{id}` - Delete a booking

<!-- TODO (Hamdi): Add API Endpoints for the Task component -->
### Task Endpoints

### Review Endpoints
- `GET /api/review` - Get all reviews
- `GET /api/review/{id}` - Get a review by ID
- `GET /api/review/vendor/{vendorId}` - Get reviews by vendor ID
- `GET /api/review/couple/{coupleId}` - Get reviews by couple ID
- `POST /api/review` - Create a new review
- `PUT /api/review/{id}` - Update a review
- `DELETE /api/review/{id}` - Delete a review


<!-- TODO (Kavindu): Add API Endpoints for the Admin component -->
### Admin Endpoints


## Data Model

The system implements the following key entities:

- **User**: Base class for all users
- **Couple**: Extends User, represents a couple planning a wedding
- **Vendor**: Extends User, represents a service provider
- **Admin**: Extends User, represents an admin user
- **Wedding**: Represents a wedding event
- **Booking**: Represents a service booking
- **Task**: Represents a wedding planning task
- **Review**: Represents a review submitted by a couple for a vendor

## Running the Project

1. Make sure you have Java 11+ and Maven installed
2. Clone the repository
3. Navigate to the project directory
4. Run `mvn spring-boot:run`
5. The API will be available at `http://localhost:8080`

## Notes

- The data files are automatically created in `src/main/resources/data/` if they don't exist
- The system demonstrates various OOP concepts like inheritance, polymorphism, and encapsulation
- Cross-origin requests are enabled for development (localhost:3000 and localhost:5173)
- The system uses JSON files for data persistence
- Error handling is implemented throughout the API
- The API follows RESTful principles
