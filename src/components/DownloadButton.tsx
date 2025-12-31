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

    canvas.width = 1242;
    canvas.height = 2688;

    const userImg = new Image();
    userImg.crossOrigin = 'anonymous';
    userImg.src = image;

    userImg.onload = () => {
      const frameImg = new Image();
      frameImg.crossOrigin = 'anonymous';
      frameImg.src = '/phone-frame.png';

      frameImg.onload = () => {
        if (!transparentBg) {
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        const frameAspectRatio = frameImg.width / frameImg.height;
        const targetFrameWidth = canvas.width * 0.9;
        const targetFrameHeight = targetFrameWidth / frameAspectRatio;

        let phoneX = (canvas.width - targetFrameWidth) / 2;
        let phoneY = (canvas.height - targetFrameHeight) / 2;

        if (titleText) {
          const previewContainerWidth = 330;
          const canvasWidth = canvas.width;

          const scaleFactor = (canvasWidth / previewContainerWidth) * 1.15;

          const actualFontSize = titleSize * scaleFactor;

          ctx.font = `bold ${actualFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
          ctx.fillStyle = titleColor;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';

          const previewPaddingTotal = 64;
          const canvasPaddingTotal = previewPaddingTotal * scaleFactor;

          const titleMarginTop = 80;
          const titleX = canvas.width / 2;
          const maxWidth = canvasWidth - canvasPaddingTotal;
          const lineHeight = actualFontSize * 1.2;

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
        }

        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        ctx.shadowBlur = 50;
        ctx.shadowOffsetY = 30;
        ctx.drawImage(frameImg, phoneX, phoneY, targetFrameWidth, targetFrameHeight);
        ctx.restore();

        const screenMarginLeft = targetFrameWidth * 0.035;
        const screenMarginTop = targetFrameHeight * 0.016;
        const screenWidth = targetFrameWidth * 0.93;
        const screenHeight = targetFrameHeight * 0.968;

        const screenX = phoneX + screenMarginLeft;
        const screenY = phoneY + screenMarginTop;
        const screenRadius = screenWidth * 0.15;

        ctx.save();
        ctx.beginPath();
        ctx.roundRect(screenX, screenY, screenWidth, screenHeight, screenRadius);
        ctx.clip();

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

        ctx.fillStyle = '#000000';
        ctx.fillRect(screenX, screenY, screenWidth, screenHeight);
        ctx.drawImage(userImg, drawX, drawY, drawWidth, drawHeight);
        ctx.restore();

        const islandWidth = targetFrameWidth * 0.28;
        const islandHeight = islandWidth * 0.28;
        const islandX = phoneX + (targetFrameWidth - islandWidth) / 2;
        const islandY = screenY + (screenHeight * 0.015);

        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.roundRect(islandX, islandY, islandWidth, islandHeight, islandHeight / 2);
        ctx.fill();

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
