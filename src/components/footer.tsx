import { Facebook, Twitter, Linkedin, Instagram, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">IQ</span>
              </div>
              <span className="text-white">InternQuest</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Connecting students with verified internship opportunities worldwide.
            </p>
            {/* Social Media */}
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#2563EB] transition">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#2563EB] transition">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#2563EB] transition">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#2563EB] transition">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#about" className="hover:text-[#10B981] transition">About Us</a></li>
              <li><a href="#careers" className="hover:text-[#10B981] transition">Careers</a></li>
              <li><a href="#blog" className="hover:text-[#10B981] transition">Blog</a></li>
              <li><a href="#press" className="hover:text-[#10B981] transition">Press</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#contact" className="hover:text-[#10B981] transition">Contact Us</a></li>
              <li><a href="#faq" className="hover:text-[#10B981] transition">FAQ</a></li>
              <li><a href="#help" className="hover:text-[#10B981] transition">Help Center</a></li>
              <li><a href="#terms" className="hover:text-[#10B981] transition">Terms of Service</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#privacy" className="hover:text-[#10B981] transition">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-[#10B981] transition">Terms & Conditions</a></li>
              <li><a href="#cookies" className="hover:text-[#10B981] transition">Cookie Policy</a></li>
              <li><a href="#guidelines" className="hover:text-[#10B981] transition">Community Guidelines</a></li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="max-w-md">
            <h3 className="text-white mb-2">Stay Updated</h3>
            <p className="text-gray-400 text-sm mb-4">Subscribe to our newsletter for the latest internship opportunities.</p>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 bg-gray-800 rounded-lg px-4 py-2">
                <Mail size={18} className="text-gray-500" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-transparent outline-none text-sm"
                />
              </div>
              <button className="bg-[#2563EB] text-white px-6 py-2 rounded-lg hover:bg-[#1d4ed8] transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>© 2025 InternQuest. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#privacy" className="hover:text-[#10B981] transition">Privacy</a>
            <a href="#terms" className="hover:text-[#10B981] transition">Terms</a>
            <a href="#contact" className="hover:text-[#10B981] transition">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}