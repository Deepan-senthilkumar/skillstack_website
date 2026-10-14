import React from 'react';
import RealAdSlot from './RealAdSlot';

/**
 * SponsoredTechCard
 * Delegates all ad placements directly to RealAdSlot for real ad monetization (Google AdSense / Tech Ads)
 * to earn actual revenue (CPC / CPM) per user visit & click.
 */
export default function SponsoredTechCard({
  variant = 'banner', // 'banner' | 'sidebar' | 'milestone'
  category = 'general',
  onDismiss = null
}) {
  return (
    <RealAdSlot
      slotType={variant}
      className={`sponsored-ad-${variant}`}
    />
  );
}
