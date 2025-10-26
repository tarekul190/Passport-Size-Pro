import React, { useState, useRef } from 'react';

interface ImageUploaderProps {
  onImagesUpload: (files: File[]) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const WandIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M18 4h-2a2 2 0 1 0-4 0H8a2 2 0 0 0-2 2v2" />
        <path d="M12 11v1" />
        <path d="m10 9-1.29.71a1 1 0 0 0-.42 1.2" />
        <path d="m14 9 1.29.71a1 1 0 0 1 .42 1.2" />
        <path d="M5 14.5s2.5-1.5 5-1.5 5 1.5 5 1.5" />
        <path d="M5.5 22a2.5 2.5 0 0 0 4 1h5a2.5 2.5 0 0 0 4-1" />
    </svg>
);

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesUpload, onGenerate, isLoading }) => {
  const [previews, setPreviews] = useState<string[]>([]);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      onImagesUpload(files);
      // Fix: Explicitly type the arguments in the map callbacks as `File` to resolve type inference issues.
      setFileNames(files.map((f: File) => f.name));
      const newPreviews = files.map((file: File) => URL.createObjectURL(file));
      setPreviews(newPreviews);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <div
        className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 text-center cursor-pointer hover:border-sky-500 dark:hover:border-sky-500 transition-colors"
        onClick={handleUploadClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
        />
        <UploadIcon className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500 mb-2" />
        <p className="font-semibold text-slate-700 dark:text-slate-300">Click to upload or drag & drop</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">PNG, JPG or WEBP. Up to 10MB each.</p>
      </div>

      {previews.length > 0 && (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">Selected Images:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {previews.map((src, index) => (
              <div key={index} className="relative aspect-square">
                <img
                  src={src}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg shadow-sm"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-center">
        <button
          onClick={onGenerate}
          disabled={isLoading || previews.length === 0}
          className="inline-flex items-center justify-center gap-2 px-8 py-3 font-semibold text-white bg-sky-600 rounded-full shadow-lg hover:bg-sky-700 disabled:bg-slate-400 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-sky-300 dark:focus:ring-sky-800"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <WandIcon className="w-5 h-5"/>
              Generate Passport Photos
            </>
          )}
        </button>
      </div>
    </div>
  );
};