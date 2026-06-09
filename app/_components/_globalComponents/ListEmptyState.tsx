import Link from "next/link";
import { LuHeart, LuBookmark, LuEye, LuList } from "react-icons/lu";

type ListType = "favorites" | "watchlist" | "watched" | "custom";

interface Props {
  type: ListType;
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

const defaultMessages: Record<ListType, { title: string; description: string }> = {
  favorites: {
    title: "No favorites yet",
    description:
      "Browse movies and TV shows and tap the heart icon to save your favorites.",
  },
  watchlist: {
    title: "Your watchlist is empty",
    description:
      "Add movies and shows you want to watch later from the browse pages.",
  },
  watched: {
    title: "Nothing watched yet",
    description:
      "You haven't marked anything as watched. Start tracking your viewing history!",
  },
  custom: {
    title: "This list is empty",
    description:
      "Add items from movie and show pages using the 'Add to List' option.",
  },
};

const typeIcons: Record<ListType, React.ReactNode> = {
  favorites: <LuHeart className="size-12 text-accent/60" />,
  watchlist: <LuBookmark className="size-12 text-accent/60" />,
  watched: <LuEye className="size-12 text-accent/60" />,
  custom: <LuList className="size-12 text-accent/60" />,
};

export function ListEmptyState({
  type,
  title,
  description,
  actionLabel = "Browse Movies",
  actionHref = "/movies",
}: Props) {
  const defaults = defaultMessages[type];

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="mb-6 opacity-70">{typeIcons[type]}</div>

      <h2 className="text-2xl font-bold text-white mb-2">
        {title || defaults.title}
      </h2>

      <p className="text-second_text text-sm max-w-md mb-8">
        {description || defaults.description}
      </p>

      <Link
        href={actionHref}
        className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-lg text-sm font-bold hover:bg-red-700 active:scale-95 transition-all duration-200"
      >
        {actionLabel}
      </Link>
    </div>
  );
}
