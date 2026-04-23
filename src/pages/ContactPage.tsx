import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Mail, Phone, MapPin, MessageCircle, Send } from 'lucide-react';
import { useState, FormEvent } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

const ContactPage = () => {
  const { lang } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);

  const T = {
    az: {
      title: 'Bizimlə Əlaqə',
      lead: 'Sualınız var? Aşağıdakı kanallardan bizimlə əlaqə saxlayın.',
      phone: 'TELEFON',
      email: 'E-POÇT',
      whatsapp: 'WHATSAPP',
      address: 'ÜNVAN',
      whatsappValue: 'Bizimlə yazın',
      addressValue: 'Bakı, Azərbaycan',
      formTitle: 'Mesaj göndər',
      name: 'Ad',
      emailLabel: 'E-poçt',
      message: 'Mesaj',
      send: 'Göndər',
      sent: 'Mesajınız göndərildi!',
      fillAll: 'Bütün xanaları doldurun',
    },
    ru: {
      title: 'Свяжитесь с нами',
      lead: 'Есть вопрос? Свяжитесь с нами через любой канал ниже.',
      phone: 'ТЕЛЕФОН',
      email: 'EMAIL',
      whatsapp: 'WHATSAPP',
      address: 'АДРЕС',
      whatsappValue: 'Написать нам',
      addressValue: 'Баку, Азербайджан',
      formTitle: 'Отправить сообщение',
      name: 'Имя',
      emailLabel: 'Email',
      message: 'Сообщение',
      send: 'Отправить',
      sent: 'Ваше сообщение отправлено!',
      fillAll: 'Заполните все поля',
    },
    en: {
      title: 'Contact Us',
      lead: 'Have a question? Reach out via any channel below.',
      phone: 'PHONE',
      email: 'EMAIL',
      whatsapp: 'WHATSAPP',
      address: 'ADDRESS',
      whatsappValue: 'Chat with us',
      addressValue: 'Baku, Azerbaijan',
      formTitle: 'Send a message',
      name: 'Name',
      emailLabel: 'Email',
      message: 'Message',
      send: 'Send',
      sent: 'Your message has been sent!',
      fillAll: 'Please fill all fields',
    },
  }[lang];

  const cards = [
    { icon: Phone, label: T.phone, value: '+994 70 233 09 89', href: 'tel:+994702330989', target: undefined },
    { icon: Mail, label: T.email, value: 'info@ar-accessories.az', href: 'mailto:info@ar-accessories.az', target: undefined },
    { icon: MessageCircle, label: T.whatsapp, value: T.whatsappValue, href: 'https://wa.me/994702330989', target: '_blank' as const },
    { icon: MapPin, label: T.address, value: T.addressValue, href: '#', target: undefined },
  ];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error(T.fillAll);
      return;
    }
    setSending(true);
    // Send via WhatsApp as a quick channel (no backend dependency for now)
    const text = `${T.name}: ${form.name}%0A${T.emailLabel}: ${form.email}%0A${T.message}: ${form.message}`;
    window.open(`https://wa.me/994702330989?text=${text}`, '_blank');
    setTimeout(() => {
      toast.success(T.sent);
      setForm({ name: '', email: '', message: '' });
      setSending(false);
    }, 400);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container-custom pt-28 pb-16">
        <h1 className="text-3xl sm:text-4xl font-bold font-display mb-4">{T.title}</h1>
        <p className="text-muted-foreground mb-10 max-w-xl">{T.lead}</p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-12 sm:mb-16">
          {cards.map(({ icon: Icon, label, value, href, target }) => (
            <a
              key={label}
              href={href}
              target={target}
              rel={target ? 'noopener noreferrer' : undefined}
              className="block p-4 sm:p-6 bg-card border border-border rounded-xl hover:border-accent hover:shadow-lg transition-all"
            >
              <Icon className="w-7 h-7 text-accent mb-3" />
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">{label}</p>
              <p className="text-sm font-medium break-all">{value}</p>
            </a>
          ))}
        </div>

        <div className="max-w-xl">
          <h2 className="text-2xl font-display font-bold mb-6">{T.formTitle}</h2>
          <form onSubmit={handleSubmit} className="space-y-7">
            <div className="floating-input">
              <input
                id="cf-name"
                type="text"
                placeholder=" "
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                maxLength={100}
                required
              />
              <label htmlFor="cf-name">{T.name}</label>
            </div>
            <div className="floating-input">
              <input
                id="cf-email"
                type="email"
                placeholder=" "
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                maxLength={255}
                required
              />
              <label htmlFor="cf-email">{T.emailLabel}</label>
            </div>
            <div className="floating-input">
              <textarea
                id="cf-message"
                placeholder=" "
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                maxLength={1000}
                required
              />
              <label htmlFor="cf-message">{T.message}</label>
            </div>

            <button
              type="submit"
              disabled={sending}
              className="btn-glass btn-glass-primary inline-flex items-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {T.send}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
