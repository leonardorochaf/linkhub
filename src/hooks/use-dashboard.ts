import { useState, useEffect } from 'react';
import { useLinkStore, Link as LinkType, UserProfile } from '../store/linkStore';
import { supabase, uploadAvatar } from '../lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface ProfileUpdateData {
  display_name: string;
  description: string;
  theme: string;
  avatar: string;
  updated_at: string;
}

interface LinkUpdateData {
  id: string;
  profile_id: string;
  name: string;
  url: string;
  enabled: boolean;
  updated_at: string;
}

export const useDashboard = () => {
  const queryClient = useQueryClient();
  const { 
    links, 
    profile, 
    reorderLinks,
    updateProfile
  } = useLinkStore();
  
  const [draftProfile, setDraftProfile] = useState<UserProfile>({
    username: '',
    displayName: '',
    description: '',
    avatar: '',
    theme: 'light'
  });
  const [draftLinks, setDraftLinks] = useState<LinkType[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddLinkDialogOpen, setIsAddLinkDialogOpen] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const { data: userData, isLoading: isLoadingUser } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      return user;
    }
  });

  const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile', userData?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userData?.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!userData?.id
  });

  const { data: linksData, isLoading: isLoadingLinks } = useQuery({
    queryKey: ['links', userData?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('links')
        .select('*')
        .eq('profile_id', userData?.id)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!userData?.id
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: ProfileUpdateData) => {
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', userData?.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', userData?.id] });
    }
  });

  const updateLinksMutation = useMutation({
    mutationFn: async (linksData: LinkUpdateData[]) => {
      const { error } = await supabase
        .from('links')
        .upsert(linksData, {
          onConflict: 'id',
          ignoreDuplicates: false
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links', userData?.id] });
    }
  });

  const deleteLinksMutation = useMutation({
    mutationFn: async (linkIds: string[]) => {
      const { error } = await supabase
        .from('links')
        .delete()
        .in('id', linkIds);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links', userData?.id] });
    }
  });

  useEffect(() => {
    if (profileData) {
      updateProfile({
        username: profileData.username,
        displayName: profileData.display_name,
        description: profileData.description,
        avatar: profileData.avatar,
        theme: profileData.theme
      });

      setDraftProfile({
        username: profileData.username,
        displayName: profileData.display_name,
        description: profileData.description,
        avatar: profileData.avatar,
        theme: profileData.theme
      });
    }
  }, [profileData, updateProfile]);

  useEffect(() => {
    if (linksData) {
      const formattedLinks = linksData.map(link => ({
        id: link.id,
        title: link.name,
        url: link.url,
        active: link.enabled
      }));

      reorderLinks(formattedLinks);
      setDraftLinks(formattedLinks);
    }
  }, [linksData, reorderLinks]);

  const handleAddLink = (link: LinkType) => {
    setDraftLinks([...draftLinks, link]);
    setHasUnsavedChanges(true);
  };

  const handleEditLink = (link: LinkType) => {
    setDraftLinks(draftLinks.map(l => l.id === link.id ? link : l));
    setHasUnsavedChanges(true);
  };

  const handleLinksChange = (links: LinkType[]) => {
    setDraftLinks(links);
    setHasUnsavedChanges(true);
  };

  const handleSaveChanges = async () => {
    try {
      if (!userData?.id) {
        toast.error("You must be logged in to save changes.");
        return;
      }

      let avatarUrl = draftProfile.avatar;
      if (draftProfile.avatar?.startsWith('data:image') && draftProfile.avatar !== profile.avatar) {
        try {
          setIsUploadingAvatar(true);
          avatarUrl = await uploadAvatar(userData.id, draftProfile.avatar);
        } catch (error) {
          toast.error("Failed to upload avatar. Other changes will be saved.");
          avatarUrl = profile.avatar;
        } finally {
          setIsUploadingAvatar(false);
        }
      }

      const profileData = {
        display_name: draftProfile.displayName,
        description: draftProfile.description,
        theme: draftProfile.theme,
        avatar: avatarUrl,
        updated_at: new Date().toISOString()
      };

      await updateProfileMutation.mutateAsync(profileData);

      const existingLinks = linksData || [];
      const existingLinkIds = new Set(existingLinks.map(link => link.id));
      const draftLinkIds = new Set(draftLinks.map(link => link.id));

      const linksToDelete = Array.from(existingLinkIds).filter(id => !draftLinkIds.has(id));
      if (linksToDelete.length > 0) {
        await deleteLinksMutation.mutateAsync(linksToDelete);
      }

      const linksToUpsert = draftLinks.map(link => ({
        id: link.id,
        profile_id: userData.id,
        name: link.title,
        url: link.url,
        enabled: link.active,
        updated_at: new Date().toISOString()
      }));

      if (linksToUpsert.length > 0) {
        await updateLinksMutation.mutateAsync(linksToUpsert);
      }

      updateProfile({
        ...draftProfile,
        avatar: avatarUrl
      });
      
      reorderLinks(draftLinks);
      
      setHasUnsavedChanges(false);
      
      toast.success("Your profile has been updated successfully.");
    } catch (error) {
      toast.error("Failed to save changes. Please try again.");
    }
  };

  const isSaving = updateProfileMutation.isPending || 
    updateLinksMutation.isPending || 
    deleteLinksMutation.isPending || 
    isUploadingAvatar;

  const isLoading = isLoadingUser || isLoadingProfile || isLoadingLinks;

  return {
    userData,
    draftProfile,
    draftLinks,
    hasUnsavedChanges,
    editingLink,
    isDialogOpen,
    isAddLinkDialogOpen,
    isSaving,
    isLoading,
    setDraftProfile,
    setHasUnsavedChanges,
    setEditingLink,
    setIsDialogOpen,
    setIsAddLinkDialogOpen,
    handleAddLink,
    handleEditLink,
    handleLinksChange,
    handleSaveChanges
  };
}; 