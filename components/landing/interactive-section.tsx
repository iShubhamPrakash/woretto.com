'use client';

import { GradientButton } from "@/components/ui/gradient-button";
import { Facebook, Twitter, Linkedin, Github } from 'lucide-react';

interface InteractiveSectionProps {
  type: 'free-plan' | 'premium-plan' | 'social-links' | 'footer-links';
}

export function InteractiveSection({ type }: InteractiveSectionProps) {
  const handleAlert = (message: string) => {
    alert(message);
  };

  switch (type) {
    case 'free-plan':
      return (
        <GradientButton onClick={() => handleAlert("Free plan registration will be available soon.")}>
          Get Started
        </GradientButton>
      );

    case 'premium-plan':
      return (
        <GradientButton onClick={() => handleAlert("Premium plan upgrade will be available soon.")}>
          Upgrade Now
        </GradientButton>
      );

    case 'social-links':
      return (
        <div className="flex space-x-4">
          <a href="#" onClick={(e) => { e.preventDefault(); handleAlert("Facebook page will be available soon."); }} className="text-slate-400 hover:text-white">
            <Facebook className="h-6 w-6" />
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); handleAlert("Twitter page will be available soon."); }} className="text-slate-400 hover:text-white">
            <Twitter className="h-6 w-6" />
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); handleAlert("Linkedin page will be available soon."); }} className="text-slate-400 hover:text-white">
            <Linkedin className="h-6 w-6" />
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); handleAlert("Github page will be available soon."); }} className="text-slate-400 hover:text-white">
            <Github className="h-6 w-6" />
          </a>
        </div>
      );

    case 'footer-links':
      return (
        <ul className="space-y-2 text-slate-400">
          <li><a href="#" onClick={(e) => { e.preventDefault(); handleAlert("About page will be available soon."); }} className="hover:text-white">About</a></li>
          <li><a href="#" onClick={(e) => { e.preventDefault(); handleAlert("Blog will be available soon."); }} className="hover:text-white">Blog</a></li>
          <li><a href="#" onClick={(e) => { e.preventDefault(); handleAlert("Terms of Service will be available soon."); }} className="hover:text-white">Terms of Service</a></li>
          <li><a href="#" onClick={(e) => { e.preventDefault(); handleAlert("Privacy Policy will be available soon."); }} className="hover:text-white">Privacy Policy</a></li>
        </ul>
      );

    default:
      return null;
  }
}
