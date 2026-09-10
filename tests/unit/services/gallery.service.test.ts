import { describe, it, expect, vi } from 'vitest';
import { GalleryService } from '@/lib/services/gallery.service';
import { SupabaseGalleryRepository } from '@/lib/repositories/supabase-gallery.repository';
import { GallerySnapshotItem } from '@/lib/domain/gallery.types';
import { formatImageUrl } from '@/app/_lib/utils';

describe('GalleryService and Utils', () => {
  it('converts Google Drive share links to direct thumbnail URLs', () => {
    const driveUrl = 'https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9I0J/view?usp=sharing';
    const formatted = formatImageUrl(driveUrl);
    expect(formatted).toBe('https://drive.google.com/thumbnail?id=1A2B3C4D5E6F7G8H9I0J&sz=w1600');
  });

  it('converts Google Drive direct d/ id links', () => {
    const driveUrl = 'https://drive.google.com/d/XYZ123ABC456/view';
    const formatted = formatImageUrl(driveUrl);
    expect(formatted).toBe('https://drive.google.com/thumbnail?id=XYZ123ABC456&sz=w1600');
  });

  it('preserves standard HTTPS image URLs unchanged', () => {
    const unsplashUrl = 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80';
    expect(formatImageUrl(unsplashUrl)).toBe(unsplashUrl);
  });

  it('lists snapshots through repository', async () => {
    const mockRepo = {
      findAll: vi.fn().mockResolvedValue([
        {
          id: '1',
          title: 'Mount Rinjani',
          subtitle: 'Summit trek',
          imageUrl: 'https://images.unsplash.com/photo-1578637387939',
          linkUrl: '/packages',
          displayOrder: 1,
          isActive: true,
        },
      ]),
      saveAll: vi.fn(),
    } as unknown as SupabaseGalleryRepository;

    const service = new GalleryService(mockRepo);
    const result = await service.listSnapshots(true);

    expect(mockRepo.findAll).toHaveBeenCalledWith(true);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Mount Rinjani');
  });

  it('sanitizes and validates gallery items before saving', async () => {
    const mockRepo = {
      findAll: vi.fn(),
      saveAll: vi.fn().mockImplementation((items) => Promise.resolve(items)),
    } as unknown as SupabaseGalleryRepository;

    const service = new GalleryService(mockRepo);
    const input: GallerySnapshotItem[] = [
      {
        id: 'item-1',
        title: '  Pink Beach Lombok  ',
        subtitle: '  Beautiful beach  ',
        imageUrl: '  https://drive.google.com/file/d/test12345/view  ',
        linkUrl: ' /packages ',
        displayOrder: 0,
        isActive: true,
      },
    ];

    const saved = await service.saveSnapshots(input);

    expect(mockRepo.saveAll).toHaveBeenCalled();
    expect(saved[0].title).toBe('Pink Beach Lombok');
    expect(saved[0].subtitle).toBe('Beautiful beach');
    expect(saved[0].linkUrl).toBe('/packages');
    expect(saved[0].displayOrder).toBe(1);
  });
});
