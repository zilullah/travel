"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { MenuIcon, XIcon } from "@/app/_components/ui/Icons";
import { useLanguage } from "@/app/_context/LanguageContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WHATSAPP_CONFIG } from "@/app/_constants/whatsapp";

export const Header: React.FC = () => {
  const { lang, setLang, t } = useLanguage();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("packages");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Detect active hash section when on homepage
      if (pathname === "/") {
        const sections = ["packages", "rental", "antar-jemput", "about"];
        const scrollPosition = window.scrollY + 200;

        for (const section of sections) {
          const el = document.getElementById(section);
          if (el) {
            const top = el.offsetTop;
            const height = el.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
              setActiveSection(section);
              break;
            }
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const navItems = [
    { key: "tours", label: t("nav.tours"), href: "/#packages", sectionId: "packages" },
    { key: "rentals", label: t("nav.rentals"), href: "/#rental", sectionId: "rental" },
    { key: "pickup", label: t("nav.pickup"), href: "/#antar-jemput", sectionId: "antar-jemput" },
    { key: "properties", label: t("nav.properties"), href: "/properties", isRoute: true },
    { key: "about", label: t("nav.about"), href: "/#about", sectionId: "about" },
  ];

  const isItemActive = (item: typeof navItems[0]) => {
    if (item.isRoute) {
      return pathname.startsWith("/properties");
    }
    return pathname === "/" && activeSection === item.sectionId;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3.5 text-[#0C4A6E] ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md border-b border-[#BAE6FD] shadow-sm"
          : "bg-white/80 backdrop-blur-sm border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-sm flex items-center justify-center bg-white border border-[#BAE6FD]">
            <Image
              src="/assets/image/logo.webp"
              alt="Lombok Experience Logo"
              width={40}
              height={40}
              className="object-contain w-full h-full"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-[#0C4A6E] leading-none">
              LOMBOK<span className="text-[#0EA5E9]">TRAVELORGANIZER</span>
            </span>
            <span className="text-[10px] tracking-wider uppercase font-semibold text-[#486581]">
              {t("header.tagline")}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#F0F9FF] p-1.5 rounded-full border border-[#BAE6FD] shadow-inner">
          {navItems.map((item) => {
            const active = isItemActive(item);
            return (
              <a
                key={item.key}
                href={item.href}
                className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all whitespace-nowrap ${
                  active
                    ? "bg-[#0284C7] text-white shadow-sm"
                    : "text-[#0C4A6E] hover:text-[#0284C7] hover:bg-white/90 hover:shadow-xs"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Desktop Controls & CTA */}
        <div className="flex items-center gap-3">
          {/* Language Switcher Button */}
          <div className="flex items-center bg-[#EFF8FF] p-1 rounded-full border border-[#BAE6FD] text-xs font-bold">
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                lang === "en"
                  ? "bg-[#0EA5E9] text-white shadow-xs"
                  : "text-[#486581] hover:text-[#0C4A6E]"
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang("id")}
              className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                lang === "id"
                  ? "bg-[#0EA5E9] text-white shadow-xs"
                  : "text-[#486581] hover:text-[#0C4A6E]"
              }`}
            >
              ID
            </button>
          </div>

          <a
            href={`https://wa.me/${WHATSAPP_CONFIG.phoneNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex bg-[#0EA5E9] hover:bg-[#0284C7] text-white px-4 py-2 rounded-[23px] text-xs font-bold transition-all shadow-sm hover:shadow active:scale-95"
          >
            {t("header.whatsapp_cta")}
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-[#0C4A6E] hover:bg-[#EFF8FF] border border-[#BAE6FD] transition-colors cursor-pointer"
            aria-label={t("header.toggle_menu")}
          >
            {mobileMenuOpen ? (
              <XIcon className="w-5 h-5" />
            ) : (
              <MenuIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/98 backdrop-blur-xl border-b border-[#BAE6FD] px-4 pt-4 pb-6 mt-3 space-y-3 shadow-xl animate-fade-in-up">
          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const active = isItemActive(item);
              return (
                <a
                  key={item.key}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                    active
                      ? "bg-[#E0F2FE] text-[#0284C7] font-bold"
                      : "text-[#0C4A6E] hover:bg-[#EFF8FF]"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          <div className="pt-2 flex items-center justify-between border-t border-[#EFF8FF]">
            <a
              href={`https://wa.me/${WHATSAPP_CONFIG.phoneNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center bg-[#0EA5E9] hover:bg-[#0284C7] text-white py-2.5 rounded-xl text-xs font-bold transition-all"
            >
              {t("header.whatsapp_cta")}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
