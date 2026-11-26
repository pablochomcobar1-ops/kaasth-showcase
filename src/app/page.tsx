import { JharokhaHero } from '@/components/home/JharokhaHero';
import { TwoCollections } from '@/components/home/TwoCollections';
import { FeaturedPieces } from '@/components/home/FeaturedPieces';
import { WoodPassport } from '@/components/home/WoodPassport';
import { HeirloomStory } from '@/components/home/HeirloomStory';
import { Reviews } from '@/components/home/Reviews';
import { VisitBand } from '@/components/home/VisitBand';

export default function Home() {
  return (
    <main>
      <JharokhaHero />
      <TwoCollections />
      <FeaturedPieces />
      <WoodPassport />
      <HeirloomStory />
      <Reviews />
      <VisitBand />
    </main>
  );
}
