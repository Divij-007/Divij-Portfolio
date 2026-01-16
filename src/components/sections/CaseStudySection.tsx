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
      "The team needed repeatable infrastructure deployments with consistent alerting and monitoring. Manual provisioning was error-prone and time-consuming, leading to configuration drift between environments.",
  },
  {
    icon: <Lightbulb className="w-6 h-6" />,
    title: "Approach",
    content:
      "Developed modular Terraform configurations for Reusabilty with a remote S3 state backend for team collaboration. Implemented a CI/CD pipeline with validation, planning, and manual approval stages before applying changes.",
  },
  {
    icon: <Wrench className="w-6 h-6" />,
    title: "Tools",
    content:
      "AWS (EC2, S3, Security Groups, CloudWatch, SNS), Terraform (modular structure), GitHub Actions for CI/CD automation, remote state locking.",
  },
  {
    icon: <CheckCircle className="w-6 h-6" />,
    title: "Outcome",
    content:
      "Reduced manual provisioning time significantly. Achieved standardized alarm configurations and reusable modules. Enabled safe infrastructure changes with approval workflows and state management.",
  },
];

const CaseStudySection = () => {
  return (
    <AnimatedSection className="section-container bg-secondary/30">
      <h2 className="section-title">Case Study</h2>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Modular Terraform + CI/CD Infrastructure Deployment
        </h3>
        <p className="text-muted-foreground">
          End-to-end infrastructure automation project demonstrating IaC best practices.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {caseBlocks.map((block, index) => (
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
