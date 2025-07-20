# NanoPure Uganda Water Purification System

A comprehensive IoT-enabled water purification monitoring system designed for deployment in Uganda, featuring real-time sensor monitoring, automated alerts, and multi-language support.

## 🌟 Features

- **Real-time Monitoring**: Live tracking of water quality parameters
- **IoT Integration**: Support for various water quality sensors
- **Automated Alerts**: Email and in-app notifications for quality issues
- **Multi-language Support**: English and Luganda language support
- **User Management**: Role-based access control
- **Data Analytics**: Historical data visualization and reporting
- **Mobile-Responsive**: Works seamlessly on all devices
- **API-First**: RESTful API for easy integration

## 🏗️ Architecture

- **Frontend**: React 19 with TypeScript
- **Backend**: Node.js with Express.js
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT-based authentication
- **Deployment**: Microsoft Azure (App Service + Static Web Apps)
- **CI/CD**: GitHub Actions

## 📁 Project Structure

```
nanopure-app/
├── nanopure-frontend/          # React frontend application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API service layer
│   │   ├── styles/            # CSS and styling
│   │   └── utils/             # Utility functions
│   ├── public/                # Static assets
│   └── build/                 # Production build output
├── nanopure-backend/          # Node.js backend API
│   ├── controllers/           # Request handlers
│   ├── models/                # Database models
│   ├── routes/                # API routes
│   ├── middleware/            # Custom middleware
│   ├── config/                # Configuration files
│   ├── scripts/               # Database and utility scripts
│   └── __tests__/             # Test files
└── .github/workflows/         # GitHub Actions CI/CD
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or later
- MySQL 8.0 or later
- Git
- Azure account (for deployment)
- GitHub account (for deployment)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/nanopure-app.git
   cd nanopure-app
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   # Backend
   cd nanopure-backend
   cp .env.template .env
   # Edit .env with your database and email credentials
   
   # Frontend
   cd ../nanopure-frontend
   cp .env.template .env
   # Edit .env with your API URL
   ```

4. **Set up the database**
   ```bash
   cd nanopure-backend
   npm run setup
   ```

5. **Start the development servers**
   ```bash
   # From the root directory
   npm run dev
   ```

   This will start:
   - Backend API at `http://localhost:3001`
   - Frontend at `http://localhost:3000`

## 📤 Deployment to Azure via GitHub

For a complete deployment to Microsoft Azure using GitHub Actions:

1. **Set up GitHub repository**: Follow the [GitHub Setup Guide](./GITHUB_SETUP.md)
2. **Deploy to Azure**: Follow the [Azure Deployment Guide](./AZURE_DEPLOYMENT.md)
3. **Use the checklist**: Reference the [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)

## 🛠️ Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend in development mode
- `npm run install:all` - Install dependencies for all projects
- `npm start` - Start frontend only
- `npm run start:backend` - Start backend only

### Backend (`nanopure-backend/`)
- `npm start` - Start the production server
- `npm run dev` - Start with nodemon for development
- `npm test` - Run tests
- `npm run setup` - Initialize database and create tables
- `npm run seed` - Populate database with sample data

### Frontend (`nanopure-frontend/`)
- `npm start` - Start development server
- `npm run build` - Create production build
- `npm test` - Run tests

## 🌍 Deployment

### Local Production Build

```bash
# Build frontend
cd nanopure-frontend
npm run build

# Start backend in production mode
cd ../nanopure-backend
NODE_ENV=production npm start
```

### Azure Deployment

See [AZURE_DEPLOYMENT.md](./AZURE_DEPLOYMENT.md) for detailed deployment instructions.

## 📊 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Sensor Endpoints
- `GET /api/sensors` - Get all sensors
- `POST /api/sensors` - Create new sensor
- `GET /api/sensors/:id` - Get specific sensor
- `PUT /api/sensors/:id` - Update sensor
- `DELETE /api/sensors/:id` - Delete sensor
- `POST /api/sensors/:id/readings` - Add sensor reading

### Alert Endpoints
- `GET /api/alerts` - Get alerts
- `POST /api/alerts` - Create alert
- `PUT /api/alerts/:id` - Update alert status

## 🔧 Configuration

### Environment Variables

#### Backend
```env
NODE_ENV=development|production
PORT=3001
DB_HOST=localhost
DB_NAME=nanopure_db
DB_USER=root
DB_PASSWORD=password
JWT_SECRET=your-secret-key
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

#### Frontend
```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_API_VERSION=v1
```

## 🧪 Testing

### Backend Tests
```bash
cd nanopure-backend
npm test
npm run test:coverage
```

### Frontend Tests
```bash
cd nanopure-frontend
npm test
npm test -- --coverage
```

## 🌐 Internationalization

The application supports multiple languages:
- English (default)
- Luganda (Uganda local language)

To add a new language:
1. Add translation files in `nanopure-frontend/src/locales/`
2. Update the i18n configuration
3. Add language selector in the UI

## 📱 Sensor Integration

The system supports various water quality sensors:
- pH sensors
- Turbidity sensors
- Temperature sensors
- Conductivity sensors
- Dissolved oxygen sensors

### Adding New Sensor Types
1. Update the sensor model in `nanopure-backend/models/Sensor.js`
2. Add sensor-specific validation
3. Update the frontend sensor management UI

## 🚨 Monitoring & Alerts

The system provides automated alerting for:
- Water quality parameter thresholds
- Sensor connectivity issues
- System health monitoring

Alerts are sent via:
- Email notifications
- In-app notifications
- Dashboard warnings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in this repository
- Email: support@nanopure-uganda.com
- Documentation: [Project Wiki](https://github.com/yourusername/nanopure-app/wiki)

## 🙏 Acknowledgments

- Uganda National Water and Sewerage Corporation
- Local communities participating in water quality monitoring
- Open-source community for excellent tools and libraries

## 🔄 Version History

- **v1.0.0** - Initial release with basic monitoring features
- **v1.1.0** - Added multi-language support
- **v1.2.0** - Enhanced alerting system
- **v2.0.0** - Azure deployment and production optimization

---

**NanoPure Uganda** - Clean Water for Everyone 💧
