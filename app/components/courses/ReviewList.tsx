// Displays reviews. UX: Pagination if many, star ratings.
// UI: shadcn Avatar for user, lucide Star.

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  comment?: string;
  user: { name: string; avatarUrl?: string };
  createdAt: Date;
}

interface ReviewListProps {
  reviews: Review[];
}

export function ReviewList({ reviews }: ReviewListProps) {
  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="flex space-x-4">
          <Avatar>
            <AvatarImage src={review.user.avatarUrl} />
            <AvatarFallback>{review.user.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-medium">{review.user.name}</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`} />
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</p>
            {review.comment && <p className="mt-2">{review.comment}</p>}
          </div>
        </div>
      ))}
      {reviews.length === 0 && <p className="text-center text-muted-foreground">No reviews yet.</p>}
    </div>
  );
}