# Vue + Vercel + Postgres Todo App

A premium Todo application built with Vue 3, Vercel Serverless Functions, and Vercel Postgres.

## Features
- **Frontend**: Vue 3 + Vite + Vanilla CSS (Glassmorphism design).
- **Backend**: Vercel Serverless Functions (`/api`).
- **Database**: Vercel Postgres.

## Setup & Deployment

1.  **Push to GitHub**:
    ```bash
    git add .
    git commit -m "Initial commit"
    git push origin main
    ```

2.  **Vercel Deployment**:
    - The project should automatically deploy on Vercel if connected.
    - Ensure you have created a **Postgres Database** in the Vercel Storage tab and connected it to the project.

3.  **Initialize Database**:
    - Once deployed, visit `https://your-project.vercel.app/api/init` to create the `todos` table.
    - You should see `{"message":"Table created successfully"}`.

4.  **Use the App**:
    - Go to `https://your-project.vercel.app/` and start adding tasks!

## Local Development
To run locally with full API support, you need the Vercel CLI and to pull environment variables:

```bash
npm install -g vercel
vercel login
vercel link
vercel env pull .env.local
vercel dev
```
