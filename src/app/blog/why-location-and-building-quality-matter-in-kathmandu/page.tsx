import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Why Location and Building Quality Matter When Choosing a Rental Building in Kathmandu",
  description: "Discover why location, building quality, accessibility, facilities, and maintenance matter when choosing a rental building in Kathmandu.",
  keywords: [
    "rental building in Kathmandu",
    "building for rent in Kathmandu",
    "commercial rental building Kathmandu",
    "office space in Kathmandu",
    "rental property in Kathmandu",
    "commercial building in Kathmandu",
  ],
  openGraph: {
    title: "Why Location and Building Quality Matter When Choosing a Rental Building in Kathmandu",
    description: "Discover why location, building quality, accessibility, facilities, and maintenance matter when choosing a rental building in Kathmandu.",
    type: "article",
    publishedTime: "2026-08-12",
    images: [{ url: "/blo.png", alt: "Why Location and Building Quality Matter" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Why Location and Building Quality Matter When Choosing a Rental Building in Kathmandu",
    description: "Discover why location, building quality, accessibility, facilities, and maintenance matter when choosing a rental building in Kathmandu.",
    images: ["/blo.png"],
  },
};

const sections = [
  { title: "1. Location Makes a Major Difference", paragraphs: ["One of the first things to consider when choosing a rental property is its location.", "A building located in a convenient area can provide easier access for tenants, employees, customers, suppliers, and visitors. Proximity to major roads, public transportation, business areas, restaurants, banks, and other essential services can make a property significantly more practical.", "For businesses especially, location can influence visibility and accessibility. A convenient location can make it easier for customers to find the business and for employees to commute to work.", "This is why location should be one of the first factors to consider when searching for a rental building in Kathmandu."] },
  { title: "2. Building Quality Matters", paragraphs: ["Location may attract people to a property, but building quality can determine how comfortable and practical the property is in the long term.", "A quality building should provide a safe, functional, and well-maintained environment. Important factors can include the structural condition of the building, electrical systems, plumbing, ventilation, lighting, flooring, and overall construction quality.", "For commercial tenants, building quality can also affect the professional appearance of the business.", "A clean, properly maintained, and well-designed building creates a better impression on customers, clients, and visitors."] },
  { title: "3. Accessibility and Transportation", paragraphs: ["Kathmandu is a busy and growing city, so accessibility is an important consideration when choosing a property.", "A rental building that can be easily reached by different modes of transportation can be more convenient for both residents and businesses.", "When evaluating a property, it is useful to consider:", "A property may have excellent facilities, but if reaching it is difficult, it may not be the right choice for every tenant."], bullets: ["Access to major roads", "Public transportation", "Parking availability", "Pedestrian accessibility", "Distance from important business areas", "Ease of access for customers and visitors"] },
  { title: "4. Facilities Can Improve Everyday Convenience", paragraphs: ["The facilities available within and around a building can have a significant impact on daily life.", "Depending on the type of property, useful facilities may include parking, reliable electricity, water supply, security, elevators, common areas, internet connectivity, waste management, and proper maintenance.", "For businesses, these facilities can help create a more productive working environment.", "For residents, they can provide greater comfort and convenience.", "Therefore, when comparing different rental properties, it is important to look beyond the monthly rent and consider the overall facilities and services provided by the building."] },
  { title: "5. A Professional Environment for Businesses", paragraphs: ["For companies, an office is more than just a place where employees work. It can also represent the identity and professionalism of the organization.", "A well-maintained commercial building can create a positive first impression when clients and business partners visit.", "A suitable office environment can also contribute to employee satisfaction and productivity.", "For this reason, businesses searching for an office space in Kathmandu should consider factors such as building quality, accessibility, surrounding environment, parking, security, and maintenance alongside the rental price."] },
  { title: "6. Maintenance Should Not Be Overlooked", paragraphs: ["Even a newly constructed building requires regular maintenance.", "Before choosing a rental property, prospective tenants should consider how well the property is maintained and whether common areas and essential facilities are properly managed.", "Regular maintenance can help prevent small problems from becoming expensive or disruptive issues.", "A professionally managed property also provides tenants with greater confidence that their concerns will be addressed when necessary."] },
  { title: "7. Consider Long-Term Value", paragraphs: ["Choosing a rental property should not always be based solely on the lowest monthly rent.", "A cheaper property may have higher transportation costs, limited facilities, poor accessibility, or additional maintenance concerns.", "On the other hand, a property with a convenient location, good construction quality, useful facilities, and professional management may provide better overall value.", "The goal should be to find a property that balances location, quality, convenience, facilities, and cost."] },
];

const questions = ["Is the location convenient?", "Is the building properly maintained?", "Are the facilities suitable for your needs?", "Is transportation easily accessible?", "Is parking available?", "Is the surrounding area appropriate for your purpose?", "Does the property offer good long-term value?"];

export default function ArticlePage() {
  return (
    <main className="min-h-screen bg-[#FAF6EA] text-slate-900 antialiased">
      <header className="border-b border-black/5 bg-[#FFF7DE]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-6">
          <Link href="/" className="inline-flex items-center gap-3"><Image src="/subhashree.png" alt="Subha Shree Bhawan logo" width={80} height={80} className="h-20 w-20 pb-2" priority /><span className="hidden font-semibold tracking-tight sm:block">Subha Shree Bhawan</span></Link>
          <Link href="/blog" className="inline-flex items-center gap-2 rounded-2xl bg-white/60 px-4 py-2 text-sm font-semibold ring-1 ring-black/10 transition hover:bg-white/80"><ArrowLeft className="h-4 w-4" /> All articles</Link>
        </div>
      </header>

      <article>
        <div className="mx-auto max-w-6xl px-5 pb-12 pt-14 sm:px-6 md:pb-16 md:pt-20">
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-flex rounded-full bg-[#FFF2C7] px-4 py-2 text-xs font-bold tracking-wide text-amber-800">RENTAL GUIDE</span>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">Why Location and Building Quality Matter When Choosing a Rental Building in Kathmandu</h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-slate-600 md:text-xl">Discover why location, building quality, accessibility, facilities, and maintenance matter when choosing a rental building in Kathmandu.</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-sm text-slate-500"><span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4" /> August 12, 2026</span><span className="inline-flex items-center gap-2"><Clock className="h-4 w-4" /> 8 min read</span></div>
          </div>
          <div className="relative mt-12 aspect-[16/9] overflow-hidden rounded-[32px] bg-slate-900 shadow-[0_30px_90px_rgba(15,23,42,0.18)]"><Image src="/blo.png" alt="Building A with the title Why Location and Building Quality Matter" fill className="object-cover" priority sizes="(max-width: 1200px) 100vw, 1152px" /></div>
        </div>

        <div className="mx-auto max-w-3xl px-5 pb-20 sm:px-6">
          <div className="space-y-10 text-lg leading-8 text-slate-700">
            <ArticleSection title="Introduction">
              <p>Finding the right <strong>rental building in Kathmandu</strong> is about more than simply finding an available space. Whether you are looking for a place to live, setting up an office, opening a business, or expanding an existing operation, the location and quality of the building can have a major impact on your experience.</p>
              <p>Kathmandu has a wide range of residential and commercial properties, but not every building offers the same level of accessibility, convenience, safety, and long-term value.</p>
              <p>A well-located and properly maintained building can make everyday activities easier, provide a better environment for employees and customers, and contribute to the overall image of a business.</p>
            </ArticleSection>

            {sections.map((section) => <ArticleSection key={section.title} title={section.title}>{section.paragraphs.map((paragraph, index) => <div key={paragraph}>{paragraph}{section.bullets && index === 2 && <BulletList items={section.bullets} />}</div>)}</ArticleSection>)}

            <ArticleSection title="Choosing the Right Rental Building in Kathmandu">
              <p>Every tenant has different requirements. A family may prioritize safety, accessibility, and nearby facilities, while a business may focus more on visibility, parking, office layout, and accessibility for clients.</p>
              <p>Before making a decision, consider:</p><BulletList items={questions} />
              <p>Taking the time to evaluate these factors can help you make a more informed decision.</p>
            </ArticleSection>

            <ArticleSection title="Our Approach to Quality and Convenience">
              <p>A good rental property should provide more than four walls and a roof. It should offer a practical environment where residents and businesses can operate comfortably and confidently.</p>
              <p>Our building is designed and maintained with attention to <strong>location, accessibility, building quality, and everyday convenience</strong>.</p>
              <p>While the property is currently fully occupied, we believe that sharing information about what makes a quality rental property valuable can help future tenants and businesses make better decisions when looking for a property in Kathmandu.</p>
            </ArticleSection>

            <ArticleSection title="Conclusion">
              <p>Choosing the right <strong>rental building in Kathmandu</strong> requires careful consideration. Location, construction quality, accessibility, facilities, maintenance, and long-term value can all influence whether a property is truly suitable for your needs.</p>
              <p>Whether you are searching for a home, office, or commercial space, looking beyond the rental price and evaluating the complete property can help you make a better decision.</p>
              <p>A well-located, well-maintained, and quality building can provide value not only today but also for years to come.</p>
            </ArticleSection>

            <div className="border-t border-black/10 pt-8"><Link href="/blog" className="inline-flex items-center gap-2 font-bold text-slate-900 hover:text-amber-800"><ArrowLeft className="h-4 w-4" /> Back to all articles</Link></div>
          </div>
        </div>
      </article>
      <footer className="border-t border-black/5 px-5 py-8 text-center text-sm text-slate-500 sm:px-6">© 2026 Subha Shree Bhawan. All rights reserved.</footer>
    </main>
  );
}

function ArticleSection({ title, children }: { title: string; children: React.ReactNode }) {
  return <section><h2 className="text-3xl font-extrabold tracking-tight text-slate-950">{title}</h2><div className="mt-4 space-y-4">{children}</div></section>;
}

function BulletList({ items }: { items: string[] }) {
  return <ul className="my-5 space-y-2 rounded-[24px] bg-white/60 p-6 ring-1 ring-black/10">{items.map((item) => <li key={item} className="flex gap-3"><span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" /><span>{item}</span></li>)}</ul>;
}
