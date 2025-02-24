"use client";

import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { markdown } from '@codemirror/lang-markdown';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown, Trash2, Play, ChevronRight } from 'lucide-react';
import { NotebookCell } from '@/types/notebook';
import AiButton from '@/components/notebook/ai-button';


interface CellProps {
  cell: NotebookCell;
  onUpdate: (id: string, content: string) => void;
  onDelete: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  isFirst: boolean;
  isLast: boolean;
}

export function Cell({
  cell,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: CellProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative border border-gray-700 rounded-lg mb-4 p-4 bg-gray-900 group">
      <div className="absolute top-2 w-full flex items-center justify-between pr-8 z-10">
        <div className="flex items-center gap-1 ml-4">
          {!isFirst && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onMoveUp(cell.id)}
              className="h-6 w-6 bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
          )}
          {!isLast && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onMoveDown(cell.id)}
              className="h-6 w-6 bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex items-center gap-1 mr-4">
          {/* <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 bg-gray-800 text-green-400 hover:text-green-300 hover:bg-gray-700"
          >
            <Play className="h-4 w-4" />
          </Button> */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(cell.id)}
            className="h-6 w-6 bg-gray-800 text-red-400 hover:text-red-300 hover:bg-gray-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="min-h-[40px] mt-6">
        <CodeMirror
          value={cell.content}
          height="auto"
          extensions={[cell.type === 'code' ? python() : markdown()]}
          onChange={(value) => onUpdate(cell.id, value)}
          theme="dark"
          className="border-none"
        />
      </div>
      
      {cell.type === 'code' && cell.outputs && cell.outputs.length > 0 && (
        <div className="mt-2">
          <div className={`bg-gray-800 rounded border border-gray-700 ${!isExpanded ? 'max-h-32 overflow-hidden' : ''}`}>
            {cell.outputs.map((output, index) => (
              <pre key={index} className="whitespace-pre-wrap text-sm text-gray-300 p-2">
                {output}
              </pre>
            ))}
          </div>
          {!isExpanded && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(true)}
              className="w-full mt-1 py-1 text-xs text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-800"
            >
              <ChevronRight className="h-3 w-3 mr-1" />
              Show full output
            </Button>
          )}
        </div>
      )}

      
      

      <AiButton />

    </div>
  );
}