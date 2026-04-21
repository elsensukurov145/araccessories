import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';

const ContactPage = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1 container-custom pt-28 pb-12">
      <h1 className="text-3xl sm:text-4xl font-bold font-display mb-4">Contact Us</h1>
      <p className="text-muted-foreground mb-10 max-w-xl">Have a question? Reach out via any channel below — we usually reply within a few hours.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Phone, label: 'Phone', value: '+994 50 123 45 67', href: 'tel:+994501234567' },
          { icon: Mail, label: 'Email', value: 'support@ar-accessories.az', href: 'mailto:support@ar-accessories.az' },
          { icon: MessageCircle, label: 'WhatsApp', value: 'Chat with us', href: 'https://wa.me/994501234567' },
          { icon: MapPin, label: 'Address', value: 'Baku, Azerbaijan', href: '#' },
        ].map(({ icon: Icon, label, value, href }) => (
          <a key={label} href={href} className="block p-6 bg-card border border-border rounded-xl hover:border-accent hover:shadow-lg transition-all">
            <Icon className="w-7 h-7 text-accent mb-3" />
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">{label}</p>
            <p className="text-sm font-medium">{value}</p>
          </a>
        ))}
      </div>
    </main>
    <Footer />
  </div>
);

export default ContactPage;
