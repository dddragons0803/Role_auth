import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import { Container, Heading, Button, Box, Text, List, ListItem, Alert, AlertIcon } from '@chakra-ui/react';

const ReviewPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [reviews, setReviews] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      // Fetch pending reviews
      const fetchReviews = async () => {
        try {
          const response = await axios.get(`/api/reviews?status=pending`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          setReviews(response.data);
        } catch (err) {
          setError('Failed to load reviews.');
          console.error(err);
        }
      };
      fetchReviews();
    }
  }, [user, loading]);

  const handleApprove = async (reviewId: string) => {
    try {
      const response = await axios.put('/api/reviews', {
        reviewId,
        adminId: user?.id,
        status: 'approved',
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      alert(response.data.message);
      // Refresh the list of reviews
      setReviews(reviews.filter(review => review._id !== reviewId));
    } catch (err) {
      setError('Failed to approve review.');
      console.error(err);
    }
  };

  const handleDecline = async (reviewId: string) => {
    console.log("review id",reviewId)
    try {
      const response = await axios.put('/api/reviews', {
        reviewId,
        adminId: user?.id,
        status: 'rejected',
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      console.log(response.data)

      alert(response.data.message);
      // Refresh the list of reviews
      setReviews(reviews.filter(review => review._id !== reviewId));
    } catch (err) {
      setError('Failed to decline review.');
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  if (!user || user.role !== 'admin') {
    router.push('/login'); // Redirect if user is not an admin
    return null;
  }

  return (
    <Container maxW="container.lg" mt={8}>
      <Heading mb={4}>Review Approvals</Heading>
      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}
      <List spacing={4}>
      {reviews.map((review) => (
  review.status === 'pending' && (
    <ListItem key={review._id} borderWidth="1px" borderRadius="md" p={4} shadow="md" bg="white">
      <Box mb={4}>
        <Heading size="md" mb={2}>Review for Product {review.productId}</Heading>
        <Text mb={2}><strong>Status:</strong> {review.status}</Text>
        <Text mb={2}><strong>Changes:</strong> {JSON.stringify(review.changes)}</Text>
      </Box>
      <Button colorScheme="teal" mr={2} onClick={() => handleApprove(review._id)}>
        Approve
      </Button>
      <Button colorScheme="red" onClick={() => handleDecline(review._id)}>
        Decline
      </Button>
    </ListItem>
  )
))}

      </List>
    </Container>
  );
};

export default ReviewPage;
