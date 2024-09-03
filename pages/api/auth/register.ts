import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../../models/User'; // You need to create this model

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    await dbConnect();

  if (req.method === 'POST') {
    const { email, password, role } = req.body;
    console.log(email,password,role)


    if (!email || !password || !role) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      if (!['admin', 'team_member'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
      }
      
     try {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(409).json({ error: 'Email already in use' });
      }

      const user = new User({ email, password, role });
      console.log(12)
      console.log(user)
      await user.save();
      console.log(13)
      // Generate JWT Token
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: '1h' }
      );

      res.status(201).json({ token });
    } catch (error) {
      console.error('Registration Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
