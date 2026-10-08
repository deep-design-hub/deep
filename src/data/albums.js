/*
 * albums.js — gallery albums table (events, meetups, workshops).
 * One row per album; `photos` are absolute paths under /assets/imgs/gallery/.
 */
export const ALBUMS = [
  {
    slug: "devfest-hackathon-2025",
    title: "DevFest Hackathon 2025",
    kind: "Event coverage",
    icon: "code",
    year: "2025",
    location: "On site + remote",
    def: "Two days of building — stage backdrop, badge system, schedule boards and the social kit that carried the event online.",
    cover: "/assets/imgs/gallery/devfest-hackathon-2025/p1.jpg",
    photos: [
      "/assets/imgs/gallery/devfest-hackathon-2025/p1.jpg",
      "/assets/imgs/gallery/devfest-hackathon-2025/p2.jpg",
      "/assets/imgs/gallery/devfest-hackathon-2025/p3.jpg",
      "/assets/imgs/gallery/devfest-hackathon-2025/p4.jpg",
      "/assets/imgs/gallery/devfest-hackathon-2025/p5.jpg",
      "/assets/imgs/gallery/devfest-hackathon-2025/p6.jpg"
    ]
  },
  {
    slug: "devs-meetup-night",
    title: "Devs Meetup Night",
    kind: "Community meetup",
    icon: "groups",
    year: "2025",
    location: "Local tech meetup",
    def: "Talk night identity: slide deck, name tags, photo wall and the recap posts that went out the next morning.",
    cover: "/assets/imgs/gallery/devs-meetup-night/p1.jpg",
    photos: [
      "/assets/imgs/gallery/devs-meetup-night/p1.jpg",
      "/assets/imgs/gallery/devs-meetup-night/p2.jpg",
      "/assets/imgs/gallery/devs-meetup-night/p3.jpg",
      "/assets/imgs/gallery/devs-meetup-night/p4.jpg",
      "/assets/imgs/gallery/devs-meetup-night/p5.jpg"
    ]
  },
  {
    slug: "campus-design-competition",
    title: "Campus Design Competition",
    kind: "Competition",
    icon: "emoji_events",
    year: "2024",
    location: "University campus",
    def: "Poster series, entry forms, jury packs and the winner announcement artwork for a campus-wide design contest.",
    cover: "/assets/imgs/gallery/campus-design-competition/p1.jpg",
    photos: [
      "/assets/imgs/gallery/campus-design-competition/p1.jpg",
      "/assets/imgs/gallery/campus-design-competition/p2.jpg",
      "/assets/imgs/gallery/campus-design-competition/p3.jpg",
      "/assets/imgs/gallery/campus-design-competition/p4.jpg",
      "/assets/imgs/gallery/campus-design-competition/p5.jpg",
      "/assets/imgs/gallery/campus-design-competition/p6.jpg"
    ]
  },
  {
    slug: "open-source-weekend",
    title: "Open Source Weekend",
    kind: "Hack weekend",
    icon: "fork_right",
    year: "2024",
    location: "Hybrid",
    def: "A weekend of shipping in the open — brand strip, contributor badges, live leaderboard graphics and recap carousel.",
    cover: "/assets/imgs/gallery/open-source-weekend/p1.jpg",
    photos: [
      "/assets/imgs/gallery/open-source-weekend/p1.jpg",
      "/assets/imgs/gallery/open-source-weekend/p2.jpg",
      "/assets/imgs/gallery/open-source-weekend/p3.jpg",
      "/assets/imgs/gallery/open-source-weekend/p4.jpg",
      "/assets/imgs/gallery/open-source-weekend/p5.jpg",
      "/assets/imgs/gallery/open-source-weekend/p6.jpg"
    ]
  },
  {
    slug: "design-workshop-students",
    title: "Design Workshop for Students",
    kind: "Workshop",
    icon: "school",
    year: "2024",
    location: "Campus workshop",
    def: "A hands-on intro to design systems — workbooks, slide templates, exercise sheets and certificates for every attendee.",
    cover: "/assets/imgs/gallery/design-workshop-students/p1.jpg",
    photos: [
      "/assets/imgs/gallery/design-workshop-students/p1.jpg",
      "/assets/imgs/gallery/design-workshop-students/p2.jpg",
      "/assets/imgs/gallery/design-workshop-students/p3.jpg",
      "/assets/imgs/gallery/design-workshop-students/p4.jpg",
      "/assets/imgs/gallery/design-workshop-students/p5.jpg"
    ]
  }
];

export function getAlbum(slug) {
  return ALBUMS.find((a) => a.slug === slug) || null;
}

export function albumStats() {
  return {
    albums: ALBUMS.length,
    photos: ALBUMS.reduce((n, a) => n + a.photos.length, 0)
  };
}
