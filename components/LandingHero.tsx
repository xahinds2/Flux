import FeaturedSlideshow, { type FeaturedItem } from "@/components/FeaturedSlideshow";

export default function LandingHero({ items }: { items: FeaturedItem[] }) {
  return (
    <section className="grid items-center gap-10 py-6 sm:py-10 md:grid-cols-2 md:gap-16">
      <div>
        <p className="mb-5 text-sm font-medium text-[#616b64]">A little closer. A little more local.</p>
        <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-[#24372f] sm:text-5xl lg:text-6xl">Good finds,<br />closer to home.</h1>
        <p className="mt-6 max-w-sm text-base leading-7 text-[#616b64]">Furniture, everyday essentials, and something you didn’t know you needed. Explore personal stores and find your next favourite.</p>
        <a href="#stores" className="mt-7 inline-flex min-h-12 items-center gap-4 rounded-lg bg-[#245c43] px-5 text-sm font-medium text-white hover:bg-[#1c4935] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#245c43] focus-visible:ring-offset-2">Explore stores <span aria-hidden="true">↓</span></a>
        <p className="mt-4 text-xs text-[#616b64]">Browse freely. Connect directly with sellers.</p>
      </div>
      <FeaturedSlideshow key={items.map((item) => item.id).join(",")} items={items} />
    </section>
  );
}
