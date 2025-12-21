import Link from "next/link";
import { Post } from "contentlayer/generated";

import { cn, formatDate, placeholderBlurhash } from "@/lib/utils";
import BlurImage from "@/components/shared/blur-image";

import Author from "./author";

export function BlogCard({
  data,
  priority,
  horizontale = false,
}: {
  data: Post & {
    blurDataURL: string;
  };
  priority?: boolean;
  horizontale?: boolean;
}) {
  return (
    <article
      className={cn(
        "group relative",
        horizontale
          ? "grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-10 lg:gap-12"
          : "flex flex-col space-y-4",
      )}
    >
      <div className="w-full overflow-hidden rounded-2xl border bg-muted/20 shadow-sm">
        <BlurImage
          alt={data.title}
          blurDataURL={data.blurDataURL ?? placeholderBlurhash}
          className={cn(
            "size-full object-cover object-center transition-transform duration-500 group-hover:scale-105",
            horizontale ? "h-64 sm:h-72 md:h-80 lg:h-96" : "aspect-video",
          )}
          width={800}
          height={400}
          priority={priority}
          placeholder="blur"
          src={data.image}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div
        className={cn(
          "flex flex-1 flex-col",
          horizontale ? "justify-center" : "justify-between",
        )}
      >
        <div className="w-full space-y-2">
          <h2 className={cn(
            "line-clamp-2 font-heading text-foreground transition-colors group-hover:text-primary",
            horizontale ? "text-3xl sm:text-4xl md:text-5xl" : "text-xl sm:text-2xl"
          )}>
            {data.title}
          </h2>
          {data.description && (
            <p className={cn(
              "line-clamp-3 text-pretty text-muted-foreground",
              horizontale ? "text-base sm:text-lg md:text-xl" : "text-sm sm:text-base"
            )}>
              {data.description}
            </p>
          )}
        </div>
        <div className="mt-4 flex items-center space-x-3">
          <div className="flex items-center -space-x-2">
            {data.authors.map((author) => (
              <Author username={author} key={data._id + author} imageOnly />
            ))}
          </div>

          {data.date && (
            <p className="text-sm text-muted-foreground">
              {formatDate(data.date)}
            </p>
          )}
        </div>
      </div>
      <Link href={data.slug} className="absolute inset-0">
        <span className="sr-only">View Article</span>
      </Link>
    </article>
  );
}
