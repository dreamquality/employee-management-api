
# Employee Management API

A RESTful API for managing employee data, including CRUD operations for employee records, designed to support organizational employee management with PostgreSQL as the database.

## Application Overview

This application is an employee management system designed for administrators and company employees. Administrators can add new employees, edit their data, assign positions, manage salary levels, and view salary increase histories. The application automatically tracks salary raise dates for employees and sends notifications to administrators one month before the scheduled increase. Additionally, the system sends notifications about upcoming employee birthdays to help administrators congratulate employees on time.

Employees can update their personal information, such as name, contact details, and programming languages, while certain fields, like salary or position, are editable only by administrators. All changes to employee profiles are automatically logged, and notifications are sent to administrators. Notifications also include employee status updates, such as current project or English language proficiency. The application ensures regular data checks and sends important notifications through a task scheduler.

## Features

- **Employee Management**: Create, read, update, and delete employee records.
- **Data Validation**: Ensures data integrity with robust validation.
- **Search and Filter**: Allows filtering employees by various criteria.
- **Pagination**: Supports paginated employee listings.
- **Error Handling**: Comprehensive error management for reliability.

## Getting Started

### Prerequisites

- **Node.js**: Install [Node.js](https://nodejs.org/) (version 14 or higher recommended).
- **npm**: Comes with Node.js but can be updated independently.
- **PostgreSQL**: Install and configure [PostgreSQL 16](https://www.postgresql.org/) as the database for employee data.

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/dreamquality/employee-management-api.git
   ```
2. Navigate to the project directory:
   ```sh
   cd employee-management-api
   ```
3. Install dependencies:
   ```sh
   npm install
   ```

### Configuration

1. Create a `.env` file in the root of the project.
2. Add the following environment variables:
   ```plaintext
   PORT=3000
   JWT_SECRET=your_jwt_secret
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=employee_db
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   SECRET_WORD=your_secret_word_for_admin_registration
   ```
   - `PORT`: Port on which the server runs.
   - `JWT_SECRET`: Secret key for JWT authentication.
   - `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`: Database connection details for PostgreSQL.
   - `SECRET_WORD`: A secret key for admin registration.

Replace `your_db_user`, `your_db_password`, `your_jwt_secret`, and `your_secret_word_for_admin_registration` with your actual values.

### Running the Application

Start the server in development mode:
   ```sh
   npm run dev
   ```
The server will be running at `http://localhost:3000`.

### API Documentation

Access the interactive API documentation at [http://localhost:3000/api-docs](http://localhost:3000/api-docs) if Swagger or a similar tool is set up. This documentation provides a complete view of the available endpoints and allows for interactive testing.

## Deployment

### Deploying to Render.com

1. **Create a Render Account**: Sign up at [Render.com](https://render.com/) and create a new Web Service.
2. **Connect GitHub Repository**: Link your GitHub repository to Render.
3. **Environment Variables**:
   - Set up environment variables (`DATABASE_URL`, `JWT_SECRET`, and any others you need) in the Render dashboard.
   - If using a PostgreSQL database on Render, you can set up a managed PostgreSQL instance and update `DATABASE_URL` accordingly.
4. **Build Command**: Use `npm install` to install dependencies.
5. **Start Command**: Use `npm start` to start the application in production mode.

Render will handle the deployment automatically, and your API will be live at the URL provided by Render.

### Docker

This application can also be containerized using Docker. Here’s how to set it up:

1. **Create a Dockerfile**: Add a `Dockerfile` to the root of the project with the following content:

   ```dockerfile
   # Use Node.js as the base image
   FROM node:16

   # Create app directory
   WORKDIR /app

   # Install app dependencies
   COPY package*.json ./
   RUN npm install

   # Bundle app source
   COPY . .

   # Expose the port the app runs on
   EXPOSE 3000

   # Define environment variable
   ENV NODE_ENV=production

   # Start the app
   CMD ["npm", "start"]
   ```

2. **Create a Docker Compose file** (optional): If you need to run PostgreSQL along with the API, add a `docker-compose.yml` file:

   ```yaml
   version: '3'
   services:
     db:
       image: postgres:16
       environment:
         POSTGRES_USER: your_db_user
         POSTGRES_PASSWORD: your_db_password
         POSTGRES_DB: employee_db
       ports:
         - "5432:5432"
       volumes:
         - pgdata:/var/lib/postgresql/data

     api:
       build: .
       environment:
         PORT: 3000
         JWT_SECRET: your_jwt_secret
         DB_HOST: db
         DB_PORT: 5432
         DB_NAME: employee_db
         DB_USER: your_db_user
         DB_PASSWORD: your_db_password
         SECRET_WORD: your_secret_word_for_admin_registration
       ports:
         - "3000:3000"
       depends_on:
         - db

   volumes:
     pgdata:
   ```

3. **Build and Run the Docker Container**:
   - To build and run the container using Docker Compose, run:
     ```sh
     docker-compose up --build
     ```
   - This command will start both the PostgreSQL database and the API server. The API will be accessible at `http://localhost:3000`.

4. **Stopping and Removing Containers**:
   - To stop and remove containers, along with associated volumes, run:
     ```sh
     docker-compose down -v
     ```

## API Documentation

Access the interactive API documentation at [http://localhost:3000/api-docs](http://localhost:3000/api-docs) to view and test available endpoints.

### Available Scripts

- **`npm run dev`**: Runs the app in development mode with hot reloading.
- **`npm start`**: Runs the app in production mode.
- **`npm test`**: Runs test cases for the application.
- **`npm run lint`**: Lints the project files to enforce consistent code style.

## API Endpoints

| Method | Endpoint               | Description                    |
|--------|-------------------------|--------------------------------|
| GET    | `/employees`           | List all employees             |
| GET    | `/employees/:id`       | Get a specific employee by ID  |
| POST   | `/employees`           | Create a new employee          |
| PUT    | `/employees/:id`       | Update employee information    |
| DELETE | `/employees/:id`       | Delete an employee             |

### Example Requests

- **Get all employees**: `GET /employees`
- **Get employee by ID**: `GET /employees/:id`
- **Add new employee**: `POST /employees` with JSON body containing employee data.
- **Update employee**: `PUT /employees/:id` with JSON body of updated data.
- **Delete employee**: `DELETE /employees/:id`

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

1. Fork the repository.
2. Create a new branch for your feature: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
