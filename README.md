# KlickTools - AI Tools Discovery Platform

A beautiful, modern platform for discovering and exploring AI tools and utilities. Built with Next.js, TypeScript, Tailwind CSS, and MongoDB.

## 🚀 Features

- **AI Tools Discovery** - Browse and search through curated AI tools
- **Advanced Search** - Filter by category, pricing, rating, and more
- **User Authentication** - Secure login with NextAuth.js
- **User Dashboard** - Manage favorites, reviews, and preferences
- **Admin Panel** - Add, edit, and manage tools and users
- **Dark/Light Mode** - Beautiful theme switching
- **Responsive Design** - Works perfectly on all devices
- **Real-time Search** - Instant results with debounced search
- **Beautiful Animations** - GSAP and Framer Motion powered

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Custom CSS Variables
- **Animations**: GSAP, Framer Motion
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js (Credentials, Google, GitHub)
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd klicktools
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   ```

4. **Seed the database**
   ```bash
   npm run seed
   # or
   yarn seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your repository

3. **Configure Environment Variables**
   In Vercel dashboard, add these environment variables:
   - `MONGODB_URI`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (your vercel domain)
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your app

### Alternative Deployment Options

- **Netlify**: Similar process, good for Next.js
- **Railway**: Full-stack platform with MongoDB hosting
- **Render**: Good free tier with MongoDB support
- **DigitalOcean**: More control, requires more setup

## 🔧 Configuration

### MongoDB Setup
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Add to environment variables

### Authentication Setup
1. **Google OAuth**:
   - Go to Google Cloud Console
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs

2. **GitHub OAuth**:
   - Go to GitHub Developer Settings
   - Create OAuth App
   - Add callback URL

## 📱 Usage

### For Users
- Browse AI tools by category
- Search for specific tools
- Create an account to save favorites
- Leave reviews and ratings
- Toggle between dark/light mode

### For Admins
- Access admin dashboard at `/dashboard`
- Add new AI tools
- Manage users and roles
- View platform statistics
- Edit existing tools

## 🎨 Customization

### Colors and Themes
- Edit `app/globals.css` for color schemes
- Modify CSS variables for theme switching
- Update Tailwind config for custom colors

### Animations
- GSAP animations in `components/OnboardingScreen.tsx`
- Framer Motion in various components
- Custom keyframes in CSS

## 🔒 Security

- NextAuth.js for secure authentication
- MongoDB with proper indexing
- Environment variables for sensitive data
- HTTPS enforced in production
- XSS protection headers

## 📊 Performance

- Next.js 14 App Router
- Optimized images and fonts
- Code splitting and lazy loading
- CDN distribution via Vercel
- MongoDB connection pooling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the console for errors
2. Verify environment variables
3. Ensure MongoDB is connected
4. Check NextAuth configuration

## 🎯 Roadmap

- [ ] User-generated content
- [ ] Advanced analytics
- [ ] API for third-party integrations
- [ ] Mobile app
- [ ] More AI tool categories
- [ ] Community features

---

Built with ❤️ using Next.js and modern web technologies. 