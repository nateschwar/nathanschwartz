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
};

function eventImage(
  folder: string,
  fileName: string,
  preview: string,
  title: string,
  ratio: string,
): GalleryImage {
  return {
    preview,
    full: `/vault/events/${folder}/originals/${fileName}`,
    name: fileName,
    title,
    ratio,
  };
}

const sidelineSports = "sideline-sports";
const apexRacing = "apex-racing-delivery";
const concertNight = "concert-night-sample";

export const galleries: Gallery[] = [
  {
    id: sidelineSports,
    title: "Sideline Sports Collection",
    date: "2026-05-24",
    location: "Fieldhouse",
    folder: sidelineSports,
    tags: ["Sports"],
    isPrivate: false,
    cover: basketballImg,
    images: [
      eventImage(sidelineSports, "basketball.jpg", basketballImg, "Basketball", "aspect-[4/5]"),
      eventImage(sidelineSports, "soccer.jpg", soccerImg, "Soccer", "aspect-[3/4]"),
      eventImage(sidelineSports, "swimmer.jpg", swimmerImg, "Swimmer", "aspect-[5/4]"),
      eventImage(sidelineSports, "hero-action.jpg", heroImg, "Hero Action", "aspect-[16/10]"),
    ],
  },
  {
    id: apexRacing,
    title: "Apex Racing Delivery",
    date: "2026-05-24",
    location: "Private Client",
    folder: apexRacing,
    tags: ["GFX", "Sports"],
    isPrivate: true,
    passcode: "apex",
    cover: posterImg,
    images: [
      eventImage(apexRacing, "apex-poster.jpg", posterImg, "Apex Poster", "aspect-[3/4]"),
      eventImage(apexRacing, "atlas-brand.jpg", brandImg, "Atlas Brand", "aspect-[4/3]"),
      eventImage(apexRacing, "hero-action.jpg", heroImg, "Hero Action", "aspect-[16/10]"),
    ],
  },
  {
    id: concertNight,
    title: "Concert Night Sample",
    date: "2026-05-24",
    location: "Backstage",
    folder: concertNight,
    tags: ["Concerts"],
    isPrivate: false,
    cover: heroImg,
    images: [
      eventImage(concertNight, "hero-action.jpg", heroImg, "Hero Action", "aspect-[16/10]"),
      eventImage(concertNight, "portrait.jpg", portraitImg, "Portrait", "aspect-[4/5]"),
    ],
  },
];

export function getGallery(galleryId: string) {
  return galleries.find((gallery) => gallery.id === galleryId);
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
