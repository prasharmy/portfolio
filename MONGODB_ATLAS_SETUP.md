# MongoDB Atlas Setup Guide

This guide helps you set up MongoDB Atlas (cloud database) for your portfolio comments feature.

## Why MongoDB Atlas?

✅ **Free**: Free tier with 512MB storage
✅ **No Installation**: Hosted in the cloud
✅ **Easy Setup**: Takes 5 minutes
✅ **Scalable**: Grows with your needs
✅ **Always Available**: 24/7 uptime

## Step-by-Step Setup

### 1. Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Sign Up Free"
3. Create account with email and password
4. Verify your email
5. Accept terms and click "Continue"

### 2. Create a New Project

1. Click "Create" on the left sidebar
2. Enter project name: "Portfolio"
3. Click "Create Project"
4. Click "Create a Deployment"

### 3. Create a Cluster

1. Select **M0 (Free)** tier
2. Choose cloud provider (AWS recommended)
3. Choose region closest to you
4. Click "Create Cluster"
5. Wait 1-2 minutes for cluster to be created

### 4. Create Database User

1. In left sidebar, click "Database Access" under "Security"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. **Username**: `admin`
5. **Password**: Create a strong password (save it!)
6. Click "Add User"

### 5. Add IP Whitelist

1. In left sidebar, click "Network Access" under "Security"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere"
4. Click "Confirm"

⚠️ **Note**: For production, add specific IPs instead of allowing all

### 6. Get Connection String

1. Click "Clusters" in left sidebar
2. Find your cluster, click "Connect"
3. Choose "Drivers"
4. Copy the connection string

The URL looks like:
```
mongodb+srv://admin:PASSWORD@cluster.mongodb.net/?retryWrites=true&w=majority
```

5. Replace `PASSWORD` with your actual password
6. Add database name at the end: `/portfolio`

Final URL:
```
mongodb+srv://admin:yourpassword@cluster.mongodb.net/portfolio?retryWrites=true&w=majority
```

### 7. Update Your Portfolio

1. Open `.env` file in portfolio folder
2. Replace the line:
```
MONGODB_URI=mongodb+srv://admin:yourpassword@cluster.mongodb.net/portfolio?retryWrites=true&w=majority
```

3. Replace `yourpassword` with your actual database password

4. Save the file

### 8. Start Your Server

```bash
cd d:\porfolio
npm install
npm start
```

You should see:
```
MongoDB connected
Server running on port 5000
```

✅ **Done!** Your portfolio now uses MongoDB Atlas!

## Testing Your Connection

1. Open `index.html` in browser
2. Submit a test comment
3. Check MongoDB Atlas:
   - Go to Clusters
   - Click "Browse Collections"
   - Navigate to: `portfolio` > `comments`
   - You should see your comment!

## Managing Your Database

### View Data in MongoDB Atlas

1. Click your cluster name
2. Click "Browse Collections"
3. Select `portfolio` database
4. Select `comments` collection
5. View all comments with timestamps and ratings

### Delete a Comment

1. Go to "Browse Collections"
2. Find the comment
3. Click the trash icon
4. Click "Delete"

### Export Data

1. Go to your cluster
2. Click "Data Export" (or "Backup" tab)
3. Choose what to export
4. Click "Export"

## Troubleshooting

### Connection Refused

**Error**: `MongoServerError: connect ECONNREFUSED`

**Solution**:
- Check `.env` has correct connection string
- Verify IP is whitelisted (Network Access)
- Check username and password are correct
- Wait 1-2 minutes for cluster initialization

### Authentication Failed

**Error**: `MongoAuthenticationError`

**Solution**:
- Double-check database password in connection string
- Make sure password doesn't have special characters (if it does, URL-encode them)
- Regenerate password in Database Access

### Database Not Found

**Error**: `MongoServerSelectionError`

**Solution**:
- Ensure cluster is fully created (green status)
- Check cluster name in connection string matches
- Verify region selection

## Connection String Format

```
mongodb+srv://[username]:[password]@[cluster-url]/[database]?retryWrites=true&w=majority
```

- `[username]`: `admin`
- `[password]`: Your database password
- `[cluster-url]`: From MongoDB Atlas console
- `[database]`: `portfolio`

## Security Best Practices

✅ **Do**:
- Keep your connection string secret
- Use `.env` file (never commit it to Git)
- Use strong passwords
- Restrict IP access in production

❌ **Don't**:
- Share connection string publicly
- Commit `.env` to GitHub
- Use "Allow Anywhere" in production
- Use simple passwords like "123456"

## Scaling Your Database

Free tier includes:
- 512 MB storage
- 100,000 API operations per month
- Unlimited read/write

Upgrade to paid plan for:
- More storage (GB+)
- Better performance
- More operations
- Dedicated support

## Backup Your Data

MongoDB Atlas automatically backs up daily. To restore:

1. Click "Backup" tab
2. Click "Restore" on a snapshot
3. Choose restore options
4. Click "Restore"

## Getting Help

- **MongoDB Documentation**: https://docs.mongodb.com/manual/
- **MongoDB Atlas Help**: https://docs.atlas.mongodb.com/
- **Support Forum**: https://www.mongodb.com/community/forums/

---

**Congratulations!** 🎉 Your portfolio now has a scalable cloud database!
