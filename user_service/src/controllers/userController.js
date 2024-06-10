const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.allUsers = async (req,res) =>{
    try{
        let users = await User.find({});
        if(!users){
            return res.status(404).json({message:'Internal Server Error - List all users'});
        }
        return res.status(200).json({users})
    }catch(error){
        res.status(500).json({ message: error.message });
    }
}

exports.createUser = async (req, res) => {
  const { name, mobile_no, email, password } = req.body;
  try {
    let user = await User.findOne({ $or: [{ mobile_no }, { email }] });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    user = new User({ name, mobile_no, email, password });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
    const { userId } = req.params;
    const { name, mobile_no, email, password } = req.body;
  
    try {
      let user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (name) user.name = name;
      if (mobile_no) user.mobile_no = mobile_no;
      if (email) user.email = email;
      if (password) user.password = password; // Password should be hashed in the model pre-save hook
  
      await user.save();
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      await User.findByIdAndDelete(userId);
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

exports.followUser = async (req, res) => {
    const { userId } = req.params;
    const { followId } = req.body;
  
    try {
      const user = await User.findById(userId);
      const followUser = await User.findById(followId);
  
      if (!user || !followUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (user.following.includes(followId)) {
        return res.status(400).json({ message: 'Already following this user' });
      }
  
      user.following.push(followId);
      followUser.followers.push(userId);
  
      await user.save();
      await followUser.save();
  
      res.status(200).json({ message: 'User followed successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

exports.unfollowUser = async (req, res) => {
    const { userId } = req.params;
    const { followId } = req.body;
  
    try {
      const user = await User.findById(userId);
      const followUser = await User.findById(followId);
  
      if (!user || !followUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (!user.following.includes(followId)) {
        return res.status(400).json({ message: 'Not following this user' });
      }
  
      user.following = user.following.filter(id => id.toString() !== followId);
      followUser.followers = followUser.followers.filter(id => id.toString() !== userId);
  
      await user.save();
      await followUser.save();
  
      res.status(200).json({ message: 'User unfollowed successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};
  
  
  