import { cleanErrorOutput, generateRandom4DigitNumber } from '@/lib/utils';
import ReactCodeMirror from '@uiw/react-codemirror';
import React, { useEffect, useState } from 'react';

interface PreviewProps {
  previewUrl: string;
  frameRef: React.MutableRefObject<HTMLIFrameElement | null>;
  executing: boolean;
  error: string;
}

const Preview = ({ previewUrl, frameRef, executing , error }: PreviewProps) => {
  const [progress, setProgress] = useState(0);


  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (executing) {
      interval = setInterval(() => {
        setProgress((prev) => (prev < 80 ? prev + 0.25 : prev));
      }, 300);
    } else {
      setProgress(100);
      setTimeout(() => setProgress(0), 500);
    }

    return () => clearInterval(interval);
  }, [executing]);

  return (
    <div className="h-full relative flex flex-col items-center justify-center text-gray-500">
      <div className="absolute top-0 left-0 w-full h-1 bg-gray-800">
        <div
          className="h-full bg-yellow-500 transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Preview Content */}
      {!previewUrl ? (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-center font-semibold">Preview</span>
        </div>
      ) : (
        error && error != "done\n" ? <div className="h-full w-full p-4 space-y-4 max-h-full overflow-y-auto">
          <div className="flex flex-col">
            <span className='text-red-600 text-2xl'>{`ManimBooks::CompileError <0x0${generateRandom4DigitNumber()}>`}</span>
            <span className='text-xs text-gray-400'>The detailed error will be displayed below. Re execute after fixing the errors! </span>
          </div>
          <ReactCodeMirror
            value={cleanErrorOutput(error)}
            height="auto"
            theme="dark"
            className="border-none"
            editable={false}
            basicSetup={{
              lineNumbers : false
            }}
          />
        </div> : 
        <iframe ref={frameRef} className="w-full h-full" src={previewUrl}></iframe>
      )}
    </div>
  );
};

export default Preview;
