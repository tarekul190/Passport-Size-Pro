import React from 'react';

interface ImageCardProps {
  src: string;
  prompt: string;
}

const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);


export const ImageCard: React.FC<ImageCardProps> = ({ src, prompt }) => {
    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = src;
        link.download = `passport-photo-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:scale-105">
      <div className="relative aspect-[3/4]">
        <img src={src} alt={prompt} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-sky-600 rounded-full hover:bg-sky-700 transition-colors">
                <DownloadIcon className="w-4 h-4" />
                Download
            </button>
        </div>
      </div>
    </div>
  );
};