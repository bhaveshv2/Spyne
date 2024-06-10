const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

// List All Users
router.get('/', userController.allUsers);

// Create a new user
router.post('/create', userController.createUser);

// User login
router.post('/login', userController.loginUser);

// Update user
router.put('/:userId', authMiddleware, userController.updateUser);

// Delete user
router.delete('/:userId', authMiddleware, userController.deleteUser);

// Follow user
router.post('/:userId/follow', authMiddleware, userController.followUser);

// Unfollow user
router.post('/:userId/unfollow', authMiddleware, userController.unfollowUser);

module.exports = router;
