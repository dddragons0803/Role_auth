  // Handles /api/profile route for profile management
  import type { NextApiRequest, NextApiResponse } from 'next';
  import dbConnect from '../../../utils/dbConnect';
  import User from '../../../models/User';
  import { authenticate } from '../../../middleware/auth';
  
  const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    await dbConnect();
  
    if (req.method === 'GET') {
      // Retrieve user profile
      try {
        const userId = req.user?.id; // `req.user` should be set by the `authenticate` middleware
        if (!userId) {
          return res.status(401).json({ error: 'Unauthorized' });
        }
  
        const user = await User.findById(userId).select('-password'); // Exclude password field
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
  
        res.status(200).json({
          name: user.name,
          email: user.email,
          role: user.role,
        });
      } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    } else if (req.method === 'PUT') {
      // Update user profile
      try {
        const userId = req.user?.id; // `req.user` should be set by the `authenticate` middleware
        if (!userId) {
          return res.status(401).json({ error: 'Unauthorized' });
        }
  
        const { name, email } = req.body;
        if (!name || !email) {
          return res.status(400).json({ error: 'Name and email are required' });
        }
  
        const user = await User.findByIdAndUpdate(userId, { name, email }, { new: true, runValidators: true });
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
  
        res.status(200).json({
          name: user.name,
          email: user.email,
          role: user.role,
        });
      } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    } else {
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  };
  
  export default authenticate(handler);
  