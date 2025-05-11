import { Link as LinkType } from '../store/linkStore';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Edit, Trash2, MoveVertical } from 'lucide-react';
import { useDragAndDrop } from '../utils/dnd';

interface LinkListProps {
  links: LinkType[];
  onLinksChange: (links: LinkType[]) => void;
  onEditClick: (link: LinkType) => void;
}

const LinkList = ({ links, onLinksChange, onEditClick }: LinkListProps) => {
  const {
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd
  } = useDragAndDrop(links, (newOrder) => {
    onLinksChange(newOrder);
  });

  const handleToggleActive = (id: string) => {
    onLinksChange(links.map(link => 
      link.id === id ? { ...link, active: !link.active } : link
    ));
  };

  const handleDelete = (id: string) => {
    onLinksChange(links.filter(link => link.id !== id));
  };

  return (
    <div className="space-y-3">
      {links.map((link) => (
        <div 
          key={link.id} 
          className={`flex items-center p-3 border rounded-md ${link.active ? 'bg-muted/30' : 'bg-muted/10'}`}
          draggable
          onDragStart={() => handleDragStart(link.id)}
          onDragOver={(e) => handleDragOver(e, link.id)}
          onDrop={handleDrop}
          onDragEnd={handleDragEnd}
        >
          <div className="cursor-move pr-2 shrink-0">
            <MoveVertical size={16} className="text-muted-foreground" />
          </div>
          <div className="shrink-0">
            <Switch 
              checked={link.active}
              onCheckedChange={() => handleToggleActive(link.id)}
            />
          </div>
          <div className="flex-1 px-4 min-w-0">
            <div className="font-medium truncate">{link.title}</div>
            <div className="text-sm text-muted-foreground truncate">{link.url}</div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button size="icon" variant="ghost" onClick={() => onEditClick(link)}>
              <Edit size={16} />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => handleDelete(link.id)}>
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LinkList; 