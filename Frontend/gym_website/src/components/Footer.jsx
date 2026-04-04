import { Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 px-6 py-10 mt-auto">
      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <h3 className="font-bold text-lg">A1 Fitness Series</h3>
          <p className="text-gray-400 mt-2">Your transformation starts here.</p>
        </div>

        <div>
          <h4 className="font-semibold">Contact</h4>
          <p className="flex items-center gap-2 mt-2 text-gray-400">
            <Phone size={16} /> +91 9876543210
          </p>
          <p className="flex items-center gap-2 text-gray-400">
            <Mail size={16} /> support@a1fitness.com
          </p>
        </div>

        <div>
          <h4 className="font-semibold">Quick Links</h4>
          <ul className="text-gray-400 mt-2 space-y-1">
            <li>Home</li>
            <li>Services</li>
            <li>Membership</li>
          </ul>
        </div>
      </div>

      <p className="text-center text-gray-500 mt-6">
        © 2026 A1 Fitness Series. All rights reserved.
      </p>
    </footer>
  );
}
