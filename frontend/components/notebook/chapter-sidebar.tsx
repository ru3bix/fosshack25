'use client';

import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Chapter } from '@/types/notebook';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { SortableChapter } from '@/components/notebook/sortable-chapter';
import { cn } from '@/lib/utils';

interface ChapterSidebarProps {
  chapters: Chapter[];
  activeChapterId: string | null;
  onChapterSelect: (chapterId: string) => void;
  onChaptersReorder: (chapters: Chapter[]) => void;
  onAddChapter: () => void;
  onDeleteChapter: (chapterId: string) => void;
  onRenameChapter: (chapterId: string, newTitle: string) => void;
}

export function ChapterSidebar({
  chapters,
  activeChapterId,
  onChapterSelect,
  onChaptersReorder,
  onAddChapter,
  onDeleteChapter,
  onRenameChapter,
}: ChapterSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = chapters.findIndex((chapter) => chapter.id === active.id);
      const newIndex = chapters.findIndex((chapter) => chapter.id === over.id);
      const newChapters = arrayMove(chapters, oldIndex, newIndex).map((chapter, index) => ({
        ...chapter,
        order: index,
      }));
      onChaptersReorder(newChapters);
    }
  }

  return (
    <div 
      className={cn(
        "bg-gray-900 border-r border-gray-700 h-[calc(100vh-64px)] flex flex-col transition-all duration-300 relative",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className={cn(
        "border-b border-gray-700 flex items-center",
        isCollapsed ? "p-2" : "p-4"
      )}>
        <Button 
          onClick={onAddChapter} 
          variant="secondary" 
          size="sm" 
          className={cn(
            "bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 border-0",
            isCollapsed ? "w-full p-2" : "w-full"
          )}
          title={isCollapsed ? "Add Chapter" : undefined}
        >
          <Plus className="w-4 h-4" />
          {!isCollapsed && <span className="ml-2">Add Chapter</span>}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute top-1/2 -right-3 h-6 w-6 rounded-full bg-gray-800 p-0.5 border border-gray-700 hover:bg-gray-700 z-50"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={chapters}
            strategy={verticalListSortingStrategy}
          >
            {chapters.map((chapter) => (
              <SortableChapter
                key={chapter.id}
                chapter={chapter}
                isActive={chapter.id === activeChapterId}
                onSelect={() => onChapterSelect(chapter.id)}
                onDelete={() => onDeleteChapter(chapter.id)}
                onRename={(newTitle) => onRenameChapter(chapter.id, newTitle)}
                isCollapsed={isCollapsed}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}