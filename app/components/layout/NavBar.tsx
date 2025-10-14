"use client"
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Search, User, LogOut, LogIn, Menu, BookOpen, LayoutDashboard, Settings } from "lucide-react"; // Lucide icons for clean, consistent visuals
import { useState } from "react";
export function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/courses?search=${encodeURIComponent(searchQuery)}`);
    }
  };
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-primary" aria-hidden="true" />
              <span className="font-bold text-xl">SkillShare Hub</span>
            </Link>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="relative w-full">
              <Input
                type="search"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
                aria-label="Search courses"
              />
              <Button type="submit" variant="ghost" className="absolute right-0 top-0 h-full px-3">
                <Search className="h-4 w-4" aria-hidden="true" />
              </Button>
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/courses" className="text-sm font-medium hover:text-primary">
              Courses
            </Link>
            <Link href="/cart" className="text-sm font-medium hover:text-primary">
              Cart
            </Link>
            {session ? (
              <>
                <Link href="/dashboard" className="text-sm font-medium hover:text-primary">
                  Dashboard
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2">
                      <User className="h-5 w-5" aria-hidden="true" />
                      <span>{session.user?.name || "Profile"}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <Settings className="mr-2 h-4 w-4" /> Profile
                      </Link>
                    </DropdownMenuItem>
                    {session.user?.role === "INSTRUCTOR" && (
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/instructor">
                          <LayoutDashboard className="mr-2 h-4 w-4" /> Instructor Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {session.user?.role === "ADMIN" && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin">
                          <Settings className="mr-2 h-4 w-4" /> Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/matching">
                        <Settings className="mr-2 h-4 w-4" /> Matching
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()}>
                      <LogOut className="mr-2 h-4 w-4" /> Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button onClick={() => signIn()} variant="outline">
                <LogIn className="mr-2 h-4 w-4" /> Log in
              </Button>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost">
                  <Menu className="h-6 w-6" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4 mt-6">
                  <form onSubmit={handleSearch} className="relative">
                    <Input
                      type="search"
                      placeholder="Search courses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pr-10"
                    />
                    <Button type="submit" variant="ghost" className="absolute right-0 top-0 h-full px-3">
                      <Search className="h-4 w-4" />
                    </Button>
                  </form>
                  <Link href="/courses" className="text-sm font-medium">
                    Courses
                  </Link>
                  {session && (
                    <>
                      <Link href="/dashboard" className="text-sm font-medium">
                        Dashboard
                      </Link>
                      <Link href="/profile" className="text-sm font-medium">
                        Profile
                      </Link>
                      {session.user?.role === "INSTRUCTOR" && (
                        <Link href="/dashboard/instructor" className="text-sm font-medium">
                          Instructor Dashboard
                        </Link>
                      )}
                      {session.user?.role === "ADMIN" && (
                        <Link href="/admin" className="text-sm font-medium">
                          Admin Panel
                        </Link>
                      )}
                    </>
                  )}
                  {session ? (
                    <Button variant="outline" onClick={() => signOut()} className="w-full justify-start">
                      <LogOut className="mr-2 h-4 w-4" /> Log out
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={() => signIn()} className="w-full justify-start">
                      <LogIn className="mr-2 h-4 w-4" /> Log in
                    </Button>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}