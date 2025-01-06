# CodeCrafters_be

**CodeCrafters_be** is the backend solution for the **CodeCrafters** project, which enables users to efficiently manage their own delivery company. This API handles order management, route optimization, and real-time user tracking, with a focus on providing scalable and reliable solutions for delivery operations.

## Key Features

- **User Management**: Secure and efficient user authentication and role-based access control (Admin, Driver, Customer).
- **Order Management**: Create, track, and update orders with real-time status changes.
- **Route Optimization**: Efficient routing algorithms to minimize delivery times and fuel costs.
- **Real-Time Notifications**: Keep drivers and customers informed with automated email notifications.
- **Database Integration**: Seamless data persistence with PostgreSQL.

## Technologies Used

- **NestJS**: A progressive Node.js framework for building efficient, scalable server-side applications.
- **MySQL**: A relational database for storing user and order data.
- **TypeScript**: Strongly typed JavaScript for building more reliable and maintainable code.
- **Docker**: Containerization for consistent development and production environments.
- **JWT**: JSON Web Token for secure authentication and authorization.

## Installation

### Prerequisites

Ensure that you have the following installed:

- [Node.js](https://nodejs.org/en/) (v20+)
- [Docker](https://www.docker.com/)

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/ZenBit-Tech/CodeCrafters_be.git
   cd CodeCrafters_be
   ```

2. Create a .env file from the provided .env.example:

   ```bash
   cp .env.example .env
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the DB with Docker:

   ```bash
   docker-compose up
   ```

5. Run database migrations:

   ```bash
   npm run seed:superadmin
   npm run seed:general
   ```

6. Start the application in development mode:
   ```bash
   npm run start:dev
   ```

## API Documentation

To explore the API, we provide interactive documentation using Swagger UI. Once the app is running locally, you can access the API docs at:

http://localhost:4000/logistic-app/api-documentation

## DB schema

![image](https://github.com/user-attachments/assets/81407e2f-f1ea-4949-8a7e-fc69daa8fd75)
