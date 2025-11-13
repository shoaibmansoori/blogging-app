const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register
async function createUser(req, res) {
    const { username, email, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, email, password: hashedPassword });
      await user.save();
      const userData = await User.findOne({ email });
      if (!userData) return res.status(404).json({ message: 'User not found' });

  
      const token = jwt.sign({ id: userData._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.status(201).json({userData:userData,token:token});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Login
  async function login(req, res) {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      const token = jwt.sign({ id: user._id,email:email }, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


  module.exports = {createUser ,login}