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
      <div className="phone-frame">
        <div className="phone-left-button"></div>
        <div className="phone-screen" onClick={handleClick}>
          <div className="phone-screen-content">
            {image ? (
              <img src={image} alt="Preview" className="preview-image" />
            ) : (
              <div className="upload-placeholder">
                <div className="plus-icon">+</div>
                <span className="upload-text">Upload Image</span>
              </div>
            )}
          </div>
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
