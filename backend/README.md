# Wedding Planning System - Spring Boot API

This project is a Spring Boot RESTful API for a wedding planning system. The system allows users (couples, vendors, and admins) to manage weddings, services, bookings, and tasks.

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

### Couple Features
- Create and manage wedding details
- Browse vendors
- Book services
- Track wedding planning tasks

### Vendor Features
- Manage service offerings
- Update availability
- Respond to booking requests
- Submit portfolio

### Admin Features
- Manage users
- Approve vendors
- Resolve disputes

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

### Vendor List (With Linked List Implementation)
- `GET /api/vendor-list` - Get all vendors using linked list implementation
- `GET /api/vendor-list/sorted` - Get all vendors sorted by rating using merge sort

### Wedding Endpoints
- `GET /api/wedding` - Get all weddings
- `GET /api/wedding/{id}` - Get a wedding by ID
- `POST /api/wedding` - Create a new wedding
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

### Service Endpoints
- `GET /api/service` - Get all services
- `GET /api/service/{id}` - Get a service by ID
- `POST /api/service` - Create a new service
- `PUT /api/service/{id}` - Update a service
- `DELETE /api/service/{id}` - Delete a service

### Task Endpoints
- `GET /api/task` - Get all tasks
- `GET /api/task/pending` - Get all pending tasks
- `GET /api/task/{id}` - Get a task by ID
- `POST /api/task` - Create a new task
- `PUT /api/task/{id}` - Update a task
- `PUT /api/task/{id}/complete` - Mark a task as completed
- `DELETE /api/task/{id}` - Delete a task

### Admin Endpoints
- `GET /api/admin/users` - Get all users (admin only)
- `PUT /api/admin/vendor/{id}/approve` - Approve a vendor
- `POST /api/admin/dispute/{userId}/resolve` - Resolve a dispute

## Data Model

The system implements the following key entities as shown in the UML diagram:

- **User**: Base class for all users
- **Couple**: Extends User, represents a couple planning a wedding
- **Vendor**: Extends User, represents a service provider
- **Admin**: Extends User, represents an admin user
- **Wedding**: Represents a wedding event
- **Booking**: Represents a service booking
- **Service**: Base class for all services
- **Photography**: Extends Service, represents photography services
- **Catering**: Extends Service, represents catering services
- **Task**: Represents a wedding planning task
- **TaskList**: Manages a collection of tasks
- **VendorNode**: Node for vendor linked list
- **VendorLinkedList**: Custom linked list implementation for vendors
- **VendorSorter**: Provides merge sort for the vendor linked list

## Running the Project

1. Make sure you have Java 11+ and Maven installed
2. Clone the repository
3. Navigate to the project directory
4. Run `mvn spring-boot:run`
5. The API will be available at `http://localhost:8080`

## Notes

- The data files are automatically created in `src/main/resources/data/` if they don't exist
- The system demonstrates various OOP concepts like inheritance, polymorphism, and encapsulation
- The VendorLinkedList and VendorSorter showcase custom data structures and algorithms
