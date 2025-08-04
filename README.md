# 🍰 Sweet Treats Budget Planner

A comprehensive web application for planning cake budgets, tracking ingredient costs, and analyzing profitability for Sweet Treats cake business.

## ✨ Features

- **Cake Budget Planning**: Create detailed cake plans with ingredient costs
- **Ingredient Management**: Track ingredient costs, units, and categories
- **Profit Analysis**: Calculate profit margins and cost efficiency
- **Analytics Dashboard**: View meaningful insights and trends
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
       git clone <your-repo-url>
    cd sweet-treats-budget-planner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Start the backend server** (in a new terminal)
   ```bash
   npm start
   ```

5. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## 🌐 Deployment Options

### Option 1: Railway (Recommended - Free)

1. **Sign up for Railway**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy your app**
   - Connect your GitHub repository
   - Railway will automatically detect the Node.js app
   - Deploy with one click

3. **Your app will be live at**
   - `https://your-app-name.railway.app`

### Option 2: Render (Free Tier)

1. **Sign up for Render**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create a new Web Service**
   - Connect your GitHub repository
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

3. **Your app will be live at**
   - `https://your-app-name.onrender.com`

### Option 3: Vercel (Frontend Only)

For frontend-only deployment (you'll need a separate backend):

1. **Sign up for Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Deploy**
   - Import your repository
   - Vercel will auto-detect the React app

## 📊 Database

The app uses SQLite for data storage:
- **Local**: Database files are stored locally
- **Production**: Railway/Render will handle database persistence
- **Backup**: Use `npm run backup` to create database backups

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express, SQLite
- **Icons**: Lucide React
- **Database**: Better SQLite3

## 📱 Usage

1. **Add Ingredients**: Start by adding your cake ingredients with costs
2. **Plan Cakes**: Create cake plans with ingredient quantities
3. **View Analytics**: Analyze costs, profit margins, and trends
4. **Track Progress**: Monitor your cake business performance

## 🔧 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run backup` - Create database backup
- `npm run lint` - Run ESLint

## 📄 License

MIT License - feel free to use this project for your cake business!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Happy Cake Planning! 🎂** 
**Happy Baking! 🎂** 