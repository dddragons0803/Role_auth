import React,{useState,useEffect} from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Flex,
  Button,
  useColorModeValue,
  Stack,
  HStack,
  Text,
} from '@chakra-ui/react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const bgColor = useColorModeValue('gray.100', 'gray.900');
  const [clientUser, setClientUser] = useState<typeof user | null>(null);

  useEffect(() => {
    setClientUser(user); // Set the user data after the initial render
  }, [user]);

  return (
    <Box bg={bgColor} px={4}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <HStack spacing={8} alignItems={'center'}>
          <Link href="/dashboard" passHref>
            {/* <Text as="a" fontSize="lg" fontWeight="bold"> */}
            <Button colorScheme='orange' variant="solid">
              Dashboard
              </Button>
            {/* </Text> */}
          </Link>
          <Link href="/profile" passHref>
            {/* <Text as="a" fontSize="lg" fontWeight="bold"> */}
            <Button colorScheme='orange' variant="solid">
              Profile
              </Button>
            {/* </Text> */}
          </Link>
          {user?.role === 'team_member' && (
            <Link href="/prrofile/my-submissions" passHref >
              {/* <Text as="a" fontSize="lg" fontWeight="bold"> */}
              <Button colorScheme='orange' variant="solid">
                My Submissions
                </Button>
              {/* </Text> */}
            </Link>
          )}
          {user?.role === 'admin' && (
            <Link href="/reviews" passHref>
              {/* <Text as="a" fontSize="lg" fontWeight="bold"> */}
              <Button colorScheme='orange' variant="solid">
                Pending Requests
                </Button>
              {/* </Text> */}
            </Link>
          )}
        </HStack>
        <Flex alignItems={'center'}>
          <Button onClick={logout} colorScheme="teal" variant="solid">
            Logout
          </Button>
        </Flex>
      </Flex>

      <Box mt={8}>{children}</Box>
    </Box>
  );
};

export default Layout;
