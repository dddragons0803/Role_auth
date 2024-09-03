import React, { useEffect, useState } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { Box, Heading, Text, Stat, StatLabel, StatNumber, SimpleGrid } from '@chakra-ui/react';

const ProfilePage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    submissions: 0,
    pending: 0,
    declined: 0,
    approved: 0,
  });

  useEffect(() => {
    if (user && user.role === 'team_member') {
      const fetchStats = async () => {
        try {
          const response = await axios.get(`/api/review-stats`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            params: { userId: user.id },
          });
          setStats(response.data);
        } catch (err) {
          console.error('Failed to load stats', err);
        }
      };

      fetchStats();
    }
  }, [user]);

  return (
    <ProtectedRoute allowedRoles={['admin', 'team_member']}>
      <Box maxW="container.md" mx="auto" mt={8}>
        <Heading mb={4}>Profile</Heading>
        <Text mb={4}>ID: {user?.id}</Text>
        <Text mb={4}>Role: {user?.role}</Text>

        {user?.role === 'team_member' && (
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <Stat>
              <StatLabel>Total Submissions</StatLabel>
              <StatNumber>{stats.submissions}</StatNumber>
            </Stat>

            <Stat>
              <StatLabel>Pending Requests</StatLabel>
              <StatNumber>{stats.pending}</StatNumber>
            </Stat>

            <Stat>
              <StatLabel>Declined Requests</StatLabel>
              <StatNumber>{stats.declined}</StatNumber>
            </Stat>

            <Stat>
              <StatLabel>Approved Requests</StatLabel>
              <StatNumber>{stats.approved}</StatNumber>
            </Stat>
          </SimpleGrid>
        )}
      </Box>
    </ProtectedRoute>
  );
};

export default ProfilePage;
