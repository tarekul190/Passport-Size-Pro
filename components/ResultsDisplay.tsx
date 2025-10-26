
import React from 'react';
import type { GeneratedImage } from '../types';
import { ImageCard } from './ImageCard';
import { Spinner } from './Spinner';

interface ResultsDisplayProps {
  isLoading: boolean;
  generatedImages: GeneratedImage[];
  originalFiles: File[];
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ isLoading, generatedImages, originalFiles }) => {
  if (isLoading) {
    return (
      <div className="mt-12 text-center">
        <Spinner />
        <p className="mt-4 text-lg font-medium text-slate-600 dark:text-slate-400">
          AI is working its magic...
        </p>
        <p className="text-sm text-slate-500">This can take a moment, please wait.</p>
      </div>
    );
  }

  if (generatedImages.length === 0) {
    return null;
  }

  const groupedImages = generatedImages.reduce((acc, image) => {
    (acc[image.originalFileName] = acc[image.originalFileName] || []).push(image);
    return acc;
  }, {} as Record<string, GeneratedImage[]>);

  return (
    <div className="mt-12 space-y-12">
      {originalFiles.map((file) => (
        <div key={file.name}>
          <h2 className="text-xl md:text-2xl font-bold mb-4 border-b-2 border-sky-500 pb-2 text-slate-800 dark:text-slate-200">
            Results for: <span className="font-mono text-base bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded">{file.name}</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {groupedImages[file.name]?.map((image, index) => (
              <ImageCard
                key={`${file.name}-${index}`}
                src={image.src}
                prompt={image.prompt}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
