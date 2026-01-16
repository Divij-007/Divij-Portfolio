import { SiLinkedin } from "react-icons/si";
import AnimatedSection from "../AnimatedSection";
import { Mail, Phone, Linkedin, Github, ExternalLink } from "lucide-react";

interface ContactItem {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
  external?: boolean;
}

const contactItems: ContactItem[] = [
  {
    icon: <Mail className="w-5 h-5" />,
    label: "Email",
    value: "divijdivij007@gmail.com",
    href: "mailto:divijdivij007@gmail.com",
  },
  {
    icon: <Phone className="w-5 h-5" />,
    label: "Phone",
    value: "+91 9597696369",
    href: "tel:+91 9597696369",
  },
  {
    icon: <SiLinkedin className="w-5 h-5" />,
    label: "LinkedIn",
    value: "linkedin.com/in/divijp",
    href: "https://www.linkedin.com/in/divijp",
    external: true,
  },
  {
    icon: <Github className="w-5 h-5" />,
    label: "GitHub",
    value: "github.com/Divij-007",
    href: "https://github.com/Divij-007",
    external: true,
  },
];

const ContactSection = () => {
  return (
    <AnimatedSection className="section-container bg-secondary/30">
      <h2 className="section-title text-center">Get In Touch</h2>
      <p className="text-center text-muted-foreground mb-8 max-w-lg mx-auto">
        Open to Cloud Engineer and DevOps Engineer opportunities. 
        Feel free to reach out.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {contactItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noopener noreferrer" : undefined}
            className="flex items-center gap-4 bg-card rounded-xl border border-border p-4 card-hover group"
          >
            <span className="text-accent">{item.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-0.5">{item.label}</p>
              <p className="text-sm text-foreground truncate group-hover:text-accent transition-colors">
                {item.value}
              </p>
            </div>
            {item.external && (
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
            )}
          </a>
        ))}
      </div>
    </AnimatedSection>
  );
};

export default ContactSection;
