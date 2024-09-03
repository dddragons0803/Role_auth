import dbConnect from '../../utils/dbConnect';
import { NextApiRequest, NextApiResponse } from 'next';
import Review from '@/models/Review';
import Product from '@/models/Product';
import { authenticate } from '../../middleware/auth';
import { JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import { Console } from 'console';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    await dbConnect();
    const { product_id } = req.query;
    if (req.method === 'GET') {
        try {
          // Fetch reviews for a product
          const reviews = await Review.find();
          res.status(200).json(reviews);
        } catch (error) {
          console.error('Review Fetch Error:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      } else if (req.method === 'PUT') {
        // Approve the review and update the product
        try {
            const { reviewId, adminId, action } = req.body; 
            console.log(req.body.status)
    
          // Find the review and update its status
          const review = await Review.findById(reviewId);
          if (!review) {
            return res.status(404).json({ message: 'Review not found' });
          }
    
          // Check if the action is to approve or decline
        if (req.body.status === 'approved') {
            review.status = 'approved';
            review.adminId = adminId;

            // Apply changes to the product
            const product = await Product.findById(review.productId);
            if (product) {
                product.set(review.changes);
                await product.save();
            }
        } else if (req.body.status === 'rejected') {
            review.status = 'rejected';
            review.adminId = adminId;
            // You may want to add any additional logic for declined reviews here
        } else {
            return res.status(400).json({ message: 'Invalid action' });
        }
          await review.save();
    
        
    
          res.status(200).json({ message: `Review ${req.body.status}d successfully` });
        }
        catch (error) {
            console.error('Review Approval Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
          }
      
    }
      else if (req.method === 'POST') {
      try {
        // Assuming `Review` is a Mongoose model you've set up
        const review = await Review.create({
          ...req.body,
          author: req.user?.id, // Assuming you're passing `req.user`
        });
  
        res.status(201).json(review);
      } catch (error) {
        console.error('Review Creation Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    } else {
      res.setHeader('Allow', ['POST','GET','PUT']);
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  };
  
  export default authenticate(handler);
  