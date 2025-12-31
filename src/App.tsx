import { useState, useRef } from 'react';
import PhoneFrame from './components/PhoneFrame';
import DownloadButton from './components/DownloadButton';
import './index.css';



function App() {
  const [image, setImage] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [transparentBg, setTransparentBg] = useState(false);

  // Title state
  const [titleText, setTitleText] = useState('');
  const [titleColor, setTitleColor] = useState('#000000');
  const [titleSize, setTitleSize] = useState(40);

  const colorInputRef = useRef<HTMLInputElement>(null);
  const titleColorInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    setImage(null);
    setTitleText('');
  };

  const handleColorButtonClick = () => {
    colorInputRef.current?.click();
  };

  const handleTitleColorClick = () => {
    titleColorInputRef.current?.click();
  };

  return (
    <div className="app light-mode">
      <main className="main-content">
        <div
          className="phone-section"
          style={{ backgroundColor: transparentBg ? 'transparent' : bgColor }}
        >
          {titleText && (
            <div
              className="title-overlay"
              style={{
                color: titleColor,
                fontSize: `${titleSize}px`,
                marginBottom: '20px'
              }}
            >
              {titleText}
            </div>
          )}
          <PhoneFrame image={image} onImageSelect={handleImageSelect} />
        </div>

        <div className="controls-section">
          <header className="header">
            <h1>Screen Generator</h1>
            <p className="subtitle">Create screen for App Store or Play Store</p>
          </header>

          <div className="buttons-container">
            {/* Title Controls */}
            <div className="control-group">
              <label className="control-label">Title</label>
              <input
                type="text"
                value={titleText}
                onChange={(e) => setTitleText(e.target.value)}
                placeholder="Add title..."
                className="text-input"
              />

              {titleText && (
                <div className="sub-controls">
                  <div className="title-color-control">
                    <button
                      className="color-btn small"
                      onClick={handleTitleColorClick}
                      title="Text Color"
                    >
                      <span className="color-preview" style={{ backgroundColor: titleColor }} />
                    </button>
                    <input
                      ref={titleColorInputRef}
                      type="color"
                      value={titleColor}
                      onChange={(e) => setTitleColor(e.target.value)}
                      className="hidden-color-input"
                    />
                  </div>

                  <div className="size-control">
                    <span className="size-label">A</span>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      value={titleSize}
                      onChange={(e) => setTitleSize(Number(e.target.value))}
                      className="size-slider"
                    />
                    <span className="size-label big">A</span>
                  </div>
                </div>
              )}
            </div>

            <div className="divider"></div>

            <button
              className="color-btn"
              onClick={handleColorButtonClick}
              title="Select background color"
              disabled={transparentBg}
            >
              <span
                className="color-preview"
                style={{ backgroundColor: transparentBg ? 'transparent' : bgColor }}
              />
              <span>Background Color</span>
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
              <span>Transparent</span>
            </label>

            <DownloadButton
              image={image}
              bgColor={bgColor}
              transparentBg={transparentBg}
              titleText={titleText}
              titleColor={titleColor}
              titleSize={titleSize}
            />

            {image && (
              <button className="clear-btn" onClick={handleClear}>
                Clear
              </button>
            )}
          </div>

          <p className="info-text">
            Output size: 1242 × 2688 pixels (for 6.5")
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;
