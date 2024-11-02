const express = require('express');
const { registerUser, loginUser, createTask, filterTasks } = require('../controllers/taskController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/tasks', createTask);
router.get('/tasks/filter/:filterOption', filterTasks);

module.exports = router;
