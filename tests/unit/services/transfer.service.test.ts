import { describe, it, expect, vi } from 'vitest';
import { TransferService } from '@/lib/services/transfer.service';
import { ITransferRepository } from '@/lib/repositories/transfer.repository.interface';
import { TransferLocation, TransferVehicle } from '@/lib/domain/transfer.types';

describe('TransferService', () => {
  const mockLocations: TransferLocation[] = [
    {
      id: 'loc-1',
      name: 'Bandara Internasional Lombok (LOP)',
      locationType: 'both',
      area: 'Central Lombok',
      isActive: true,
      displayOrder: 1,
    },
  ];

  const mockVehicles: TransferVehicle[] = [
    {
      id: 'veh-1',
      name: 'Toyota All New Avanza',
      category: 'Standard MPV',
      capacityPax: 5,
      baseRateIdr: 350000,
      isActive: true,
    },
  ];

  const mockRepo: ITransferRepository = {
    findAllLocations: vi.fn().mockResolvedValue(mockLocations),
    createLocation: vi.fn().mockImplementation((data) =>
      Promise.resolve({ id: 'loc-2', ...data })
    ),
    updateLocation: vi.fn().mockImplementation((id, data) =>
      Promise.resolve({ ...mockLocations[0], ...data, id })
    ),
    deleteLocation: vi.fn().mockResolvedValue(true),

    findAllVehicles: vi.fn().mockResolvedValue(mockVehicles),
    createVehicle: vi.fn().mockImplementation((data) =>
      Promise.resolve({ id: 'veh-2', ...data })
    ),
    updateVehicle: vi.fn().mockImplementation((id, data) =>
      Promise.resolve({ ...mockVehicles[0], ...data, id })
    ),
    deleteVehicle: vi.fn().mockResolvedValue(true),
  };

  const service = new TransferService(mockRepo);

  it('should list locations and vehicles', async () => {
    const locs = await service.listLocations();
    const vehs = await service.listVehicles();

    expect(locs).toHaveLength(1);
    expect(locs[0].name).toContain('Bandara');
    expect(vehs).toHaveLength(1);
    expect(vehs[0].capacityPax).toBe(5);
  });

  it('should reject invalid location or vehicle payload', async () => {
    await expect(
      service.createLocation({ name: '', area: '' } as any)
    ).rejects.toThrow(/Location Validation Error/);

    await expect(
      service.createVehicle({ name: '', capacityPax: -1 } as any)
    ).rejects.toThrow(/Vehicle Validation Error/);
  });

  it('should create valid location point', async () => {
    const created = await service.createLocation({
      name: 'Kuta Mandalika Beach Resort',
      locationType: 'both',
      area: 'South Lombok',
      isActive: true,
    });

    expect(created.id).toBe('loc-2');
    expect(created.name).toBe('Kuta Mandalika Beach Resort');
  });
});
