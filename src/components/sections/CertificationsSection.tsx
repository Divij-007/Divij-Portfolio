import { SiAmazonwebservices, SiAwsamplify } from "react-icons/si";
import AnimatedSection from "../AnimatedSection";
import { Award, ExternalLink, FileText} from "lucide-react";

interface Certification {
  name: string;
  issuer: string;
  date: string;
  pdfUrl?: string;
  badgeColor: string;
}

const certifications: Certification[] = [
  {
    name: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services",
    date: "2025",
    pdfUrl: "https://drive.google.com/file/d/1egh97bzKcJ1ZFwAjHXrvY4wk0QKCwO9J/view?usp=drive_link", // Replace with actual PDF URL
    badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
];

const CertificationsSection = () => {
  return (
    <AnimatedSection className="section-container">
      <h2 className="section-title">Certifications</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certifications.map((cert, index) => (
          <div
            key={cert.name}
            className="bg-card rounded-xl border border-border p-6 card-hover group"
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${cert.badgeColor}`}>
                <Award className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">{cert.name}</h3>
                <div className="flex items-center gap-2">
              <SiAmazonwebservices className="w-4 h-4"/>
              <p  className="text-sm text-muted-foreground mb-1">{cert.issuer}</p>
            </div>
                
                <p className="text-xs text-muted-foreground mb-4">Issued {cert.date}</p>
                
                {cert.pdfUrl && (
                  <a
                    href={cert.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    View Certificate
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <p className="mt-6 text-sm text-muted-foreground text-center">
        Additional certifications in progress
      </p>
    </AnimatedSection>
  );
};

export default CertificationsSection;
