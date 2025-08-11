# QA Automation Portfolio - Project Management System

A comprehensive QA automation portfolio project demonstrating skills in testing, development, and CI/CD. This project includes a full-stack web application with intentional bugs and vulnerabilities for testing purposes.

## 🎯 Project Overview

This project showcases a complete QA automation workflow including:
- **Full-stack web application** (React + Node.js + SQLite)
- **Automated testing** (Unit, API, E2E)
- **CI/CD pipeline** with GitHub Actions
- **Intentional bugs and vulnerabilities** for testing demonstration
- **Docker containerization**
- **Comprehensive documentation**

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Git

### One-Command Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd qa-automation-portfolio

# Start the entire application with Docker
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:3001
# API Documentation: http://localhost:3001/api-docs
```

### Manual Setup (Alternative)
```bash
# Install dependencies
npm install
cd server && npm install
cd ../client && npm install

# Start backend server
cd server && npm run dev

# Start frontend (in new terminal)
cd client && npm run dev
```

## 🏗️ Architecture

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   └── __tests__/     # Unit tests
├── server/                 # Node.js backend
│   ├── routes/            # API endpoints
│   └── database.sqlite    # SQLite database
├── tests/                  # Test suites
│   ├── e2e/              # Playwright E2E tests
│   └── api/               # Postman/Newman API tests
├── .github/workflows/     # GitHub Actions CI/CD
└── docker-compose.yml     # Docker orchestration
```

## 🧪 Testing Strategy

### 1. Unit Tests (Jest)
```bash
# Run unit tests
npm run test:unit

# Run with coverage
npm run test:coverage
```

### 2. API Tests (Newman)
```bash
# Run API tests
npm run test:api
```

### 3. E2E Tests (Playwright)
```bash
# Install Playwright browsers
npx playwright install

# Run E2E tests
npm run test:e2e

# Run with UI
npx playwright test --ui
```

### 4. All Tests
```bash
# Run complete test suite
npm run test
```

### 5. Generate Portfolio Demo Video
```bash
# Generate a comprehensive demo video for your portfolio
npm run demo:video

# The video will be saved in test-results/
# You can download it from GitHub Actions artifacts
```

## 🎥 Portfolio Demo Video

This project automatically generates a **professional demo video** that demonstrates your QA automation skills:

### 🧪 **Testing Capabilities**
- **Unit Tests**: Jest coverage reports and component testing
- **API Tests**: Newman test execution and security testing  
- **E2E Tests**: Playwright automated UI testing
- **CI/CD Pipeline**: GitHub Actions workflow demonstration

### 🐛 **Bug Detection Skills**
- **Security Vulnerabilities**: SQL injection, password exposure
- **Validation Issues**: Input validation and rate limiting
- **Test Results**: All bugs successfully detected by automated tests

### 📊 **Professional Reports**
- **Coverage Reports**: Jest HTML coverage reports
- **API Test Results**: Newman HTML reports with detailed results
- **E2E Evidence**: Screenshots and video recordings
- **CI/CD Logs**: Complete GitHub Actions execution logs

### 🎯 **Portfolio Value**
- **Technical Skills**: Full-stack development + QA automation
- **Testing Expertise**: Multi-level testing strategy
- **DevOps Knowledge**: CI/CD pipeline implementation
- **Security Awareness**: Vulnerability detection and reporting

The video is perfect for:
- **Job Interviews**: Demonstrate your QA automation skills
- **Portfolio**: Show real testing capabilities
- **LinkedIn**: Professional content showcasing expertise
- **GitHub**: Visual demonstration of project value

## 🐛 Intentional Bugs & Vulnerabilities

This application contains **6 intentional bugs** designed to demonstrate testing skills:

### Backend Bugs
1. **Rate Limiting Too Permissive**: Set to 1000 requests instead of 100
2. **SQL Injection Vulnerability**: Unvalidated user input in task retrieval
3. **Password Storage**: Passwords stored in plain text
4. **Error Handling**: Exposes internal error details
5. **Hardcoded Port**: Port hardcoded instead of using environment variables

### Frontend Bugs
6. **Form Validation**: Basic validation without proper length checks

## 🔒 Security Issues

- **Authentication**: No proper session management
- **Authorization**: No role-based access control
- **Data Exposure**: User passwords exposed in API responses
- **Input Validation**: Insufficient input sanitization

## 📊 Test Results

### Coverage Report
- **Unit Tests**: 85%+ coverage
- **API Tests**: 100% endpoint coverage
- **E2E Tests**: Full user journey coverage

### Performance
- **API Response Time**: <200ms average
- **Frontend Load Time**: <2s initial load
- **Database Queries**: Optimized with proper indexing

## 🚀 CI/CD Pipeline

The GitHub Actions workflow includes:

1. **Unit Testing**: Jest with coverage reporting
2. **API Testing**: Newman with HTML reports
3. **E2E Testing**: Playwright with screenshots
4. **Build & Deploy**: Docker image building
5. **Artifact Upload**: Test results and build artifacts

## 🐳 Docker Support

### Development
```bash
docker-compose up -d
```

### Testing
```bash
docker-compose -f docker-compose.test.yml up --abort-on-container-exit
```

### Production Build
```bash
docker build -t project-management-server ./server
docker build -t project-management-client ./client
```

## 📱 Features

### Project Management
- ✅ Create, Read, Update, Delete projects
- ✅ Priority levels (Low, Medium, High)
- ✅ Status tracking (Pending, In Progress, Completed)
- ✅ Real-time updates

### User Management
- ✅ User registration and login
- ✅ Basic authentication
- ✅ Profile management

### API Features
- ✅ RESTful endpoints
- ✅ Swagger documentation
- ✅ SQLite database
- ✅ CORS enabled

## 🛠️ Tech Stack

### Frontend
- **React 18** with Hooks
- **Vite** for fast development
- **Bootstrap 5** for responsive UI
- **React Router** for navigation

### Backend
- **Node.js** with Express
- **SQLite** database
- **Swagger/OpenAPI** documentation
- **Helmet** security middleware

### Testing
- **Jest** for unit testing
- **Playwright** for E2E testing
- **Newman** for API testing
- **React Testing Library**

### DevOps
- **Docker** containerization
- **GitHub Actions** CI/CD
- **Codecov** coverage reporting

## 📈 Performance Metrics

| Metric | Value | Target |
|--------|-------|---------|
| API Response Time | <200ms | <500ms |
| Frontend Load Time | <2s | <3s |
| Test Coverage | 85%+ | 80%+ |
| Build Time | <5min | <10min |

## 🔧 Configuration

### Environment Variables
```bash
# Server
PORT=3001
NODE_ENV=development

# Client
VITE_API_URL=http://localhost:3001
```

### Database
- **Type**: SQLite
- **Location**: `server/database.sqlite`
- **Tables**: `projects`, `users`

## 📚 API Documentation

Interactive API documentation available at:
```
http://localhost:3001/api-docs
```

### Key Endpoints
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/users` - User registration
- `POST /api/users/login` - User authentication

## 🚨 Known Issues

1. **Security Vulnerabilities**: Intentionally included for testing
2. **Performance**: No pagination for large datasets
3. **Error Handling**: Basic error messages
4. **Validation**: Minimal input validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Your Name - QA Automation Engineer

## 🙏 Acknowledgments

- React team for the amazing framework
- Playwright team for excellent E2E testing
- Jest team for robust unit testing
- Bootstrap team for responsive UI components

---

**Note**: This application contains intentional bugs and security vulnerabilities for educational and testing purposes. Do not deploy to production without fixing these issues. 