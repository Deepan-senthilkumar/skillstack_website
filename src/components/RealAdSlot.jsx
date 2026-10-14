import React, { useEffect, useRef, useState } from 'react';

/**
 * RealAdSlot — Production-ready Google AdSense & Real Ad Network Component
 * 
 * To start earning real money:
 * 1. Create a free account at https://adsense.google.com
 * 2. Get your Publisher ID (e.g. ca-pub-1234567890123456)
 * 3. Add to skillstack_website/.env:
 *    VITE_ADSENSE_CLIENT_ID=ca-pub-1234567890123456
 *    VITE_ADSENSE_BANNER_SLOT=1234567890
 *    VITE_ADSENSE_SIDEBAR_SLOT=9876543210
 */

const ADSENSE_CLIENT = import.meta.env.VITE_ADSENSE_CLIENT_ID || 'ca-pub-6469063098847756';
const ADSENSE_BANNER_SLOT = import.meta.env.VITE_ADSENSE_BANNER_SLOT || '2336514484';
const ADSENSE_SIDEBAR_SLOT = import.meta.env.VITE_ADSENSE_SIDEBAR_SLOT || '2336514484';

export default function RealAdSlot({
  slotType = 'banner', // 'banner' (728x90) | 'sidebar' (300x250) | 'milestone'
  adSlot = '',
  className = '',
  forceReal = false
}) {
  const adRef = useRef(null);
  const adPushedRef = useRef(false);
  const isLocalhost = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  );

  const activeSlot = adSlot || (slotType === 'sidebar' ? ADSENSE_SIDEBAR_SLOT : ADSENSE_BANNER_SLOT);
  const activeClient = ADSENSE_CLIENT;
  const shouldRenderReal = activeClient && (!isLocalhost || forceReal);

  useEffect(() => {
    if (shouldRenderReal && !adPushedRef.current) {
      try {
        // Ensure AdSense script exists in document
        if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
          const script = document.createElement('script');
          script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${activeClient}`;
          script.async = true;
          script.crossOrigin = 'anonymous';
          document.head.appendChild(script);
        }

        // Push ad unit safely once DOM ins node is ready
        const timer = setTimeout(() => {
          try {
            if (window.adsbygoogle && !adPushedRef.current) {
              (window.adsbygoogle = window.adsbygoogle || []).push({});
              adPushedRef.current = true;
            }
          } catch (err) {
            // Suppress duplicate push warnings in dev strict mode
            console.debug('AdSense push caught:', err);
          }
        }, 100);

        return () => clearTimeout(timer);
      } catch (e) {
        console.warn('AdSense ad push error:', e);
      }
    }
  }, [activeClient, activeSlot, shouldRenderReal]);

  // If real AdSense credentials are configured:
  if (shouldRenderReal) {
    const isBanner = slotType === 'banner' || slotType === 'milestone';
    return (
      <div
        className={`real-ad-wrapper ${className}`}
        style={{
          margin: slotType === 'sidebar' ? '12px 0' : '20px auto',
          textAlign: 'center',
          overflow: 'hidden',
          maxWidth: isBanner ? '728px' : '300px',
          width: '100%'
        }}
      >
        {/* skillstackdisplayads */}
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{
            display: 'inline-block',
            width: isBanner ? '728px' : '300px',
            maxWidth: '100%',
            height: isBanner ? '90px' : '250px'
          }}
          data-ad-client={activeClient}
          data-ad-slot={activeSlot}
          data-ad-format={isBanner ? undefined : 'rectangle'}
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // If no real AdSense client is configured or ad not loaded, do NOT show any empty boxes
  return null;
}
