import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useLinkStore } from '../store/linkStore';

const Index = () => {
  const navigate = useNavigate();
  const { authenticated } = useLinkStore();
  
  useEffect(() => {
    if (authenticated) {
      navigate('/linkhub/dashboard');
    }
  }, [authenticated, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col md:flex-row">
        <div className="flex-1 flex items-center justify-center p-8 md:p-16 lg:p-24">
          <div className="max-w-xl space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
              Your links, <span className="text-brand-blue">all in one place</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Create your personal link hub and share it with the world. Simple, customizable, and efficient.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={() => navigate('/linkhub/signup')} size="lg" className="bg-brand-blue hover:bg-brand-blue/90">
                Get Started
              </Button>
            </div>
          </div>
        </div>
        
        <div className="hidden md:flex flex-1 bg-muted items-center justify-center p-8">
          <div className="w-full max-w-xs p-6 bg-background rounded-xl shadow-lg">
            <div className="w-16 h-16 bg-brand-blue rounded-full mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-center mb-4">User Name</h2>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-full p-3 bg-brand-dark rounded-md text-white text-center">
                  Link {i}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
