import express from 'express';
import { AuthRequest } from '../middleware/auth';

const router = express.Router();

// @desc    Get all notifications
// @route   GET /api/notifications
// @access  Private
router.get('/', async (req: AuthRequest, res: express.Response) => {
  res.json({
    success: true,
    data: [],
    message: 'Notifications route - Coming soon'
  });
});

export default router;
