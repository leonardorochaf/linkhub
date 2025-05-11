import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { useLinkStore } from '../store/linkStore';
import { supabase } from '../lib/supabase';

const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, authenticated, logout } = useLinkStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const isProfileRoute = location.pathname.includes('/profile/');
  const isLoginPage = location.pathname === '/linkhub/login';
  const isSignupPage = location.pathname === '/linkhub/signup';

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      logout();
      navigate('/linkhub/login');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {!isProfileRoute && (
        <header className="border-b px-6 py-3 flex justify-between items-center">
          <Link to="/linkhub" className="text-xl font-bold">LinkHub</Link>
          <div className="flex items-center gap-4">
            {authenticated ? (
              <>
                <Link to={`/linkhub/profile/${profile.username}`} target="_blank">
                  <Button variant="secondary" size="sm">View Profile</Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </Button>
              </>
            ) : (
              <>
                {isLoginPage && (
                  <Link to="/linkhub/signup">
                    <Button size="sm">Sign Up</Button>
                  </Link>
                )}
                {isSignupPage && (
                  <Link to="/linkhub/login">
                    <Button size="sm">Login</Button>
                  </Link>
                )}
                {!isLoginPage && !isSignupPage && (
                  <Link to="/linkhub/login">
                    <Button size="sm">Login</Button>
                  </Link>
                )}
              </>
            )}
          </div>
        </header>
      )}
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
