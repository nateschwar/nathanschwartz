import basketballImg from "@/assets/optimized/work-basketball-preview.jpg";
import posterImg from "@/assets/optimized/work-poster-preview.jpg";
import soccerImg from "@/assets/optimized/work-soccer-preview.jpg";
import brandImg from "@/assets/optimized/work-brand-preview.jpg";
import swimmerImg from "@/assets/optimized/work-swimmer-preview.jpg";
import heroImg from "@/assets/optimized/hero-action-preview.jpg";
import portraitImg from "@/assets/optimized/about-portrait-preview.jpg";

export type GalleryImage = {
  preview: string;
  full: string;
  name: string;
  title: string;
  ratio: string;
};

export type SubGallery = {
  id: string;
  title: string;
  folder: string;
  cover: string;
  images: GalleryImage[];
};

export type Gallery = {
  id: string;
  title: string;
  date: string;
  location: string;
  folder: string;
  tags: string[];
  isPrivate: boolean;
  passcode?: string;
  cover: string;
  images: GalleryImage[];
  subGalleries?: SubGallery[];
};

function eventImage(
  folder: string,
  fileName: string,
  preview: string,
  title: string,
  ratio: string,
  sportFolder?: string,
): GalleryImage {
  const path = sportFolder
    ? `/vault/events/${folder}/${sportFolder}/${fileName}`
    : `/vault/events/${folder}/originals/${fileName}`;
  return {
    preview,
    full: path,
    name: fileName,
    title,
    ratio,
  };
}

const sidelineSports = "sideline-sports";
const apexRacing = "apex-racing-delivery";
const concertNight = "concert-night-sample";
const bahsSports = "BAHSSportsPhoto";

export const galleries: Gallery[] = [
  {
    id: bahsSports,
    title: "Bel Air High School Sports Photography",
    date: "2026-05-24",
    location: "Bel Air High School",
    folder: bahsSports,
    tags: ["Sports", "High School"],
    isPrivate: false,
    cover: basketballImg,
    images: [],
    subGalleries: [
      {
        id: "baseball",
        title: "Baseball",
        folder: "baseball",
        cover: basketballImg,
        images: [],
      },
      {
        id: "boys-basketball",
        title: "Boys Basketball",
        folder: "boys-basketball",
        cover: basketballImg,
        images: [],
      },
      {
        id: "boys-lacrosse",
        title: "Boys Lacrosse",
        folder: "boys-lacrosse",
        cover: "/vault/events/BAHSSportsPhoto/boys-lacrosse/Boys LAX 4.27.26 -1.jpg",
        images: [
          eventImage(bahsSports, "Boys LAX 4.27.26 -1.jpg", "/vault/events/BAHSSportsPhoto/boys-lacrosse/Boys LAX 4.27.26 -1.jpg", "Boys Lacrosse", "aspect-[3/4]", "boys-lacrosse"),
          eventImage(bahsSports, "Boys LAX 4.27.26 -2.jpg", "/vault/events/BAHSSportsPhoto/boys-lacrosse/Boys LAX 4.27.26 -2.jpg", "Boys Lacrosse", "aspect-[3/4]", "boys-lacrosse"),
          eventImage(bahsSports, "Boys LAX 4.27.26 -3.jpg", "/vault/events/BAHSSportsPhoto/boys-lacrosse/Boys LAX 4.27.26 -3.jpg", "Boys Lacrosse", "aspect-[3/4]", "boys-lacrosse"),
          eventImage(bahsSports, "Boys LAX 4.27.26 -4.jpg", "/vault/events/BAHSSportsPhoto/boys-lacrosse/Boys LAX 4.27.26 -4.jpg", "Boys Lacrosse", "aspect-[3/4]", "boys-lacrosse"),
          eventImage(bahsSports, "Boys LAX 4.27.26 -5.jpg", "/vault/events/BAHSSportsPhoto/boys-lacrosse/Boys LAX 4.27.26 -5.jpg", "Boys Lacrosse", "aspect-[3/4]", "boys-lacrosse"),
        ],
      },
      {
        id: "boys-volleyball",
        title: "Boys Volleyball",
        folder: "boys-volleyball",
        cover: basketballImg,
        images: [],
      },
      {
        id: "football",
        title: "Football",
        folder: "football",
        cover: basketballImg,
        images: [],
      },
      {
        id: "girls-basketball",
        title: "Girls Basketball",
        folder: "girls-basketball",
        cover: "/vault/events/BAHSSportsPhoto/girls-basketball/BAHS-VS-ABERDEEN-GB-1626-01.jpg",
        images: [
          eventImage(bahsSports, "BAHS-VS-ABERDEEN-GB-1626-01.jpg", "/vault/events/BAHSSportsPhoto/girls-basketball/BAHS-VS-ABERDEEN-GB-1626-01.jpg", "Girls Basketball", "aspect-[3/4]", "girls-basketball"),
          eventImage(bahsSports, "BAHS-VS-ABERDEEN-GB-1626-02.jpg", "/vault/events/BAHSSportsPhoto/girls-basketball/BAHS-VS-ABERDEEN-GB-1626-02.jpg", "Girls Basketball", "aspect-[3/4]", "girls-basketball"),
          eventImage(bahsSports, "BAHS-VS-ABERDEEN-GB-1626-03.jpg", "/vault/events/BAHSSportsPhoto/girls-basketball/BAHS-VS-ABERDEEN-GB-1626-03.jpg", "Girls Basketball", "aspect-[3/4]", "girls-basketball"),
          eventImage(bahsSports, "BAHS-VS-ABERDEEN-GB-1626-04.jpg", "/vault/events/BAHSSportsPhoto/girls-basketball/BAHS-VS-ABERDEEN-GB-1626-04.jpg", "Girls Basketball", "aspect-[3/4]", "girls-basketball"),
          eventImage(bahsSports, "BAHS-VS-ABERDEEN-GB-1626-05.jpg", "/vault/events/BAHSSportsPhoto/girls-basketball/BAHS-VS-ABERDEEN-GB-1626-05.jpg", "Girls Basketball", "aspect-[3/4]", "girls-basketball"),
        ],
      },
      {
        id: "girls-lacrosse",
        title: "Girls Lacrosse",
        folder: "girls-lacrosse",
        cover: "/vault/events/BAHSSportsPhoto/girls-lacrosse/Girls LAX 4.24.26 -1.jpg",
        images: [
          eventImage(bahsSports, "Girls LAX 4.24.26 -1.jpg", "/vault/events/BAHSSportsPhoto/girls-lacrosse/Girls LAX 4.24.26 -1.jpg", "Girls Lacrosse", "aspect-[3/4]", "girls-lacrosse"),
          eventImage(bahsSports, "Girls LAX 4.24.26 -2.jpg", "/vault/events/BAHSSportsPhoto/girls-lacrosse/Girls LAX 4.24.26 -2.jpg", "Girls Lacrosse", "aspect-[3/4]", "girls-lacrosse"),
          eventImage(bahsSports, "Girls LAX 4.24.26 -3.jpg", "/vault/events/BAHSSportsPhoto/girls-lacrosse/Girls LAX 4.24.26 -3.jpg", "Girls Lacrosse", "aspect-[3/4]", "girls-lacrosse"),
          eventImage(bahsSports, "Girls LAX 4.24.26 -4.jpg", "/vault/events/BAHSSportsPhoto/girls-lacrosse/Girls LAX 4.24.26 -4.jpg", "Girls Lacrosse", "aspect-[3/4]", "girls-lacrosse"),
          eventImage(bahsSports, "Girls LAX 4.24.26 -5.jpg", "/vault/events/BAHSSportsPhoto/girls-lacrosse/Girls LAX 4.24.26 -5.jpg", "Girls Lacrosse", "aspect-[3/4]", "girls-lacrosse"),
        ],
      },
      {
        id: "girls-volleyball",
        title: "Girls Volleyball",
        folder: "girls-volleyball",
        cover: basketballImg,
        images: [],
      },
      {
        id: "softball",
        title: "Softball",
        folder: "softball",
        cover: basketballImg,
        images: [],
      },
      {
        id: "track",
        title: "Track",
        folder: "track",
        cover: basketballImg,
        images: [],
      },
    ],
  },
];

export function getGallery(galleryId: string) {
  return galleries.find((gallery) => gallery.id === galleryId);
}

export function getSubGallery(galleryId: string, subGalleryId: string) {
  const gallery = getGallery(galleryId);
  return gallery?.subGalleries?.find((sub) => sub.id === subGalleryId);
}

export function getGalleryTags() {
  return ["All", ...Array.from(new Set(galleries.flatMap((gallery) => gallery.tags)))];
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
