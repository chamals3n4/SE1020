import { createContext, useState, useContext, useEffect } from 'react';

// Create the authentication context
const AuthContext = createContext(null);

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Session timeout in milliseconds (2 hours)
  const SESSION_TIMEOUT = 2 * 60 * 60 * 1000;
  
  // Check if user is logged in when the app loads and validate session
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    const sessionTime = localStorage.getItem('sessionTime');
    
    if (storedUser && sessionTime) {
      // Check if session has expired
      const currentTime = new Date().getTime();
      const sessionStartTime = parseInt(sessionTime, 10);
      
      if (currentTime - sessionStartTime < SESSION_TIMEOUT) {
        // Session is still valid
        setCurrentUser(JSON.parse(storedUser));
        
        // Update session time to extend it
        localStorage.setItem('sessionTime', currentTime.toString());
      } else {
        // Session has expired, log user out
        console.log('Session expired, logging out');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('sessionTime');
      }
    }
    
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password, userType) => {
    try {
      let user = null;
      
      if (userType === 'couple') {
        // Fetch all couples from backend
        try {
          const response = await fetch('http://localhost:8080/api/couple');
          if (!response.ok) throw new Error('Failed to fetch couples');
          
          const couples = await response.json();
          // Find the couple with matching email and password
          const matchedCouple = couples.find(c => c.email === email && c.password === password);
          
          if (matchedCouple) {
            // Fetch wedding data for this couple
            const weddingResponse = await fetch('http://localhost:8080/api/wedding');
            if (!weddingResponse.ok) throw new Error('Failed to fetch weddings');
            
            const weddings = await weddingResponse.json();
            const coupleWedding = weddings.find(w => w.coupleId === matchedCouple.id);
            
            user = {
              id: matchedCouple.id,
              email: matchedCouple.email,
              name: matchedCouple.name,
              userType: 'couple',
              weddingId: coupleWedding ? coupleWedding.weddingId : null,
              partnerId: matchedCouple.partnerId,
              phone: matchedCouple.phone,
              budget: matchedCouple.budget,
              weddingDate: matchedCouple.weddingDate
            };
            
            console.log('Logged in couple with wedding ID:', user.weddingId);
          }
        } catch (error) {
          console.error('Error during couple login:', error);
          throw new Error('Unable to connect to the server. Please try again.');
        }
      } else if (userType === 'vendor') {
        // Fetch all vendors from backend
        try {
          const response = await fetch('http://localhost:8080/api/vendor');
          if (!response.ok) throw new Error('Failed to fetch vendors');
          
          const vendors = await response.json();
          // Find the vendor with matching email and password
          const matchedVendor = vendors.find(v => v.email === email && v.password === password);
          
          if (matchedVendor) {
            user = {
              id: matchedVendor.id,
              email: matchedVendor.email,
              name: matchedVendor.name,
              userType: 'vendor',
              vendorType: matchedVendor.vendorType,
              // Include other relevant vendor data
              phone: matchedVendor.phone,
              description: matchedVendor.description,
              address: matchedVendor.address
            };
          }
        } catch (error) {
          console.error('Error fetching vendors:', error);
          throw new Error('Unable to connect to the server. Please try again.');
        }
      } else {
        throw new Error('Invalid user type');
      }
      
      // If no user was found, credentials are invalid
      if (!user) {
        throw new Error('Invalid credentials');
      }
      
      // Login successful
      setCurrentUser(user);
      
      // Store user data and session start time
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('sessionTime', new Date().getTime().toString());
      
      return user;
      
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Register function
  const register = async (userData, userType) => {
    try {
      // In a real app, this would save to your file-based storage
      // For this assignment, we'll simulate registration
      
      return new Promise((resolve) => {
        setTimeout(() => {
          // Create a new user with an ID
          const newUser = {
            ...userData,
            id: `${userType}-${Date.now()}`,
            userType
          };
          
          // Auto-login after registration
          setCurrentUser(newUser);
          localStorage.setItem('currentUser', JSON.stringify(newUser));
          resolve(newUser);
        }, 500);
      });
    } catch (error) {
      throw new Error('Registration failed');
    }
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('sessionTime');
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
