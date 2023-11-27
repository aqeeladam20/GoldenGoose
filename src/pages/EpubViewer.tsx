// EpubViewer.tsx
import React, { useEffect, useRef } from 'react';
import ePub, { Book, Rendition } from 'epubjs';
import './EpubViewer.css'; // Import the CSS file

interface EpubViewerProps {
  url: string;
}

const EpubViewer: React.FC<EpubViewerProps> = ({ url }) => {
  const viewerRef = useRef<HTMLDivElement | null>(null);
  let book: Book | null = null;
  let rendition: Rendition | null = null;

  useEffect(() => {
    if (!viewerRef.current) return;

    book = ePub(url);

    rendition = book.renderTo(viewerRef.current, {
      width: '100%',
      height: '600px',
    });

    rendition.display();

    return () => {
      if (rendition) {
        rendition.destroy();
      }
      if (book) {
        book.destroy();
      }
    };
  }, [url]);

  const handlePrevPage = () => {
    if (rendition) {
      rendition.prev();
    }
  };

  const handleNextPage = () => {
    if (rendition) {
      rendition.next();
    }
  };

  return (
    <div className="epub-viewer-container">
      <div ref={viewerRef} className="epub-viewer-content" />
      <div className="epub-viewer-buttons">
        {/* Explicit buttons for next and previous page with styles */}
        <button onClick={handlePrevPage} className="epub-viewer-button">Previous Page</button>
        <button onClick={handleNextPage} className="epub-viewer-button">Next Page</button>
      </div>
    
    </div>

  );
};

export default EpubViewer;