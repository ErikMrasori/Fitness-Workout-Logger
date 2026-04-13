# Fitness Workout Logger API

A complete REST API built with Node.js, Express.js, and SQLite for workout tracking.

## Run

```bash
npm install
cp .env.example .env
# optional: set DB_PATH in .env if you want a custom sqlite file location
npm run dev
```

Server runs on `http://localhost:3000`.

## Project Structure

- `routes/` → Express Router modules per resource
- `controllers/` → request handlers
- `middleware/` → auth, role, logging, validation, error handling
- `config/` → SQLite connection + table initialization
- `models/` → DB query layer
- `logs/requests.log` → asynchronous request logging

## Resources

- `POST /auth/register`
- `POST /auth/login`
- `GET|POST|PUT|PATCH|DELETE /users` (admin only)
- `GET|POST|PUT|PATCH|DELETE /workouts`
- `GET|POST|PUT|PATCH|DELETE /exercises`
- `GET|POST|PUT|PATCH|DELETE /logs`

## Auth & Authorization

- JWT bearer token required for all routes except `/auth/*`
- Roles: `admin`, `user`
- Admin can access all resources
- Users can only manage their own workouts/logs

## Notes for Postman

1. Register a user/admin with `/auth/register`
2. Login at `/auth/login` to get token
3. Set header: `Authorization: Bearer <token>`
4. All responses are JSON with `message` and optional `data`


## SQLite file location

- Default DB file: `./data/fitness.db` (auto-creates `data/` if missing).
- Optional override: set `DB_PATH` in `.env` (absolute or relative path).
