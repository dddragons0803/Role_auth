import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import Product from '../../../models/Product';
import { authenticate } from '../../../middleware/auth';

// Handler function for /api/products endpoint
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  if (req.method === 'GET') {
    // List products
    try {
      const products = await Product.find(); // Retrieve all products from the database
    //   console.log("Products",products)
      res.status(200).json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
};

// Allow both 'admin' and 'team_member' roles to access this route
export default authenticate(handler, ['admin', 'team_member']);
