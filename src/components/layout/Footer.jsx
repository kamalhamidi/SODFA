// src/components/layout/Footer.jsx — Pied de page SODFA
import { Link } from 'react-router-dom'
import { Globe, MessageCircle, Mail, MapPin, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-sodfa-charcoal border-t border-sodfa-gold/10">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo & Description */}
          <div className="md:col-span-1">
            <div className="flex flex-col items-start mb-6">
              <svg width="36" height="24" viewBox="0 0 80 60" fill="none" className="mb-1">
                <path d="M40 5 L25 25 L10 5 L10 45 L70 45 L70 5 L55 25 L40 5Z" stroke="#c9a96e" strokeWidth="2" fill="none" />
                <path d="M10 48 L70 48" stroke="#c9a96e" strokeWidth="2" />
              </svg>
              <span className="font-cormorant text-xl italic text-sodfa-gold tracking-[0.25em]">SODFA</span>
              <span className="text-sodfa-gold/50 text-[8px] mt-0.5" style={{ fontFamily: 'serif' }}>صُدفة</span>
            </div>
            <p className="text-sodfa-cream/40 text-sm leading-relaxed font-light">
              Maison de parfums de luxe. Chaque fragrance est une invitation au voyage, un hommage à l'art oriental.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-cormorant text-lg text-sodfa-gold mb-6 tracking-wider">Navigation</h4>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Accueil' },
                { to: '/boutique', label: 'Boutique' },
              ].map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sodfa-cream/40 hover:text-sodfa-gold text-sm transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-cormorant text-lg text-sodfa-gold mb-6 tracking-wider">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sodfa-cream/40 text-sm">
                <MapPin size={16} className="text-sodfa-gold/60 flex-shrink-0" />
                Casablanca, Maroc
              </li>
              <li className="flex items-center gap-3 text-sodfa-cream/40 text-sm">
                <Phone size={16} className="text-sodfa-gold/60 flex-shrink-0" />
                +212 5XX-XXX-XXX
              </li>
              <li className="flex items-center gap-3 text-sodfa-cream/40 text-sm">
                <Mail size={16} className="text-sodfa-gold/60 flex-shrink-0" />
                contact@sodfa.ma
              </li>
            </ul>
          </div>

          {/* Réseaux sociaux */}
          <div>
            <h4 className="font-cormorant text-lg text-sodfa-gold mb-6 tracking-wider">Suivez-nous</h4>
            <div className="flex gap-4">
              {[
                { icon: Globe, href: '#' },
                { icon: MessageCircle, href: '#' },
                { icon: Mail, href: '#' },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  className="w-10 h-10 border border-sodfa-gold/20 flex items-center justify-center text-sodfa-cream/40 hover:text-sodfa-gold hover:border-sodfa-gold/50 transition-all duration-300"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
            <p className="text-sodfa-cream/20 text-xs mt-6 leading-relaxed">
              Inscrivez-vous à notre newsletter pour découvrir nos nouvelles créations en avant-première.
            </p>
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-sodfa-gold/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sodfa-cream/20 text-xs tracking-wider">
            © {new Date().getFullYear()} SODFA — Maison de Parfums de Luxe. Tous droits réservés.
          </p>
          <p className="text-sodfa-cream/20 text-xs">
            Fait avec ♥ au Maroc
          </p>
        </div>
      </div>
    </footer>
  )
}
