import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from 'jsonwebtoken';
import { User } from "../models/user";
import { BadRequestError, validateRequest } from "@altick/common";

const router = express.Router();

router.post('/api/users/signup', [
    body('email')
      .isEmail()
      .withMessage('Email must be valid.'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters.')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('Email in use');
    }

    const user = User.build({ email, password });
    await user.save();

    // Generate JWT
    const userJwt: string = jwt.sign({
      id: user.id,
      email: user.email,
    }, process.env.JWT_KEY!, { expiresIn: Math.floor(Date.now() / 1000) - 30 });

    // Store it on session object
    // kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf
    req.session = { jwt: userJwt };

    res.status(201).send(user);
});

export  { router as signupRouter };
