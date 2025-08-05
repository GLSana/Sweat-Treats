# Vercel Backend Fix - Technical Implementation Plan

## Problem Analysis

Your Sweet Treats app frontend is working on Vercel, but the backend API calls are failing with 404 and connection errors. The issues are:

1. **Incorrect Vercel Configuration**: Current `vercel.json` tries to use `server.js` directly, but Vercel requires serverless functions in `/api` directory
2. **SQLite Database Issue**: SQLite doesn't work in Vercel's serverless environment (ephemeral filesystem)
3. **API Routing Structure**: Need to restructure API endpoints for Vercel's serverless architecture

## Solution Architecture

### 1. Vercel Serverless Functions Structure
Create individual serverless functions in `/api` directory:
- `/api/ingredients.js` - Handle ingredients CRUD operations
- `/api/cakes.js` - Handle cakes CRUD operations  
- `/api/analytics.js` - Handle analytics data
- `/api/db.js` - Shared database utilities

### 2. Database Solution for Vercel
Since SQLite doesn't work in serverless environment, we have two options:
- **Option A**: Use in-memory storage with JSON files (simple, free)
- **Option B**: Use external database like PlanetScale or Supabase (more robust)

For immediate fix, we'll use **Option A** with JSON file storage.

### 3. Updated Vercel Configuration
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/dist/$1"
    }
  ]
}
```

## Implementation Steps

### Step 1: Create Serverless API Functions

#### `/api/ingredients.js`
```javascript
import { getIngredients, createIngredient, updateIngredient, deleteIngredient } from './db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    switch (req.method) {
      case 'GET':
        const ingredients = await getIngredients();
        return res.json(ingredients);
      
      case 'POST':
        const newIngredient = await createIngredient(req.body);
        return res.status(201).json(newIngredient);
      
      case 'PUT':
        // Handle update logic
        break;
      
      case 'DELETE':
        // Handle delete logic
        break;
      
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
```

#### `/api/cakes.js`
Similar structure for cakes operations

#### `/api/analytics.js`
Similar structure for analytics operations

#### `/api/db.js`
Shared database utilities using JSON file storage:
```javascript
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const DATA_DIR = '/tmp';
const INGREDIENTS_FILE = path.join(DATA_DIR, 'ingredients.json');
const CAKES_FILE = path.join(DATA_DIR, 'cakes.json');

// Initialize data files with sample data
export const initializeData = () => {
  if (!fs.existsSync(INGREDIENTS_FILE)) {
    const sampleIngredients = [
      {
        id: uuidv4(),
        name: 'All Purpose Flour',
        unit: 'g',
        costPerUnit: 450,
        packageSize: 1000,
        notes: 'Premium quality flour',
        category: 'Dry Ingredients',
        createdAt: new Date().toISOString()
      },
      // ... more sample data
    ];
    fs.writeFileSync(INGREDIENTS_FILE, JSON.stringify(sampleIngredients, null, 2));
  }
  
  if (!fs.existsSync(CAKES_FILE)) {
    fs.writeFileSync(CAKES_FILE, JSON.stringify([], null, 2));
  }
};

export const getIngredients = () => {
  initializeData();
  const data = fs.readFileSync(INGREDIENTS_FILE, 'utf8');
  return JSON.parse(data);
};

// ... other database functions
```

### Step 2: Update Frontend API Configuration

Update `src/config/api.ts`:
```typescript
const getApiBaseUrl = () => {
  // Always use relative URLs for Vercel
  return '/api';
};

export const API_BASE_URL = getApiBaseUrl();
```

### Step 3: Update Vercel Configuration

Replace current `vercel.json` with simplified version that only handles static build and API routing.

### Step 4: Update Package.json Scripts

Ensure build scripts work correctly:
```json
{
  "scripts": {
    "build": "vite build",
    "vercel-build": "npm run build"
  }
}
```

## Testing Strategy

1. **Local Testing**: Test serverless functions locally using Vercel CLI
2. **Deployment Testing**: Deploy to Vercel and test all API endpoints
3. **Frontend Integration**: Verify frontend can communicate with backend APIs
4. **Data Persistence**: Ensure data persists across function calls

## Deployment Process

1. Create all serverless function files
2. Update configuration files
3. Test locally with `vercel dev`
4. Commit and push to GitHub
5. Vercel will auto-deploy
6. Test live deployment

## Expected Outcome

After implementation:
- ✅ Frontend loads correctly
- ✅ Backend API endpoints respond properly
- ✅ Dashboard shows actual data (ingredients, cakes, analytics)
- ✅ All CRUD operations work
- ✅ Data persists between requests
- ✅ No 404 or connection errors

## Alternative Database Solutions (Future Enhancement)

For production use, consider:
1. **Supabase** (PostgreSQL, free tier available)
2. **PlanetScale** (MySQL, free tier available)
3. **MongoDB Atlas** (NoSQL, free tier available)
4. **Vercel KV** (Redis-based, paid)

These provide better data persistence and scalability than JSON file storage.