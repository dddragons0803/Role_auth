import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import Product from '../../../models/Product';
import { authenticate } from '../../../middleware/auth';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  if (req.method === 'POST') {
    const { title, description, imageUrl, price } = req.body;

    if (!title || !description || !imageUrl || price === undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      const product = new Product({ title, description, imageUrl, price });
      await product.save();
      res.status(201).json({ product });
    } catch (error) {
      console.error('Product Creation Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
};

export default authenticate(handler, ['admin']);
