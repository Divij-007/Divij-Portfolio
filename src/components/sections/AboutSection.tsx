import AnimatedSection from "../AnimatedSection";

const AboutSection = () => {
  return (
    <AnimatedSection className="section-container">
      <h2 className="section-title">About</h2>
      <div className="max-w-4xl">
        <p className="text-lg text-muted-foreground leading-relaxed text-justify">
          Cloud Engineer with 1 year of experience in AWS-based infrastructure operations, focused on monitoring, alerting, and platform stability. Took initiative to move beyond reactive monitoring by implementing alerting enhancements and deployment workflows through CI/CD pipelines. Gained hands-on exposure to Terraform for infrastructure standardization and automation. Currently transitioning toward a DevOps Engineer specialization with emphasis on automation, reliability engineering, and Infrastructure as Code practices.
        </p>
      </div>
    </AnimatedSection>
  );
};

export default AboutSection;
