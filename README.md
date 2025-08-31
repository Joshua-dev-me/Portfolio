# Me-API Playground

A comprehensive candidate profile API playground that stores and serves information about skills, projects, and work experience. Built with Node.js, Express, and SQLite, featuring a modern React-based frontend.

## 🚀 Features

- **Profile Management**: Store and manage candidate information (name, email, education, professional links)
- **Skills Tracking**: Organize skills by category with proficiency levels (1-5 scale)
- **Project Portfolio**: Showcase projects with descriptions, links, and associated skills
- **Work Experience**: Track employment history with company details and descriptions
- **Advanced Search**: Global search across all data types with filtering options
- **RESTful API**: Clean, documented endpoints for all operations
- **Modern Frontend**: Responsive React-based UI with tabbed navigation
- **Database**: SQLite with proper schema, indexes, and relationships

## 🏗️ Architecture

```
├── server.js              # Main Express server
├── database/
│   └── db.js             # Database connection and schema
├── routes/
│   ├── profile.js        # Profile CRUD operations
│   ├── projects.js       # Project management
│   ├── skills.js         # Skills and categories
│   └── search.js         # Global search functionality
├── scripts/
│   ├── init-db.js        # Database initialization
│   └── seed-db.js        # Sample data seeding
├── public/
│   └── index.html        # Frontend application
└── logs/                 # Application logs
```

## 🗄️ Database Schema

### Tables

#### Profile
- `id` (INTEGER, PRIMARY KEY)
- `name` (TEXT, NOT NULL)
- `email` (TEXT, UNIQUE, NOT NULL)
- `education` (TEXT)
- `github` (TEXT)
- `linkedin` (TEXT)
- `portfolio` (TEXT)
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

#### Skills
- `id` (INTEGER, PRIMARY KEY)
- `name` (TEXT, UNIQUE, NOT NULL)
- `proficiency` (INTEGER, 1-5 scale)
- `category` (TEXT)
- `created_at` (DATETIME)

#### Projects
- `id` (INTEGER, PRIMARY KEY)
- `title` (TEXT, NOT NULL)
- `description` (TEXT)
- `github_link` (TEXT)
- `live_link` (TEXT)
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

#### Project Skills (Junction Table)
- `project_id` (INTEGER, FOREIGN KEY)
- `skill_id` (INTEGER, FOREIGN KEY)

#### Work Experience
- `id` (INTEGER, PRIMARY KEY)
- `company` (TEXT, NOT NULL)
- `position` (TEXT, NOT NULL)
- `description` (TEXT)
- `start_date` (DATE)
- `end_date` (DATE)
- `current` (BOOLEAN)
- `created_at` (DATETIME)

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd me-api-playground
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Initialize the database**
   ```bash
   npm run init-db
   ```

4. **Seed the database with sample data**
   ```bash
   npm run seed-db
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3001
   - API Health: http://localhost:3001/health
   - API Base: http://localhost:3001/api

### Production Deployment

1. **Set environment variables**
   ```bash
   export NODE_ENV=production
   export PORT=3001
   ```

2. **Install production dependencies**
   ```bash
   npm install --production
   ```

3. **Initialize and seed database**
   ```bash
   npm run init-db
   npm run seed-db
   ```

4. **Start the server**
   ```bash
   npm start
   ```

## 📡 API Endpoints

### Health Check
- `GET /health` - API health status

### Profile
- `GET /api/profile` - Get profile information
- `POST /api/profile` - Create new profile
- `PUT /api/profile` - Update existing profile

### Skills
- `GET /api/skills` - Get all skills
- `GET /api/skills/top` - Get top skills by proficiency
- `GET /api/skills/categories` - Get skill categories
- `GET /api/skills/:id` - Get specific skill

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects?skill=:skill` - Filter projects by skill
- `GET /api/projects/:id` - Get specific project

### Search
- `GET /api/search?q=:query` - Global search
- `GET /api/search/advanced?q=:query&type=:type&category=:category` - Advanced search

## 🔍 Sample API Usage

### Using cURL

```bash
# Health check
curl http://localhost:3001/health

# Get profile
curl http://localhost:3001/api/profile

# Get skills
curl http://localhost:3001/api/skills

# Get top skills
curl http://localhost:3001/api/skills/top

# Search projects by skill
curl "http://localhost:3001/api/projects?skill=JavaScript"

# Global search
curl "http://localhost:3001/api/search?q=React"

# Advanced search
curl "http://localhost:3001/api/search/advanced?q=Python&type=skill&category=Backend"
```

### Using Postman

Import the following collection:

```json
{
  "info": {
    "name": "Me-API Playground",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/health"
      }
    },
    {
      "name": "Get Profile",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/api/profile"
      }
    },
    {
      "name": "Get Skills",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/api/skills"
      }
    },
    {
      "name": "Get Projects",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/api/projects"
      }
    },
    {
      "name": "Search Projects by Skill",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/api/projects?skill=JavaScript"
      }
    },
    {
      "name": "Global Search",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/api/search?q=React"
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3001"
    }
  ]
}
```

## 🌐 Frontend Features

- **Overview Tab**: Dashboard with statistics and API status
- **Profile Tab**: Display candidate information and professional links
- **Skills Tab**: Browse and search skills with proficiency indicators
- **Projects Tab**: View projects with skill associations and links
- **Search Tab**: Global search across all data types

## 🚀 Deployment Options

### Heroku
1. Create a new Heroku app
2. Set environment variables
3. Deploy using Git:
   ```bash
   heroku git:remote -a your-app-name
   git push heroku main
   ```

### Railway
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically on push

### DigitalOcean App Platform
1. Connect your repository
2. Configure build settings
3. Set environment variables
4. Deploy

### Vercel
1. Import your repository
2. Configure build settings
3. Deploy

## 📝 Environment Variables

```bash
NODE_ENV=production          # Environment (development/production)
PORT=3001                   # Server port
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📊 Monitoring & Logging

- **Winston logging** with file and console outputs
- **Request logging** for all API calls
- **Error tracking** with detailed error messages
- **Health monitoring** endpoint for uptime checks

## 🔒 Security Features

- **Helmet.js** for security headers
- **CORS configuration** for cross-origin requests
- **Rate limiting** (100 requests per 15 minutes per IP)
- **Input validation** on all endpoints
- **SQL injection protection** using parameterized queries

## 📈 Performance Features

- **Database indexing** on frequently queried fields
- **Efficient queries** with proper JOINs
- **Response caching** headers
- **Compression** for large responses

## 🚧 Known Limitations

1. **Single Profile**: Currently supports only one profile per instance
2. **No Authentication**: Write operations are not protected (intended for playground use)
3. **SQLite**: Limited concurrent connections (suitable for development/demo)
4. **File-based Logging**: Logs are stored locally
5. **No Pagination**: Large datasets may impact performance

## 🔮 Future Enhancements

- [ ] User authentication and authorization
- [ ] Multiple profile support
- [ ] PostgreSQL/MySQL database support
- [ ] API rate limiting per user
- [ ] Real-time notifications
- [ ] File upload support for project images
- [ ] Advanced analytics and reporting
- [ ] Mobile app support
- [ ] Webhook integrations

## 📚 Resume Link

[View My Resume](https://your-resume-link.com)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For questions or support, please open an issue in the GitHub repository or contact me at [your-email@example.com](mailto:your-email@example.com).

---

**Built with ❤️ for the Backend Assessment**
