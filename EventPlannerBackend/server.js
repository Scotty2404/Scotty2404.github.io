require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const { router: authRoutes} = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB verbunden")
}).catch(err => console.log(err));

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

app.listen(5000, () => console.log("Server running on Port 5000"));