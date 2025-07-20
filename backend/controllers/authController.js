import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { generateRefreshToken, generateToken } from '../utils/generateToken.js';

const userResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email
});

export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      user: userResponse(user),
      token: generateToken(user._id),
      refreshToken: generateRefreshToken(user._id)
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      user: userResponse(user),
      token: generateToken(user._id),
      refreshToken: generateRefreshToken(user._id)
    });
  } catch (error) {
    next(error);
  }
};

export const me = async (req, res) => {
  res.json({ user: userResponse(req.user) });
};

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token is required' });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET || process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Refresh token user no longer exists' });
    }

    res.json({
      user: userResponse(user),
      token: generateToken(user._id),
      refreshToken: generateRefreshToken(user._id)
    });
  } catch (error) {
    return res.status(401).json({ message: 'Refresh token is invalid or expired' });
  }
};
