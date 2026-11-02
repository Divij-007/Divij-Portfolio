import AnimatedSection from "../AnimatedSection";
import { AlertTriangle, Lightbulb, Wrench, CheckCircle } from "lucide-react";

interface CaseBlock {
  icon: React.ReactNode;
  title: string;
  content: string;
}

const caseBlocks: CaseBlock[] = [
  {
    icon: <AlertTriangle className="w-6 h-6" />,
    title: "Problem",
    content:
      "ABSA applications migrated to AWS required structured operational readiness validation before handover to the application teams. Each application needed to meet standards across patch management, AMI management, CI/CD, backup & restore, monitoring, alerting, and service transition — a time-intensive process that initially lacked automation.",
  },
  {
    icon: <Lightbulb className="w-6 h-6" />,
    title: "Approach",
    content:
      "Expanded from initial monitoring support into full operational readiness delivery. Deployed Terraform-based CloudWatch alerts via GitHub Actions CI/CD pipelines for servers, databases, and ECS clusters. Wrote Python scripts to extract and validate resource configurations across multiple AWS accounts. Built Lambda automations to enforce tag compliance, surface unused cost-incurring resources, and auto-resolve stale CloudWatch alarms.",
  },
  {
    icon: <Wrench className="w-6 h-6" />,
    title: "Tools",
    content:
      "AWS (EC2, RDS, S3, Lambda, CloudWatch, SNS, SSM, ECS), Terraform (modular configurations), GitHub Actions (CI/CD pipelines), Python (cross-account resource validation scripts).",
  },
  {
    icon: <CheckCircle className="w-6 h-6" />,
    title: "Outcome",
    content:
      "Delivered operational readiness for multiple application sets and completed service transition to application teams after hypercare. Lambda and Python automations reduced manual validation effort, improved cost visibility, and ensured tag compliance across environments.",
  },
];

const CaseStudySection = () => {
  return (
    <AnimatedSection className="section-container bg-secondary/30">
      <h2 className="section-title">Case Study</h2>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Cloud Operational Readiness & Automation
        </h3>
        <p className="text-muted-foreground">
          Client: ABSA (Banking) · Delivered at LTIMindTree · AWS operational readiness
          and automation across enterprise cloud workloads.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {caseBlocks.map((block) => (
          <div
            key={block.title}
            className="bg-card rounded-xl border border-border p-6 card-hover"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-accent">{block.icon}</span>
              <h4 className="font-semibold text-foreground">{block.title}</h4>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed text-justify">
              {block.content}
            </p>
          </div>
        ))}
      </div>
    </AnimatedSection>
  );
};

export default CaseStudySection;
