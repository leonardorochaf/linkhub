import { useRef, useState } from 'react';
import { UserProfile } from '../store/linkStore';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Upload } from 'lucide-react';
import ImageCropper from './ImageCropper';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

interface ProfileFormProps {
  profile: UserProfile;
  onProfileChange: (profile: UserProfile) => void;
  userId: string;
}

const ProfileForm = ({ profile, onProfileChange, userId }: ProfileFormProps) => {
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Image = e.target?.result as string;
        setSelectedImage(base64Image);
        setIsCropperOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCroppedImage = (croppedImage: string) => {
    onProfileChange({ ...profile, avatar: croppedImage });
    setIsCropperOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="avatar">Profile Image</Label>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleImageUpload}
        />
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2"
        >
          <Upload size={14} />
          Upload Image
        </Button>
      </div>
      <div>
        <Label htmlFor="displayName">Name</Label>
        <Input 
          id="displayName"
          value={profile.displayName}
          onChange={(e) => onProfileChange({...profile, displayName: e.target.value})}
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description"
          rows={3}
          className="resize-none"
          value={profile.description}
          onChange={(e) => onProfileChange({...profile, description: e.target.value})}
        />
      </div>
      <div>
        <Label htmlFor="theme">Theme</Label>
        <Select 
          value={profile.theme} 
          onValueChange={(value) => onProfileChange({...profile, theme: value as 'light' | 'dark'})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Dialog open={isCropperOpen} onOpenChange={setIsCropperOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Crop Profile Image</DialogTitle>
            <DialogDescription>
              Adjust the image to fit your profile picture.
            </DialogDescription>
          </DialogHeader>
          {selectedImage && (
            <ImageCropper
              image={selectedImage} 
              onCropComplete={handleCroppedImage}
              onCancel={() => {
                setIsCropperOpen(false);
                setSelectedImage(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileForm; 