import React from 'react';

interface DownloadButtonProps {
  image: string | null;
  bgColor: string;
  transparentBg: boolean;
  titleText?: string;
  titleColor?: string;
  titleSize?: number;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  image,
  bgColor,
  transparentBg,
  titleText,
  titleColor = '#000000',
  titleSize = 40
}) => {
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
      // Arka plan
      if (!transparentBg) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Telefon boyutları
      const phoneWidth = canvas.width * 0.85;
      const phoneHeight = canvas.height * 0.82;

      // Pozisyon hesaplama
      let phoneX = (canvas.width - phoneWidth) / 2;
      let phoneY = (canvas.height - phoneHeight) / 2;

      // Eğer başlık varsa, başlığı çiz ve telefonu aşağı kaydır
      if (titleText) {
        // Başlık yazı tipi ve ayarları
        // Preview'daki telefon genişliği (280px) ile Canvas'taki telefon genişliği arasındaki oranı buluyoruz
        const previewPhoneWidth = 280;
        const canvasPhoneWidth = canvas.width * 0.85;
        const scaleFactor = canvasPhoneWidth / previewPhoneWidth;
        const actualFontSize = titleSize * scaleFactor;

        ctx.font = `bold ${actualFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
        ctx.fillStyle = titleColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        // Yazı ayarları
        const titleMarginTop = 150;
        const titleX = canvas.width / 2;
        const maxWidth = canvas.width - 200; // Kenarlardan 100px boşluk
        const lineHeight = actualFontSize * 1.2;

        // Metin sarmalama (Text Wrapping) mantığı
        const words = titleText.split(' ');
        let line = '';
        const lines = [];

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = ctx.measureText(testLine);
          const testWidth = metrics.width;

          if (testWidth > maxWidth && n > 0) {
            lines.push(line);
            line = words[n] + ' ';
          } else {
            line = testLine;
          }
        }
        lines.push(line);

        // Satırları çiz
        lines.forEach((lineText, index) => {
          ctx.fillText(lineText.trim(), titleX, titleMarginTop + (index * lineHeight));
        });

        // Telefonu aşağı kaydır
        // Toplam yazı yüksekliği + boşluk kadar aşağı
        const totalTextHeight = lines.length * lineHeight;
        const phoneMarginTop = 80; // Yazı ile telefon arası boşluk
        phoneY = titleMarginTop + totalTextHeight + phoneMarginTop;

        // Taşma kontrolü (eğer çok uzun yazı varsa)
        const maxPhoneY = canvas.height - phoneHeight - 50;
        if (phoneY > maxPhoneY) {
          // En kötü durumda alt sınıra yasla (veya scale küçültülebilir ama şimdilik yaslayalım)
          phoneY = maxPhoneY;
        }
      }

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

      // Ekran arka planı
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.roundRect(screenX, screenY, screenWidth, screenHeight, screenRadius);
      ctx.fill();

      // Ekran içine resmi çiz (clip ile)
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(screenX, screenY, screenWidth, screenHeight, screenRadius);
      ctx.clip();

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

      // Yan butonlar
      ctx.fillStyle = '#3a3a3a';
      // Sağ
      ctx.beginPath();
      ctx.roundRect(phoneX + phoneWidth - 2, phoneY + 250, 8, 60, [0, 4, 4, 0]);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(phoneX + phoneWidth - 2, phoneY + 330, 8, 120, [0, 4, 4, 0]);
      ctx.fill();
      // Sol
      ctx.beginPath();
      ctx.roundRect(phoneX - 6, phoneY + 280, 8, 80, [4, 0, 0, 4]);
      ctx.fill();

      // İndir
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
      Download (1242×2688)
    </button>
  );
};

export default DownloadButton;
