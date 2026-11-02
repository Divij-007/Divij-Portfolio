import AnimatedSection from "../AnimatedSection";
import TechIcon from "../TechIcon";
import { Cloud, GitBranch, Boxes, Activity, Terminal, Code2 } from "lucide-react";

interface SkillCategory {
  title: string;
  icon: React.ReactNode;
  skills: { name: string; iconKey?: string }[];
}

const skillCategories: SkillCategory[] = [
  {
    title: "Cloud",
    icon: <Cloud className="w-5 h-5" />,
    skills: [
      { name: "EC2", iconKey: "server" },
      { name: "RDS", iconKey: "storage" },
      { name: "S3", iconKey: "storage" },
      { name: "Lambda", iconKey: "aws" },
      { name: "CloudWatch", iconKey: "monitoring" },
      { name: "SNS", iconKey: "alerting" },
      { name: "VPC", iconKey: "network" },
      { name: "IAM", iconKey: "iam" },
    ],
  },
  {
    title: "CI/CD",
    icon: <GitBranch className="w-5 h-5" />,
    skills: [
      { name: "GitHub Actions", iconKey: "github-actions" },
      { name: "CodePipeline", iconKey: "aws" },
    ],
  },
  {
    title: "IaC",
    icon: <Boxes className="w-5 h-5" />,
    skills: [
      { name: "Terraform", iconKey: "terraform" },
    ],
  },
  {
    title: "Scripting",
    icon: <Code2 className="w-5 h-5" />,
    skills: [
      { name: "Python" },
      { name: "AWS Lambda" },
    ],
  },
  {
    title: "Monitoring",
    icon: <Activity className="w-5 h-5" />,
    skills: [
      { name: "CloudWatch Metrics" },
      { name: "CloudWatch Logs" },
      { name: "CloudWatch Alarms" },
      { name: "SNS Alerts" },
    ],
  },
  {
    title: "Other",
    icon: <Terminal className="w-5 h-5" />,
    skills: [
      { name: "Linux", iconKey: "linux" },
      { name: "Git", iconKey: "git" },
      { name: "Networking Basics", iconKey: "network" },
    ],
  },
];

const SkillsSection = () => {
  return (
    <AnimatedSection className="section-container bg-secondary/30">
      <h2 className="section-title">Skills</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skillCategories.map((category, index) => (
          <div
            key={category.title}
            className="bg-card rounded-xl p-6 border border-border card-hover"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-accent">{category.icon}</span>
              <h3 className="font-semibold text-foreground">{category.title}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <span key={skill.name} className="badge-skill">
                  {skill.iconKey && <TechIcon name={skill.iconKey} />}
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AnimatedSection>
  );
};

export default SkillsSection;
