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

  // If real AdSense credentials are configured and running on production domain:
  if (shouldRenderReal) {
    const isBanner = slotType === 'banner' || slotType === 'milestone';
    return (
      <div
        className={`real-ad-wrapper ${className}`}
        style={{
          margin: slotType === 'sidebar' ? '16px 0' : '24px auto',
          textAlign: 'center',
          overflow: 'hidden',
          borderRadius: '12px',
          background: '#FAFAFA',
          border: '1px dashed #CBD5E1',
          padding: '10px',
          maxWidth: isBanner ? '760px' : '340px'
        }}
      >
        <div style={{ fontSize: '9px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.06em' }}>
          Advertisement
        </div>
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

  // Development & Config Placeholder (Shows exact ad dimensions & earnings setup)
  if (slotType === 'sidebar') {
    return (
      <div style={{
        marginTop: '16px',
        padding: '16px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
        border: '1.5px dashed #CBD5E1',
        boxSizing: 'border-box',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{
            fontSize: '9.5px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            background: '#E2E8F0',
            color: '#475569',
            padding: '2px 8px',
            borderRadius: '999px'
          }}>
            Google AdSense • 300x250
          </span>
          <span style={{ fontSize: '10px', color: '#16A34A', fontWeight: 800 }}>$ Monetized Slot</span>
        </div>

        <div style={{
          minHeight: '140px',
          background: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '14px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '6px' }}>💰</div>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
            Live Real Ad Placement
          </div>
          <div style={{ fontSize: '10.5px', color: '#64748B', lineHeight: 1.4, maxWidth: '220px' }}>
            Earns CPC / CPM per click &amp; impression once approved on your live domain.
          </div>
        </div>
      </div>
    );
  }

  // Banner Placement (Inside Notes / Content)
  return (
    <div style={{
      margin: '28px 0 20px',
      padding: '18px 22px',
      borderRadius: '20px',
      background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
      border: '1.5px dashed #CBD5E1',
      boxSizing: 'border-box'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <span style={{
          fontSize: '10px',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          background: '#E2E8F0',
          color: '#475569',
          padding: '3px 10px',
          borderRadius: '999px'
        }}>
          Google AdSense • Responsive In-Article Ad Slot
        </span>
        <span style={{ fontSize: '11px', color: '#16A34A', fontWeight: 800 }}>
          💵 Real Monetization Slot (Active on Prod)
        </span>
      </div>

      <div style={{
        minHeight: '85px',
        background: '#FFFFFF',
        borderRadius: '14px',
        border: '1px solid #E2E8F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 20px',
        flexWrap: 'wrap',
        gap: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #DCFCE7 0%, #BBF7D0 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px'
          }}>
            📈
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', marginBottom: '2px' }}>
              Real Google AdSense / Tech Ads Container
            </div>
            <div style={{ fontSize: '11.5px', color: '#64748B' }}>
              Paste your <code style={{ background: '#F1F5F9', padding: '1px 5px', borderRadius: '4px', color: '#7B1C6E' }}>ca-pub-XXXX</code> in <code style={{ background: '#F1F5F9', padding: '1px 5px', borderRadius: '4px' }}>.env</code> to start receiving real advertiser revenue.
            </div>
          </div>
        </div>

        <a
          href="https://adsense.google.com/start/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '7px 16px',
            borderRadius: '999px',
            background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: '11.5px',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            boxShadow: '0 2px 8px rgba(22, 163, 74, 0.25)'
          }}
        >
          <span>Connect Google AdSense</span>
          <span>↗</span>
        </a>
      </div>
    </div>
  );
}
