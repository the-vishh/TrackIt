# TrackIt - Smart Expense Tracker

A comprehensive expense tracking application with AI-powered insights, real-time analytics, and gamification features.

## Features

- 📊 **Smart Analytics**: AI-powered spending insights and predictions
- 🎯 **Budget Management**: Set and track budgets by category
- 📱 **Real-time Sync**: Live updates across all devices
- 🏆 **Gamification**: Achievements and rewards for smart spending
- 📍 **Location Tracking**: Track spending by location
- 🔔 **Smart Notifications**: Personalized alerts and reminders
- 📸 **Receipt Scanning**: OCR-powered receipt analysis
- 📈 **Advanced Charts**: Beautiful visualizations of spending patterns

## Tech Stack

### Frontend
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts + Chart.js
- **Animations**: Framer Motion
- **PWA**: Next-PWA

### Backend
- **Runtime**: Node.js + Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: JWT + bcryptjs
- **Real-time**: Socket.IO
- **Logging**: Winston
- **Security**: Helmet, CORS, Rate limiting

### AI/ML Service
- **Framework**: FastAPI (Python)
- **ML Libraries**: TensorFlow, Scikit-learn
- **AI APIs**: OpenAI, Hugging Face
- **Image Processing**: OpenCV, Tesseract OCR
- **Predictions**: Prophet

### DevOps
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel (Frontend), Railway/Render (Backend)

## Getting Started

### Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download here](https://www.python.org/)
- **PostgreSQL** (v12 or higher) - [Download here](https://www.postgresql.org/)
- **Git** - [Download here](https://git-scm.com/)
- **Docker** (optional, for containerized setup) - [Download here](https://www.docker.com/)

### Step 1: Clone and Install Dependencies

```bash
# Clone the repository
git clone <https://github.com/the-vishh/TrackIt>
cd expense-tracker

# Install all dependencies (root, client, server, and AI service)
npm run install:all
```

### Step 2: Set Up Environment Variables

Create the following `.env` files with your configuration:

#### Root `.env` file (optional, for Docker setup)
```bash
# Create .env in the root directory
touch .env
```

Add the following content:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/expense_tracker"

# Redis (for caching and sessions)
REDIS_URL="redis://localhost:6379"

# JWT Secret (generate a strong secret)
JWT_SECRET="your-super-secret-jwt-key-here"

# API Keys (get these from respective services)
OPENAI_API_KEY="your-openai-api-key"
GOOGLE_MAPS_API_KEY="your-google-maps-api-key"

# Email (for notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Frontend URL
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_AI_SERVICE_URL="http://localhost:8000"
```

#### Server `.env` file
```bash
# Create .env in the server directory
cd server
touch .env
```

Add the following content:
```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/expense_tracker"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"

# Redis
REDIS_URL="redis://localhost:6379"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# CORS
CORS_ORIGIN="http://localhost:3000"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Client `.env.local` file
   ```bash
# Create .env.local in the client directory
cd ../client
touch .env.local
```

Add the following content:
```env
# API URLs
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_AI_SERVICE_URL="http://localhost:8000"

# Authentication
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# External APIs (optional)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
```

#### AI Service `.env` file
   ```bash
# Create .env in the ai-service directory
cd ../ai-service
touch .env
```

Add the following content:
```env
# AI Service Configuration
PORT=8000
HOST=0.0.0.0

# OpenAI API
OPENAI_API_KEY="your-openai-api-key"

# Database (if needed for AI features)
DATABASE_URL="postgresql://username:password@localhost:5432/expense_tracker"

# CORS
CORS_ORIGINS=["http://localhost:3000", "http://localhost:3001"]
```

### Step 3: Set Up Database

#### Option A: Using Docker (Recommended)
```bash
# Start PostgreSQL and Redis using Docker Compose
docker-compose up -d postgres redis

# Wait a few seconds for the database to be ready
sleep 5

# Run database migrations
npm run db:migrate

# Seed the database with initial data (optional)
npm run db:seed
```

#### Option B: Local PostgreSQL
```bash
# Create the database
createdb expense_tracker

# Run database migrations
npm run db:migrate

# Seed the database with initial data (optional)
npm run db:seed
```

### Step 4: Start the Application

#### Option A: Start All Services (Recommended)
```bash
# Start all services (client, server, AI service, database)
npm run dev
```

This will start:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- AI Service: http://localhost:8000
- PostgreSQL: localhost:5432
- Redis: localhost:6379

#### Option B: Start Services Individually
```bash
# Terminal 1: Start the backend server
cd server
npm run dev

# Terminal 2: Start the frontend client
cd client
npm run dev

# Terminal 3: Start the AI service
cd ai-service
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Step 5: Visit Your Application

Once all services are running, you can access your expense tracker:

- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **AI Service API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs (FastAPI auto-generated docs)

### Step 6: Create Your First Account

1. Visit http://localhost:3000
2. Click "Get Started" or "Register"
3. Fill in your details and create an account
4. Log in and start tracking your expenses!

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/logout` - Logout user

### Expense Endpoints
- `GET /api/expenses` - Get all expenses (with pagination and filtering)
- `POST /api/expenses` - Create a new expense
- `GET /api/expenses/:id` - Get a specific expense
- `PUT /api/expenses/:id` - Update an expense
- `DELETE /api/expenses/:id` - Delete an expense

### Analytics Endpoints
- `GET /api/analytics/spending` - Get spending analytics
- `GET /api/analytics/budgets` - Get budget analytics
- `GET /api/analytics/locations` - Get location insights
- `GET /api/analytics/predictions` - Get spending predictions

### AI Service Endpoints
- `POST /ai/analyze-expense` - Analyze expense for categorization
- `POST /ai/predict-spending` - Predict future spending
- `POST /ai/analyze-receipt` - Analyze receipt image

## Project Structure

```
expense-tracker/
├── client/                 # Next.js frontend
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # Utilities and API clients
│   │   ├── store/         # Zustand stores
│   │   └── types/         # TypeScript types
│   ├── public/            # Static assets
│   └── package.json
├── server/                # Express.js backend
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Express middleware
│   │   ├── config/        # Configuration files
│   │   └── utils/         # Utility functions
│   └── package.json
├── ai-service/            # FastAPI AI service
│   ├── main.py           # FastAPI application
│   └── requirements.txt  # Python dependencies
├── database/             # Database schema and migrations
│   └── schema.prisma    # Prisma schema
├── prisma/              # Prisma generated files
├── docker-compose.yml   # Docker services
└── package.json         # Root package.json
```

## Development

### Available Scripts

#### Root Level
```bash
npm run dev              # Start all services
npm run build            # Build all services
npm run test             # Run all tests
npm run install:all      # Install all dependencies
npm run db:migrate       # Run database migrations
npm run db:seed          # Seed database
npm run docker:up        # Start Docker services
npm run docker:down      # Stop Docker services
```

#### Client
   ```bash
cd client
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run test             # Run tests
npm run lint             # Run linter
```

#### Server
   ```bash
cd server
npm run dev              # Start development server
npm run build            # Build TypeScript
npm run start            # Start production server
npm run test             # Run tests
```

#### AI Service
```bash
cd ai-service
python -m uvicorn main:app --reload  # Start development server
python -m pytest                     # Run tests
```

### Database Commands

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Reset database
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio

# Seed database
npm run db:seed
```

## Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Railway/Render)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically on push to main branch

### AI Service (Railway/Render)
1. Connect your GitHub repository
2. Set Python environment variables
3. Deploy automatically on push to main branch

### Database (Supabase/PlanetScale)
1. Create a new database instance
2. Update DATABASE_URL in your environment variables
3. Run migrations: `npx prisma migrate deploy`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests: `npm run test`
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Prisma](https://www.prisma.io/) for the excellent ORM
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [FastAPI](https://fastapi.tiangolo.com/) for the modern Python web framework
