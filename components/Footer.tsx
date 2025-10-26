
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-4 mt-12 bg-slate-200 dark:bg-slate-900/50">
      <div className="container mx-auto text-center text-sm text-slate-600 dark:text-slate-400">
        <p>
          &copy; 2026 Developer By{' '}
          <a
            href="https://wa.link/hnt3t7"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-sky-600 dark:text-sky-400 hover:underline"
          >
            Tarekul Software Limited
          </a>
        </p>
      </div>
    </footer>
  );
};
