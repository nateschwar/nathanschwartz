import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Download, Images, Lock, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getGallery, getSubGallery, slugify } from "@/lib/gallery-data";
import { ImageViewer } from "@/components/ImageViewer";

export const Route = createFileRoute("/gallery/$galleryId")({
  head: ({ params }) => {
    const gallery = getGallery(params.galleryId);

    return {
      meta: [
        { title: gallery ? `${gallery.title} - Gallery` : "Gallery Not Found" },
        { name: "robots", content: "noindex, nofollow" },
      ],
    };
  },
  component: GalleryPage,
});

type ZipFile = {
  name: string;
  data: Uint8Array;
  modifiedAt: Date;
};

const unlockedGalleryKey = "vault.unlockedGalleries.v2";
const crcTable = new Uint32Array(256);

for (let i = 0; i < crcTable.length; i += 1) {
  let value = i;

  for (let bit = 0; bit < 8; bit += 1) {
    value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  }

  crcTable[i] = value >>> 0;
}

function triggerDownload(url: string, filename: string) {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

function getCrc32(data: Uint8Array) {
  let crc = 0xffffffff;

  for (const byte of data) {
    crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }

  return (crc ^ 0xffffffff) >>> 0;
}

function getDosDateTime(date: Date) {
  const year = Math.max(date.getFullYear(), 1980);
  const time =
    (date.getHours() << 11) |
    (date.getMinutes() << 5) |
    Math.floor(date.getSeconds() / 2);
  const dosDate = ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();

  return { dosDate, time };
}

function writeUInt16(output: number[], value: number) {
  output.push(value & 0xff, (value >>> 8) & 0xff);
}

function writeUInt32(output: number[], value: number) {
  output.push(value & 0xff, (value >>> 8) & 0xff, (value >>> 16) & 0xff, (value >>> 24) & 0xff);
}

function appendBytes(output: number[], bytes: Uint8Array) {
  for (const byte of bytes) output.push(byte);
}

function createUncompressedZip(files: ZipFile[]) {
  const encoder = new TextEncoder();
  const output: number[] = [];
  const centralDirectory: number[] = [];

  files.forEach((file) => {
    const nameBytes = encoder.encode(file.name);
    const crc = getCrc32(file.data);
    const { dosDate, time } = getDosDateTime(file.modifiedAt);
    const offset = output.length;

    writeUInt32(output, 0x04034b50);
    writeUInt16(output, 20);
    writeUInt16(output, 0);
    writeUInt16(output, 0);
    writeUInt16(output, time);
    writeUInt16(output, dosDate);
    writeUInt32(output, crc);
    writeUInt32(output, file.data.length);
    writeUInt32(output, file.data.length);
    writeUInt16(output, nameBytes.length);
    writeUInt16(output, 0);
    appendBytes(output, nameBytes);
    appendBytes(output, file.data);

    writeUInt32(centralDirectory, 0x02014b50);
    writeUInt16(centralDirectory, 20);
    writeUInt16(centralDirectory, 20);
    writeUInt16(centralDirectory, 0);
    writeUInt16(centralDirectory, 0);
    writeUInt16(centralDirectory, time);
    writeUInt16(centralDirectory, dosDate);
    writeUInt32(centralDirectory, crc);
    writeUInt32(centralDirectory, file.data.length);
    writeUInt32(centralDirectory, file.data.length);
    writeUInt16(centralDirectory, nameBytes.length);
    writeUInt16(centralDirectory, 0);
    writeUInt16(centralDirectory, 0);
    writeUInt16(centralDirectory, 0);
    writeUInt16(centralDirectory, 0);
    writeUInt32(centralDirectory, 0);
    writeUInt32(centralDirectory, offset);
    appendBytes(centralDirectory, nameBytes);
  });

  const centralDirectoryOffset = output.length;
  output.push(...centralDirectory);

  writeUInt32(output, 0x06054b50);
  writeUInt16(output, 0);
  writeUInt16(output, 0);
  writeUInt16(output, files.length);
  writeUInt16(output, files.length);
  writeUInt32(output, centralDirectory.length);
  writeUInt32(output, centralDirectoryOffset);
  writeUInt16(output, 0);

  return new Blob([new Uint8Array(output)], { type: "application/zip" });
}

function readUnlockedGalleries() {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(unlockedGalleryKey);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function GalleryPage() {
  const { galleryId } = Route.useParams();
  const gallery = getGallery(galleryId);
  const [unlockedGalleries, setUnlockedGalleries] = useState<string[]>([]);
  const [unlockCode, setUnlockCode] = useState("");
  const [unlockError, setUnlockError] = useState("");
  const [downloadState, setDownloadState] = useState<"idle" | "preparing" | "saving">("idle");
  const [viewing, setViewing] = useState<number | null>(null);
  const [selectedSubGalleryId, setSelectedSubGalleryId] = useState<string | null>(null);
  const [downloadingAll, setDownloadingAll] = useState(false);

  const currentSubGallery = selectedSubGalleryId ? getSubGallery(galleryId, selectedSubGalleryId) : null;

  const isUnlocked = !gallery?.isPrivate || unlockedGalleries.includes(gallery.id);
  const hasSubGalleries = gallery?.subGalleries && gallery.subGalleries.length > 0;
  const visibleImages = currentSubGallery
    ? currentSubGallery.images
    : gallery && isUnlocked && !hasSubGalleries
      ? gallery.images
      : [];
  const current = viewing !== null ? visibleImages[viewing] : null;

  const downloadAllImages = async () => {
    setDownloadingAll(true);
    for (const image of visibleImages) {
      const link = document.createElement("a");
      link.href = image.full;
      link.download = image.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    setDownloadingAll(false);
  };

  useEffect(() => {
    setUnlockedGalleries(readUnlockedGalleries());
  }, []);


  if (!gallery) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f5f0] px-5 text-[#161616]">
        <div className="max-w-md text-center">
          <h1 className="font-display text-5xl font-black uppercase italic">Gallery Not Found</h1>
          <Link
            to="/gallery"
            className="mt-6 inline-flex h-11 items-center justify-center bg-black px-5 text-[11px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-vivid hover:text-dark"
          >
            Back to Gallery
          </Link>
        </div>
      </div>
    );
  }

  const unlockGallery = () => {
    if (!gallery.passcode || unlockCode.trim() === gallery.passcode) {
      const next = Array.from(new Set([...unlockedGalleries, gallery.id]));
      setUnlockedGalleries(next);
      window.localStorage.setItem(unlockedGalleryKey, JSON.stringify(next));
      setUnlockCode("");
      setUnlockError("");
      return;
    }

    setUnlockError("That code does not match this gallery.");
  };

  const downloadGallery = async () => {
    if (downloadState !== "idle") return;

    setDownloadState("preparing");

    try {
      const zipFiles = await Promise.all(
        gallery.images.map(async (image) => {
          const response = await fetch(image.full);

          if (!response.ok) throw new Error(`Unable to download ${image.name}`);

          return {
            name: `${gallery.folder}/originals/${image.name}`,
            data: new Uint8Array(await response.arrayBuffer()),
            modifiedAt: new Date(),
          };
        }),
      );

      setDownloadState("saving");
      const zip = createUncompressedZip(zipFiles);
      const objectUrl = URL.createObjectURL(zip);
      triggerDownload(objectUrl, `${slugify(gallery.title)}.zip`);
      URL.revokeObjectURL(objectUrl);
    } finally {
      setDownloadState("idle");
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#161616]">
      <header className="border-b border-black/10 px-5 py-5 md:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-black/55 transition-colors hover:text-black"
          >
            <ChevronLeft aria-hidden="true" size={16} />
            All Galleries
          </Link>
          <button
            type="button"
            onClick={downloadGallery}
            disabled={!isUnlocked || downloadState !== "idle"}
            className="inline-flex h-11 items-center justify-center gap-2 bg-black px-5 text-[11px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-vivid hover:text-dark disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Download aria-hidden="true" size={16} />
            {downloadState === "idle" ? "Download Gallery" : "Preparing Zip"}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 md:px-10 md:py-12">
        <section className="mb-8 grid gap-5 border-b border-black/10 pb-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <div className="flex flex-wrap gap-2">
              {gallery.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-black px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="mt-4 font-display text-5xl font-black uppercase italic leading-none md:text-7xl">
              {gallery.title}
            </h1>
            <p className="mt-3 text-sm text-black/55">
              {gallery.date} / {gallery.location}
            </p>
          </div>
          <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-black/45">
            {gallery.isPrivate ? <Lock aria-hidden="true" size={15} /> : <Images aria-hidden="true" size={15} />}
            {gallery.images.length} Images
          </div>
        </section>

        {!isUnlocked ? (
          <section className="mx-auto max-w-md bg-white p-6 shadow-sm">
            <div className="mb-5 inline-flex size-11 items-center justify-center bg-black text-white">
              <Lock aria-hidden="true" size={20} />
            </div>
            <h2 className="font-display text-3xl font-black uppercase italic">Private Gallery</h2>
            <p className="mt-2 text-sm leading-relaxed text-black/55">
              Enter the gallery code to view proofs and download delivery files.
            </p>
            <div className="mt-5 flex gap-2">
              <input
                value={unlockCode}
                onChange={(event) => setUnlockCode(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") unlockGallery();
                }}
                placeholder="Gallery code"
                className="min-w-0 flex-1 border border-black/15 bg-white px-3 py-3 text-sm outline-none focus:border-black"
              />
              <button
                type="button"
                onClick={unlockGallery}
                className="bg-black px-5 text-[11px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-vivid hover:text-dark"
              >
                Unlock
              </button>
            </div>
            {unlockError && <p className="mt-3 text-sm text-red-600">{unlockError}</p>}
          </section>
        ) : (
          <div className="space-y-8">
            <section className="relative overflow-hidden bg-black shadow-sm">
              <img
                src={gallery.cover}
                alt={gallery.title}
                className="h-[42vh] w-full object-cover opacity-90 md:h-[56vh]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-6 text-white md:p-10">
                <div className="flex flex-wrap gap-2">
                  {gallery.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-black"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="max-w-3xl">
                  <h2 className="font-display text-4xl font-black uppercase italic leading-none md:text-6xl">
                    {gallery.title}
                  </h2>
                  <p className="mt-3 max-w-xl text-sm text-white/75">
                    {gallery.date} / {gallery.location}
                  </p>
                </div>
              </div>
            </section>

            {hasSubGalleries && !selectedSubGalleryId ? (
              <section>
                <div className="mb-4 flex items-end justify-between gap-4 border-b border-black/10 pb-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-black/45">
                      Collections
                    </p>
                    <h3 className="font-display text-3xl font-black uppercase italic leading-none">
                      Sports
                    </h3>
                  </div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-black/45">
                    {gallery.subGalleries?.length} collections
                  </p>
                </div>

                <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {gallery.subGalleries?.map((subGallery) => (
                    <article key={subGallery.id} className="group bg-white shadow-sm">
                      <a
                        href={`/gallery/${galleryId}/${subGallery.id}`}
                        className="block"
                      >
                        <div className="relative overflow-hidden">
                          <img
                            src={subGallery.cover}
                            alt={subGallery.title}
                            className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            loading="lazy"
                          />
                        </div>
                        <div className="p-4">
                          <h2 className="font-display text-3xl font-black uppercase italic leading-none">
                            {subGallery.title}
                          </h2>
                          <div className="mt-4 flex items-center justify-between gap-4 text-[11px] font-bold uppercase tracking-widest text-black/45">
                            <span>{subGallery.images.length} images</span>
                          </div>
                        </div>
                      </a>
                    </article>
                  ))}
                </section>
              </section>
            ) : (
              <section>
                <div className="mb-4 flex items-end justify-between gap-4 border-b border-black/10 pb-4">
                  <div>
                    {selectedSubGalleryId && (
                      <button
                        type="button"
                        onClick={() => setSelectedSubGalleryId(null)}
                        className="mb-2 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-black/55 transition-colors hover:text-black"
                      >
                        <ChevronLeft aria-hidden="true" size={16} />
                        Back to Collections
                      </button>
                    )}
                    <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-black/45">
                      Gallery View
                    </p>
                    <h3 className="font-display text-3xl font-black uppercase italic leading-none">
                      {selectedSubGalleryId ? currentSubGallery?.title : "All Images"}
                    </h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-black/45">
                      {visibleImages.length} images
                    </p>
                    {selectedSubGalleryId && (
                      <button
                        type="button"
                        onClick={downloadAllImages}
                        disabled={downloadingAll || visibleImages.length === 0}
                        className="inline-flex h-9 items-center justify-center gap-2 bg-black px-4 text-[10px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-vivid hover:text-dark disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Download aria-hidden="true" size={14} />
                        {downloadingAll ? "Downloading..." : "Download All"}
                      </button>
                    )}
                  </div>
                </div>

                <section className="columns-2 gap-2 md:columns-3 md:gap-3 xl:columns-4">
                  {visibleImages.map((image, index) => (
                    <figure
                      key={`${gallery.id}-${image.name}-${index}`}
                      className="group mb-2 break-inside-avoid overflow-hidden bg-white shadow-sm md:mb-3"
                    >
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setViewing(index)}
                          className="block w-full text-left"
                          aria-label={`View ${image.title}`}
                        >
                          <img
                            src={image.preview}
                            alt={image.title}
                            loading="lazy"
                            className={`${image.ratio} w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]`}
                          />
                        </button>
                        <a
                          href={image.full}
                          download={image.name}
                          className="absolute right-3 top-3 inline-flex size-9 items-center justify-center bg-black/85 text-white transition-colors hover:bg-vivid hover:text-dark"
                          aria-label={`Download ${image.title}`}
                        >
                          <Download aria-hidden="true" size={16} />
                        </a>
                      </div>
                    </figure>
                  ))}
                </section>
              </section>
            )}
          </div>
        )}
      </main>

      <ImageViewer
        images={visibleImages}
        index={viewing}
        onClose={() => setViewing(null)}
        onIndexChange={setViewing}
      />
    </div>
  );
}
