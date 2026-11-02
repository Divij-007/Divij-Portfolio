import AnimatedSection from "../AnimatedSection";

const AboutSection = () => {
  return (
    <AnimatedSection className="section-container">
      <h2 className="section-title">About</h2>
      <div className="max-w-4xl">
        <p className="text-lg text-muted-foreground leading-relaxed text-justify">
          AWS Cloud Engineer at LTIMindTree with hands-on experience in cloud operations
          and operational readiness across enterprise AWS environments. Working with a
          banking client (ABSA) on cloud migration support — delivering operational
          readiness across patch management, AMI management, CI/CD validation, backup &amp;
          restore, monitoring, alerting, and service transition. Deployed Terraform-based
          CloudWatch alerts via GitHub Actions pipelines, and built Python scripts and
          AWS Lambda automations for tag compliance, unused resource detection, and
          automatic alert resolution. Certified AWS Cloud Practitioner (Oct 2025).
          Currently advancing toward a DevOps Engineer role with a focus on automation,
          reliability, and Infrastructure as Code.
        </p>
      </div>
    </AnimatedSection>
  );
};

export default AboutSection;
