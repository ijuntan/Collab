const express = require('express');
const path = require('path');

const app = express();

if(!process.env.PRODUCTION){
    require("dotenv").config();
}

// Serve static assets
app.use(express.static(path.join(__dirname, 'build')));

// Handle SPA fallback (for routers like Vue Router in history mode)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


//const PORT = process.env.PORT || 443;
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});