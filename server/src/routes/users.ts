import express from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';

const router = express.Router();

// @desc    Get all users
// @route   GET /api/users
// @access  Private
// @desc    Get all users
// @route   GET /api/users
// @access  Private
router.get('/', async (req: AuthRequest, res: express.Response) => {
  try {
    const users = await User.find()
      .select('-password -emailVerificationToken -passwordResetToken -passwordResetExpires')
      .populate('skillsOffered')
      .populate('skillsWanted')
      .exec();
    res.json({ success: true, data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
router.get('/:id', async (req: AuthRequest, res: express.Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
