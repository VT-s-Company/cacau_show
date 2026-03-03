import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  size?: number;
}

export default function StarRating({
  rating,
  size = 14,
}: Readonly<StarRatingProps>) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: fullStars }).map((_, index) => (
        <Star
          key={`full-${
            // biome-ignore lint/suspicious/noArrayIndexKey: Static array for star ratings
            index
          }`}
          size={size}
          className="fill-accent text-accent"
        />
      ))}
      {hasHalfStar && (
        <div className="relative">
          <Star size={size} className="text-border" />
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: "50%" }}
          >
            <Star size={size} className="fill-accent text-accent" />
          </div>
        </div>
      )}
      {Array.from({ length: emptyStars }).map((_, index) => (
        <Star
          key={`empty-${
            // biome-ignore lint/suspicious/noArrayIndexKey: Static array for star ratings
            index
          }`}
          size={size}
          className="text-border"
        />
      ))}
    </div>
  );
}
