import express from 'express';
import Joi from 'joi';
import User from '../models/User';
import Skill from '../models/Skill';
import { AuthRequest } from '../middleware/auth';

const router = express.Router();

// Validation schemas
const skillSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  category: Joi.string().max(50).required(),
  level: Joi.string().valid('Beginner', 'Intermediate', 'Advanced', 'Expert').required(),
  description: Joi.string().max(500).required(),
  tags: Joi.array().items(Joi.string().max(30)).max(10).optional(),
  type: Joi.string().valid('offered', 'wanted').required()
});

// @desc    Get all skills (with filters)
// @route   GET /api/skills
// @access  Private
router.get('/', async (req: AuthRequest, res: express.Response) => {
  try {
    const {
      q,
      category,
      level,
      location,
      type,
      page = 1,
      limit = 10
    } = req.query;

    const query: any = {};

    // Text search
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q as string, 'i')] } }
      ];
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by level
    if (level) {
      query.level = level;
    }

    // Filter by type
    if (type) {
      query.type = type;
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const skills = await Skill.find(query)
      .populate('userId', 'name role avatar location rating')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const totalSkills = await Skill.countDocuments(query);

    res.json({
      success: true,
      data: skills,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalSkills / limitNum),
        totalItems: totalSkills
      }
    });

  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching skills'
    });
  }
});

// @desc    Get user's skills
// @route   GET /api/skills/my-skills
// @access  Private
router.get('/my-skills', async (req: AuthRequest, res: express.Response) => {
  try {
    const { type } = req.query;
    const query: any = { userId: req.user?._id };

    if (type) {
      query.type = type;
    }

    const skills = await Skill.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: skills
    });

  } catch (error) {
    console.error('Get my skills error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching your skills'
    });
  }
});

// @desc    Create new skill
// @route   POST /api/skills
// @access  Private
router.post('/', async (req: AuthRequest, res: express.Response) => {
  try {
    const { error, value } = skillSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const skill = await Skill.create({
      ...value,
      userId: req.user?._id
    });

    // Add skill to user's skills array
    const user = await User.findById(req.user?._id);
    if (user) {
      if (skill.type === 'offered') {
        user.skillsOffered.push(skill._id);
      } else {
        user.skillsWanted.push(skill._id);
      }
      await user.save();
    }

    const populatedSkill = await Skill.findById(skill._id)
      .populate('userId', 'name role avatar location rating');

    res.status(201).json({
      success: true,
      data: populatedSkill,
      message: 'Skill created successfully'
    });

  } catch (error) {
    console.error('Create skill error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating skill'
    });
  }
});

// @desc    Update skill
// @route   PUT /api/skills/:id
// @access  Private
router.put('/:id', async (req: AuthRequest, res: express.Response) => {
  try {
    const { error, value } = skillSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    // Check if user owns this skill
    if (skill.userId.toString() !== req.user?._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this skill'
      });
    }

    const updatedSkill = await Skill.findByIdAndUpdate(
      req.params.id,
      value,
      { new: true, runValidators: true }
    ).populate('userId', 'name role avatar location rating');

    res.json({
      success: true,
      data: updatedSkill,
      message: 'Skill updated successfully'
    });

  } catch (error) {
    console.error('Update skill error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating skill'
    });
  }
});

// @desc    Delete skill
// @route   DELETE /api/skills/:id
// @access  Private
router.delete('/:id', async (req: AuthRequest, res: express.Response) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    // Check if user owns this skill
    if (skill.userId.toString() !== req.user?._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this skill'
      });
    }

    await Skill.findByIdAndDelete(req.params.id);

    // Remove skill from user's skills array
    const user = await User.findById(req.user?._id);
    if (user) {
      if (skill.type === 'offered') {
        user.skillsOffered.pull(skill._id);
      } else {
        user.skillsWanted.pull(skill._id);
      }
      await user.save();
    }

    res.json({
      success: true,
      message: 'Skill deleted successfully'
    });

  } catch (error) {
    console.error('Delete skill error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting skill'
    });
  }
});

export default router;
