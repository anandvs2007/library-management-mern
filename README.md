# Library Book Management (MERN)

A full-stack catalogue where a librarian can add, edit, delete, issue and return books.

- **Live app:** _add your frontend link_
- **API:** _add your Render link_
- **Repository:** _add your GitHub link_

## Problem statement
Small libraries often track books on paper, so it is hard to know which titles are available. This app lets staff catalogue books and issue or return them so availability is always up to date.

## Users
One role: the **librarian**, who can add, edit, delete, issue and return books.

## Scope
**Must have:** CRUD for books; Issue / Return buttons that change the copies count; Issue blocked at 0 copies.
**Later:** search, member accounts, due dates.

## User stories
1. As a librarian, I want to add a book so that it appears in the catalogue. _Title, author and ISBN are required; a duplicate ISBN shows a clear error; the new book appears without a refresh._
2. As a librarian, I want to issue a book so that availability stays accurate. _Copies drop by 1; Issue is disabled at 0._
3. As a librarian, I want to delete a book so that old titles do not clutter the list. _A confirmation is shown first._

## Tech stack
React (Vite), React Router, Material UI, Axios, Node.js, Express, MongoDB Atlas, Mongoose

## Project structure
```
client/src/  components/  pages/  services/ (all API calls)
server/src/  routes/  controllers/  models/  middleware/  config/
```

## Data model: Book
`title`, `author`, `isbn` (unique), `genre`, `copiesAvailable` (0 or more), `shelfLocation`, timestamps.

## API
| Method | Endpoint | Purpose | Success | Errors |
|---|---|---|---|---|
| GET | /api/books?page=1&limit=10 | List books (paged, max 50) | 200 | |
| GET | /api/books/:id | Get one book | 200 | 400, 404 |
| POST | /api/books | Add a book | 201 | 400, 409 duplicate ISBN |
| PUT | /api/books/:id | Update a book | 200 | 400, 404, 409 |
| DELETE | /api/books/:id | Delete a book | 200 | 400, 404 |
| PATCH | /api/books/:id/issue | Copies −1 | 200 | 400 no copies, 404 |
| PATCH | /api/books/:id/return | Copies +1 | 200 | 400, 404 |

## Environment variables
| App | Variable | Meaning |
|---|---|---|
| server | `PORT` | Port the API listens on |
| server | `MONGODB_URI` | MongoDB Atlas connection string |
| server | `CLIENT_URL` | Allowed frontend origin (no trailing slash) |
| client | `VITE_API_URL` | API base URL, ending in `/api` |

## Run locally
```bash
# terminal 1 - API
cd server
cp .env.example .env     # on Windows: copy .env.example .env  (then fill in the values)
npm install
npm run dev              # http://localhost:5000

# terminal 2 - frontend
cd client
cp .env.example .env
npm install
npm run dev              # http://localhost:5173
```

## Deployment
- **Database:** MongoDB Atlas (dedicated database user, network access allowed for the host).
- **API:** Render Web Service, root `server`, build `npm install`, start `npm start`, set `MONGODB_URI` and `CLIENT_URL` (your live frontend URL).
- **Frontend:** Render Static Site (or Vercel/Netlify), root `client`, build `npm run build`, publish `dist`, set `VITE_API_URL`. Add a rewrite `/*` → `/index.html` so page refreshes work.

## Testing
_Add your test table here: what you tested, expected result, actual result._

## Screenshots
_Add Dashboard, Add form, Edit form, delete confirmation, and a mobile view._

## Known limitations
- No login: anyone with the link can change the catalogue.
- No search or filtering yet.
- Free hosting can sleep, so the first request may be slow.
