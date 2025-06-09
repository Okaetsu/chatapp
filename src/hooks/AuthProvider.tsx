import { useContext, createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<object | null>(null);
  const navigate = useNavigate();

  const loginAction = (data) => {
    fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(await res.text());
        }

        const profileResponse = await fetch('/api/me');
        if (!profileResponse.ok) {
          throw new Error(await res.text());
        }

        const responseData = await profileResponse.json();
        if (!responseData) {
          throw new Error(await res.text());
        }

        setUser(responseData.user);
        navigate('/');
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const signupAction = (data) => {
    fetch('/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(async (res) => {
        const responseData = await res.json();
        if (!responseData) {
          throw new Error(await res.text());
        }

        setUser(responseData.user);
        navigate('/');
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const updateUser = (userData: object) => {
    const updatedUser = {
      ...user,
      ...(userData.avatar !== null && { avatar: userData.avatar }),
      ...(userData.displayName !== null && {
        displayName: userData.displayName
      })
    };
    setUser(updatedUser);
  };

  const logOut = () => {
    fetch('/auth/logout', {
      method: 'DELETE'
    })
      .then(async (res) => {
        if (res.ok) {
          setUser(null);
          navigate('/login');
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    fetch('/api/me', { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(await res.text());
        }

        const responseData = await res.json();
        if (!responseData) {
          throw new Error(await res.text());
        }

        setUser(responseData.user);
        navigate('/');
        console.log('Logged in.');
      })
      .catch((err) => {
        navigate('/login');
        console.error(`Failed to login: ${err}`);
      });
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, signupAction, loginAction, logOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
