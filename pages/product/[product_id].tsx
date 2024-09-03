// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/router';
// import axios from 'axios';
// import {
//   Container,
//   Box,
//   Heading,
//   Text,
//   Image,
//   Button,
//   Spinner,
//   Alert,
//   AlertIcon,
//   Stack,
// } from '@chakra-ui/react';

// const ProductDetailPage = () => {
//   const router = useRouter();
//   const { product_id } = router.query;
//   const [product, setProduct] = useState<any>(null);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (product_id) {
//       const fetchProduct = async () => {
//         try {
//           const response = await axios.get(`/api/products/${product_id}`);
//           setProduct(response.data);
//         } catch (err) {
//           setError('Failed to load product.');
//           console.error(err);
//         }
//       };
//       fetchProduct();
//     }
//   }, [product_id]);

//   if (!product) {
//     return (
//       <Container maxW="container.lg" mt={8}>
//         <Spinner size="xl" />
//       </Container>
//     );
//   }

//   return (
//     <Container maxW="container.lg" mt={8}>
//       <Heading mb={4}>Product Detail</Heading>
//       {error && (
//         <Alert status="error" mb={4}>
//           <AlertIcon />
//           {error}
//         </Alert>
//       )}
//       <Stack direction={['column', 'row']} spacing={8}>
//         <Box flex="1" maxW="400px" mx="auto">
//           <Image
//             src={product.imageUrl}
//             alt={product.title}
//             borderRadius="md"
//             objectFit="cover"
//             width="100%"
//             height="auto"
//             maxH="400px"
//           />
//         </Box>
//         <Box flex="2">
//           <Heading size="lg" mb={2}>
//             {product.title}
//           </Heading>
//           <Text fontSize="lg" mb={4}>
//             {product.description}
//           </Text>
//           <Text fontWeight="bold" fontSize="xl" mb={4}>
//             Price: ${product.price.toFixed(2)}
//           </Text>
//           <Button
//             colorScheme="teal"
//             onClick={() => router.push('/dashboard')}
//             mt={4}
//           >
//             Back to Products
//           </Button>
//         </Box>
//       </Stack>
//     </Container>
//   );
// };

// export default ProductDetailPage;









import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import {
  Container,
  Box,
  Heading,
  Text,
  Image,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  Stack,
  Input,
  Textarea,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext'; // Custom hook to get the user and their role
import Cropper from 'react-easy-crop';
import { getStorage,getDownloadURL, ref, uploadBytesResumable,UploadTaskSnapshot } from 'firebase/storage';
import storage from '../../firebaseClient'; // Your Firebase config

const ProductDetailPage = () => {
  const router = useRouter();
  const { product_id } = router.query;
  const [product, setProduct] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [image, setImage] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const { user } = useAuth(); // Custom hook to get the user and their role

  useEffect(() => {
    if (product_id) {
      const fetchProduct = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`/api/products/${product_id}`, {
            headers: {
              Authorization: `Bearer ${token}`, // Include token in request
            },
          });
          setProduct(response.data);
  
          setTitle(response.data.title);
          setDescription(response.data.description);
          setPrice(response.data.price);
        } catch (err) {
          setError('Failed to load product.');
          console.error(err);
        }
      };
      fetchProduct();
    }
  }, [product_id]);



  const handleImageUpload = async () => {
    if (!image) return;
    const storageRef = ref(storage, `products/${product_id}`);
    const uploadTask = uploadBytesResumable(storageRef, image);
    
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Handle upload progress
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
        console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        setError('Failed to upload image.');
        console.error(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setCroppedImage(downloadURL);
          console.log('File available at', downloadURL);
        });
      }
    );
  };

  const handleSave = async () => {
    try {
      const updatedProduct = { title, description, price, imageUrl: croppedImage || product.imageUrl };
      if (user?.role === 'admin') {
        const config = {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        };
        await axios.put(`/api/products/${product_id}`, updatedProduct, config);
      } else if (user?.role === 'team_member') {
        const config = {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        };
        await axios.post(`/api/reviews`, { changes: updatedProduct, productId: product_id, status: 'pending', author: user.id },config);
      }
      router.push('/dashboard');
    } catch (err) {
      setError('Failed to save changes.');
      console.error(err);
    }
  };

  if (!product) {
    return (
      <Container maxW="container.lg" mt={8}>
        <Spinner size="xl" />
      </Container>
    );
  }

  return (
    <Container maxW="container.lg" mt={8}>
      <Heading mb={4}>Product Detail</Heading>
      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}
      <Stack direction={['column', 'row']} spacing={8}>
        <Box flex="1" maxW="400px" mx="auto">
          <Image
            src={croppedImage || product.imageUrl}
            alt={product.title}
            borderRadius="md"
            objectFit="cover"
            width="100%"
            height="auto"
            maxH="400px"
          />
          <FormControl mt={4}>
            <FormLabel>Change Image</FormLabel>
            <Input type="file" onChange={(e) => setImage(e.target.files?.[0] || null)} />
            {/* Include cropping tool here, e.g., using react-easy-crop */}
            <Button onClick={handleImageUpload} mt={2}>
              Upload Image
            </Button>
            <progress value={progress} max="100" />
            {downloadURL && (
        <div>
          <p>Image uploaded successfully!</p>
          <Image src={downloadURL} alt="Uploaded file" />
        </div>
      )}
          </FormControl>
        </Box>
        <Box flex="2">
          <FormControl mb={4}>
            <FormLabel>Title</FormLabel>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Description</FormLabel>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Price</FormLabel>
            <Input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
          </FormControl>
          {user?.role === 'team_member' ? (
            <Button colorScheme="teal" onClick={handleSave} mt={4}>
              Submit for Review
            </Button>
          ) : (
            <Button colorScheme="teal" onClick={handleSave} mt={4}>
              Save
            </Button>
          )}
          <Button
            colorScheme="gray"
            onClick={() => router.push('/dashboard')}
            mt={4}
            ml={4}
          >
            Back to Products
          </Button>
        </Box>
      </Stack>
    </Container>
  );
};

export default ProductDetailPage;

