import React, { useEffect, useState } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import axios from 'axios';
import { Box, Heading, Text, Spinner, Alert, AlertIcon ,Badge, VStack } from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';

const MySubmissionsPage = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/reviews?author=${user?.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setReviews(response.data);
      } catch (err) {
        setError('Failed to load submissions.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchReviews();
    }
  }, [user]);

  if (loading) return <Spinner />;

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['team_member']}>
      <Box maxW="container.lg" mt={8} >
        <Heading mb={4}>My Submissions</Heading>
        {reviews.length === 0 ? (
          <Text>No submissions found.</Text>
        ) : (
          reviews.map((review) => (
            <Box
            key={review._id}
            p={6}
            mb={4}
            
            borderWidth="1px"
            borderRadius="md"
            shadow="md"
            bg="white"
            _hover={{ bg: 'gray.50' }}
            
          >
            <Heading size="md" mb={2}>
              Product ID: {review.productId}
            </Heading>
            <Badge
              colorScheme={
                review.status === 'approved'
                  ? 'green'
                  : review.status === 'rejected'
                  ? 'red'
                  : 'yellow'
              }
              mb={2}
              fontSize="0.9em"
            >
              {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
            </Badge>
            <Text fontWeight="bold" mb={2}>
              Changes:
            </Text>
            <Box
              as="pre"
              fontSize="sm"
              p={2}
              borderRadius="md"
              bg="gray.100"
              overflowX="auto"
            >
              {JSON.stringify(review.changes, null, 2)}
            </Box>
          </Box>
          ))
        )}
      </Box>
    </ProtectedRoute>
  );
};

export default MySubmissionsPage;
