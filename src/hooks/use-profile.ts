import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

interface Profile {
  username: string;
  displayName: string;
  description: string;
  avatar: string;
  theme: 'light' | 'dark';
}

interface Link {
  id: string;
  title: string;
  url: string;
  active: boolean;
}

export const useProfile = (username: string | undefined) => {
  const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile', username],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!username
  });

  const { data: linksData, isLoading: isLoadingLinks } = useQuery({
    queryKey: ['links', profileData?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('links')
        .select('*')
        .eq('profile_id', profileData?.id)
        .eq('enabled', true)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!profileData?.id
  });

  const profile: Profile | undefined = profileData ? {
    username: profileData.username,
    displayName: profileData.display_name,
    description: profileData.description,
    avatar: profileData.avatar,
    theme: profileData.theme as 'light' | 'dark'
  } : undefined;

  const links: Link[] = linksData?.map(link => ({
    id: link.id,
    title: link.name,
    url: link.url,
    active: link.enabled
  })) || [];

  return {
    profile,
    links,
    isLoading: isLoadingProfile || isLoadingLinks
  };
}; 