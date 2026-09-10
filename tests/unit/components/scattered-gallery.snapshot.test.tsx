import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { ScatteredGallerySection } from '@/app/_sections/scattered-gallery/ScatteredGallerySection';
import { LanguageProvider } from '@/app/_context/LanguageContext';
import { FALLBACK_GALLERY_SNAPSHOTS } from '@/lib/gallery';

describe('ScatteredGallery UI/UX Snapshot Test', () => {
  it('renders standard fallback scattered gallery UI structure consistently', () => {
    const html = renderToString(
      <LanguageProvider>
        <ScatteredGallerySection snapshots={FALLBACK_GALLERY_SNAPSHOTS} />
      </LanguageProvider>
    );

    expect(html).toContain('Mount Rinjani Caldera');
    expect(html).toContain('Pink Sand Beach');
    expect(html).toContain('Secret Gili Islands');
    expect(html).toContain('Bukit Merese Savanna');
    expect(html).toContain('Tiu Kelep Waterfall');
    expect(html).toContain('Baun Pusuk Forest');
    expect(html).toContain('Selong Belanak Surf');
    expect(html).toContain('Infinity Villa Kuta');
    expect(html).toMatchSnapshot();
  });

  it('renders customized snapshot items without crashing', () => {
    const customItems = [
      {
        id: 'custom-1',
        title: 'Custom Lombok Waterfall',
        subtitle: 'Hidden paradise in central Lombok',
        badgeTop: 'Special Promo',
        badgeStat: 'HOT DEAL',
        badgeExtra: 'Guided Trek',
        imageUrl: 'https://drive.google.com/file/d/customId12345/view?usp=sharing',
        linkUrl: '/packages',
        displayOrder: 1,
        isActive: true,
      },
    ];

    const html = renderToString(
      <LanguageProvider>
        <ScatteredGallerySection snapshots={customItems} />
      </LanguageProvider>
    );

    expect(html).toContain('Custom Lombok Waterfall');
    expect(html).toContain('Special Promo');
    expect(html).toContain('HOT DEAL');
    expect(html).toContain('https://drive.google.com/thumbnail?id=customId12345&amp;sz=w1600');
    expect(html).toMatchSnapshot();
  });
});
