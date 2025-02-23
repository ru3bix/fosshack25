import { useState } from 'react';
import { useLocation } from 'wouter';
import { os } from '@neutralinojs/lib';
import { extractMBook, ExtractionProgress } from '../utils/mbook';

export default function Home() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<ExtractionProgress | null>(null);

  const handleOpenBook = async () => {
    try {
      setLoading(true);
      setProgress({ status: 'Opening file dialog...', current: 0, total: 100 });
      
      const entry = await os.showOpenDialog('Open MBook file', {
        filters: [{ name: 'MBook files', extensions: ['mbook'] }]
      });

      if (entry.length > 0) {
        const filePath = entry[0];
        
        try {
          const { metadata, extractPath } = await extractMBook(filePath, (progress) => {
            setProgress(progress);
          });
          
          setProgress({ status: 'Saving book data...', current: 95, total: 100 });
          console.log(JSON.stringify({
            metadata,
            extractPath,
            currentChapter: metadata.chapters[0]
          }))
          localStorage.setItem('mbook', JSON.stringify({
            metadata,
            extractPath,
            currentChapter: metadata.chapters[0]
          }));

          setProgress({ status: 'Opening book viewer...', current: 100, total: 100 });
          setLocation('/view');
        } catch (error : any) {
          console.error('Extraction error:', error);
          await os.showMessageBox('Error', `Failed to open book: ${error.message}`);
        }
      }
    } catch (error : any) {
      console.error('Open dialog error:', error);
      await os.showMessageBox('Error', `Failed to open file dialog: ${error.message}`);
    } finally {
      setLoading(false);
      setProgress(null);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">MBook Reader</h1>
        <button
          onClick={handleOpenBook}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Opening...' : 'Open Book'}
        </button>
        {progress && (
          <div className="mt-4">
            <p className="text-gray-600 mb-2">{progress.status}</p>
            <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}