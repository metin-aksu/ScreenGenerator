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

    // Önce kullanıcı resmini yükle
    const userImg = new Image();
    userImg.crossOrigin = 'anonymous';
    userImg.src = image;

    userImg.onload = () => {
      // Sonra çerçeve resmini yükle
      const frameImg = new Image();
      frameImg.crossOrigin = 'anonymous'; // Local dosya için gerekmeyebilir ama zararı yok
      frameImg.src = '/phone-frame.png'; // Public klasöründen

      frameImg.onload = () => {
        // --- 1. Arka Plan ---
        if (!transparentBg) {
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // --- 2. Başlık ve Frame Konumu Hesaplama ---

        // Frame Boyutları (Canvas'a oranla)
        // Frame resminin aspect ratio'sunu koruyarak genişliği ayarlayalım
        const frameAspectRatio = frameImg.width / frameImg.height;
        const targetFrameWidth = canvas.width * 0.9; // %90 genişlik (biraz daha geniş olsun)
        const targetFrameHeight = targetFrameWidth / frameAspectRatio;

        // Varsayılan Frame Konumu (Ortalı)
        let phoneX = (canvas.width - targetFrameWidth) / 2;
        let phoneY = (canvas.height - targetFrameHeight) / 2;

        // Başlık varsa kaydır
        if (titleText) {
          // Preview ve Canvas oranlarını eşitleme mantığı:
          // Preview Container (phone-section) Genişliği: 330px (index.css)
          // Preview Padding: 2rem (32px) * 2 = 64px
          // Preview Kullanılabilir Alan: 330 - 64 = 266px

          const previewContainerWidth = 330;
          const canvasWidth = canvas.width; // 1242

          // Ölçek Faktörü: Canvas / Preview
          const scaleFactor = canvasWidth / previewContainerWidth;

          // Font boyutunu ölçekle
          const actualFontSize = titleSize * scaleFactor;

          ctx.font = `bold ${actualFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
          ctx.fillStyle = titleColor;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';

          // Padding ve Genişlik Ayarları
          // Preview padding oranını koru
          const previewPaddingTotal = 64; // 2rem left + 2rem right
          const canvasPaddingTotal = previewPaddingTotal * scaleFactor;

          const titleMarginTop = 80; // Sabit kalabilir veya oranlanabilir
          const titleX = canvas.width / 2;
          const maxWidth = canvasWidth - canvasPaddingTotal; // ~1001px
          const lineHeight = actualFontSize * 1.2;

          // Text Wrapping
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

          lines.forEach((lineText, index) => {
            ctx.fillText(lineText.trim(), titleX, titleMarginTop + (index * lineHeight));
          });

          const totalTextHeight = lines.length * lineHeight;
          const phoneMarginTop = 40;
          phoneY = titleMarginTop + totalTextHeight + phoneMarginTop;

          // Taşma kontrolü kaldırıldı: Kullanıcı taşsa bile aşağı kaymasını istiyor (crop olsun)
          // const maxPhoneY = canvas.height - targetFrameHeight - 50;
          // if (phoneY > maxPhoneY) {
          //   phoneY = maxPhoneY;
          // }
        }

        // --- 3. Frame Çizimi ---
        // Gölge efekti (Frame resminin kendisine ait gölgesi yoksa ekleyelim)
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        ctx.shadowBlur = 50;
        ctx.shadowOffsetY = 30;
        ctx.drawImage(frameImg, phoneX, phoneY, targetFrameWidth, targetFrameHeight);
        ctx.restore();

        // --- 4. Ekran İçeriği Çizimi ---

        // Ekranın frame içindeki konumu (CSS'teki % değerlerine göre)
        // CSS: top: 1.8%, left: 4%, width: 92%, height: 96.5%
        const screenMarginLeft = targetFrameWidth * 0.04;
        const screenMarginTop = targetFrameHeight * 0.018;
        const screenWidth = targetFrameWidth * 0.92;
        const screenHeight = targetFrameHeight * 0.965;

        const screenX = phoneX + screenMarginLeft;
        const screenY = phoneY + screenMarginTop;
        const screenRadius = screenWidth * 0.12; // Köşe yuvarlaklığı tahmini

        // Clip (Kesme) Alanı Oluştur
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(screenX, screenY, screenWidth, screenHeight, screenRadius);
        ctx.clip();

        // Kullanıcı resmini "cover" modunda çiz
        const imgRatio = userImg.width / userImg.height;
        const screenRatio = screenWidth / screenHeight;
        let drawWidth, drawHeight, drawX, drawY;

        if (imgRatio > screenRatio) {
          drawHeight = screenHeight;
          drawWidth = userImg.width * (screenHeight / userImg.height);
          drawX = screenX + (screenWidth - drawWidth) / 2;
          drawY = screenY;
        } else {
          drawWidth = screenWidth;
          drawHeight = userImg.height * (screenWidth / userImg.width);
          drawX = screenX;
          drawY = screenY + (screenHeight - drawHeight) / 2;
        }

        ctx.fillStyle = '#000000'; // Resim yoksa siyah
        ctx.fillRect(screenX, screenY, screenWidth, screenHeight);
        ctx.drawImage(userImg, drawX, drawY, drawWidth, drawHeight);
        ctx.restore();

        // --- 5. Dynamic Island Overlay ---
        // Üstüne siyah hap şeklinde island çizelim ki resim onu kapatmasın
        const islandWidth = targetFrameWidth * 0.28; // Tahmini oran
        const islandHeight = islandWidth * 0.28;
        const islandX = phoneX + (targetFrameWidth - islandWidth) / 2;
        const islandY = screenY + (screenHeight * 0.015); // Biraz aşağıda

        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.roundRect(islandX, islandY, islandWidth, islandHeight, islandHeight / 2);
        ctx.fill();

        // --- 6. İndirme ---
        const link = document.createElement('a');
        link.download = `app_screen_${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      };
    };
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
