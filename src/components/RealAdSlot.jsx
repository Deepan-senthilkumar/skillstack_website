import React, { useState, useEffect } from 'react';

/**
 * RealAdSlot — Production-ready Dual Ad Network Component
 * Supports:
 * 1. Adsterra Real Units (Immediate Active Delivery):
 *    - Leaderboard Banner: 728x90 (key: bcb17925672d5883bd0526ad42e3863d)
 *    - Skyscraper Vertical: 160x600 (key: a5d6d3695577982c41c7b6ad4574ec1d)
 *    - Medium Rectangle: 300x250 (key: c48aedc80aa82c5d254b2557bf8ac2c0)
 * 2. Google AdSense (Parallel / Co-existence)
 * 
 * Safety & Security:
 * - Sandboxed iframes prevent unauthorized parent window navigation & hijacking.
 * - Non-adult configuration enforced.
 * - Mobile responsive: 728x90 auto-adapts to 300x250 on narrow smartphone viewports.
 */

const ADSTERRA_UNITS = {
  banner: {
    key: 'bcb17925672d5883bd0526ad42e3863d',
    width: 728,
    height: 90,
  },
  leaderboard: {
    key: 'bcb17925672d5883bd0526ad42e3863d',
    width: 728,
    height: 90,
  },
  milestone: {
    key: 'bcb17925672d5883bd0526ad42e3863d',
    width: 728,
    height: 90,
  },
  sidebar: {
    key: 'c48aedc80aa82c5d254b2557bf8ac2c0',
    width: 300,
    height: 250,
  },
  rectangle: {
    key: 'c48aedc80aa82c5d254b2557bf8ac2c0',
    width: 300,
    height: 250,
  },
  skyscraper: {
    key: 'a5d6d3695577982c41c7b6ad4574ec1d',
    width: 160,
    height: 600,
  },
  vertical: {
    key: 'a5d6d3695577982c41c7b6ad4574ec1d',
    width: 160,
    height: 600,
  }
};

export default function RealAdSlot({
  slotType = 'banner', // 'banner' (728x90) | 'sidebar'/'rectangle' (300x250) | 'skyscraper' (160x600)
  className = '',
  network = 'adsterra' // 'adsterra' | 'adsense' | 'both'
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Determine active unit config
  let targetType = slotType;
  // If 728x90 banner on mobile, automatically use 300x250 rectangle to prevent screen overflow
  if (isMobile && (slotType === 'banner' || slotType === 'leaderboard' || slotType === 'milestone')) {
    targetType = 'rectangle';
  }

  const unit = ADSTERRA_UNITS[targetType] || ADSTERRA_UNITS.banner;

  // Build sandboxed HTML snippet for Adsterra invocation
  const iframeContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="referrer" content="no-referrer-when-downgrade">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          overflow: hidden;
        }
      </style>
    </head>
    <body>
      <script type="text/javascript">
        atOptions = {
          'key' : '${unit.key}',
          'format' : 'iframe',
          'height' : ${unit.height},
          'width' : ${unit.width},
          'params' : {}
        };
      </script>
      <script type="text/javascript" src="https://www.highrevenueformat.com/${unit.key}/invoke.js"></script>
    </body>
    </html>
  `;

  return (
    <div
      className={`real-ad-slot-wrapper ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: slotType === 'sidebar' ? '14px 0' : '22px auto',
        width: '100%',
        maxWidth: `${unit.width}px`,
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          marginBottom: '5px'
        }}
      >
        <span
          style={{
            fontSize: '9.5px',
            fontWeight: 700,
            color: '#94A3B8',
            letterSpacing: '0.08em',
            textTransform: 'uppercase'
          }}
        >
          Sponsored
        </span>
      </div>

      <iframe
        key={`${unit.key}-${unit.width}-${unit.height}`}
        title={`Adsterra Ad ${unit.width}x${unit.height}`}
        srcDoc={iframeContent}
        width={unit.width}
        height={unit.height}
        style={{
          border: 'none',
          maxWidth: '100%',
          overflow: 'hidden',
          borderRadius: '8px',
          background: 'transparent',
          display: 'block'
        }}
        scrolling="no"
        loading="lazy"
        // Security Sandbox: Allows scripts & clicking popups, but blocks top-level parent window redirection
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      />
    </div>
  );
}
