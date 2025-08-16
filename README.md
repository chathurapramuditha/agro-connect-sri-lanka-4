# Agriculture Marketplace - SQLite3 Integration

A full-stack agricultural marketplace application with React frontend, FastAPI backend, and SQLite3 database for managing farmers, buyers, products, orders, and real-time communications.

## 🚀 Features

- **User Management**: Support for farmers, buyers, and administrators
- **Product Marketplace**: Browse and manage agricultural products
- **Real-time Chat**: WebSocket-powered messaging system
- **Order Management**: Complete order lifecycle tracking
- **Reviews & Ratings**: User feedback system
- **Analytics Dashboard**: System insights and statistics
- **Multi-language Support**: English, Sinhala, Tamil
- **Responsive Design**: Works on desktop and mobile

## 📋 Prerequisites

Before running this project on Windows, ensure you have:

- **Python 3.11+** - [Download from python.org](https://www.python.org/downloads/)
- **Node.js 18+** - [Download from nodejs.org](https://nodejs.org/)
- **Yarn Package Manager** - Install via: `npm install -g yarn`
- **Git** - [Download from git-scm.com](https://git-scm.com/)

## 🛠️ Installation & Setup (Windows)

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd agriculture-marketplace
```

### 2. Backend Setup

#### Navigate to backend directory
```bash
cd backend
```

#### Create and activate virtual environment
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
venv\Scripts\activate
```

#### Install Python dependencies
```bash
pip install -r requirements.txt
```

#### Set up environment variables
Create a `.env` file in the `backend` directory:
```env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="agriculture_marketplace"
CORS_ORIGINS="http://localhost:3000,http://127.0.0.1:3000"
```

### 3. Frontend Setup

#### Navigate to frontend directory (open new terminal)
```bash
cd frontend
```

#### Install Node dependencies
```bash
yarn install
```

#### Set up environment variables
Create a `.env` file in the `frontend` directory:
```env
REACT_APP_BACKEND_URL=http://localhost:8001
WDS_SOCKET_PORT=3000
```

## 🚀 Running the Application

### 1. Start the Backend Server

Open Command Prompt or PowerShell, navigate to backend directory:
```bash
cd backend
venv\Scripts\activate
python -m uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

The backend will be available at: `http://localhost:8001`

### 2. Start the Frontend Server

Open another Command Prompt or PowerShell, navigate to frontend directory:
```bash
cd frontend
yarn dev
```

The frontend will be available at: `http://localhost:3000`

## 📊 Database Management

### Initialize Database
The SQLite3 database will be automatically initialized when the backend starts. You can also manually initialize it:

```bash
# Make a POST request to initialize database
curl -X POST http://localhost:8001/api/init-database
```

### Database Location
The SQLite database file is located at: `backend/data/application.db`

### Sample Data
The application includes sample data for testing. You can create additional test data using the API endpoints.

## 🔧 API Documentation

Once the backend is running, you can access the interactive API documentation at:
- **Swagger UI**: `http://localhost:8001/docs`
- **ReDoc**: `http://localhost:8001/redoc`

### Key API Endpoints

#### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `GET /api/users/{user_id}` - Get user by ID
- `PUT /api/users/{user_id}` - Update user
- `DELETE /api/users/{user_id}` - Delete user

#### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create new product
- `GET /api/products/{product_id}` - Get product by ID
- `GET /api/products/seller/{seller_id}` - Get products by seller

#### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order
- `GET /api/orders/buyer/{buyer_id}` - Get orders by buyer
- `GET /api/orders/seller/{seller_id}` - Get orders by seller

#### Real-time Communication
- `WebSocket /ws/{user_id}` - WebSocket connection for real-time updates

## 🧪 Testing

### Backend Testing
Run comprehensive backend tests:
```bash
cd backend
python backend_test.py
```

### Frontend Testing
The frontend can be tested through the browser at `http://localhost:3000`

## 🏗️ Project Structure

```
agriculture-marketplace/
├── backend/                 # FastAPI backend
│   ├── data/               # SQLite database files
│   ├── routes/             # API route modules
│   ├── database.py         # Database management
│   ├── models.py           # Pydantic models
│   ├── server.py           # Main server file
│   ├── websocket_manager.py # WebSocket handling
│   └── requirements.txt    # Python dependencies
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── App.tsx         # Main app component
│   ├── package.json        # Node dependencies
│   └── vite.config.ts      # Vite configuration
└── README.md               # This file
```

## 🔐 User Types & Access

### Farmer
- Manage products and listings
- View and manage orders
- Chat with buyers
- Access to farmer dashboard

### Buyer
- Browse marketplace
- Place orders
- Chat with farmers
- Access to buyer dashboard

### Admin
- User management
- System analytics
- Content moderation
- Administrative tools

## 🌐 WebSocket Events

The application supports real-time updates through WebSocket:

- `USER_ONLINE` - User comes online
- `USER_OFFLINE` - User goes offline
- `NEW_MESSAGE` - New chat message
- `ORDER_UPDATE` - Order status changes
- `PRODUCT_UPDATE` - Product information changes

## 🐛 Troubleshooting

### Common Issues

#### Backend won't start
- Ensure Python 3.11+ is installed
- Check that virtual environment is activated
- Verify all dependencies are installed: `pip install -r requirements.txt`

#### Frontend won't start
- Ensure Node.js 18+ is installed
- Check that Yarn is installed: `yarn --version`
- Clear node_modules and reinstall: `rm -rf node_modules && yarn install`

#### Database issues
- Check that `backend/data/` directory exists and is writable
- Verify SQLite database file permissions
- Try reinitializing database: `POST /api/init-database`

#### CORS errors
- Ensure CORS_ORIGINS in backend `.env` includes frontend URL
- Check that both frontend and backend are running on correct ports

### Logs
- Backend logs: Check console output where backend is running
- Frontend logs: Check browser console (F12)
- Database logs: Check SQLite database file for corruption

## 📝 Development

### Adding New Features

1. **Backend Changes**:
   - Add new models in `models.py`
   - Create route modules in `routes/`
   - Update database schema in `database.py`
   - Add to main router in `server.py`

2. **Frontend Changes**:
   - Add API calls to `services/api.ts`
   - Create new components in `components/`
   - Add new pages in `pages/`
   - Update routing in `App.tsx`

### Code Style
- Backend: Follow PEP 8 Python style guide
- Frontend: Use TypeScript and follow React best practices
- Use meaningful variable names and add comments

## 📞 Support

For issues and questions:
1. Check the troubleshooting section above
2. Review API documentation at `/docs`
3. Check browser console for frontend errors
4. Check backend console for server errors

## 🔄 Updates

To update the application:
1. Pull latest changes: `git pull`
2. Update backend dependencies: `pip install -r requirements.txt`
3. Update frontend dependencies: `yarn install`
4. Restart both servers

---

**Note**: This application is designed for development and testing. For production deployment, additional security measures, environment configurations, and optimizations should be implemented.
