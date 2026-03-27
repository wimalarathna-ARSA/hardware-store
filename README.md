# Hardware Store Application

A full-stack e-commerce application for a hardware store built with React, Node.js, and Express.

## Project Structure

```
hardware-store/
├── client/              # React frontend application
│   ├── src/
│   │   ├── pages/       # Page components
│   │   ├── App.jsx
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── server/              # Node.js/Express backend
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── index.js
│   └── package.json
└── README.md
```

## Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **ESLint** - Code quality

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database (implied from models)

## Features

- User authentication and registration
- Product browsing and search
- Shopping cart management
- Order management
- Admin dashboard
- Admin product management
- Admin order management
- Admin promotions management
- Contact page

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (for backend)

### Installation

#### Backend Setup
```bash
cd server
npm install
```

#### Frontend Setup
```bash
cd client
npm install
```

### Environment Variables

Create `.env` and `.env.local` files in appropriate directories:

**Server (.env)**
```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

**Client (.env.local)**
```
VITE_API_URL=http://localhost:5000
```

### Running the Application

#### Start Backend
```bash
cd server
npm start
```

#### Start Frontend (Development)
```bash
cd client
npm run dev
```

The application will be available at `http://localhost:5173` (Vite default port)

## Available Scripts

### Client
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Server
- `npm start` - Start the server

## Pages

- **Home** - Landing page
- **Products** - Product listing
- **Product Detail** - Individual product details
- **Cart** - Shopping cart
- **Checkout** - Purchase process
- **Orders** - User order history
- **Login** - User authentication
- **Register** - New user registration
- **Contact** - Contact form
- **Admin Dashboard** - Admin overview
- **Admin Products** - Product management
- **Admin Orders** - Order management
- **Admin Promotions** - Promotion management

## Git Workflow

This project uses a `.gitignore` file to exclude:
- `node_modules/` - Dependencies
- `.env` files - Environment variables
- `dist/` and `build/` - Build outputs
- Editor/IDE files - `.vscode/`, `.idea/`
- Logs and temporary files

## Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Create a pull request

## License

This project is proprietary and confidential.

## Support

For issues or questions, please contact the development team.
