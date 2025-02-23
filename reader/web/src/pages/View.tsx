import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { MBookState } from '../types/mbook';

export default function View() {
  const [, setLocation] = useLocation();
  const [bookState, setBookState] = useState<MBookState>({
    isLoaded: false,
    metadata: null,
    currentChapter: null,
    extractPath: null,
    error: null
  });

  useEffect(() => {
    const storedData = localStorage.getItem('mbook');
    if (!storedData) {
      setLocation('/');
      return;
    }

    try {
      const data = JSON.parse(storedData);
      setBookState({
        isLoaded: true,
        metadata: data.metadata,
        currentChapter: data.currentChapter,
        extractPath: data.extractPath,
        error: null
      });

    } catch (error) {
      setLocation('/');
    }
  }, [setLocation]);

  const handleChapterClick = (chapter: string) => {
    const storedData = localStorage.getItem('mbook');
    if (!storedData) return;

    const data = JSON.parse(storedData);
    data.currentChapter = chapter;
    localStorage.setItem('mbook', JSON.stringify(data));

    setBookState(prev => ({ ...prev, currentChapter: chapter }));
  };

  if (!bookState.isLoaded || !bookState.metadata) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  const getChapterPath = () => {
    if (!bookState.extractPath || !bookState.currentChapter) return '';
    // Remove the leading './' from the path
    const cleanPath = bookState.extractPath.replace(/^(\.\/|\/?resources\/)/, '');
    console.log(cleanPath);
    return `http://localhost:5500/${cleanPath.substring(10)}/${bookState.currentChapter}/index.html`;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Chapters</h2>
          <div className="space-y-2">
            {bookState.metadata.chapters.map((chapter) => (
              <button
                key={chapter}
                onClick={() => handleChapterClick(chapter)}
                className={`w-full text-left px-4 py-2 rounded ${
                  chapter === bookState.currentChapter
                    ? 'bg-blue-100 text-blue-700'
                    : 'hover:bg-gray-100'
                }`}
              >
                {chapter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        {bookState.currentChapter && bookState.extractPath && (
          <iframe
            src={getChapterPath()}
            className="w-full h-full border-none"
            title="Chapter Content"
          />
        )}
      </div>
    </div>
  );
}