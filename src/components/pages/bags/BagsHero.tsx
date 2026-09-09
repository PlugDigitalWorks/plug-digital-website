import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';

export default function BagsHero() {
  return (
    <Section className="bg-[url('/images/bags-thumb.webp')] bg-cover bg-center pb-8 md:pb-12">
      <Container className="relative flex flex-col lg:flex-row items-center gap-10 min-h-[420px] py-12">
        {/* Left: Texts */}
        <div className="flex-1 flex flex-col gap-6 items-center lg:items-start justify-center">
          <h1 className="text-white text-4xl md:text-6xl font-secondary font-normal leading-tight text-center lg:text-left">
            Luxury Bags
          </h1>
          <p className="text-white text-base md:text-lg max-w-xl text-center lg:text-left">
            Discover our exclusive collection of designer handbags and luxury accessories.
            Each piece represents the pinnacle of craftsmanship and timeless elegance.
          </p>
        </div>
      </Container>
    </Section>
  );
}
