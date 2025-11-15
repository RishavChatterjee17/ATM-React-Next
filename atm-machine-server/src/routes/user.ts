// route for getting and updating user profile

import { Router } from 'express';
import { findUserById, updateUserProfile } from '../utils/helper.js';
import { userSchema } from '../schema/user.js';

const router = Router();

router.get('/profile', (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string || req.query.userId as string;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    const user = findUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const { pin, ...userWithoutPin } = user;

    res.json({
      success: true,
      user: userWithoutPin,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

router.put('/profile', (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string || req.query.userId as string;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    const user = findUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // pick only the fields that are in the profile page
    const validation = userSchema.pick({
      firstname: true,
      lastname: true,
      email: true,
      contact: true,
      address: true,
    }).partial().safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request data',
        errors: validation.error.issues,
      });
    }

    const updateData: {
      firstname?: string;
      lastname?: string;
      email?: string;
      contact?: number;
      address?: string;
    } = {};
    
    if (validation.data.firstname !== undefined) updateData.firstname = validation.data.firstname;
    if (validation.data.lastname !== undefined) updateData.lastname = validation.data.lastname;
    if (validation.data.email !== undefined) updateData.email = validation.data.email;
    if (validation.data.contact !== undefined) updateData.contact = validation.data.contact;
    if (validation.data.address !== undefined) updateData.address = validation.data.address;

    const updated = updateUserProfile(userId, updateData);

    if (!updated) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update profile',
      });
    }

    const updatedUser = findUserById(userId);
    if (!updatedUser) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve updated profile',
      });
    }

    const { pin, ...userWithoutPin } = updatedUser;

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: userWithoutPin,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

export default router;