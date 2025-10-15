// For dashboard/admin panels. UX: Collapsible on larger screens, icons for quick recognition.

import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, BookOpen, User, Settings, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export function Sidebar() {
  const { data: session } = useSession();

  return (
    <aside className="w-64 bg-background border-r h-full p-4 hidden md:block">
      <div className="flex flex-col space-y-4">
        <Link href="/dashboard" className="flex items-center space-x-2 text-lg font-bold">
          <LayoutDashboard className="h-6 w-6" /> Dashboard
        </Link>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="courses">
            <AccordionTrigger>
              <BookOpen className="mr-2 h-4 w-4" /> Courses
            </AccordionTrigger>
            <AccordionContent>
              <Link href="/dashboard/enrolled" className="block py-2 pl-4 hover:bg-accent">Enrolled</Link>
              {session?.user?.role === "INSTRUCTOR" && (
                <Link href="/dashboard/instructor" className="block py-2 pl-4 hover:bg-accent">My Courses</Link>
              )}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="profile">
            <AccordionTrigger>
              <User className="mr-2 h-4 w-4" /> Profile
            </AccordionTrigger>
            <AccordionContent>
              <Link href="/profile" className="block py-2 pl-4 hover:bg-accent">Settings</Link>
            </AccordionContent>
          </AccordionItem>
          {session?.user?.role === "ADMIN" && (
            <AccordionItem value="admin">
              <AccordionTrigger>
                <Settings className="mr-2 h-4 w-4" /> Admin
              </AccordionTrigger>
              <AccordionContent>
                <Link href="/admin/users" className="block py-2 pl-4 hover:bg-accent">Users</Link>
                <Link href="/admin/courses" className="block py-2 pl-4 hover:bg-accent">Courses</Link>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
        <Button variant="ghost" onClick={() => signOut()} className="w-full justify-start mt-auto">
          <LogOut className="mr-2 h-4 w-4" /> Log out
        </Button>
      </div>
    </aside>
  );
}