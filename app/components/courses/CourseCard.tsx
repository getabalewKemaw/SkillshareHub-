// For listing courses. UX: Hover effects, clear info hierarchy (title > instructor > price/rating).
// UI: shadcn Card, Badge for categories, lucide for icons like Star for ratings.

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Users, DollarSign } from "lucide-react";
import Link from "next/link";
import Image from "next/image"; // For optimized thumbnails

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  category?: string;
  price: number;
  rating: number;
  enrollmentCount: number;
  instructorName: string;
}

export function CourseCard({ id, title, description, thumbnailUrl, category, price, rating, enrollmentCount, instructorName }: CourseCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {thumbnailUrl && (
        <div className="relative h-40">
          <Image src={thumbnailUrl} alt={title} fill className="object-cover" />
        </div>
      )}
      <CardHeader>
        <CardTitle className="line-clamp-1">{title}</CardTitle>
        <CardDescription className="text-sm">By {instructorName}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        {category && <Badge variant="secondary" className="mt-2">{category}</Badge>}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center space-x-2 text-sm">
          <Star className="h-4 w-4 text-yellow-500" /> <span>{rating.toFixed(1)}</span>
          <Users className="h-4 w-4" /> <span>{enrollmentCount}</span>
        </div>
        <div className="flex items-center text-sm font-medium">
          <DollarSign className="h-4 w-4 mr-1" /> {price === 0 ? "Free" : price}
        </div>
      </CardFooter>
      <Link href={`/courses/${id}`} className="absolute inset-0" aria-label={`View ${title}`} />
    </Card>
  );
}