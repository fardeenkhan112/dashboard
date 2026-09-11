# Berry Dashboard Admin Panel

A professional full-stack admin dashboard recreated from scratch and inspired by the layout and visual language of Berry Dashboard.

The application provides real MongoDB CRUD for Products and Categories plus Multer-based product image uploads.

## Stack

- React.js
- Vite (React build/dev tool)
- Tailwind CSS
- Node.js
- Express.js
- MongoDB
- Mongoose (MongoDB model/connection layer)
- Multer (image uploads)

**No TypeScript is used.** All application source files are JavaScript/JSX.

## Features

- Berry-inspired responsive admin layout
- Professional dashboard UI with light/dark theme toggle (saved in browser)
- Single global product search in the top navigation
- Dashboard overview with live MongoDB statistics
- Product CRUD
- Category CRUD
- Product/category search and filtering
- Product image upload with Multer
- Optional image replacement when editing a product
- Uploaded images served by Express
- Stock status indicators
- Category product counts
- Inventory value calculation
- Delete confirmation modal
- Form validation and API error messages
- Mobile sidebar and responsive tables
- Single Express server for development and production

## Structure

```text
/project-root
├── backend/
│   ├── controllers/
│   │   ├── categoryController.js
│   │   └── productController.js
│   ├── middleware/
│   │   └── upload.js
│   ├── models/
│   │   ├── Category.js
│   │   └── Product.js
│   ├── routes/
│   │   ├── categoryRoutes.js
│   │   ├── productRoutes.js
│   │   └── statsRoutes.js
│   ├── uploads/
│   ├── db.js
│   └── seed.js
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── server.js
├── vite.config.js
└── README.md
```

## 1. MongoDB setup

Create a MongoDB Atlas cluster or use a local MongoDB server.

For MongoDB Atlas:

1. Create a database user.
2. Create a database named `berry_dashboard` (or use another database name in the URI).
3. In Atlas Network Access, allow the IP address of the machine/server running the backend.
4. Copy the connection string.

Do not commit your real connection string to GitHub.

## 2. Environment variables

Create a `.env` file in the project root:

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/berry_dashboard?retryWrites=true&w=majority
PORT=3000
```

For a separate frontend deployment, you can also set:

```env
CORS_ORIGIN=https://your-frontend-domain.example
```

For a separate frontend build, create a frontend environment variable:

```env
VITE_API_URL=https://your-backend-domain.example/api
```

When frontend and backend are deployed together, the default `/api` URL is sufficient.

## 3. Install

From the project root:

```bash
npm install
```

## 4. Run locally

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

The server starts only after a valid MongoDB connection is established.

## 5. Optional sample data

The project includes `backend/seed.js`.

Run it only if you want sample categories and products:

```bash
node backend/seed.js
```

**Warning:** the seed script clears the existing Products and Categories collections before inserting sample data.

## API

### Products

```text
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

`POST` and `PUT` accept `multipart/form-data` with the image field named `image`.

### Categories

```text
GET    /api/categories
GET    /api/categories/:id
POST   /api/categories
PUT    /api/categories/:id
DELETE /api/categories/:id
```

A category cannot be deleted while products still use it. Reassign those products first.

### Dashboard

```text
GET /api/stats
GET /api/stats/db-status
GET /api/health
```

## Image uploads

Uploaded images are stored in:

```text
/backend/uploads
```

Express serves them from:

```text
/uploads/<filename>
```

Maximum upload size is 5MB.

Allowed image formats include JPEG, PNG, WebP, GIF and AVIF.

## Production build

Build the React application:

```bash
npm run build
```

Then set:

```text
NODE_ENV=production
```

and start:

```bash
npm start
```

On Windows PowerShell:

```powershell
$env:NODE_ENV="production"
npm start
```

The Express server serves the generated `dist` folder and the API from the same application.

## UI notes

The dashboard uses one global product search in the top navigation. The Products page keeps category and sorting controls without a duplicate search field. The Sun/Moon control switches between light and dark themes and remembers the selected theme in `localStorage`.

## GitHub checklist

Before pushing:

- Do not commit `.env`
- Do not commit `node_modules`
- Do not commit production secrets
- Keep `.env.example`
- Test `npm run build`
- Test Product CRUD
- Test Category CRUD
- Test image upload/replacement
- Test dashboard statistics
- Check browser console for errors

Example:

```bash
git init
git add .
git commit -m "Complete Berry dashboard admin panel"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY
git push -u origin main
```

## Deployment checklist

The deployment platform must support:

- Node.js
- Express
- MongoDB network access
- Persistent storage for `/backend/uploads` if uploaded images must survive server restarts

Set these production environment variables:

```text
MONGODB_URI=...
PORT=...
NODE_ENV=production
```

If the frontend is deployed separately, set:

```text
VITE_API_URL=https://YOUR-BACKEND-DOMAIN/api
```

and configure:

```text
CORS_ORIGIN=https://YOUR-FRONTEND-DOMAIN
```

After deployment, verify:

```text
/api/health
/api/stats
/api/products
/api/categories
```

Then test a real image upload and refresh the page to confirm the image remains accessible.

## Final submission

```text
Live Website:
YOUR_LIVE_WEBSITE_LINK

GitHub Repository:
YOUR_GITHUB_REPOSITORY_LINK
```
