'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Chapter } from '@/types/notebook';
import { Button } from '../ui/button';
import { BookOpen, GripVertical, Pencil, Save, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';

interface SortableChapterProps {
  chapter: Chapter;
  isActive: boolean;
  isCollapsed: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onRename: (newTitle: string) => void;
}

export function SortableChapter({ 
  chapter, 
  isActive, 
  isCollapsed,
  onSelect, 
  onDelete, 
  onRename 
}: SortableChapterProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(chapter.title);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: chapter.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSave = () => {
    onRename(editTitle);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(chapter.title);
    setIsEditing(false);
  };

  if (isCollapsed) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          'group flex items-center justify-center p-2 rounded-md mb-1 cursor-pointer relative',
          isActive ? 'bg-gray-800' : 'hover:bg-gray-800/50'
        )}
        onClick={onSelect}
        title={chapter.title}
      >
        <div {...attributes} {...listeners} className="absolute left-0 top-1/2 -translate-y-1/2 cursor-grab opacity-0 group-hover:opacity-100">
          <GripVertical className="w-4 h-4 text-gray-500" />
        </div>
        <BookOpen className="w-4 h-4" />
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group flex items-center gap-2 p-2 rounded-md mb-1 cursor-pointer',
        isActive ? 'bg-gray-800' : 'hover:bg-gray-800/50'
      )}
      onClick={onSelect}
    >
      <div {...attributes} {...listeners} className="cursor-grab">
        <GripVertical className="w-4 h-4 text-gray-500" />
      </div>

      {isEditing ? (
        <div className="flex-1 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="h-7 bg-gray-800"
            autoFocus
          />
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            onClick={handleSave}
          >
            <Save className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            onClick={handleCancel}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <>
          <span className="flex-1 truncate">{chapter.title}</span>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-red-400 hover:text-red-300 hover:bg-gray-700"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}