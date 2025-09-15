# Project Structure Documentation

## Overview
This document provides a clear explanation of the project structure, so that anyone can easily navigate and understand different modules.

---

```plaintext
backend/
│
├─ documentation/       # Project documentation (project_strcuture, design notes, API specs, etc.)
├─ node_modules/        # Installed npm packages (auto-generated)
│
├─ src/                 # All application source code
│  ├─ config/           # Place database or third-party settings here
│  ├─ controllers/      # Request/response handlers that interface with routes
│  ├─ middlewares/      # Express middleware (e.g., authentication, authorizRole)
│  ├─ models/           # Mongoose/MongoDB schema definitions
│  ├─ routes/           # API route definitions mapping endpoints to controllers
│  ├─ services/         # Core business logic, reusable across controllers
│  ├─ utils/            # Helper utilities (error handling, logging, etc.)
│  ├─ validators/       # Joi or other schema validators for request payloads
│  ├─ app.js            # Express application configuration
│  └─ server.js         # Entry point to start the HTTP server
│
├─ .env                 # Environment variables (do not commit dot env file)
├─ .env.example         # Template for required environment variables
├─ .gitignore           # Git ignore rules
├─ package.json         # Project metadata, scripts, and dependencies
└─ package-lock.json    # Locked dependency versions for reproducible builds

```