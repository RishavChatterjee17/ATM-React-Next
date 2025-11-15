// login authentication + zod validation -> based on the card type (randmonlyChosenCardstored in redux), we can check which user to authenticate

import { Router } from 'express';
import { findUserById } from '../utils/helper.js';
import { z } from 'zod';

const router = Router();

const loginSchema = z.object({
  cardType: z.enum(['visa', 'mastercard']),
  pin: z.string().length(4),
});

router.post('/login', (req, res) => {
  try {
    // zod validation check
    const validation = loginSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request data',
        errors: validation.error.issues,
      });
    }

    const { cardType, pin } = validation.data;

    const userId = cardType === 'visa' ? '1' : '2';
    const user = findUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.pin !== pin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid PIN',
      });
    }

    const { pin: _, ...userWithoutPin } = user;

    res.json({
      success: true,
      message: 'Login successful',
      user: userWithoutPin,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

export default router;

