
import Link from "next/link";
import { Github, Twitter, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-background border-t py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SkillShare Hub. All rights reserved.
          </div>
          <nav className="flex space-x-6">
            <Link href="/about" className="text-sm hover:text-primary">About</Link>
            <Link href="/privacy" className="text-sm hover:text-primary">Privacy</Link>
            <Link href="/terms" className="text-sm hover:text-primary">Terms</Link>
          </nav>
          <div className="flex space-x-4">
            <a href="https://github.com/getabalewKemaw" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <Github className="h-5 w-5 hover:text-primary" />
            </a>
            <a href="https://twitter.com/getabalewKemaw" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <Twitter className="h-5 w-5 hover:text-primary" />
            </a>
            <a href="mailto:gech12kemaw@gmail.com" target="_blank" rel="noopener noreferrer" aria-label="Email">
              <Mail className="h-5 w-5 hover:text-primary" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}