import dbConnect from '../../utils/dbConnect'; // Your database connection utility
import Review from '@/models/Review'; // Assuming you have a Review model
import { NextApiRequest, NextApiResponse } from 'next';
import { authenticate } from '../../middleware/auth';

const handler = async (req: NextApiRequest, res: NextApiResponse)  => {
  const { userId } = req.query;
  console.log(userId)

  try {
    await dbConnect();

    const submissions = await Review.countDocuments({author: userId });
    console.log(submissions)
    const pending = await Review.countDocuments({ author: userId , status: 'pending' });
    const declined = await Review.countDocuments({ author: userId , status: 'rejected' });
    const approved = await Review.countDocuments({author: userId , status: 'approved' });

    res.status(200).json({ submissions, pending, declined, approved });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};


export default authenticate(handler);