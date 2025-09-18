# Nexus Draw

<img width="1504" height="777" alt="image" src="https://github.com/user-attachments/assets/7aa3bb91-ed12-4629-93a5-ec92bfe243d2" />
<img width="1619" height="856" alt="image" src="https://github.com/user-attachments/assets/68cfb70f-40ae-420f-8ec2-a036409c8500" />


## Table of Contents

- [Overview](#overview)
- [Features](#-features)
- [Tech Stack](#tech-stack)
- [Monorepo Structure](#monorepo-structure)
- [Apps](#apps)
- [Packages](#packages)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Deployment](#deployment)
- [API Endpoints](#api-endpoints-http-back-end)


---

## Overview
NexusDraw is a real-time collaborative online whiteboard that allows multiple users to draw, annotate, and interact on the same canvas simultaneously. It’s designed for seamless teamwork, offering a smooth interface, live synchronization, and persistent storage to ensure that no work is lost. The platform combines modern frontend technologies like Next.js and Tailwind CSS with a robust backend using Node.js, Express, WebSockets, and PostgreSQL, making it scalable, secure, and responsive.



---


## 🚀 Features

* 🖊️ **Drawing Tools**: Easily switch between a **Pencil** for freehand drawing, and structured shapes like **Rectangle**, **Circle**, and **Arrow**. The **Text** tool allows you to add annotations and notes to your canvas.

* ↩️ **Undo/Redo**: Never worry about mistakes. Our intuitive undo and redo functionality lets you step backward and forward through your drawing history with a single click.

* ⚡ **Real-time Collaboration**: Powered by WebSockets, NexusDraw provides instant updates to all connected users. When one person draws, everyone else sees it appear on their screen with virtually no delay, making it feel like you're in the same room.

* 💾 **Persistent Storage**: All drawing data is automatically saved to a **PostgreSQL** database using **Prisma ORM**. This ensures your work is never lost and you can return to a session exactly where you left off.

* 🎨 **Modern UI**: The user interface is built with **Next.js 15**, styled with **Tailwind CSS v4** for rapid development, and enhanced with beautiful, accessible components from **ShadCN UI**.

* 🔒 **Secure Backend**: A robust backend, built with **Node.js** and **Express.js**, handles all drawing and user data with a focus on security and performance.


## Tech Stack

- **Front-End:** Next.js (React, TypeScript)
- **Back-End:** Express (Node.js, TypeScript)
- **WebSocket:** Node.js (for real-time drawing/chat)
- **Database:** PostgreSQL (via Prisma ORM)
- **Monorepo Management:** pnpm workspaces
- **Deployment:** Vercel (front-end), Railway/Render (back-end)
- **Shared Packages:** TypeScript config, Prisma client, common types

---

## Monorepo Structure

```
draw-project/
│
├── apps/
│   ├── front-end/         # Next.js app (React, TypeScript)
│   ├── http-backend/      # Express API server (TypeScript)
│   └── ws-backend/        # WebSocket server (Node.js, TypeScript)
│
├── packages/
│   ├── backend-common/    # Shared backend config/utilities
│   ├── common/            # Shared types/schemas
│   ├── db/                # Prisma client/database logic
│   └── typescript-config/ # Shared TypeScript config
│
├── pnpm-workspace.yaml    # pnpm workspace config
└── ...
```

---

## Apps

### Front-End (`apps/front-end`)
- Built with Next.js and TypeScript.
- Handles UI, drawing canvas, chat, and room management.
- Reads backend URLs from environment variables.

### HTTP Back-End (`apps/http-backend`)
- Express server with TypeScript.
- Handles authentication, room management, and chat APIs.
- Uses Prisma ORM for database access.
- Shares code with packages via pnpm workspaces.

### WebSocket Back-End (`apps/ws-backend`)
- Handles real-time drawing and chat updates via WebSocket.

---

## Packages

- **backend-common:** Shared backend config (e.g., JWT secret).
- **common:** Shared types and validation schemas.
- **db:** Prisma client and database logic.
- **typescript-config:** Shared TypeScript configuration.

---

## Environment Variables

### Front-End (Vercel)
- `NEXT_PUBLIC_API_URL` — URL of the HTTP backend.
- `NEXT_PUBLIC_WS_URL` — URL of the WebSocket backend.

### Back-End (Railway/Render)
- `DATABASE_URL` — PostgreSQL connection string.
- `JWT_SECRET` — Secret for JWT authentication.
- `PORT` — Port to run the server (default: 8080).

---

## Development

1. **Install dependencies (from repo root):**
   ```sh
   pnpm install
   ```

2. **Build all packages:**
   ```sh
   pnpm run build
   ```

3. **Start the back-end:**
   ```sh
   cd apps/http-backend
   pnpm start
   ```

4. **Start the front-end:**
   ```sh
   cd apps/front-end
   pnpm dev
   ```

---

## Deployment

### Front-End (Vercel)
- Import the repo in Vercel.
- Set project root to `apps/front-end`.
- Set environment variables: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_WS_URL`.

### Back-End (Railway/Render)
- Set root directory to `apps/http-backend`.
- Build command: `pnpm install --frozen-lockfile && pnpm run build`
- Start command: `pnpm start`
- Set environment variables: `DATABASE_URL`, `JWT_SECRET`, `PORT`.

---

## API Endpoints (HTTP Back-End)

| Method | Endpoint         | Description                  |
|--------|------------------|-----------------------------|
| GET    | `/health`        | Health check                |
| POST   | `/signup`        | User registration           |
| POST   | `/signin`        | User login (returns JWT)    |
| POST   | `/room`          | Create a new room           |
| GET    | `/chats/:id`     | Get last 50 chat messages   |
| GET    | `/rooms`         | List all rooms              |

---

