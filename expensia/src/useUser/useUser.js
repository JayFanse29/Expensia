import { useState, useEffect } from 'react';

const useUser = (token) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        if(token)
        {
            const response = await fetch(`http://localhost:5000/expensia/users/profile`, {
                method: 'GET',
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
            throw new Error('Failed to fetch user');
            }
            const data = await response.json();
            setUser(data.user);
            setLoading(false);
        }
      } catch (err) {
        setError(err);
      } finally {
      }
    };

    fetchUser();
  }, [token]);

  return { user, loading, error };
};

export default useUser;
