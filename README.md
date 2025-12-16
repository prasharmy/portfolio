# Portfolio with Comments and Ratings Feature

This portfolio website includes a comments and ratings system that stores data in MongoDB.

## Features

- **Comments and Ratings**: Users can leave comments with star ratings (1-5 stars)
- **Statistics**: Display total number of comments and average rating
- **Database Storage**: All comments are stored in MongoDB
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works on all device sizes
- **Real-time Updates**: Comments update automatically after submission

## Project Structure

```
portfolio/
├── index.html          # Main portfolio page
├── style.css           # Styling
├── comments.js         # Frontend comments functionality
├── email.js            # EmailJS integration
├── server.js           # Node.js/Express backend
├── package.json        # Project dependencies
├── .env                # Environment variables
├── blogs.html          # Blog page
├── projects.html       # Projects page
└── email.html          # Email page
```

## Prerequisites

1. **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
2. **MongoDB** - One of:
   - **Local MongoDB**: [Download](https://www.mongodb.com/try/download/community)
   - **MongoDB Atlas** (Cloud): [Free account](https://www.mongodb.com/cloud/atlas)

## Installation and Setup

### Step 1: Install Node.js Dependencies

```bash
cd d:\porfolio
npm install
```

This will install:
- `express`: Web framework
- `mongoose`: MongoDB object modeling
- `cors`: Enable cross-origin requests
- `dotenv`: Environment variable management
- `nodemon`: Development auto-reload (optional)

### Step 2: Set Up MongoDB

#### Option A: Local MongoDB Installation

1. Install MongoDB Community Edition from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
   - **Windows**: MongoDB service starts automatically (check Services)
   - **macOS**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongod`

#### Option B: MongoDB Atlas (Cloud - Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and sign in
3. Create a new cluster (free tier available)
4. Get your connection string
5. Update the `.env` file with your connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio
   PORT=5000
   ```

### Step 3: Start the Server

In the portfolio directory, run:

```bash
npm start
```

You should see:
```
MongoDB connected
Server running on port 5000
```

## Using the Comments Feature

### For Users:

1. Open `index.html` in your browser
2. Scroll to the "Comments & Ratings" section
3. Fill in:
   - **Your Name**: Enter your name
   - **Your Email**: Enter your email address
   - **Rating**: Click on stars (1-5) to rate
   - **Comment**: Write your comment
4. Click "Submit Comment"
5. Your comment appears in the list below automatically

### Features:

- ⭐ **Star Rating System**: Interactive 5-star rating system with hover effects
- 📊 **Statistics**: View total reviews and average rating in real-time
- 🎨 **Dark Mode**: Comments section respects the dark mode toggle
- 📱 **Responsive**: Works perfectly on mobile and desktop

## API Endpoints

The backend provides the following REST API endpoints:

### GET `/api/comments`
Retrieves all comments sorted by newest first

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Great portfolio!",
    "rating": 5,
    "createdAt": "2025-12-11T10:30:00.000Z"
  }
]
```

### POST `/api/comments`
Creates a new comment

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Great portfolio!",
  "rating": 5
}
```

**Response:** Returns the created comment object

### GET `/api/comments/count`
Gets comment count and average rating

**Response:**
```json
{
  "count": 5,
  "avgRating": "4.6"
}
```

### DELETE `/api/comments/:id`
Deletes a specific comment (for admin use)

**Response:**
```json
{
  "message": "Comment deleted"
}
```

## Environment Variables

The `.env` file contains:

```
MONGODB_URI=mongodb://localhost:27017/portfolio
PORT=5000
```

- `MONGODB_URI`: MongoDB connection string
- `PORT`: Server port (default: 5000)

## Troubleshooting

### MongoDB Connection Error

**Error:** `MongoDB connection error`

**Solution:**
- Ensure MongoDB is running
- For local MongoDB: Check if `mongod` process is running
- For MongoDB Atlas: Verify connection string in `.env`
- Check network connectivity

### Comments not loading

**Error:** `Error loading comments. Make sure the server is running on http://localhost:5000`

**Solution:**
- Verify server is running with `npm start`
- Check browser console (F12) for errors
- Ensure MongoDB is connected
- Check if port 5000 is already in use

### CORS Error

**Error:** `Cross-Origin Request Blocked`

**Solution:**
- Server has CORS enabled by default
- If using a different domain, update the `API_URL` in `comments.js`

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Find and kill process using port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

Or change port in `.env`:
```
PORT=5001
```

And update `API_URL` in `comments.js`:
```javascript
const API_URL = 'http://localhost:5001/api';
```

## File Descriptions

### `server.js`
- Node.js/Express server
- MongoDB schema definition for comments
- REST API endpoints
- CORS and middleware configuration

### `comments.js`
- Frontend JavaScript for comments functionality
- Star rating interaction
- Form submission handler
- Comments loading and display
- HTML escaping for security

### `style.css`
- Styling for comments section
- Star rating visual styles
- Dark mode support
- Responsive design
- Comment card styling

### `index.html`
- Comments and ratings section HTML
- Star rating input UI
- Comments list container
- Form structure

## Security Considerations

1. **Input Validation**: All inputs are validated on both frontend and backend
2. **HTML Escaping**: Comments are escaped to prevent XSS attacks
3. **Environment Variables**: Sensitive data stored in `.env` (not in code)
4. **CORS**: Configured to accept requests from your domain

## Performance Optimization

- Comments are cached and loaded on page load
- Efficient database queries with sorting
- Lazy loading of comments
- Minimal re-renders

## Future Enhancements

- User authentication
- Admin panel for comment moderation
- Comment editing/deletion by users
- Spam detection
- Comment threading/replies
- Email notifications for new comments
- Comment search and filtering
- Social sharing of comments

## License

MIT License - Feel free to use and modify

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Check browser console (F12) for error messages
3. Check server console for backend errors
4. Verify MongoDB connection

---

**Created by**: Prashanth Kulkarni
**Date**: December 2025
