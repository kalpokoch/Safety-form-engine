# Safety Form Engine

A dynamic form management system for safety inspections with conditional logic, multi-branch support, and video uploads.

## Live Deployment

- Frontend: https://safetyform.netlify.app/

## Features

**Backend**
- RESTful API with FastAPI and PostgreSQL
- Field types: text, number, select, radio_group, video_upload
- Form definition management and submission validation
- Video file uploads with 100MB limit
- Branch metadata endpoints

**Frontend**
- Visual form builder with field configuration
- Dynamic form renderer with real-time validation
- Conditional logic engine (show/hide fields, dynamic requirements, safety highlighting)
- Integration with backend API for data sources

## Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL 14+

## Local Setup

### Database

Create a PostgreSQL database:
```sql
CREATE DATABASE safety_forms;
```

### Backend

1. Navigate to backend directory:
```bash
cd backend
```

2. Create `.env` file:
```env
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=safety_forms
```

3. Install dependencies and seed database:
```bash
pip install -r requirements.txt
python seed_data.py
```

4. Run server:
```bash
uvicorn main:app --reload
```

Backend available at: http://localhost:8000  
API docs: http://localhost:8000/docs

### Frontend

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run development server:
```bash
npm run dev
```

Frontend available at: http://localhost:5173

## API Endpoints

**Metadata**
- `GET /metadata/branches` - List all branches

**Forms**
- `POST /forms/definitions` - Create form template
- `GET /forms/definitions` - List all forms
- `GET /forms/definitions/{form_id}` - Get specific form
- `POST /forms/{form_id}/submission` - Submit form data

**Uploads**
- `POST /upload/video` - Upload video file (max 100MB)

## Database Schema

**Branches**: id, name, location, created_at

**FormDefinitions**: id, title, description, field_schema (JSONB), version, created_at, updated_at

**FormSubmissions**: id, form_id, branch_id, submission_data (JSONB), submitted_at

## Usage

### Creating a Form

1. Navigate to Form Builder
2. Enter form title and description
3. Add fields with configuration:
   - Field ID, label, type, required status
   - Options for select/radio fields
   - Data source for dynamic data (e.g., `/metadata/branches`)
4. Add logic rules (optional):
   - Condition: field, operator, value
   - Action: show, hide, require, or highlight
5. Save the form

### Submitting a Form

1. Navigate to Fill Form
2. Select a form and branch
3. Complete all required fields
4. Upload videos if needed
5. Submit

### Logic Rules Examples

- Hide field when another is empty: `employee_name equals "" → Hide department`
- Require field based on value: `hazard_level > 5 → Require safety_equipment`
- Highlight urgent items: `priority equals "High" → Highlight (orange)`

## Project Structure

```
safety-form-engine/
├── backend/
│   ├── main.py              # FastAPI app
│   ├── database.py          # DB configuration
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas
│   ├── seed_data.py         # Database seeding
│   ├── routers/
│   │   ├── metadata.py      # Branch endpoints
│   │   ├── forms.py         # Form CRUD
│   │   └── uploads.py       # File uploads
│   └── uploads/videos/      # Video storage
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── api/             # API client
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Helper functions
│   └── package.json
└── README.md
```

## Dependencies

**Backend**: FastAPI, uvicorn, SQLAlchemy, psycopg2-binary, python-dotenv, pydantic

**Frontend**: React 18, TypeScript, React Router, React Hook Form, Axios, Tailwind CSS, Vite

## License

MIT License
