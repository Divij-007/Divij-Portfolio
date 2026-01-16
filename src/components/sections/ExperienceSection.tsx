import AnimatedSection from "../AnimatedSection";
import { Briefcase, Calendar, MapPin } from "lucide-react";

const ExperienceSection = () => {
  const responsibilities = [
    "Monitored infrastructure alerts, investigated incidents, and provided remediation within defined SLAs.",
    "Took initiative to improve alert signal-to-noise ratio by identifying false positives, tuning thresholds, and proposing alarm optimizations.",
    "Collaborated with the development team to deploy new CloudWatch alarms via CI/CD pipelines and Terraform, ensuring consistent configurations across applications.",
    "Analyzed AWS cost usage patterns and submitted optimization suggestions to reduce unnecessary resource consumption.",
    "Worked cross-functionally to enhance observability for new applications through structured logging and metric instrumentation.",
    "Currently upskilling in automation and Infrastructure as Code (Terraform, GitHub Actions/Jenkins) to transition into a DevOps role.",
  ];

  return (
    <AnimatedSection className="section-container">
      <h2 className="section-title">Experience</h2>
      <div className="bg-card rounded-xl border border-border p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="w-5 h-5 text-accent" />
              <h3 className="text-xl font-semibold text-foreground">Engineer - Cloud and Infra Management</h3>
            </div>
            <p className="text-muted-foreground font-medium">LTIMINDTREE</p>
          </div>
          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>2024 – Present</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Chennai</span>
            </div>
          </div>
        </div>
        
        <ul className="space-y-3">
          {responsibilities.map((item, index) => (
            <li key={index} className="flex gap-3 text-muted-foreground text-justify">
              <span className="text-accent mt-1.5 flex-shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </AnimatedSection>
  );
};

export default ExperienceSection;
