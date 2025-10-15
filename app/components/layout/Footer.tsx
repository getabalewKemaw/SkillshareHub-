import Link from "next/link";
import { BookOpen, Github, Twitter, Mail, Facebook, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">SkillShare Hub</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Empowering learners worldwide with quality education and expert instructors.
            </p>
            <div className="flex space-x-3">
              <a href="https://github.com/getabalewKemaw" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://twitter.com/getabalewKemaw" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/courses" className="text-sm text-muted-foreground hover:text-primary transition-colors">Browse Courses</Link>
              <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">Dashboard</Link>
              <Link href="/dashboard/instructor" className="text-sm text-muted-foreground hover:text-primary transition-colors">Become Instructor</Link>
              <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link>
            </nav>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/help" className="text-sm text-muted-foreground hover:text-primary transition-colors">Help Center</Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact Us</Link>
              <a href="mailto:gech12kemaw@gmail.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">Email Support</a>
              <Link href="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">FAQ</Link>
            </nav>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
              <Link href="/cookies" className="text-sm text-muted-foreground hover:text-primary transition-colors">Cookie Policy</Link>
              <Link href="/refund" className="text-sm text-muted-foreground hover:text-primary transition-colors">Refund Policy</Link>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            {new Date().getFullYear()} SkillShare Hub. All rights reserved.
          </div>
          <div className="text-sm text-muted-foreground">
            Made with by <a href="https://github.com/getabalewKemaw" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Getabalew Kemaw</a>
          </div>
        </div>
      </div>
    </footer>
  );
}