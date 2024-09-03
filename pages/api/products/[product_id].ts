import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import Product from '../../../models/Product';
import jwt from 'jsonwebtoken';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();
  interface DecodedToken {
    userId: string;
    role: string;
    iat: number;
    exp: number;
  }


  const { product_id } = req.query;

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token missing or malformed' });
  }
console.log(authHeader)
  const token = authHeader.split(' ')[1];
  
  // Verify the token and extract the user's role
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  console.log("jwt secret",process.env.JWT_SECRET)

  let decodedToken: DecodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken; // Replace with your actual secret
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
  console.log("dec toeken",decodedToken)

  const userRole = decodedToken.role;
  
  if (req.method === 'GET') {
   
    try {
      const product = await Product.findById(product_id);

      if (product) {
        res.status(200).json(product);
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      console.error('Product Fetch Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } 
  else if (req.method === 'PUT') {
   
    // Ensure only admins can update the product
    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    try {
      const updatedProduct = await Product.findByIdAndUpdate(product_id, req.body);

      if (updatedProduct) {
        res.status(200).json(updatedProduct);
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      console.error('Product Update Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  else {
    res.setHeader('Allow', ['GET','PUT']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
};

export default handler;
