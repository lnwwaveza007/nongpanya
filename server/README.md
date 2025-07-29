# 🩺 Nongpanya API

## Tech Stack
- **Node.js + Express** – Server and API framework
- **Prisma** – ORM for MySQL
- **MySQL** – Relational database
- **JWT** – User authentication
- **CORS** – Cross-origin access support
- **Nodemon** – Hot reload during development
- **WebSocket** – Real-time communication
- **Passport** – OAuth authentication (e.g., Microsoft)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/lnwwaveza007/nongpanya.git
cd server
```
### 2. Install dependencies
```bash
npm install
```
### 3. Set up environment variables
Create a .env file in the root directory:
```bash
# ESP32 Board Endpoint (for direct HTTP requests if needed)
BOARD_URL=http://0.0.0.0

# Microsoft OAuth2 Configuration (for login with Microsoft account)
MICROSOFT_CLIENT_ID=your-microsoft-client-id
MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret
MICROSOFT_CALLBACK_URL=https://example-web.com/auth #http://localhost:3001/auth
MICROSOFT_AUTH_URL=https://login.microsoftonline.com/common/oauth2/v2.0/authorize
MICROSOFT_TOKEN_URL=https://login.microsoftonline.com/common/oauth2/v2.0/token

# Database (MySQL connection)
DATABASE_URL="mysql://username:password@localhost:3306/your_database"

# JWT (for user session tokens)
JWT_SECRET=your_super_secure_jwt_secret
```
### 4. Initialize Prisma
```bash
npx prisma generate      # Generate client
```
### 5. Start the server
```bash
npm run dev
```

## Project Structure
```
server/
├── configs/
│   └── prismaClient.js      # Prisma setup
├── controllers/
│   └── authControllers.js
├── middlewares/
│   └── authenticateToken.js
├── prisma/
│   └── schema.prisma
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── medRoutes.js
│   └── codeRoutes.js
├── services/
│   ├── authServices.js
├── utils/
│   ├── formatter.js
├── .env
├── server.js
└── package.json
```
## Useful Scripts
```bash
npx prisma db pull       # Sync schema from DB
npx prisma generate      # Generate Prisma client
npx prisma studio        # Visual DB browser
```
## Branch setting
- `main`: For deploying
- `dev`: For gather all the develoop code by merge the code every 2 weeks on monday
- `feat/your-feature`: For new feature
- `fix/your-fix`: For bug fix

## Commit message
```
<type>: <subject>
<optional body>
```
Commonly used `<type>` values:
- `build`: Anything related to the build system (e.g. npm scripts, adding external dependencies, modifying Dockerfiles, etc.)
- `chore`: Internal changes that don’t affect the application behavior (e.g. updating .gitignore, .prettierrc, etc.)
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes only (e.g. updating README, comments)
- `refactor`: Code changes that improve structure without changing behavior
- `perf`: Changes to improve performance
- `test`: Anything related to testing (e.g. adding or updating test cases)
