const Discussion = require('../models/Discussion');

exports.createDiscussion = async (req, res) => {
  const { text, image, hashtags } = req.body;
  const userId = req.user;

  try {
    const discussion = new Discussion({
      userId,
      text,
      image,
      hashtags,
    });

    await discussion.save();

    res.status(201).json(discussion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateDiscussion = async (req, res) => {
  const { discussionId } = req.params;
  const { text, image, hashtags } = req.body;
  const userId = req.user;

  try {
    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    if (discussion.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    discussion.text = text || discussion.text;
    discussion.image = image || discussion.image;
    discussion.hashtags = hashtags || discussion.hashtags;

    await discussion.save();
    res.status(200).json(discussion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteDiscussion = async (req, res) => {
  const { discussionId } = req.params;
  const userId = req.user;

  try {
    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    if (discussion.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await discussion.deleteOne();
    res.status(200).json({ message: 'Discussion deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.commentOnDiscussion = async (req, res) => {
  const { discussionId } = req.params;
  const { text } = req.body;
  const userId = req.user;

  try {
    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    const comment = {
      userId,
      text,
    };

    discussion.comments.push(comment);
    await discussion.save();

    res.status(201).json(discussion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.likeDiscussion = async (req, res) => {
  const { discussionId } = req.params;
  const userId = req.user;

  try {
    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    if (discussion.likes.includes(userId)) {
      return res.status(400).json({ message: 'Already liked this discussion' });
    }

    discussion.likes.push(userId);
    await discussion.save();

    res.status(200).json(discussion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.unlikeDiscussion = async (req, res) => {
  const { discussionId } = req.params;
  const userId = req.user;

  try {
    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    discussion.likes = discussion.likes.filter(id => id.toString() !== userId);
    await discussion.save();

    res.status(200).json(discussion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.likeComment = async (req, res) => {
  const { discussionId, commentId } = req.params;
  const userId = req.user;

  try {
    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    const comment = discussion.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.likes.includes(userId)) {
      return res.status(400).json({ message: 'Already liked this comment' });
    }

    comment.likes.push(userId);
    await discussion.save();

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.replyToComment = async (req, res) => {
  const { discussionId, commentId } = req.params;
  const { text } = req.body;
  const userId = req.user;

  try {
    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    const comment = discussion.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const reply = {
      userId,
      text,
    };

    comment.replies.push(reply);
    await discussion.save();

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.likeReply = async (req, res) => {
  const { discussionId, commentId, replyId } = req.params;
  const userId = req.user;

  try {
    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    const comment = discussion.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const reply = comment.replies.id(replyId);
    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    if (reply.likes.includes(userId)) {
      return res.status(400).json({ message: 'Already liked this reply' });
    }

    reply.likes.push(userId);
    await discussion.save();

    res.status(200).json(reply);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.incrementViewCount = async (req, res) => {
  const { discussionId } = req.params;

  try {
    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    discussion.views += 1;
    await discussion.save();

    res.status(200).json(discussion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchDiscussionsByText = async (req, res) => {
  const { text } = req.query;

  try {
    const discussions = await Discussion.find({ text: new RegExp(text, 'i') });
    res.status(200).json(discussions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchDiscussionsByHashtags = async (req, res) => {
  const { hashtags } = req.query;

  try {
    const discussions = await Discussion.find({ hashtags: { $in: hashtags.split(',') } });
    res.status(200).json(discussions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add methods to update and delete comments and replies as needed
exports.updateComment = async (req, res) => {
  const { discussionId, commentId } = req.params;
  const { text } = req.body;
  const userId = req.user;

  try {
    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    const comment = discussion.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    comment.text = text || comment.text;
    await discussion.save();

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  const { discussionId, commentId } = req.params;
  const userId = req.user;

  try {
    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    const comment = discussion.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    comment.deleteOne();
    await discussion.save();

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};