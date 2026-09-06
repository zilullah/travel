import {
  IPackageRepository,
  TourPackageFilter,
} from "../repositories/package.repository.interface";
import {
  TourPackage,
  PricingTier,
  PackageStatus,
} from "../domain/package.types";
import {
  validateTourPackage,
  generateSlug,
} from "../domain/package.validation";

export class PackageService {
  constructor(private packageRepo: IPackageRepository) {}

  async listPackages(filter?: TourPackageFilter): Promise<TourPackage[]> {
    return this.packageRepo.findAll(filter);
  }

  async getPackageById(id: string): Promise<TourPackage | null> {
    if (!id) throw new Error("Package ID is required");
    return this.packageRepo.findById(id);
  }

  async getPackageBySlug(slug: string): Promise<TourPackage | null> {
    if (!slug) throw new Error("Slug is required");
    return this.packageRepo.findBySlug(slug);
  }

  async createPackage(data: unknown): Promise<TourPackage> {
    if (typeof data === "object" && data !== null) {
      const input = data as Record<string, unknown>;
      if (!input.slug && typeof input.title === "string") {
        input.slug = generateSlug(input.title);
      }
    }

    const validation = validateTourPackage(data);
    if (!validation.success) {
      const errorMsg = validation.error.issues
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join(", ");
      throw new Error(`Validation Error: ${errorMsg}`);
    }

    const validData = validation.data;

    // Check slug uniqueness
    const existing = await this.packageRepo.findBySlug(validData.slug);
    if (existing) {
      validData.slug = `${validData.slug}-${Date.now().toString().slice(-4)}`;
    }

    return this.packageRepo.create(validData);
  }

  async updatePackage(
    id: string,
    data: Partial<TourPackage>,
  ): Promise<TourPackage> {
    if (!id) throw new Error("Package ID is required");

    const existing = await this.packageRepo.findById(id);
    if (!existing) {
      throw new Error(`Package with ID ${id} not found`);
    }

    if (data.title && !data.slug) {
      data.slug = generateSlug(data.title);
    }

    return this.packageRepo.update(id, data);
  }

  async updatePackageStatus(
    id: string,
    status: PackageStatus,
  ): Promise<TourPackage> {
    if (!["published", "draft", "archived"].includes(status)) {
      throw new Error(`Invalid status: ${status}`);
    }
    return this.updatePackage(id, { status });
  }

  async updatePricingTiers(
    packageId: string,
    tiers: PricingTier[],
  ): Promise<PricingTier[]> {
    if (!packageId) throw new Error("Package ID is required");

    // Invariant checks
    for (const tier of tiers) {
      if (tier.minPax > tier.maxPax) {
        throw new Error(
          `Tier ${tier.tierName}: minPax (${tier.minPax}) cannot be greater than maxPax (${tier.maxPax})`,
        );
      }
      if (tier.pricePerPaxIdr < 0) {
        throw new Error(`Tier ${tier.tierName}: price cannot be negative`);
      }
    }

    return this.packageRepo.savePricingTiers(packageId, tiers);
  }

  async deletePackage(id: string): Promise<boolean> {
    if (!id) throw new Error("Package ID is required");
    return this.packageRepo.delete(id);
  }
}
