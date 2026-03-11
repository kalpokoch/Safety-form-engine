# Safety Form Engine

A dynamic, intelligent form management system for safety inspections with advanced features including conditional logic, multi-branch support, and video uploads.

## 🚀 Features

### Backend
- **RESTful API** with FastAPI
- **GET /metadata/branches** - List all branches with id, name, location
- **POST /forms/definitions** - Create form templates with JSON schema
- **GET /forms/definitions** - List all forms
- **GET /forms/definitions/{form_id}** - Get specific form
- **POST /forms/{form_id}/submission** - Submit form data with validation
- **POST /upload/video** - Upload video files
- **Field Types**: text, number, select, radio_group, video_upload
- **Comprehensive Validation**: Type checking, required fields, option validation
- **PostgreSQL Database** with SQLAlchemy ORM

### Frontend
- **Form Builder UI** - Visual form designer
  - Drag-and-drop field management
  - Configure field types and properties
  - Attach dynamic data sources
  - Define logic rules
- **Dynamic Form Renderer** - Smart form display
  - Fetches schema from backend
  - Renders appropriate UI components
  - Populates dropdowns from API endpoints
  - Real-time conditional logic
- **Logic Engine** (Bonus Features)
  - ✅ Conditional visibility (show/hide fields)
  - ✅ Dynamic required fields
  - ✅ Safety highlighting (color-coded warnings)
  - Operators: equals, not equals, greater than, less than, etc.

## 📋 Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL 14+
- pip and npm

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd safety-form-engine
```

### 2. Database Setup

Create a PostgreSQL database:
```sql
CREATE DATABASE safety_forms;
```

### 3. Backend Setup

Navigate to backend directory:
```bash
cd backend
```

Create a `.env` file:
```env
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=safety_forms
```

Install Python dependencies:
```bash
pip install -r requirements.txt
```

Seed the database with sample data:
```bash
python seed_data.py
```

Run the backend server:
```bash
uvicorn main:app --reload
```

Backend will be available at: `http://localhost:8000`
API documentation: `http://localhost:8000/docs`

### 4. Frontend Setup

Navigate to frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Run the development server:
```bash
npm run dev
```

Frontend will be available at: `http://localhost:5173`

## 📁 Project Structure

```
safety-form-engine/
├── backend/
│   ├── main.py                  # FastAPI application entry
│   ├── database.py              # Database configuration
│   ├── models.py                # SQLAlchemy models
│   ├── schemas.py               # Pydantic schemas
│   ├── seed_data.py             # Database seeding script
│   ├── requirements.txt         # Python dependencies
│   ├── .env                     # Environment variables
│   ├── routers/
│   │   ├── metadata.py          # Branch endpoints
│   │   ├── forms.py             # Form CRUD & submission
│   │   └── uploads.py           # File upload handling
│   └── uploads/
│       └── videos/              # Uploaded video storage
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FormBuilder/
│   │   │   │   ├── FormBuilder.tsx     # Form designer
│   │   │   │   └── FieldEditor.tsx     # Field configuration
│   │   │   ├── FormRenderer/
│   │   │   │   ├── FormRenderer.tsx    # Form display
│   │   │   │   └── FieldRenderer.tsx   # Field rendering
│   │   │   └── shared/
│   │   │       └── Navbar.tsx
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── BuilderPage.tsx
│   │   │   └── RendererPage.tsx
│   │   ├── types/
│   │   │   └── index.ts         # TypeScript definitions
│   │   ├── utils/
│   │   │   └── logicEngine.ts   # Conditional logic engine
│   │   ├── api/
│   │   │   └── client.ts        # Axios API client
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## 🎯 Usage Guide

### Creating a Form

1. Navigate to **Form Builder** page
2. Enter form title and description
3. Click **"+ Add Field"** to add fields
4. For each field, configure:
   - Field ID (unique identifier)
   - Label (display name)
   - Type (text, number, select, radio_group, video_upload)
   - Required status
   - Options (for select/radio fields)
   - Data Source (e.g., `/metadata/branches` for dynamic data)
5. Add **Logic Rules** (optional):
   - When: Select a previous field
   - Operator: Choose comparison (equals, greater than, etc.)
   - Value: Enter comparison value
   - Action: Show, Hide, Require, or Highlight
   - Color: Pick highlight color (for highlight action)
6. Click **"Create Form"** to save

### Filling Out a Form

1. Navigate to **Fill Form** page
2. Select a form from the list
3. Select your branch
4. Fill in all required fields
5. Upload videos if needed (automatic upload on file selection)
6. Submit the form

### Logic Rules Examples

**Hide field when another is empty:**
- When: "employee_name" equals "" → Hide "department"

**Require safety gear when hazard level is high:**
- When: "hazard_level" greater than 5 → Require "safety_equipment"

**Highlight urgent issues:**
- When: "priority" equals "High" → Highlight (orange background)

## 🔌 API Endpoints

### Metadata
```
GET /metadata/branches
```
Returns list of all branches

### Forms
```
POST /forms/definitions
Body: { title, description, field_schema }
```
Create a new form template

```
GET /forms/definitions
```
List all form templates

```
GET /forms/definitions/{form_id}
```
Get specific form template

```
POST /forms/{form_id}/submission
Body: { branch_id, submission_data }
```
Submit form data

### Uploads
```
POST /upload/video
Body: FormData with 'file' field
```
Upload a video file (max 100MB)

## 🔧 Configuration

### Backend Environment Variables (.env)
```env
DB_USER=postgres          # Database username
DB_PASSWORD=password      # Database password
DB_HOST=localhost         # Database host
DB_PORT=5432             # Database port
DB_NAME=safety_forms     # Database name
```

### Frontend API Configuration
Update `frontend/src/api/client.ts` to change the API base URL if needed.

## 🗄️ Database Schema

### Branches
- id (UUID, Primary Key)
- name (String)
- location (String)
- created_at (Timestamp)

### FormDefinitions
- id (UUID, Primary Key)
- title (String)
- description (Text)
- field_schema (JSONB)
- version (Integer)
- created_at (Timestamp)
- updated_at (Timestamp)

### FormSubmissions
- id (UUID, Primary Key)
- form_id (UUID, Foreign Key → FormDefinitions)
- branch_id (UUID, Foreign Key → Branches)
- submission_data (JSONB)
- submitted_at (Timestamp)

## 🧪 Testing

### Seeding Test Data
```bash
cd backend
python seed_data.py
```
This adds 5 sample branches to the database.

### Manual API Testing
Visit `http://localhost:8000/docs` for interactive API documentation.

## 🚦 Common Issues & Solutions

**Database connection error:**
- Verify PostgreSQL is running
- Check .env credentials
- Ensure database exists

**File upload fails:**
- Check `uploads/videos/` directory exists
- Verify permissions on directory
- Ensure file is under 100MB
- Check file has valid video extension

**Logic rules not working:**
- Ensure referenced field comes before dependent field
- Check field IDs match exactly
- Verify operator and value types match

## 📦 Dependencies

### Backend
- fastapi - Web framework
- uvicorn - ASGI server
- sqlalchemy - ORM
- psycopg2-binary - PostgreSQL adapter
- python-dotenv - Environment variables
- pydantic - Data validation
- python-multipart - File upload support

### Frontend
- React 18
- TypeScript
- React Router - Routing
- React Hook Form - Form handling
- Axios - HTTP client
- Tailwind CSS - Styling
- Vite - Build tool

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

Safety Form Engine Development Team

## 🙏 Acknowledgments

Built with FastAPI, React, PostgreSQL, and modern web technologies.
```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

### API Documentation

Once the server is running, you can access:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### Form Metadata
- `POST /api/metadata/` - Create new form metadata
- `GET /api/metadata/` - Get all form metadata
- `GET /api/metadata/{form_id}` - Get specific form metadata
- `PUT /api/metadata/{form_id}` - Update form metadata
- `DELETE /api/metadata/{form_id}` - Delete form metadata

### Form Submissions
- `POST /api/forms/` - Create new form submission
- `GET /api/forms/` - Get all form submissions
- `GET /api/forms/{submission_id}` - Get specific submission
- `PUT /api/forms/{submission_id}` - Update submission
- `DELETE /api/forms/{submission_id}` - Delete submission

## Features

- **Dynamic Form Management**: Create and manage form metadata with custom schemas
- **Form Submissions**: Handle form submissions with various statuses (draft, submitted, approved, rejected)
- **RESTful API**: Clean and well-documented API endpoints
- **Database Support**: SQLite by default, easily configurable for PostgreSQL
- **CORS Enabled**: Ready for frontend integration

## Environment Variables

Configure the following in the `.env` file:
- `DATABASE_URL`: Database connection string
- `API_HOST`: API host address
- `API_PORT`: API port number
- `SECRET_KEY`: Secret key for security features
- `ALGORITHM`: Algorithm for token encoding
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Token expiration time

## Development

The backend is built with:
- **FastAPI**: Modern, fast web framework
- **SQLAlchemy**: SQL toolkit and ORM
- **Pydantic**: Data validation using Python type annotations
- **Uvicorn**: ASGI server

## License

MIT
