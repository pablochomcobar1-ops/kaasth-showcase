import type { SiteConfig } from './schema';

/**
 * Everything brand-specific lives here and in products.ts.
 * To re-skin this demo for a client, edit these two files (and the logo/renders in /public).
 */
export const siteConfig = {
  mode: 'demo',
  credit: 'Designed & built by BSX Agency',
  demoBadge: 'Concept demo · BSX Agency',
  brand: {
    name: 'Kaasth',
    nameDeva: 'काष्ठ',
    tagline: 'Made to be inherited.',
    lines: ['Purana dil, naya andaaz.', 'Har lakdi ki apni kahani.', 'Chai pe milte hain.'],
    established: 1962,
    city: 'Ahmedabad',
    collections: {
      heirloom: { name: 'Heirloom', nameDeva: 'विरासत', line: 'Restored and hand-carved pieces with a past.' },
      form: { name: 'Form', nameDeva: 'रूप', line: 'Modern solid wood, made to outlive trends.' },
    },
  },
  contact: {
    phone: '+91 98765 00000',
    whatsapp: '919876500000',
    email: 'hello@kaasth.example',
    address: ['Kaasth Workshop & Showroom', 'Pol no. 7, near Manek Chowk', 'Ahmedabad 380001, Gujarat'],
    directionsUrl: 'https://maps.google.com/?q=Manek+Chowk+Ahmedabad',
    hours: 'Tuesday to Sunday, 11:00 to 19:00',
    closedDay: 'Closed on Mondays',
  },
  nav: [
    { label: 'Products', href: '/products' },
    { label: 'Services', href: '/services' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  reviewsNote: 'Sample reviews for this concept demo.',
  reviews: [
    { quote: 'The divan came with a card telling us which village it was carved in. Our kids already call it "dadaji ka takht".', name: 'Meera P.', city: 'Ahmedabad', piece: 'Sheesham Divan' },
    { quote: 'They showed us the dovetail joints before we paid. Three years later, not one wobble, not one termite.', name: 'Arjun & Nisha', city: 'Vadodara', piece: 'Oak Dining Table' },
    { quote: 'We sat in the showroom, had chai, and left with a chair my father would have loved.', name: 'Farhan K.', city: 'Surat', piece: 'Teak Planter Chair' },
  ],
  services: [
    { id: 'custom', title: 'Custom-made furniture', line: 'Your size, your wood, our hands.', steps: ['Visit and measure', 'Wood and sketch approval', 'Made, finished and delivered'] },
    { id: 'restoration', title: 'Antique restoration', line: 'We bring old wood back without erasing its story.', steps: ['Inspect and document', 'Repair joints, treat for termites', 'Hand-finish and return with a provenance card'] },
    { id: 'styling', title: 'Interior styling', line: 'One room or the whole home, old and new together.', steps: ['Home visit', 'Layout and piece list', 'Placement on delivery day'] },
    { id: 'delivery', title: 'Delivery & installation', line: 'Wrapped, carried and set up by our own team.', steps: ['Date that suits you', 'Blanket-wrapped transport', 'Set-up and care walkthrough'] },
  ],
  story: [
    { year: 1962, title: 'A workshop in the pol', text: 'Our grandfather opens a small carpentry shop near Manek Chowk, repairing doors and charpais.' },
    { year: 1984, title: 'The first restoration', text: 'A haveli owner brings in a broken teak almirah. Restoring it becomes what we are known for.' },
    { year: 2009, title: 'The Wood Passport', text: 'Every piece starts leaving with a card: wood, joinery, hours, treatment. No more "wood finish" guesses.' },
    { year: 2022, title: 'Form', text: 'The third generation adds a modern line: clean solid-wood pieces made with the same old joints.' },
  ],
} satisfies SiteConfig;
