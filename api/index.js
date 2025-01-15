const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

// DB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connected successfully'))
  .catch((err) => console.error('Database connection failed:', err));

// Routes
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const switchRoutes = require('./routes/switchRoutes');
const switchImageRoutes = require('./routes/switchImageRoutes');
const pricingRoutes = require('./routes/pricingRoutes'); // Add pricing routes
const affiliateRoutes = require('./routes/affiliateRoutes'); // Add affiliate routes

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/switches', switchRoutes);
app.use('/api/switch-images', switchImageRoutes);
app.use('/api/pricing', pricingRoutes); // Mount pricing routes
app.use('/api/affiliate-links', affiliateRoutes); // Mount affiliate routes

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
