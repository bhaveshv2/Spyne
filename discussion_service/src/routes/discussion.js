const express = require('express');
const router = express.Router();
const discussionController = require('../controllers/discussionController');
const authMiddleware = require('../middleware/auth');

// Create a new discussion
router.post('/', authMiddleware, discussionController.createDiscussion);

// Update a discussion
router.put('/:discussionId', authMiddleware, discussionController.updateDiscussion);

// Delete a discussion
router.delete('/:discussionId', authMiddleware, discussionController.deleteDiscussion);

// Comment on a discussion
router.post('/:discussionId/comment', authMiddleware, discussionController.commentOnDiscussion);

// Update a comment
router.put('/:discussionId/comment/:commentId', authMiddleware, discussionController.updateComment);

// Delete a comment
router.delete('/:discussionId/comment/:commentId', authMiddleware, discussionController.deleteComment);

// Like a discussion
router.post('/:discussionId/like', authMiddleware, discussionController.likeDiscussion);

// Unlike a discussion
router.post('/:discussionId/unlike', authMiddleware, discussionController.unlikeDiscussion);

// Like a comment
router.post('/:discussionId/comment/:commentId/like', authMiddleware, discussionController.likeComment);

// Reply to a comment
router.post('/:discussionId/comment/:commentId/reply', authMiddleware, discussionController.replyToComment);

// Like a reply
router.post('/:discussionId/comment/:commentId/reply/:replyId/like', authMiddleware, discussionController.likeReply);

// Increment view count
router.post('/:discussionId/view', discussionController.incrementViewCount);

// Search discussions by text
router.get('/search', discussionController.searchDiscussionsByText);

// Search discussions by hashtags
router.get('/hashtags', discussionController.searchDiscussionsByHashtags);

module.exports = router;
