import { useState, useEffect } from 'react';
import { Link as LinkType } from '../store/linkStore';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';

interface LinkFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (link: LinkType) => void;
  initialLink?: LinkType;
}

const LinkForm = ({ isOpen, onClose, onSubmit, initialLink }: LinkFormProps) => {
  const [link, setLink] = useState<LinkType>({
    id: '',
    title: '',
    url: '',
    active: true
  });

  useEffect(() => {
    if (initialLink) {
      setLink(initialLink);
    } else {
      setLink({
        id: crypto.randomUUID(),
        title: '',
        url: '',
        active: true
      });
    }
  }, [initialLink, isOpen]);

  const handleSubmit = () => {
    if (link.title.trim() && link.url.trim()) {
      onSubmit({
        ...link,
        url: link.url.startsWith('http') ? link.url : `https://${link.url}`
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialLink ? 'Edit Link' : 'Add New Link'}</DialogTitle>
          <DialogDescription>
            {initialLink ? 'Make changes to your link below.' : 'Enter the details for your new link.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title"
              value={link.title}
              onChange={(e) => setLink({...link, title: e.target.value})}
              placeholder="Link title"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="url">URL</Label>
            <Input 
              id="url"
              value={link.url}
              onChange={(e) => setLink({...link, url: e.target.value})}
              placeholder="https://example.com"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!link.title || !link.url}>
            {initialLink ? 'Save changes' : 'Add Link'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LinkForm; 