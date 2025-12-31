import React, { useRef } from 'react';
import './PhoneFrame.css';

interface PhoneFrameProps {
  image: string | null;
  onImageSelect: (file: File) => void;
}

const PhoneFrame: React.FC<PhoneFrameProps> = ({ image, onImageSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  return (
    <div className="phone-frame-container">
      <div className="phone-frame-wrapper">
        {/* Çerçeve Resmi */}
        <img src="/phone-frame.png" alt="Phone Frame" className="frame-image" />

        {/* Ekran Alanı (Resmin üstüne yerleştirilecek) */}
        <div className="screen-container" onClick={handleClick}>
          {image ? (
            <div className="preview-container">
              <img src={image} alt="Preview" className="preview-image" />
              {/* Dynamic Island Overlay (Opsiyonel, eğer resimdeki kaybolursa diye) */}
              <div className="dynamic-island-overlay"></div>
            </div>
          ) : (
            <div className="upload-placeholder">
              <div className="plus-icon">+</div>
              <span className="upload-text">Upload Image</span>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="file-input"
        />
      </div>
    </div>
  );
};

export default PhoneFrame;
