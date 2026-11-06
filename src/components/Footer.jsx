import Link from "next/link";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Explore Studios", href: "/studios" },
  { name: "How It Works", href: "/#how-it-works" },
  { name: "About Us", href: "/#about" },
];

const popularCategories = [
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Workshop",
];

const accountLinks = [
  { name: "Login", href: "/login" },
  { name: "Register", href: "/register" },
];

const socialLinks = [
  { name: "Facebook", href: "https://www.facebook.com/share/1PrxzAJ46B/", icon: "f" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/prantodev/", icon: "in" },
  {name: "GitHub", href: "https://github.com/prantodev", icon: "g" }
  
];

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">

        {/* Main Footer */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="inline-block text-3xl font-extrabold tracking-tight text-white"
            >
              Studio<span className="text-indigo-400">Space</span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-gray-400">
              Discover, create, and share inspiring creative spaces.
              StudioSpace connects creators with unique studios for
              photography, filmmaking, podcasting, music, and more.
            </p>

            {/* Social Links */}
            <div className="mt-7">
              <h3 className="mb-4 text-sm font-semibold text-white">
                Follow Us
              </h3>

              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 text-sm font-bold text-gray-300 transition hover:border-indigo-400 hover:bg-indigo-500 hover:text-white"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 text-lg font-bold text-white">
              Quick Links
            </h3>

            <ul className="space-y-3 text-sm">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="transition hover:translate-x-1 hover:text-indigo-400"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h3 className="mb-5 text-lg font-bold text-white">
              Popular Categories
            </h3>

            <ul className="space-y-3 text-sm">
              {popularCategories.map((category) => (
                <li key={category}>
                  <Link
                    href={`/studios?category=${encodeURIComponent(category)}`}
                    className="transition hover:text-indigo-400"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account & Contact */}
          <div>
            <h3 className="mb-5 text-lg font-bold text-white">
              Account
            </h3>

            <ul className="space-y-3 text-sm">
              {accountLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="transition hover:text-indigo-400"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="mb-4 mt-8 text-lg font-bold text-white">
              Contact Us
            </h3>

            <ul className="space-y-3 text-sm text-gray-400">
              <li>📍 Dhaka, Bangladesh</li>
              <li>
                ✉️{" "}
                <a
                  href="mailto:support@studiospace.com"
                  className="transition hover:text-indigo-400"
                >
                  prentodev@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-7 text-center sm:flex-row">

          <p className="text-sm text-gray-500">
  © 2026 StudioSpace. All rights reserved.
</p>

          <p className="text-sm text-gray-500">
            Made with ❤️ for creative people.
          </p>
        </div>
      </div>
    </footer>
  );
}