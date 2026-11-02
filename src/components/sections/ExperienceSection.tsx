import AnimatedSection from "../AnimatedSection";
import { Briefcase, Calendar, MapPin } from "lucide-react";

const ExperienceSection = () => {
  const responsibilities = [
    "Logging, monitoring & alerting: Deployed CloudWatch alerts for servers, databases, and ECS clusters using Terraform and CI/CD pipelines with GitHub Actions.",
    "Patch & AMI management: Verified SSM agent installation and configuration, AMI dates, private AMI usage, and security agent installation across environments.",
    "CI/CD validation: Reviewed application team pipelines for compliance, including security checks such as absence of hardcoded credentials.",
    "Backup & restore: Confirmed backup coverage for application servers; performed DR failover and snapshot-based restore activities to demonstrate recovery to application teams.",
    "Technical change & incident management: Coordinated with application teams who handle changes and incidents through their own procedures.",
    "Service transition: Completed operational readiness tasks and supported handover to application teams after hypercare.",
    "Operational automation: Wrote Python scripts to extract and validate resource details across AWS accounts; built Lambda automations for notifications on unused cost-incurring resources, missing mandatory tags, and automatic CloudWatch alert resolution.",
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
