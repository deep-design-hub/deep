/*
 * blog.js — the Deep Design Dev journal.
 * Post body is a list of { h?, p } paragraphs; images reuse the studio
 * project covers so no new assets are needed.
 */
export const POSTS = [
  {
    slug: "why-you-need-a-design-system-before-your-words",
    title: "Why you need a design system before your 500th word",
    date: "2026-08-14",
    minutes: 6,
    tag: "Design systems",
    image: "/assets/imgs/project/dashboard/cover.jpg",
    lede: "Most “brand refresh” conversations really start with a broken system. Here's what to fix first — and what it costs when you don't.",
    body: [
      { p: "The average project lands with three versions of the logo, five shades of “off-black” and a Figma file only the original freelancer can navigate. That's not a brand problem. That's a system problem." },
      { p: "A design system isn't a 400-page style guide. It's the minimum set of rules that makes the next decision obvious: the palette that can't be misused, the type scale that answers “what size should this be?”, the button component that makes a new page orderable in an afternoon." },
      { p: "The difference shows up where it hurts money — the fifth deck, the landing page nobody remembers whose template it was, the engineer who has to ask “is this the real logo?” every sprint." },
      { h: "Start with three things", p: "Your colour tokens (no more than 2 neutrals), one type system, and the ten components you actually ship. Everything else is debt you take on when the business grows — not before." },
      { p: "If you already have one, the honest test is: change your homepage heading tomorrow. How many files, approvals and meetings does that take? The number is your system's real score." }
    ]
  },
  {
    slug: "clients-do-not-buy-logo-they-buy-the-rules",
    title: "Clients don't buy logos — they buy the rules",
    date: "2026-07-30",
    minutes: 5,
    tag: "Branding",
    image: "/assets/imgs/project/branding/cover.jpg",
    lede: "A mark without guidelines is a sticker. The hard part of branding is deciding how the brand behaves when you're not there to decide.",
    body: [
      { p: "Every “logo project” I've turned down quietly was a sticker request. The client needed consistency across a store, a social channel and a sales deck — not another version of the mark." },
      { p: "Guidelines dumb down the day-to-day: which image treatment, which photography direction, which voice. They're the part of the brand a client actually flies with." },
      { p: "The deliverable that pays for itself is small and specific: a one-page set of rules the team can read on a mobile in two minutes, plus the master files organised so the intern can't break them." }
    ]
  },
  {
    slug: "from-sketch-to-shipped-design-developer-pipeline",
    title: "From sketch to shipped: the one-person pipeline",
    date: "2026-07-12",
    minutes: 8,
    tag: "Process",
    image: "/assets/imgs/project/devconnect/cover.jpg",
    lede: "How a single designer-developer takes an idea from a napkin sketch to a live URL without the hand-off killing the design.",
    body: [
      { p: "The classic reason client work goes stale is the hand-off: designer finishes Figma, developer rebuilds it “pragmatically”, and the intent dies somewhere in the middle." },
      { p: "Working as one person, the design and the build have to stay honest to each other because they're the same brain. The tools change, the intent doesn't." },
      { p: "What really shipped: a component library in code that mirrors the design tokens exactly, spacing that follows the 4pt grid in both places, and a preview the client clicks before any of the fine print exists." },
      { h: "The two rules", p: "Never design a state you wouldn't build, and never build a screen you haven't designed. Breaks together, ships whole." }
    ]
  },
  {
    slug: "flat-price-sane-scope-how-to-quote-projects",
    title: "Flat price, sane scope: how fixed quotes actually work",
    date: "2026-06-20",
    minutes: 5,
    tag: "Freelance",
    image: "/assets/imgs/project/greenleaf/cover.jpg",
    lede: "Fixed quotes look risky from the outside and attractive from the inside. Here's the discipline that makes them stay profitable — and honest.",
    body: [
      { p: "The unsexy secret of a flat quote is not the price — it's the scope. A fixed quote only works when both sides agree exactly what “done” means before a single screen is drawn." },
      { p: "My one-page brief template fixes the three things that cause scope fights: the pages or deliverables, the revision rounds, and what's explicitly out." },
      { p: "It sounds like admin, but it protects the work: the project gets judged on the outcome everyone already agreed to, not on a moving imagination of what was promised." }
    ]
  },
  {
    slug: "hyper-local-design-system-the-brand-guide",
    title: "A design system for a hyper-local coffee brand",
    date: "2026-06-02",
    minutes: 7,
    tag: "Case study",
    image: "/assets/imgs/project/packaging/cover.jpg",
    lede: "A small-batch roaster with packaging designed across three printers, four years and zero rules — until the system fixed it.",
    body: [
      { p: "When the label system for a small roaster started, every bag was a new design decision. Three printers, four years and a shelf full of near-duplicates later, the brand was recognisable the way relatives are: you know it's family, you just can't tell who." },
      { p: "The rescue work was a system: one dieline, a strict hierarchy for roast names and tasting notes, and a print spec so tight the worst printer in the list could still pass." },
      { p: "The second release cost a fraction of the first and looked more like the brand than anything the brand had shipped in years. Rules win." }
    ]
  },
  {
    slug: "sellers-sorting-the-gallery-of-templates",
    title: "Turning shipped client work into sellable templates",
    date: "2026-05-18",
    minutes: 4,
    tag: "Products",
    image: "/assets/imgs/project/festival/cover.jpg",
    lede: "Every project in the gallery started life as client work. Here's the checklist for turning it into something you can sell under a licence.",
    body: [
      { p: "Production-proven beats “designed to sell”. A template you've shipped for a real client already has the edges filed off: empty states, error paths, the boring screens nobody illustrates." },
      { p: "The licence is the product. Buyers aren't paying for pixels — they're paying for permission to use work that clearly took real time, without a subscription hanging over their head." },
      { p: "If it's worth selling, it deserves a walkthrough: what's inside, what the licence allows, and one honest string about what it is NOT (white-label SaaS source, unlimited clients, etc.)." }
    ]
  }
];

export function listPosts() {
  return POSTS.slice().sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

export function getPost(slug) {
  return POSTS.find((p) => p.slug === slug) || null;
}