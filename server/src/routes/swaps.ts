import express from 'express';
import { AuthRequest } from '../middleware/auth';
import SkillSwap from '../models/SkillSwap';

const router = express.Router();

// @desc    Get all swaps for user (sent and received)
// @route   GET /api/swaps
// @access  Private
router.get('/', async (req: AuthRequest, res: express.Response) => {
  try {
    const userId = req.user._id;
    const swaps = await SkillSwap.find({
      $or: [{ requester: userId }, { provider: userId }]
    })
      .populate('requester provider skillOffered skillWanted')
      .exec();
    res.json({ success: true, data: swaps });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Create a new swap request
// @route   POST /api/swaps
// @access  Private
router.post('/', async (req: AuthRequest, res: express.Response) => {
  try {
    // Support public swap requests via isPublic flag
    const { provider, skillOffered, skillWanted, message, isPublic } = req.body;
    const requester = req.user._id;
    // Build creation payload
    const swapData: any = {
      requester,
      skillOffered,
      skillWanted,
      message,
      isPublic: Boolean(isPublic)
    };
    // Only include provider for non-public requests
    if (!isPublic) swapData.provider = provider;
    const swap = await SkillSwap.create(swapData);
    res.status(201).json({ success: true, data: swap });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Respond to a swap (accept or reject)
// @route   PUT /api/swaps/:id/respond
// @access  Private
router.put('/:id/respond', async (req: AuthRequest, res: express.Response) => {
  try {
    const { response } = req.body; // 'accept' or 'reject'
    const swap = await SkillSwap.findById(req.params.id);
    if (!swap) {
      return res.status(404).json({ success: false, message: 'Swap not found' });
    }
    // Only provider can respond
    if (swap.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    if (response === 'accept') {
      swap.status = 'accepted';
    } else if (response === 'reject') {
      swap.status = 'cancelled';
    }
    await swap.save();
    res.json({ success: true, data: swap });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
// @desc    Get all public swap requests
// @route   GET /api/swaps/public
// @access  Private
router.get('/public', async (req: AuthRequest, res: express.Response) => {
  try {
    const publicSwaps = await SkillSwap.find({ isPublic: true })
      .populate('requester skillOffered skillWanted')
      .exec();
    res.json({ success: true, data: publicSwaps });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
