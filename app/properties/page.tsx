import { getProperties } from '@/app/_lib/properties';
import { PropertyList } from '@/app/_sections/properties/PropertyList';

export const metadata = {
  title: 'Lombok Real Estate & Villas | Full Listings',
  description: 'Explore verified luxury villas for sale and freehold land in South Lombok, Kuta, and Selong Belanak.',
};

export default async function PropertiesPage() {
  const properties = await getProperties();

  return (
    <main className="min-h-screen pt-24">
      <PropertyList properties={properties} />
    </main>
  );
}
