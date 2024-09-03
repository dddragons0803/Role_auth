 // Handles /profile route for user profile page
 import React, { useState, useEffect } from 'react';
 import axios from 'axios';
 import { useRouter } from 'next/router';
 
 const ProfilePage = () => {
   const [user, setUser] = useState<any>(null);
   const [error, setError] = useState<string | null>(null);
   const router = useRouter();
 
   useEffect(() => {
     const fetchUserProfile = async () => {
       try {
         const response = await axios.get('/api/proofile'); // Replace with your API endpoint
         setUser(response.data);
         setError(null);
       } catch (err) {
         setError('Failed to load user profile.');
         setUser(null);
         console.error(err);
         router.push('/login'); // Redirect to login if user is not authenticated
       }
     };
 
     fetchUserProfile();
   }, [router]);
 
   if (!user) return <div>Loading...</div>;
 
   return (
     <div style={{ padding: '20px' }}>
       <h1>User Profile</h1>
       {error && <p style={{ color: 'red' }}>{error}</p>}
       <div>
         <h2>{user.name}</h2>
         {/* <p>Email: {user.email}</p> */}
         <p>Role: {user.role}</p>
         {/* Add more user details here */}
       </div>
     </div>
   );
 };
 
 export default ProfilePage;
 