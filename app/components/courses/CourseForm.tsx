"use client"

// For creating/editing courses. UX: Stepper for multi-part form, validation feedback.
// UI: shadcn Form, Input, Textarea, Select, lucide for icons.

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, X, FileVideo } from "lucide-react";
import { useRouter } from "next/navigation";

// Categories matching the database
const CATEGORIES = [
  "Web Development",
  "Mobile Development",
  "Data Science",
  "Machine Learning",
  "Design",
  "Business",
  "Marketing",
  "Photography",
  "Music",
  "Health & Fitness",
  "Language Learning",
  "Personal Development",
];

// Schema for validation
const courseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
  price: z.string().min(0, "Price is required"),
  level: z.string().optional(),
  tags: z.string().optional(),
});

type CourseFormValues = z.infer<typeof courseSchema>;

interface CourseFormProps {
  initialData?: Partial<CourseFormValues>;
}

export function CourseForm({ initialData }: CourseFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [introVideoFile, setIntroVideoFile] = useState<File | null>(null);
  const [introVideoName, setIntroVideoName] = useState<string>("");

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      category: "",
      price: "0",
      level: "Beginner",
      tags: "",
    },
  });

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIntroVideoFile(file);
      setIntroVideoName(file.name);
    }
  };

  const handleSubmit = async (data: CourseFormValues) => {
    setLoading(true);
    setError("");

    try {
      // Upload thumbnail if exists
      let thumbnailUrl = "";
      if (thumbnailFile) {
        const formData = new FormData();
        formData.append("file", thumbnailFile);
        formData.append("type", "course-thumbnail");

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          thumbnailUrl = uploadData.url;
        }
      }

      // Upload intro video if exists
      let introVideoUrl = "";
      if (introVideoFile) {
        const formData = new FormData();
        formData.append("file", introVideoFile);
        formData.append("type", "video");

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          introVideoUrl = uploadData.url;
        }
      }

      // Create course
      const courseData = {
        title: data.title,
        description: data.description,
        category: data.category,
        price: parseFloat(data.price),
        level: data.level || "Beginner",
        tags: data.tags ? data.tags.split(",").map((t) => t.trim()) : [],
        thumbnailUrl: thumbnailUrl || undefined,
        // Note: introVideoUrl stored separately if needed, or add to schema later
      };

      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to create course");
      }

      const course = await res.json();
      
      // Redirect to instructor courses page
      router.push(`/dashboard/instructor/courses`);
    } catch (err) {
      console.error("Course creation error:", err);
      setError(err instanceof Error ? err.message : "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Title *</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Complete Web Development Bootcamp" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description *</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe what students will learn in this course..." 
                  rows={5}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Level</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} defaultValue="Beginner">
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price (ETB) *</FormLabel>
              <FormControl>
                <Input 
                  type="text" 
                  placeholder="0" 
                  {...field}
                />
              </FormControl>
              <p className="text-sm text-muted-foreground">Enter 0 for free courses</p>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g., JavaScript, React, Node.js (comma-separated)" 
                  {...field}
                />
              </FormControl>
              <p className="text-sm text-muted-foreground">Separate tags with commas</p>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Thumbnail Upload */}
        <div className="space-y-2">
          <FormLabel>Course Thumbnail</FormLabel>
          <div className="flex items-center gap-4">
            {thumbnailPreview && (
              <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
                <img src={thumbnailPreview} alt="Thumbnail preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setThumbnailFile(null);
                    setThumbnailPreview("");
                  }}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="hidden"
                id="thumbnail-upload"
              />
              <label htmlFor="thumbnail-upload">
                <Button type="button" variant="outline" asChild>
                  <span>
                    <Upload className="mr-2 h-4 w-4" />
                    {thumbnailFile ? "Change Thumbnail" : "Upload Thumbnail"}
                  </span>
                </Button>
              </label>
              <p className="text-sm text-muted-foreground mt-1">Recommended: 1280x720px</p>
            </div>
          </div>
        </div>

        {/* Intro Video Upload */}
        <div className="space-y-2">
          <FormLabel>Intro Video (Optional)</FormLabel>
          <div className="flex items-center gap-4">
            {introVideoName && (
              <div className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-md">
                <FileVideo className="h-5 w-5" />
                <span className="text-sm">{introVideoName}</span>
                <button
                  type="button"
                  onClick={() => {
                    setIntroVideoFile(null);
                    setIntroVideoName("");
                  }}
                  className="p-1 hover:bg-destructive/10 rounded"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            <div>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="hidden"
                id="video-upload"
              />
              <label htmlFor="video-upload">
                <Button type="button" variant="outline" asChild>
                  <span>
                    <FileVideo className="mr-2 h-4 w-4" />
                    {introVideoFile ? "Change Video" : "Upload Video"}
                  </span>
                </Button>
              </label>
              <p className="text-sm text-muted-foreground mt-1">Short intro video for your course</p>
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Course...
            </>
          ) : (
            "Create Course"
          )}
        </Button>
      </form>
    </Form>
  );
}