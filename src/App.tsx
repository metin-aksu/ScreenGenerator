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
  const [bgColor, setBgColor] = useState('#ffffff');
  const [transparentBg, setTransparentBg] = useState(false);
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
    <div className={`app ${isLight ? 'light-mode' : ''}`}>
      <main className="main-content">
        <div
          className="phone-section"
          style={{ backgroundColor: transparentBg ? 'transparent' : bgColor }}
        >
          <PhoneFrame image={image} onImageSelect={handleImageSelect} />
        </div>

        <div className="controls-section">
          <header className="header">
            <h1>Screenshot Generator</h1>
            <p className="subtitle">App Store Connect için ekran görüntüsü oluşturun</p>
          </header>

          <div className="buttons-container">

            <button
              className="color-btn"
              onClick={handleColorButtonClick}
              title="Arka plan rengi seç"
              disabled={transparentBg}
            >
              <span
                className="color-preview"
                style={{ backgroundColor: transparentBg ? 'transparent' : bgColor }}
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

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={transparentBg}
                onChange={(e) => setTransparentBg(e.target.checked)}
              />
              <span className="checkbox-custom"></span>
              <span>Transparan</span>
            </label>

            <DownloadButton image={image} bgColor={bgColor} transparentBg={transparentBg} />

            {image && (
              <button className="clear-btn" onClick={handleClear}>
                Temizle
              </button>
            )}
          </div>

          <p className="info-text">
            Çıktı boyutu: 1242 × 2688 piksel (iPhone 6.5" için)
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;
