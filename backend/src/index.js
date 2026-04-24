const express = require('express');
const cors = require('cors');
const bfhlRoutes = require('./routes/bfhlRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/bfhl', bfhlRoutes);

// Optional: Add a simple root GET route so clicking the root domain doesn't show "Cannot GET"
app.get('/', (req, res) => {
    res.json({ message: "BFHL API is running. Please send a POST request with your data to /bfhl." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
