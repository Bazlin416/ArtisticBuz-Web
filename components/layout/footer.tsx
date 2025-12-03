import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white fill-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">ArtisticBuz</h2>
                <p className="text-xs text-gray-400">Restore Your Confidence</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              Leading hair restoration specialists dedicated to helping you regain your
              natural hair and confidence through advanced FUE and FUT techniques.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-emerald-600 rounded-full flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-emerald-600 rounded-full flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-emerald-600 rounded-full flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-emerald-600 rounded-full flex items-center justify-center transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm hover:text-emerald-400 transition-colors">Home</a></li>
              <li><a href="#about" className="text-sm hover:text-emerald-400 transition-colors">About Us</a></li>
              <li><a href="#services" className="text-sm hover:text-emerald-400 transition-colors">Services</a></li>
              <li><a href="#calculator" className="text-sm hover:text-emerald-400 transition-colors">Hair Calculator</a></li>
              <li><a href="#" className="text-sm hover:text-emerald-400 transition-colors">Before & After</a></li>
              <li><a href="#" className="text-sm hover:text-emerald-400 transition-colors">Testimonials</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm hover:text-emerald-400 transition-colors">FUE Hair Transplant</a></li>
              <li><a href="#" className="text-sm hover:text-emerald-400 transition-colors">FUT Hair Transplant</a></li>
              <li><a href="#" className="text-sm hover:text-emerald-400 transition-colors">Beard Transplant</a></li>
              <li><a href="#" className="text-sm hover:text-emerald-400 transition-colors">Eyebrow Transplant</a></li>
              <li><a href="#" className="text-sm hover:text-emerald-400 transition-colors">PRP Treatment</a></li>
              <li><a href="#" className="text-sm hover:text-emerald-400 transition-colors">Scalp Micropigmentation</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Riverside drive opposite prime bank apartment called Daphton court suit  A3</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span className="text-sm">+254 722 691 272 </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span className="text-sm">jared.babu@artisticclinic.com</span>
              </li>
            </ul>
            <div className="mt-6">
              <p className="text-sm font-semibold text-white mb-2">Business Hours</p>
              <p className="text-sm">Monday - Friday: 9:00 AM - 6:00 PM</p>
              <p className="text-sm">Saturday: 10:00 AM - 4:00 PM</p>
              <p className="text-sm">Sunday: Closed</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              &copy; 2025 ArtisticBuz. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm hover:text-emerald-400 transition-colors">Privacy Policy</a>
              <a href="#" className="text-sm hover:text-emerald-400 transition-colors">Terms of Service</a>
              <a href="#" className="text-sm hover:text-emerald-400 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
