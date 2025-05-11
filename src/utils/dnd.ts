import { useState, useEffect } from 'react';

export const useDragAndDrop = <T extends { id: string }>(items: T[], onReorder: (newOrder: T[]) => void) => {
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dragOverItemId, setDragOverItemId] = useState<string | null>(null);

  const handleDragStart = (id: string) => {
    setDraggedItemId(id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    setDragOverItemId(id);
  };

  const handleDrop = () => {
    if (!draggedItemId || !dragOverItemId) return;
    
    const draggedItemIndex = items.findIndex(item => item.id === draggedItemId);
    const dragOverItemIndex = items.findIndex(item => item.id === dragOverItemId);
    
    if (draggedItemIndex === -1 || dragOverItemIndex === -1) return;
    
    const newItems = [...items];
    const draggedItem = newItems[draggedItemIndex];
    
    newItems.splice(draggedItemIndex, 1);
    newItems.splice(dragOverItemIndex, 0, draggedItem);
    
    onReorder(newItems);
    
    setDraggedItemId(null);
    setDragOverItemId(null);
  };

  const handleDragEnd = () => {
    setDraggedItemId(null);
    setDragOverItemId(null);
  };

  return {
    draggedItemId,
    dragOverItemId,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd
  };
};

export const reorder = <T>(list: T[], startIndex: number, endIndex: number): T[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export const move = <T>(
  source: T[],
  destination: T[],
  droppableSource: { index: number; droppableId: string },
  droppableDestination: { index: number; droppableId: string }
): { [key: string]: T[] } => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);
  destClone.splice(droppableDestination.index, 0, removed);

  const result: { [key: string]: T[] } = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};
