# Health App Backend

A Node.js backend for the health monitoring application with user authentication and Supabase PostgreSQL integration featuring TimescaleDB for time-series health data.

## Features

- User registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Supabase PostgreSQL integration with TimescaleDB extension
- Time-series data optimization for health metrics
- Input validation
- Rate limiting
- Security headers with Helmet
- CORS support
- Environment-based configuration
- Row Level Security (RLS) for data protection

## Prerequisites

Before running this application, make sure you have the following:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [Supabase Account](https://supabase.com/) (free tier available)
- npm (comes with Node.js)

## Supabase Setup

### 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and create a free account
2. Create a new project
3. Wait for the project to be set up (this takes a few minutes)

### 2. Enable TimescaleDB Extension

1. In your Supabase dashboard, go to the SQL Editor
2. Run this command to enable TimescaleDB:
   ```sql
   CREATE EXTENSION IF NOT EXISTS timescaledb;
   ```

### 3. Set up the Database Schema

1. In the SQL Editor, copy and paste the contents of `sql/01_schema.sql`
2. Run the script to create all tables and hypertables
3. Optionally, run `sql/02_rls_policies.sql` for Row Level Security (if using Supabase Auth)

### 4. Get Your Project Credentials

1. Go to Project Settings > API
2. Copy the following values:
   - Project URL
   - anon public key
   - service_role key (keep this secret!)
3. Go to Project Settings > Database
4. Copy the Connection String (for direct PostgreSQL access if needed)

## Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env` file and update the values:
   ```bash
   cp .env .env.local
   ```
   - Edit `.env.local` with your Supabase project details:
   ```env
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   DATABASE_URL=postgresql://postgres:your-password@db.your-project-id.supabase.co:5432/postgres
   JWT_SECRET=your-super-secret-jwt-key
   ```

## Database Schema

The application uses several tables optimized for health data:

### Core Tables
- **users**: User accounts and authentication
- **user_profiles**: Extended user profile information

### Time-Series Tables (TimescaleDB Hypertables)
- **health_metrics**: Weight, blood pressure, heart rate, blood sugar, etc.
- **sleep_data**: Sleep tracking with quality metrics
- **exercise_data**: Workout and activity logging
- **nutrition_data**: Food intake and calorie tracking
- **medication_logs**: Medication adherence tracking

All time-series tables are optimized with TimescaleDB for efficient querying and storage of temporal health data.

## Running the Application

### Development Mode
```bash
npm run dev
```
This uses nodemon for automatic restarts on file changes.

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000` (or your specified PORT).

## API Endpoints

### Authentication

#### POST /api/auth
Universal endpoint that handles both login and registration based on request body.

**Registration** (when `name` field is present):
```json
{
  "name": "John Smith",
  "username": "johnsmith",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Login** (when `name` field is absent):
```json
{
  "username": "johnsmith",
  "password": "password123"
}
```

#### POST /api/auth/register
Explicit registration endpoint.

#### POST /api/auth/login
Explicit login endpoint.

#### GET /api/health
Health check endpoint to verify the API is running.

## Response Format

### Success Response
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Smith",
    "username": "johnsmith",
    "role": "user"
  }
}
```

### Error Response
```json
{
  "message": "Error description",
  "errors": [] // validation errors if applicable
}
```

## Security Features

- Password hashing with bcrypt (12 rounds)
- JWT tokens for authentication
- Rate limiting (100 requests per 15 minutes per IP)
- Security headers with Helmet
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## Project Structure

```
backend/
├── models/
│   └── User.js          # User model with Mongoose
├── routes/
│   └── auth.js          # Authentication routes
├── middleware/
│   └── auth.js          # Authentication middleware
├── .env                 # Environment variables (template)
├── server.js            # Main server file
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## Frontend Integration

Your React frontend should send requests to:
- Login/Register: `POST http://localhost:3000/api/auth`
- Include the JWT token in subsequent requests:
  ```javascript
  headers: {
    'Authorization': `Bearer ${token}`
  }
  ```

## TimescaleDB Benefits

TimescaleDB provides several advantages for health data:

1. **Time-series Optimization**: Automatic partitioning by time for faster queries
2. **Compression**: Automatic data compression for older data
3. **Continuous Aggregates**: Pre-computed rollups for dashboard analytics
4. **Retention Policies**: Automatic data lifecycle management
5. **Scalability**: Handles millions of data points efficiently

## Example Queries

### Get Recent Health Metrics
```sql
SELECT * FROM health_metrics 
WHERE user_id = $1 AND metric_type = 'weight' 
ORDER BY recorded_at DESC 
LIMIT 30;
```

### Monthly Weight Average
```sql
SELECT date_trunc('month', recorded_at) as month,
       AVG(value) as avg_weight
FROM health_metrics 
WHERE user_id = $1 AND metric_type = 'weight'
  AND recorded_at >= NOW() - INTERVAL '1 year'
GROUP BY month
ORDER BY month;
```

## Development Tips

1. **Check server status**: Visit `http://localhost:3000/api/health`
2. **View logs**: The server logs all requests and errors
3. **Database inspection**: Use MongoDB Compass or Studio 3T to view your database
4. **Environment**: Make sure your `.env` file is not committed to version control

## Troubleshooting

### Common Issues

1. **Supabase Connection Failed**
   - Ensure your Supabase project is active and running
   - Check that your API keys are correct in `.env`
   - Verify your project URL is correct

2. **JWT Secret Error**
   - Make sure `JWT_SECRET` is set in your `.env` file
   - Use a long, random string for production

3. **CORS Issues**
   - Frontend port is included in CORS configuration
   - Update CORS settings in `server.js` if needed

4. **Database Schema Errors**
   - Run the SQL scripts in the correct order (01_schema.sql first)
   - Make sure TimescaleDB extension is enabled
   - Check Supabase logs for detailed error messages

5. **Port Already in Use**
   - Change the PORT in `.env` file
   - Kill the process using the port: `lsof -ti:3000 | xargs kill`

## Next Steps

1. **Health Data Models**: Implement endpoints for health metrics, sleep, exercise
2. **TimescaleDB Features**: Set up continuous aggregates for analytics
3. **Data Visualization**: Create endpoints for charts and trends
4. **Real-time Features**: Add real-time data sync with Supabase subscriptions
5. **File Upload**: Implement profile pictures and document storage
6. **Email Integration**: Add email verification and notifications
7. **Data Export**: Implement health data export in various formats
8. **AI Integration**: Add health insights and recommendations
9. **Mobile API**: Optimize endpoints for mobile health apps
10. **Compliance**: Implement HIPAA compliance features if needed
