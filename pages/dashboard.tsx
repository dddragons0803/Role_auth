import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import axios from 'axios';
import {
    Box,
    Button,
    Container,
    Heading,
    Text,
    SimpleGrid,
    Spinner,
    Alert,
    AlertIcon,
    Image
  } from '@chakra-ui/react';
import Link from 'next/link';
const DashboardPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      // Fetch products data server-side or client-side depending on user role
      const fetchData = async () => {
        try {
          // Get token from local storage
          const token = localStorage.getItem('token');

          // Attach token to request headers
          const response = await axios.get('/api/products', {
            headers: {
              Authorization: `Bearer ${token}`, // Attach token
            },
          });

        //   console.log(response);
          setProducts(response.data);
        } catch (err) {
          setError('Failed to load products.');
          console.error(err);
        }
      };
      fetchData();
    }
  }, [user, loading]);

  if (loading) return <div>Loading...</div>;

  if (!user) {
    router.push('/login'); // Redirect if user is not authenticated
    return null;
  }

  return (
     <Container maxW="container.lg" mt={8}>
          <Heading mb={4}>
            {user.role === 'admin' ? 'Admin Dashboard' : 'Team Member Dashboard'}
          </Heading>
          {error && (
            <Alert status="error" mb={4}>
              <AlertIcon />
              {error}
            </Alert>
          )}
                {/* Admin-specific button to go to review page */}
      {/* {user.role === 'admin' && (
        // <Button
        //   colorScheme="blue"
        //   mb={6}
        //   onClick={() => router.push('/reviews')}
        // >
        //   Go to Review Approvals
        // </Button>
      )} */}

          <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
            {products.map((product) => (
              <Box
                key={product._id}
                borderWidth="1px"
                borderRadius="md"
                p={4}
                shadow="md"
                bg="white"
                overflow="hidden"
                maxW="300px" // Set a fixed maximum width
                maxH="400px" // Set a fixed maximum height
              >
                <Box
                  width="100%"
                  height="200px" // Fixed height for image container
                  mb={4}
                  overflow="hidden"
                >
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    objectFit="cover" // Ensure the image covers the area
                    boxSize="100%"
                    height="100%" // Ensure image fills the container's height
                  />
                </Box>
                <Heading size="md" mb={2}>
                  {product.title}
                </Heading>
                <Text mb={4}>{product.description}</Text>
                <Button
                  colorScheme="teal"
                  // onClick={() => router.push(`/product/${product._id}`)}
                >
                  <Link href={`/product/${product._id}`} as={`/product/${product._id}`}>
    View Product
  </Link>
                </Button>
              </Box>
            ))}
          </SimpleGrid>
        </Container>
  );
};

export default DashboardPage;
