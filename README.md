# 3XBANG Construction Company Web Application

A comprehensive web application for a construction company that includes both internal management features and a public-facing website to showcase projects and services.

## Features

### Public-Facing Website
- Home page with company overview and services
- Projects showcase with filtering options
- Project detail pages with gallery and features
- About page with company history and team
- Contact form for inquiries

### Internal Management System
- Secure admin dashboard
- Project management (create, edit, track progress)
- Client management
- Employee management
- Task and deadline tracking
- Analytics and reporting

## Technology Stack

- **Frontend**: Vue 3 with Composition API
- **State Management**: Pinia
- **Routing**: Vue Router
- **UI Library**: Element Plus
- **Build Tool**: Vite
- **CSS Preprocessor**: SASS

## Project Structure

```
3xbang-web/
├── public/                # Static assets
├── src/
│   ├── assets/            # Images, fonts, and global styles
│   ├── components/        # Reusable Vue components
│   ├── layouts/           # Page layout components
│   ├── router/            # Vue Router configuration
│   ├── store/             # Pinia stores
│   ├── views/             # Page components
│   │   └── admin/         # Admin interface pages
│   ├── App.vue            # Root component
│   └── main.js            # Entry point
├── API_DOCUMENTATION.md   # API documentation
├── DATA_MODELS.md         # Data models documentation
├── index.html             # HTML entry point
└── package.json           # Project dependencies
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/3xbang-web.git
   cd 3xbang-web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Authentication

For demo purposes, you can use any email and password to log in to the admin interface. In a production environment, this would be replaced with proper authentication.

## Documentation

- [API Documentation](./API_DOCUMENTATION.md)
- [Data Models](./DATA_MODELS.md)

## Note

This is a frontend demonstration project. In a real-world scenario, it would connect to a backend API for data storage and retrieval. 