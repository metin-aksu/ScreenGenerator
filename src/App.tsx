import { useState, useMemo, useRef } from 'react';
import PhoneFrame from './components/PhoneFrame';
import DownloadButton from './components/DownloadButton';
import './index.css';

// Rengin açık mı koyu mu olduğunu hesapla
function isLightColor(hexColor: string): boolean {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  // Luminance formülü
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}

function App() {
  const [image, setImage] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState('#0a0a0f');
  const colorInputRef = useRef<HTMLInputElement>(null);

  const isLight = useMemo(() => isLightColor(bgColor), [bgColor]);

  const handleImageSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    setImage(null);
  };

  const handleColorButtonClick = () => {
    colorInputRef.current?.click();
  };

  return (
    <div
      className={`app ${isLight ? 'light-mode' : ''}`}
      style={{ backgroundColor: bgColor }}
    >
      <header className="header">
        <h1>Screenshot Generator</h1>
      </header>

      <main className="main-content">
        <PhoneFrame image={image} onImageSelect={handleImageSelect} />

        <div className="buttons-container">
          <DownloadButton image={image} bgColor={bgColor} />

          <button
            className="color-btn"
            onClick={handleColorButtonClick}
            title="Arka plan rengi seç"
          >
            <span
              className="color-preview"
              style={{ backgroundColor: bgColor }}
            />
            <span>Arka Plan Rengi</span>
          </button>
          <input
            ref={colorInputRef}
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="hidden-color-input"
          />

          {image && (
            <button className="clear-btn" onClick={handleClear}>
              Temizle
            </button>
          )}
        </div>

        <p className="info-text">
          Çıktı boyutu: 1242 × 2688 piksel (iPhone 6.5" için)
        </p>
      </main>
    </div>
  );
}

export default App;
