'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { openDB, IDBPDatabase } from 'idb';
import { Cell } from '@/components/notebook/cell';
import { Toolbar } from '@/components/notebook/toolbar';
import { NotebookCell, Notebook, Chapter, Book, CellContent } from '@/types/notebook';
import { v4 as uuidv4 } from 'uuid';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { backendService } from '@/lib/execute';
import Preview from '@/components/notebook/preview';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ChapterSidebar } from '@/components/notebook/chapter-sidebar';

const DB_NAME = 'NotebookDB';
const STORE_NAME = 'notebook';
const DB_VERSION = 2;

const initializeDB = async (): Promise<IDBPDatabase> => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion) {
      if (oldVersion < 2) {
        if (db.objectStoreNames.contains(STORE_NAME)) {
          db.deleteObjectStore(STORE_NAME);
        }
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
};

const createEmptyNotebook = (): Notebook => ({
  cells: [],
  metadata: {
    kernelspec: {
      name: 'python3',
      display_name: 'Python 3',
    },
    language_info: {
      name: 'python',
      version: '3.8',
    },
  },
});

const createNewChapter = (order: number): Chapter => ({
  id: uuidv4(),
  title: `Chapter ${order + 1}`,
  notebook: createEmptyNotebook(),
  order,
});

export default function Home() {
  const [previewUrl, setPreviewUrl] = useState('');
  const [executing, setExecuting] = useState(false);
  const [fileName, setFileName] = useState('book');
  const [error, setError] = useState('');
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [book, setBook] = useState<Book>({
    chapters: [],
    activeChapterId: null,
  });


  const fetchBook = useCallback(async () => {
    const db = await initializeDB();
    const storedBook = await db.get(STORE_NAME, 'book');
    if (storedBook) {
      setBook(storedBook);
    } else {
      const initialChapter = createNewChapter(0);
      const newBook = {
        chapters: [initialChapter],
        activeChapterId: initialChapter.id,
      };
      setBook(newBook);
      await db.put(STORE_NAME, { id: 'book', ...newBook });
    }
  }, []);

  const saveBook = useCallback(async (newBook: Book) => {
    const db = await initializeDB();
    await db.put(STORE_NAME, { id: 'book', ...newBook });
    console.log('Book saved to IndexedDB.');
  }, []);

  useEffect(() => {
    fetchBook();
  }, [fetchBook]);

  const activeChapter = book.chapters.find(
    (chapter) => chapter.id === book.activeChapterId
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 's':
            e.preventDefault();
            toast('Saved', {
              icon: '✅',
              style: {
                borderRadius: '10px',
                background: '#282c34',
                color: '#fff',
              },
            });
            saveBook(book);
            break;
          case 'b':
            e.preventDefault();
            if (activeChapter) {
              addCell('code');
              toast('Created code block', {
                icon: '🤖',
                style: {
                  borderRadius: '10px',
                  background: '#282c34',
                  color: '#fff',
                },
              });
            }
            break;
          case 'm':
            e.preventDefault();
            if (activeChapter) {
              addCell('markdown');
              toast('Created markdown block', {
                icon: '🪄',
                style: {
                  borderRadius: '10px',
                  background: '#282c34',
                  color: '#fff',
                },
              });
            }
            break;
          case '/':
            e.preventDefault();
            document.getElementById('ai-btn')?.click();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [book, saveBook, activeChapter]);

  const addCell = useCallback(
    (type: 'code' | 'markdown', index?: number) => {
      if (!activeChapter) return;

      const newCell: NotebookCell = {
        id: uuidv4(),
        type,
        content: '',
        outputs: [],
      };

      setBook((prevBook) => {
        const updatedChapters = prevBook.chapters.map((chapter) => {
          if (chapter.id === prevBook.activeChapterId) {
            const cells = [...chapter.notebook.cells];
            if (typeof index === 'number') {
              cells.splice(index + 1, 0, newCell);
            } else {
              cells.push(newCell);
            }
            return {
              ...chapter,
              notebook: {
                ...chapter.notebook,
                cells,
              },
            };
          }
          return chapter;
        });

        return {
          ...prevBook,
          chapters: updatedChapters,
        };
      });
    },
    [activeChapter]
  );

  const updateCell = useCallback(
    (id: string, content: string) => {
      if (!activeChapter) return;

      setBook((prevBook) => {
        const updatedChapters = prevBook.chapters.map((chapter) => {
          if (chapter.id === prevBook.activeChapterId) {
            return {
              ...chapter,
              notebook: {
                ...chapter.notebook,
                cells: chapter.notebook.cells.map((cell) =>
                  cell.id === id ? { ...cell, content } : cell
                ),
              },
            };
          }
          return chapter;
        });

        return {
          ...prevBook,
          chapters: updatedChapters,
        };
      });
    },
    [activeChapter]
  );

  const deleteCell = useCallback(
    (id: string) => {
      if (!activeChapter) return;

      setBook((prevBook) => {
        const updatedChapters = prevBook.chapters.map((chapter) => {
          if (chapter.id === prevBook.activeChapterId) {
            return {
              ...chapter,
              notebook: {
                ...chapter.notebook,
                cells: chapter.notebook.cells.filter((cell) => cell.id !== id),
              },
            };
          }
          return chapter;
        });

        return {
          ...prevBook,
          chapters: updatedChapters,
        };
      });
    },
    [activeChapter]
  );

  const moveCell = useCallback(
    (id: string, direction: 'up' | 'down') => {
      if (!activeChapter) return;

      setBook((prevBook) => {
        const updatedChapters = prevBook.chapters.map((chapter) => {
          if (chapter.id === prevBook.activeChapterId) {
            const cells = [...chapter.notebook.cells];
            const index = cells.findIndex((cell) => cell.id === id);
            if (direction === 'up' && index > 0) {
              [cells[index - 1], cells[index]] = [cells[index], cells[index - 1]];
            } else if (direction === 'down' && index < cells.length - 1) {
              [cells[index], cells[index + 1]] = [cells[index + 1], cells[index]];
            }
            return {
              ...chapter,
              notebook: {
                ...chapter.notebook,
                cells,
              },
            };
          }
          return chapter;
        });

        return {
          ...prevBook,
          chapters: updatedChapters,
        };
      });
    },
    [activeChapter]
  );

  const handleAddChapter = useCallback(() => {
    setBook((prevBook) => {
      const newChapter = createNewChapter(prevBook.chapters.length);
      const newBook = {
        chapters: [...prevBook.chapters, newChapter],
        activeChapterId: newChapter.id,
      };
      saveBook(newBook);
      return newBook;
    });
  }, [saveBook]);

  const handleDeleteChapter = useCallback(
    (chapterId: string) => {
      setBook((prevBook) => {
        const updatedChapters = prevBook.chapters.filter(
          (chapter) => chapter.id !== chapterId
        );
        const newBook = {
          chapters: updatedChapters,
          activeChapterId:
            prevBook.activeChapterId === chapterId
              ? updatedChapters[0]?.id || null
              : prevBook.activeChapterId,
        };
        saveBook(newBook);
        return newBook;
      });
    },
    [saveBook]
  );

  const handleRenameChapter = useCallback(
    (chapterId: string, newTitle: string) => {
      setBook((prevBook) => {
        const newBook = {
          ...prevBook,
          chapters: prevBook.chapters.map((chapter) =>
            chapter.id === chapterId
              ? { ...chapter, title: newTitle }
              : chapter
          ),
        };
        saveBook(newBook);
        return newBook;
      });
    },
    [saveBook]
  );

  const handleChaptersReorder = useCallback(
    (newChapters: Chapter[]) => {
      setBook((prevBook) => {
        const newBook = {
          ...prevBook,
          chapters: newChapters,
        };
        saveBook(newBook);
        return newBook;
      });
    },
    [saveBook]
  );

  const executeNotebook = useCallback(async () => {
    if (!activeChapter) return;

    setExecuting(true);
    setError('');
    const ipynb = {
      cells: activeChapter.notebook.cells.map((cell) => {
        const format: CellContent = {
          cell_type: cell.type,
          metadata: {},
          source: [cell.content],
        };

        if (cell.type === 'code') {
          format.outputs = cell.outputs?.map((output) => ({
            output_type: 'stream',
            text: [output],
          }));
          format.execution_count = 0;
        }

        return format;
      }),
      metadata: activeChapter.notebook.metadata,
      nbformat: 4,
      nbformat_minor: 5,
    };

    try {
      const preview = await backendService(JSON.stringify(ipynb), uuidv4());
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setPreviewUrl(preview.url);

      // Poll for status
      const pollStatus = async (url: string) => {
        try {
          while (true) {
            try {
              const response = await axios.post('/api/success', {
                previewUrl: url,
              });
              if (response.status === 200) {
                if (!response.data.done) {
                  setError(response.data.error);
                }
                break;
              }
            } catch (e) {
              // Pass 404 Error
              await new Promise((resolve) => setTimeout(resolve, 3000)); // 3-second delay
            }
          }
        } catch (error) {
          console.error('Error while polling status:', error);
        }
      };

      await pollStatus(preview.url);
      if (frameRef.current) {
        frameRef.current.src = preview.url;
      }
    } catch (error) {
      console.error('Error during notebook execution:', error);
    } finally {
      setExecuting(false);
    }
  }, [activeChapter]);

  const importBook = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = JSON.parse(e.target?.result as string);
          const chapters = content.chapters.map((chapter: any) => ({
            id: uuidv4(),
            title: chapter.title,
            notebook: {
              cells: chapter.notebook.cells.map((cell: any) => ({
                id: uuidv4(),
                type: cell.type,
                content: cell.content,
                outputs: cell.outputs || []
              })),
              metadata: chapter.notebook.metadata
            }
          }));
          
          setBook({
            activeChapterId: "",
            chapters
          });
          setFileName(content.title);
  
        } catch (error) {
          console.error('Error importing book:', error);
        } finally {
          (event.target as HTMLInputElement).value = "";
        }
      };
      reader.readAsText(file);
    }
  };
  
  const exportBook = () => {
    const mbcData = {
      title: fileName,
      chapters: book.chapters.map(chapter => ({
        title: chapter.title,
        notebook: {
          cells: chapter.notebook.cells.map(cell => ({
            type: cell.type,
            content: cell.content,
            outputs: cell.outputs
          })),
          metadata: chapter.notebook.metadata
        }
      }))
    };
  
    const blob = new Blob([JSON.stringify(mbcData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName.replace(/\s+/g, '_')}.mbc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Toolbar
        onAddCodeCell={() => addCell('code')}
        onAddMarkdownCell={() => addCell('markdown')}
        onImportNotebook={importBook}
        onExportNotebook={exportBook}
        onExecute={executeNotebook}
        executing={executing}
        fileName={fileName}
        setFileName={setFileName}
      />
      <div className="flex">
        <ChapterSidebar
          chapters={book.chapters}
          activeChapterId={book.activeChapterId}
          onChapterSelect={(chapterId) =>
            setBook((prev) => ({ ...prev, activeChapterId: chapterId }))
          }
          onChaptersReorder={handleChaptersReorder}
          onAddChapter={handleAddChapter}
          onDeleteChapter={handleDeleteChapter}
          onRenameChapter={handleRenameChapter}
        />
        <div className="flex-1 grid grid-cols-2">
          <div className="p-4 overflow-y-auto max-h-[calc(100vh-64px)]">
            <div className="space-y-1">
              {activeChapter?.notebook.cells.map((cell, index) => (
                <div key={cell.id}>
                  <Cell
                    cell={cell}
                    onUpdate={updateCell}
                    onDelete={deleteCell}
                    onMoveUp={(id) => moveCell(id, 'up')}
                    onMoveDown={(id) => moveCell(id, 'down')}
                    isFirst={index === 0}
                    isLast={
                      index === activeChapter.notebook.cells.length - 1
                    }
                  />
                  <div className="h-1 group relative">
                    <div className="absolute inset-x-0 -top-2 h-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                      <div className="w-full flex h-px bg-gray-700" />
                      <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => addCell('code', index)}
                          className="h-6 min-w-[80px] bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full text-xs"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add Code
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => addCell('markdown', index)}
                          className="h-6 min-w-[80px] bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full text-xs"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add Markdown
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-900 border-l border-gray-700 h-[calc(100vh-74px)] sticky top-[64px]">
            <Preview
              previewUrl={previewUrl}
              frameRef={frameRef}
              executing={executing}
              error={error}
            />
          </div>
        </div>
      </div>
    </div>
  );
}