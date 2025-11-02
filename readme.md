
# Employee Management System

A full-stack employee management system with a RESTful API backend and a modern React frontend, designed to support organizational employee management with PostgreSQL as the database.

## Repository Structure

```
employee-management-api/
├── frontend/           # React frontend application
├── backend/           # Node.js API (root level)
├── docker-compose.yml # Docker orchestration for full stack
└── README.md         # This file
```

## Application Overview

This application is an employee management system designed for administrators and company employees. Administrators can add new employees, edit their data, assign positions, manage salary levels, and view salary increase histories. The system now includes comprehensive project management capabilities, allowing administrators to create and manage projects, assign multiple projects to employees, and track project status. The application automatically tracks salary raise dates for employees and sends notifications to administrators one month before the scheduled increase. Additionally, the system sends notifications about upcoming employee birthdays to help administrators congratulate employees on time.

Employees can update their personal information, such as name, contact details, and programming languages, while certain fields, like salary or position, are editable only by administrators. Employees can be assigned to multiple projects simultaneously, with project information visible on their profiles. All changes to employee profiles are automatically logged, and notifications are sent to administrators. Notifications also include employee status updates, such as assigned projects or English language proficiency. The application ensures regular data checks and sends important notifications through a task scheduler.

## Features

### Backend API
- **Employee Management**: Create, read, update, and delete employee records.
- **Project Management**: Full CRUD operations for projects with many-to-many employee-project relationships.
- **Data Validation**: Ensures data integrity with robust validation and input sanitization.
- **Search and Filter**: Allows filtering employees and projects by various criteria.
- **Pagination**: Supports paginated employee and project listings.
- **Error Handling**: Comprehensive error management for reliability.
- **Authentication**: JWT-based authentication system with role-based access control.
- **Notifications**: Automated notification system for birthdays and salary reviews.
- **Transaction Support**: Database transactions for data consistency.

### Frontend Application
- **Modern UI**: Built with React, Vite, Shadcn UI, and Tailwind CSS.
- **Authentication**: Secure login and registration.
- **Employee Management**: View, create, edit, and delete employees.
- **Project Management**: Full CRUD interface for projects with role-based access control.
- **Employee-Project Assignment**: Assign multiple projects to employees with visual indicators.
- **Responsive Design**: Works on desktop, tablet, and mobile.
- **Real-time Updates**: Notifications and data updates.
- **Interactive Components**: Clickable project cards, modals, and dynamic forms.

## Screenshots

### Login Page
![Login Page](https://github.com/user-attachments/assets/cc6948be-1100-46cb-93c6-e58a282e80e6)

### Employee List
![Employee List](https://github.com/user-attachments/assets/23b92ee0-2275-486a-a793-f72a701caa7a)

### Employee Detail
![Employee Detail](https://github.com/user-attachments/assets/13365042-dae5-4e5c-befe-d14b284655de)

### Create Employee
![Create Employee](https://github.com/user-attachments/assets/301ce060-378d-4b4e-9be9-edf07fd39ddb)

### Projects Management
![Projects Page](https://github.com/user-attachments/assets/project-management-page)

### Employee Projects
![Employee Projects](https://github.com/user-attachments/assets/employee-projects-view)

## Quick Start with Docker

The easiest way to run the full stack is using Docker Compose:

```bash
# Start all services (database, API, and frontend)
docker compose up --build

# Or start in detached mode
docker compose up -d --build
```

This will start:
- **PostgreSQL Database** on port 5432
- **Backend API** on port 3000
- **Frontend Application** on port 5173

Access the application at `http://localhost:5173`

**Default Admin Credentials:**
- Email: `admin1@example.com`
- Password: `adminpassword`

## Manual Setup

### Backend API Setup

### Prerequisites

- **Node.js**: Install [Node.js](https://nodejs.org/) (version 18 or higher recommended).
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
   # Локальная база данных
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_NAME=employee_db
   DB_USER=your_local_db_user
   DB_PASSWORD=your_local_db_password

   # Секреты
   JWT_SECRET=your_jwt_secret
   SECRET_WORD=your_secret_word_for_admin_registration

   # Среда разработки
   NODE_ENV=development

   # Порт (опционально, по умолчанию 3000)
   PORT=3000
   ```
   - `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`: Данные для подключения к базе данных PostgreSQL.
   - `JWT_SECRET`: Секретный ключ для аутентификации JWT.
   - `SECRET_WORD`: Секретный ключ для регистрации администратора.
   - `NODE_ENV`: Указывает среду выполнения.
   - `PORT`: Порт, на котором будет работать сервер (по умолчанию 3000).

Замените `your_local_db_user`, `your_local_db_password`, `your_jwt_secret`, и `your_secret_word_for_admin_registration` на свои реальные значения.

### Running the Application

Start the server in development mode:
   ```sh
   npm run dev
   ```
The server will be running at `http://localhost:3000`.

### API Documentation

Access the interactive API documentation at [http://localhost:3000/api-docs](http://localhost:3000/api-docs) if Swagger or a similar tool is set up. This documentation provides a complete view of the available endpoints and allows for interactive testing.

### Frontend Setup

1. Navigate to the frontend directory:
   ```sh
   cd frontend
   ```

2. Install frontend dependencies:
   ```sh
   npm install
   ```

3. Create a `.env` file in the frontend directory:
   ```sh
   cp .env.example .env
   ```

4. Update the `.env` file with the API URL:
   ```plaintext
   VITE_API_URL=http://localhost:3000
   ```

5. Start the frontend development server:
   ```sh
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`.

For more details about the frontend, see the [frontend README](./frontend/README.md).

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

This application can be containerized using Docker. The repository includes Dockerfiles and a `docker-compose.yml` for easy setup.

#### Using Docker Compose

The `docker-compose.yml` file includes four services:
- **db**: PostgreSQL database
- **app**: The backend API server in development mode
- **frontend**: The React frontend application
- **test**: Test runner service

1. **Build and Run the Full Stack**:
   ```sh
   docker compose up --build
   ```
   This command will start:
   - PostgreSQL database on port 5432
   - Backend API on port 3000
   - Frontend on port 5173

   Access the application at `http://localhost:5173`

2. **Run Only Backend and Database**:
   ```sh
   docker compose up --build app db
   ```
   The API will be accessible at `http://localhost:3000`.

3. **Run Tests**:
   
   Before running tests for the first time, create the test database:
   ```sh
   docker compose up -d db
   docker compose exec db psql -U postgres -c "CREATE DATABASE my_database_test;"
   ```
   
   Then run the tests:
   ```sh
   docker compose run --rm test
   ```
   This command will run the test suite in a containerized environment with its own test database.

4. **Stopping and Removing Containers**:
   - To stop the containers:
     ```sh
     docker compose down
     ```
   - To stop and remove containers along with volumes:
     ```sh
     docker compose down -v
     ```

#### Docker Configuration

The application uses the following services defined in `docker-compose.yml`:

**Database Service (db):**
- Image: postgres:16
- Port: 5432
- Default credentials: postgres/postgres
- Database: my_database

**Application Service (app):**
- Runs in development mode
- Port: 3000
- Automatically runs database migrations on startup
- Uses hot-reloading via nodemon

**Test Service (test):**
- Runs the test suite using Mocha
- Uses a separate test database (my_database_test)
- Configured with NODE_ENV=test

## API Documentation

Access the interactive API documentation at [http://localhost:3000/api-docs](http://localhost:3000/api-docs) to view and test available endpoints.

### Available Scripts

- **`npm run dev`**: Runs the app in development mode with hot reloading.
- **`npm start`**: Runs the app in production mode.
- **`npm test`**: Runs test cases for the application.
- **`npm run build:swagger`**: Generates static HTML Swagger documentation in the `docs/` folder.
- **`npm run check-api-usage`**: Analyzes API endpoint usage between backend and frontend, generates detailed reports.
- **`npm run lint`**: Lints the project files to enforce consistent code style.

### API Endpoint Usage Analysis

The project includes an automated tool to analyze which API endpoints are used by the frontend. This helps identify unused endpoints and maintain code quality.

**Running the analysis:**
```bash
npm run check-api-usage
```

**Output:**
- Console summary showing used and unused endpoints
- `api-usage-report.md` - Detailed technical report
- `API-USAGE-SUMMARY.md` - Quick executive summary

See `docs/api-endpoint-analysis.md` for comprehensive documentation.

**Current Status:** ✅ All 18 backend endpoints are actively used by the frontend (100% utilization)

## Continuous Integration

This project uses GitHub Actions for automated testing and documentation deployment. Tests run automatically on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

The CI workflow:
1. Sets up Node.js 18 and PostgreSQL 16
2. Installs dependencies
3. Creates test database
4. Runs the full test suite
5. Generates Swagger documentation (only on `main` branch)
6. Deploys documentation to GitHub Pages in the `docs/` folder (only on `main` branch)

The generated documentation is automatically published to GitHub Pages at `https://<username>.github.io/<repo>/docs/` after successful test runs on the main branch.

You can view the test status in the repository's Actions tab.

## API Endpoints

### Authentication
| Method | Endpoint                          | Description                               |
|--------|-----------------------------------|-------------------------------------------|
| POST   | `/login`                         | Authenticate user                         |
| POST   | `/register`                      | Register a new user                       |

### Users
| Method | Endpoint                          | Description                               |
|--------|-----------------------------------|-------------------------------------------|
| GET    | `/users`                         | List all users (with pagination, filtering, sorting) |
| GET    | `/users/:id`                     | Get a specific user by ID                |
| POST   | `/users`                         | Create a new user (admin only)            |
| PUT    | `/users/:id`                     | Update user information                   |
| DELETE | `/users/:id`                     | Delete a user (admin only)               |
| GET    | `/users/me`                      | Get current user's profile                |

### Projects
| Method | Endpoint                                    | Description                               |
|--------|---------------------------------------------|-------------------------------------------|
| GET    | `/projects`                                | List all projects (with pagination, filtering, search) |
| GET    | `/projects/:id`                            | Get a specific project by ID              |
| POST   | `/projects`                                | Create a new project (admin only)         |
| PUT    | `/projects/:id`                            | Update project information (admin only)   |
| DELETE | `/projects/:id`                            | Delete a project (admin only)            |
| POST   | `/projects/:id/employees`                  | Assign multiple employees to project (admin only) |
| POST   | `/projects/:id/employee`                   | Add single employee to project (admin only) |
| DELETE | `/projects/:id/employees/:employeeId`      | Remove employee from project (admin only) |
| GET    | `/projects/:id/employees`                  | Get all employees assigned to a project   |

### Notifications
| Method | Endpoint                          | Description                               |
|--------|-----------------------------------|-------------------------------------------|
| GET    | `/notifications`                 | Get all notifications for the user        |
| POST   | `/notifications/mark-as-read`    | Mark notifications as read                |

### Example Requests

#### User Management
- **Get all users**: `GET /users?page=1&limit=10&sortBy=registrationDate&order=DESC`
- **Get user by ID**: `GET /users/:id`
- **Add new user**: `POST /users` with JSON body containing user data
- **Update user**: `PUT /users/:id` with JSON body of updated data (includes `projectIds` array for project assignment)
- **Delete user**: `DELETE /users/:id`
- **Get current user's profile**: `GET /users/me`

#### Authentication
- **User login**: `POST /login` with JSON body containing credentials
- **User registration**: `POST /register` with JSON body containing user details

#### Project Management
- **Get all projects**: `GET /projects?page=1&limit=10&active=true&search=project name`
- **Get project by ID**: `GET /projects/:id`
- **Create project**: `POST /projects` with JSON body:
  ```json
  {
    "name": "Project Name",
    "description": "Project description",
    "wage": 5000,
    "active": true
  }
  ```
- **Update project**: `PUT /projects/:id` with JSON body of updated data
- **Delete project**: `DELETE /projects/:id`
- **Assign employees to project**: `POST /projects/:id/employees` with JSON body:
  ```json
  {
    "employeeIds": [1, 2, 3]
  }
  ```
- **Add single employee**: `POST /projects/:id/employee` with JSON body:
  ```json
  {
    "employeeId": 1
  }
  ```
- **Remove employee from project**: `DELETE /projects/:id/employees/:employeeId`
- **Get project employees**: `GET /projects/:id/employees`

#### Notifications
- **Get notifications**: `GET /notifications`
- **Mark notifications as read**: `POST /notifications/mark-as-read` with JSON body containing notification IDs

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

1. Fork the repository.
2. Create a new branch for your feature: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
