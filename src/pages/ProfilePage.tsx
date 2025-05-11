import { useParams } from 'react-router-dom';
import NotFound from './NotFound';
import { Loader2 } from 'lucide-react';
import { useProfile } from '../hooks/use-profile';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Button } from '../components/ui/button';

const ProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const { profile, links, isLoading } = useProfile(username);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <NotFound />;
  }

  const activeLinks = links.filter(link => link.active);
  
  return (
    <div className={`flex flex-col items-center min-h-screen py-10 px-4 ${profile.theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-muted/20'}`}>
      <div className="w-full max-w-md space-y-6 text-center flex-1 flex flex-col">
        <Avatar className="w-24 h-24 mx-auto">
          <AvatarImage src={profile.avatar} alt={profile.displayName} />
          <AvatarFallback>{profile.displayName.charAt(0)}</AvatarFallback>
        </Avatar>
        
        <h1 className="text-3xl font-bold">{profile.displayName}</h1>

        {profile.description && (
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{profile.description}</p>
        )}
        
        <div className="space-y-3 flex-1 overflow-auto">
          {activeLinks.map((link) => (
            <a 
              key={link.id} 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
            >
              <Button 
                variant="secondary" 
                className={`w-full py-6 ${profile.theme === 'dark' ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-brand-dark text-white hover:bg-brand-dark/90'} transition-transform hover:scale-[1.01]`}
              >
                {link.title}
              </Button>
            </a>
          ))}
        </div>
        
        <div className="text-sm text-muted-foreground mt-auto">
          Powered by LinkHub
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
