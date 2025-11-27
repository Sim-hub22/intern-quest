"use client";

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  console.log(pathname)

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">IQ</span>
              </div>
              <span className="text-[#1E293B]">InternQuest</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button 
              className={`${pathname === '/' ? 'text-[#2563EB]' : 'text-gray-600'} hover:text-[#2563EB] transition`}
              
            >
              <Link href="/">
              Home
              </Link>
            </button>
            <button 
              className={`${pathname === '/internships' ? 'text-[#2563EB]' : 'text-gray-600'} hover:text-[#2563EB] transition`}
              
            >
              <Link href="/internships">
              Internships
              </Link>
            </button>
            <button 
              className={`${pathname === '/resources' ? 'text-[#2563EB]' : 'text-gray-600'} hover:text-[#2563EB] transition`}
              
            >
              <Link href="/resources">
              Resources
              </Link>
            </button>
            <Link href="#about" className="text-gray-600 hover:text-[#2563EB] transition">
              About
            </Link>
            <button 
              className="text-gray-600 hover:text-[#2563EB] transition"
              
            >
              <Link href="/login">
              Login
              </Link>
            </button>
            <button 
              className="bg-[#2563EB] text-white px-6 py-2 rounded-lg hover:bg-[#1d4ed8] transition"
            >
              <Link href="/signup">
              Get Started
              </Link>
            </button>
          </div>

          {/* Mobile Menu button */}
          <button
            className="md:hidden text-gray-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <button 
              className={`block w-full text-left ${pathname === 'home' ? 'text-[#2563EB]' : 'text-gray-600'} hover:text-[#2563EB] transition`}
              
            >
              <Link href="/">
              Home
              </Link>
            </button>
            <button 
              className={`block w-full text-left ${pathname === 'internships' ? 'text-[#2563EB]' : 'text-gray-600'} hover:text-[#2563EB] transition`}
            >
              <Link href="/internships">
              Internships
              </Link>
            </button>
            <button 
              className={`block w-full text-left ${pathname === 'resources' ? 'text-[#2563EB]' : 'text-gray-600'} hover:text-[#2563EB] transition`}
            >
              <Link href="/resources">
              Resources
              </Link>
            </button>
            <Link href="#about" className="block text-gray-600 hover:text-[#2563EB] transition">
              About
            </Link>
            <button 
              className="block w-full text-left text-gray-600 hover:text-[#2563EB] transition"
            >
              <Link href="/login">
              Login
              </Link>
            </button>
            <button 
              className="w-full bg-[#2563EB] text-white px-6 py-2 rounded-lg hover:bg-[#1d4ed8] transition"
            >
              <Link href="/signup">
              Get Started
              </Link>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}