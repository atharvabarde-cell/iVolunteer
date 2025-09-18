# Project Setup

This guide explains how to set up the backend locally for development and testing.

---

### 1. Prerequisites
Make sure you have the following installed:
- **Node.js:** v18+(check with `node -v`)
- **npm:** v9+(check with `npm -v`)
- **MongoDB:** Local instance or remote cluster
- **Git:** For cloning and version control

---

### 2. Fork the Repository
1. Navigate to the project’s GitHub page.
2. Click Fork (top-right) to create a personal copy under your GitHub account.

This keeps your changes isolated and makes it easy to open pull requests.

---

### 3. Clone Your Fork

```bash
git clone https://github.com/<your-username>/<repository-name>.git
cd <repository-name>/backend
```

---

### 4. Install Dependencies
```bash
cd backend
npm install 
```

--- 

### 5. Configure Environment Variables
Copy the example file and update values:

```bash
cp .env.example .env
```
Edit `.env` with the correct keys:
```bash
PORT=5000
MONGO_URI=mongodb://localhost:27017/your_db_name
ACCESS_TOKEN=your-secret-key
REFRESH_TOKEN=your-secret-key
NODE_ENV=development   # or "production"
```

---

### 6. Database Setup
- Local MongoDB: Make sure the service is running on port `27017`.
- Cloud MongoDB: Use your cluster connection string in `MONGO_URI`.

---

### 7. Start the Application
Development mode with hot reloading:
```bash
cd backend
npm run dev
```
The API will be accessible at `http://localhost:<PORT>` (default: `5000`).

---

### 8. Contribution Workflow
1. Create a new branch for each feature or bug fix:
```bash
git checkout -b feature/your-feature-name
```

2. Commit using [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
Example:
```bash
git commit -m "feat(auth): add login endpoint"
```

3. Before pushing or making pull request **Review** and **Test** your code.

4. Push your branch and open a Pull Request from your fork to the main repository.
