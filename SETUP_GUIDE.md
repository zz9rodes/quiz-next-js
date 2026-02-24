# SETUP INSTRUCTIONS FOR NEXT.JS QUIZ API

## 1. Environment Setup

### Create .env.local file (copy from .env.example)
```bash
cp .env.example .env.local
```

### Update DATABASE_URL
For MySQL (Development):
```
DATABASE_URL="mysql://root:password@localhost:3306/quiz_festif_dev"
```

For PostgreSQL (Production):
```
DATABASE_URL="postgresql://user:password@host:5432/quiz_festif"
```

### Set JWT_SECRET
Generate a secure secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 2. Database Setup

### MySQL Setup (Development)

1. Install MySQL if not already installed:
```bash
# Windows: Use MySQL Community Server installer
# macOS: brew install mysql
# Linux: sudo apt-get install mysql-server
```

2. Start MySQL service:
```bash
# Windows
net start MySQL80

# macOS
brew services start mysql

# Linux
sudo service mysql start
```

3. Create database:
```bash
mysql -u root -p
CREATE DATABASE quiz_festif_dev;
EXIT;
```

4. Run migrations:
```bash
npm run db:push
```

This will sync the Prisma schema with your database.

### PostgreSQL Setup (Production)

1. Install PostgreSQL and create database:
```bash
createdb quiz_festif
```

2. Update DATABASE_URL and DATABASE_PROVIDER in .env.local

3. Run migrations:
```bash
npm run db:push
```

## 3. Running the API

### Development Mode
```bash
npm run dev
```

API will be available at: http://localhost:3000

### Production Build
```bash
npm run build
npm start
```

## 4. Available Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm start            # Start production server
npm run db:push      # Sync Prisma schema with database
npm run db:migrate   # Create migration file
npm run db:studio    # Open Prisma Studio (database GUI)
npm run lint         # Run ESLint
```

## 5. Database Management

### Open Prisma Studio (Visual Database Manager)
```bash
npm run db:studio
```

### View Database Schema
```bash
npm run db:schema
```

### Generate Prisma Client Types
```bash
npm run db:generate
```

## 6. API Documentation

All 28 endpoints match the original AdonisJS API exactly:

### Authentication (4 endpoints)
- POST /api/auth/signup
- POST /api/auth/login
- GET /api/auth/profile
- PUT /api/auth/profile

### Quizzes (6 endpoints)
- GET /api/quizzes
- POST /api/quizzes
- GET /api/quizzes/[id]
- PUT /api/quizzes/[id]
- DELETE /api/quizzes/[id]
- GET /api/quizzes/[id]/play
- GET /api/quizzes/[id]/stats
- GET /api/quizzes/[id]/participants

### Questions (3 endpoints)
- POST /api/questions
- PUT /api/questions/[id]
- DELETE /api/questions/[id]

### Participations (3 endpoints)
- POST /api/participations/submit
- GET /api/participations/[id]
- GET /api/participations/[id]/details

### Messages (5 endpoints)
- POST /api/messages/send
- GET /api/messages
- GET /api/messages/[id]
- DELETE /api/messages/[id]
- GET /api/users/[publicKey]/messages

### Users (1 endpoint)
- GET /api/users/[publicKey]

### Admin (4 endpoints)
- GET /api/admin/users
- GET /api/admin/quizzes
- GET /api/admin/quizzes/[id]
- GET /api/admin/participations

## 7. Testing the API

### Using cURL

**Signup:**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "display_name": "John Doe"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**Get Profile (requires token):**
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman

1. Import the API_DOCUMENTATION.md into Postman
2. Create environment variables:
   - `base_url`: http://localhost:3000
   - `token`: (will be populated after login)
3. Set authorization header: `Authorization: Bearer {{token}}`

## 8. Troubleshooting

### Database Connection Error
- Verify DATABASE_URL is correct
- Check if database service is running
- Ensure user credentials are valid

### Migration Error
- Delete node_modules and package-lock.json
- Run: `npm install && npm run db:push`

### Type Errors
- Run: `npm run db:generate`
- Restart development server

### JWT Token Issues
- Ensure JWT_SECRET is set in .env.local
- Verify token format: "Bearer <token>"

## 9. Project Structure

```
src/
├── app/api/              # Route handlers (28 endpoints)
├── middleware/           # Auth middleware
├── lib/                  # Core utilities
│   ├── prisma.ts        (Prisma client)
│   ├── auth.ts          (JWT & password utilities)
│   ├── response.ts      (Response helpers)
│   └── validators.ts    (Zod validation schemas)
├── services/            # Business logic
│   ├── auth.service.ts
│   ├── quiz.service.ts
│   ├── question.service.ts
│   ├── participation.service.ts
│   ├── message.service.ts
│   └── admin.service.ts
└── utils/               # Error handling
    └── errors.ts

prisma/
└── schema.prisma        # Database schema

database/               # SQL migrations
```

## 10. Production Deployment

### Build Optimization
```bash
npm run build
npm start
```

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use strong JWT_SECRET
- Use PostgreSQL for better scaling
- Enable CORS for frontend URL

### Docker Deployment (Optional)
Create Dockerfile if needed for containerization.

## Support

For issues or questions:
1. Check error logs in terminal
2. Review Prisma Studio for data validation
3. Check database connection with: `npx prisma db execute`
4. Review CORS and network settings if frontend cannot connect
