import { useIsMobile } from '../hooks/use-mobile';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Save, Plus, Loader2 } from 'lucide-react';
import ProfileForm from '../components/ProfileForm';
import LinkList from '../components/LinkList';
import LinkForm from '../components/LinkForm';
import ProfilePreview from '../components/ProfilePreview';
import { useDashboard } from '../hooks/use-dashboard';
import { useNavigate } from 'react-router-dom';
import { useLinkStore } from '../store/linkStore';
import { useEffect } from 'react';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { authenticated } = useLinkStore();
  const isMobile = useIsMobile();
  const {
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
  } = useDashboard();

  useEffect(() => {
    if (!authenticated) {
      navigate('/linkhub');
    }
  }, [authenticated, navigate]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!userData?.id) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">User not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isMobile ? 'h-full overflow-y-auto' : 'container h-full overflow-hidden'}`}>
      <div className={`flex ${isMobile ? 'flex-col' : 'flex-row h-full'} gap-8 p-4 md:p-6 lg:p-8`}>
        {isMobile && (
          <div className="w-full mb-4">
            <Card className="p-0 overflow-hidden h-[40vh]">
              <CardContent className="p-0 h-full">
                <ProfilePreview profile={draftProfile} links={draftLinks} />
              </CardContent>
            </Card>
          </div>
        )}

        <div className={`${isMobile ? 'w-full' : 'w-1/3 h-full py-4'}`}>
          <div className="sticky top-0 bg-background z-10 pb-4">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <Button 
                onClick={handleSaveChanges} 
                disabled={!hasUnsavedChanges || isSaving}
                className="flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>

          <Card className="p-4 mb-6">
            <CardContent className="p-0 space-y-4">
              <div className="pb-4 border-b">
                <h2 className="text-xl font-semibold mb-4">Profile</h2>
                <ProfileForm
                  profile={draftProfile}
                  onProfileChange={(profile) => {
                    setDraftProfile(profile);
                    setHasUnsavedChanges(true);
                  }}
                  userId={userData.id}
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-semibold">Links</h2>
                  <Button size="sm" variant="outline" onClick={() => setIsAddLinkDialogOpen(true)}>
                    <Plus size={16} className="mr-1" />
                    Add Link
                  </Button>
                </div>
                
                <LinkList
                  links={draftLinks}
                  onLinksChange={handleLinksChange}
                  onEditClick={(link) => {
                    setEditingLink(link);
                    setIsDialogOpen(true);
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {!isMobile && (
          <div className="w-2/3 h-full py-4">
            <Card className="p-0 overflow-hidden h-full">
              <CardContent className="p-0 h-full">
                <ProfilePreview profile={draftProfile} links={draftLinks} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <LinkForm
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingLink(null);
        }}
        onSubmit={handleEditLink}
        initialLink={editingLink}
      />

      <LinkForm
        isOpen={isAddLinkDialogOpen}
        onClose={() => setIsAddLinkDialogOpen(false)}
        onSubmit={handleAddLink}
      />
    </div>
  );
};

export default DashboardPage;
