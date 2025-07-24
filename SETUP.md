# 🚀 KlickTools Backend Setup Guide

## 📋 Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- Yarn package manager

## 🔧 Step-by-Step Setup

### 1. Install Dependencies

```bash
yarn install
```

### 2. MongoDB Connection Setup

#### Option A: MongoDB Atlas (Recommended)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a new cluster (free tier works fine)
3. Create a database user with read/write permissions
4. Get your connection string
5. Add your IP address to the whitelist

#### Option B: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/klicktools`

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/klicktools?retryWrites=true&w=majority

# NextAuth Configuration
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=http://localhost:3001

# JWT Secret
JWT_SECRET=your-jwt-secret-key-here
```

### 4. Generate Secure Secrets

Generate secure random strings for your secrets:

```bash
# For NEXTAUTH_SECRET and JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5. Initialize Database

Run the setup script to create indexes and seed initial data:

```bash
yarn setup
```

This will:

- Create database indexes for better performance
- Create an admin user
- Seed the database with initial AI tools

### 6. Start Development Server

```bash
yarn dev
```

The application will be available at `http://localhost:3001`

## 🔑 Default Admin Credentials

After running the setup script, you can log in with:

- **Email**: `admin@klicktools.com`
- **Password**: `admin123`

**⚠️ Important**: Change these credentials after first login!

## 📊 Database Structure

### Collections Created

1. **users** - User accounts and authentication
2. **tools** - AI tools directory
3. **reviews** - User reviews and ratings

### Indexes Created

- Email and username uniqueness for users
- Tool name, category, and tag search optimization
- Review relationships and uniqueness

## 🛠 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Tools (Coming Soon)

- `GET /api/tools` - Get all tools
- `GET /api/tools/[id]` - Get specific tool
- `POST /api/tools` - Create new tool (admin only)
- `PUT /api/tools/[id]` - Update tool (admin only)
- `DELETE /api/tools/[id]` - Delete tool (admin only)

## 🔍 Troubleshooting

### Common Issues

1. **Connection Error**: Check your MongoDB URI and network access
2. **Authentication Error**: Verify username/password in connection string
3. **Port Already in Use**: Change port in `next.config.js` or kill existing process

### Debug Commands

```bash
# Check MongoDB connection
yarn setup

# View logs
yarn dev

# Reset database (if needed)
# Delete and recreate your MongoDB database
```

## 🚀 Next Steps

After successful setup:

1. **Test Authentication**: Try logging in with admin credentials
2. **Explore Tools**: Browse the seeded AI tools
3. **Add More Tools**: Use the admin interface to add more tools
4. **Customize**: Modify the design and add your own features

## 📞 Support

If you encounter any issues:

1. Check the console logs for error messages
2. Verify your environment variables
3. Ensure MongoDB is accessible
4. Check the troubleshooting section above

---

**Happy coding! 🎉** 