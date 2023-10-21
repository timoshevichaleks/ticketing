import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from 'jsonwebtoken';
import { User } from "../models/user";
import { Password } from "../services/password";
import { BadRequestError, validateRequest } from "@altick/common";

const router = express.Router();

router.post('/api/users/signin',
  [
    body('email')
      .isEmail()
      .withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    const passwordsMatch = await Password.compare(existingUser.password, password);
    if (!passwordsMatch) {
      throw new BadRequestError('Invalid credentials');
    }

    // Generate JWT
    const userJwt: string = jwt.sign({
      id: existingUser.id,
      email: existingUser.email,
    }, process.env.JWT_KEY!, { expiresIn: Math.floor(Date.now() / 1000) - 30 });

    // Store it on session object
    // kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf
    req.session = { jwt: userJwt };

    res.status(200).send(existingUser);
});

export  { router as signinRouter };
