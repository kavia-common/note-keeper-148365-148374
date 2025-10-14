# Note Keeper Backend

Express REST API for creating, viewing, editing, and deleting notes.

- Framework: Express
- Port: 3001
- CORS: Enabled for http://localhost:3000
- Docs: Swagger UI at /docs and OpenAPI JSON at /openapi.json
- Storage: In-memory (Map). Structured for easy future DB integration.

## Run

- Development: npm run dev
- Production: npm start

The server starts at http://localhost:3001

## Endpoints

Base URL: http://localhost:3001

- GET / — Health check
- GET /notes — List all notes
- POST /notes — Create a new note
- GET /notes/:id — Get a note by ID
- PUT /notes/:id — Update a note by ID
- DELETE /notes/:id — Delete a note by ID

### Models

Note:
- id: string (UUID)
- title: string (required)
- content: string (required)
- createdAt: string (ISO date)
- updatedAt: string (ISO date)

### Examples

Create a note:
curl -sX POST http://localhost:3001/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"First Note","content":"This is a test"}'

List notes:
curl -s http://localhost:3001/notes

Get a note:
curl -s http://localhost:3001/notes/{id}

Update a note:
curl -sX PUT http://localhost:3001/notes/{id} \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated","content":"Updated body"}'

Delete a note:
curl -sX DELETE http://localhost:3001/notes/{id} -i

## Error Handling

- 400: Validation errors with message and errors[]
- 404: Note not found
- 500: Internal server error (generic)

## Future DB Integration

The storage layer is abstracted in src/models/noteStore.js. Replace its methods with DB calls while keeping the same public interface to avoid changes to routes.
