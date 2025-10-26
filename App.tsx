
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ImageUploader } from './components/ImageUploader';
import { ResultsDisplay } from './components/ResultsDisplay';
import { generatePassportPhotos } from './services/geminiService';
import type { GeneratedImage } from './types';

const App: React.FC = () => {
  const [originalFiles, setOriginalFiles] = useState<File[]>([]);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (files: File[]) => {
    setOriginalFiles(files);
    setGeneratedImages([]);
    setError(null);
  };

  const handleGenerateClick = useCallback(async () => {
    if (originalFiles.length === 0) {
      setError('Please upload at least one image.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);

    try {
      const results = await generatePassportPhotos(originalFiles);
      setGeneratedImages(results);
    } catch (err) {
      console.error(err);
      setError('Failed to generate images. Please check the console for details.');
    } finally {
      setIsLoading(false);
    }
  }, [originalFiles]);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 md:p-8">
          <p className="text-center text-slate-600 dark:text-slate-400 mb-6">
            Upload one or more photos to transform them into professional, studio-quality passport images. Our AI will generate multiple options for you.
          </p>
          <ImageUploader onImagesUpload={handleImageUpload} onGenerate={handleGenerateClick} isLoading={isLoading} />
          {error && (
            <div className="mt-6 p-4 bg-red-100 dark:bg-red-900/50 border border-red-400 text-red-700 dark:text-red-300 rounded-lg text-center">
              {error}
            </div>
          )}
        </div>

        <ResultsDisplay
          isLoading={isLoading}
          generatedImages={generatedImages}
          originalFiles={originalFiles}
        />
      </main>
      <Footer />
    </div>
  );
};

export default App;
