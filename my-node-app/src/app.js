const express = require('express');
const bodyParser = require('body-parser');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use('/api', taskRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
