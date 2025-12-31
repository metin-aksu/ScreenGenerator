import React from 'react';

interface DownloadButtonProps {
  image: string | null;
  bgColor: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ image, bgColor }) => {
  const handleDownload = () => {
    if (!image) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // App Store Connect için gerekli boyutlar (iPhone 6.5")
    canvas.width = 1242;
    canvas.height = 2688;

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      // Arka plan rengi (kullanıcının seçtiği)
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Telefon çerçevesi boyutları (canvas'a oranla)
      const phoneWidth = canvas.width * 0.85;
      const phoneHeight = canvas.height * 0.82;
      const phoneX = (canvas.width - phoneWidth) / 2;
      const phoneY = (canvas.height - phoneHeight) / 2;
      const phoneRadius = 100;

      // Telefon çerçevesi (dış)
      const frameGradient = ctx.createLinearGradient(phoneX, phoneY, phoneX, phoneY + phoneHeight);
      frameGradient.addColorStop(0, '#2d2d2d');
      frameGradient.addColorStop(1, '#1a1a1a');

      ctx.fillStyle = frameGradient;
      ctx.beginPath();
      ctx.roundRect(phoneX, phoneY, phoneWidth, phoneHeight, phoneRadius);
      ctx.fill();

      // Çerçeve border (metalik efekt)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Ekran alanı
      const screenPadding = 25;
      const screenX = phoneX + screenPadding;
      const screenY = phoneY + screenPadding;
      const screenWidth = phoneWidth - (screenPadding * 2);
      const screenHeight = phoneHeight - (screenPadding * 2);
      const screenRadius = 80;

      // Ekran arka planı (siyah)
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.roundRect(screenX, screenY, screenWidth, screenHeight, screenRadius);
      ctx.fill();

      // Ekran içine resmi çiz (clip ile)
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(screenX, screenY, screenWidth, screenHeight, screenRadius);
      ctx.clip();

      // Resmi ekran boyutunda çiz (cover gibi davran)
      const imgRatio = img.width / img.height;
      const screenRatio = screenWidth / screenHeight;

      let drawWidth, drawHeight, drawX, drawY;

      if (imgRatio > screenRatio) {
        drawHeight = screenHeight;
        drawWidth = img.width * (screenHeight / img.height);
        drawX = screenX + (screenWidth - drawWidth) / 2;
        drawY = screenY;
      } else {
        drawWidth = screenWidth;
        drawHeight = img.height * (screenWidth / img.width);
        drawX = screenX;
        drawY = screenY + (screenHeight - drawHeight) / 2;
      }

      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
      ctx.restore();

      // Dynamic Island
      const islandWidth = 220;
      const islandHeight = 65;
      const islandX = phoneX + (phoneWidth - islandWidth) / 2;
      const islandY = screenY + 25;

      ctx.fillStyle = '#1a1a1a';
      ctx.beginPath();
      ctx.roundRect(islandX, islandY, islandWidth, islandHeight, 35);
      ctx.fill();

      // Sağ yan butonlar
      ctx.fillStyle = '#3a3a3a';
      // Küçük buton
      ctx.beginPath();
      ctx.roundRect(phoneX + phoneWidth - 2, phoneY + 250, 8, 60, [0, 4, 4, 0]);
      ctx.fill();
      // Büyük buton
      ctx.beginPath();
      ctx.roundRect(phoneX + phoneWidth - 2, phoneY + 330, 8, 120, [0, 4, 4, 0]);
      ctx.fill();

      // Sol yan buton
      ctx.beginPath();
      ctx.roundRect(phoneX - 6, phoneY + 280, 8, 80, [4, 0, 0, 4]);
      ctx.fill();

      // PNG olarak indir
      const link = document.createElement('a');
      link.download = `app_screenshot_${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };

    img.src = image;
  };

  return (
    <button
      className="download-btn"
      onClick={handleDownload}
      disabled={!image}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
      İndir (1242×2688)
    </button>
  );
};

export default DownloadButton;
