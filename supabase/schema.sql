-- ==============================================================================
-- Portfolio Database Schema & Seed Data for Supabase
-- Run this in your Supabase Project -> SQL Editor -> Run
-- ==============================================================================

-- 1. Create portfolio_content table
CREATE TABLE IF NOT EXISTS public.portfolio_content (
  id TEXT PRIMARY KEY DEFAULT 'main',
  content JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.portfolio_content ENABLE ROW LEVEL SECURITY;

-- 3. Public read policy (anyone visiting the portfolio can read content)
DROP POLICY IF EXISTS "Allow public read access" ON public.portfolio_content;
CREATE POLICY "Allow public read access"
ON public.portfolio_content
FOR SELECT
TO public
USING (true);

-- 4. Authenticated admin update policy (only logged in admin can edit content)
DROP POLICY IF EXISTS "Allow authenticated users to update" ON public.portfolio_content;
CREATE POLICY "Allow authenticated users to update"
ON public.portfolio_content
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- 5. Authenticated admin insert policy
DROP POLICY IF EXISTS "Allow authenticated users to insert" ON public.portfolio_content;
CREATE POLICY "Allow authenticated users to insert"
ON public.portfolio_content
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 6. Insert initial portfolio data if table is empty
INSERT INTO public.portfolio_content (id, content)
VALUES (
  'main',
  '{
    "profile": {
      "name": "Divij P",
      "title": "Cloud & Infrastructure Engineer",
      "tagline": "Transitioning to DevOps · AWS Cloud Architecture · Terraform IaC · CI/CD Automation",
      "bio": "AWS Cloud Engineer at LTM formerly LTIMindtree with hands-on expertise in cloud operations, infrastructure management, and operational readiness across enterprise AWS environments. Partnered with a premier banking client (ABSA) on high-impact cloud migration initiatives — driving end-to-end operational readiness across patch management, private AMI governance, CI/CD compliance validation, disaster recovery & backup verification, multi-account monitoring, and structured service transition. Spearheaded the deployment of Terraform-managed CloudWatch alerting pipelines via GitHub Actions, and engineered Python scripts alongside event-driven AWS Lambda automations for tag compliance, idle resource cost containment, and automated alarm remediation. AWS Certified Cloud Practitioner. Dedicated to delivering high-availability cloud architecture, automated reliability engineering, and scalable Infrastructure as Code.",
      "location": "Chennai, India",
      "email": "divijdivij007@gmail.com",
      "phone": "+91 9597696369",
      "avatarUrl": "",
      "resumeUrl": "/resume.pdf",
      "socials": [
        {
          "label": "LinkedIn",
          "url": "https://www.linkedin.com/in/divijp",
          "icon": "linkedin"
        },
        {
          "label": "GitHub",
          "url": "https://github.com/Divij-007",
          "icon": "github"
        },
        {
          "label": "Email",
          "url": "mailto:divijdivij007@gmail.com",
          "icon": "mail"
        }
      ]
    },
    "sections": [
      { "id": "about", "label": "About", "visible": true, "order": 0 },
      { "id": "experience", "label": "Experience", "visible": true, "order": 1 },
      { "id": "skills", "label": "Skills", "visible": true, "order": 2 },
      { "id": "case-study", "label": "Case Study", "visible": true, "order": 3 },
      { "id": "certifications", "label": "Certifications", "visible": true, "order": 4 },
      { "id": "contact", "label": "Contact", "visible": true, "order": 5 }
    ],
    "experience": [
      {
        "id": "ltm-2024",
        "role": "Engineer – Cloud and Infrastructure Management",
        "company": "LTM formerly LTIMindtree",
        "startDate": "2024",
        "location": "Chennai, India",
        "responsibilities": [
          "Logging, Monitoring & Proactive Alerting: Engineered and deployed automated CloudWatch alarms and metric filters for virtual servers, RDS relational databases, and containerized ECS clusters using modular Terraform configurations integrated into automated GitHub Actions CI/CD workflows.",
          "Patch Management & AMI Governance: Enforced operational standards by auditing Systems Manager (SSM) agent configurations, validating private AMI lifecycles, and ensuring baseline security agent compliance across testing and production environments.",
          "CI/CD Pipeline Validation & Security Standards: Evaluated application delivery pipelines for compliance against enterprise benchmarks, guaranteeing secure secret isolation and preventing hardcoded credentials.",
          "Disaster Recovery, Backup & Restoration: Guaranteed comprehensive backup policies for mission-critical application workloads; executed simulated disaster recovery (DR) failovers and snapshot-based restoration exercises to validate Recovery Time and Point Objectives (RTO/RPO).",
          "Change & Incident Management Coordination: Facilitated seamless technical change implementations and incident response workflows in close collaboration with cross-functional application engineering teams under structured ITIL protocols.",
          "Operational Readiness & Service Transition: Led operational readiness gate reviews, validating production checklist criteria and orchestrating smooth handover to core application teams following hypercare support.",
          "Cloud Automation & Cost Governance: Authored custom Python automation utilities to extract and audit resource configurations across multiple AWS accounts; engineered event-driven AWS Lambda functions that notify on unattached cost-bearing resources, enforce mandatory tagging schemas, and auto-remediate recurring alerts."
        ]
      }
    ],
    "projects": [],
    "skills": [
      {
        "category": "Cloud Infrastructure",
        "items": ["AWS EC2", "AWS RDS", "AWS S3", "AWS Lambda", "CloudWatch", "AWS SNS", "AWS VPC", "AWS IAM", "AWS ECS", "AWS SSM"]
      },
      {
        "category": "CI/CD & Automation",
        "items": ["GitHub Actions", "AWS CodePipeline", "Automated Testing", "Artifact Packaging", "Deployment Gates"]
      },
      {
        "category": "Infrastructure as Code",
        "items": ["Terraform", "Modular Architecture", "State Management", "IaC Compliance"]
      },
      {
        "category": "Scripting & Development",
        "items": ["Python", "Boto3 SDK", "AWS Lambda Automations", "Bash Shell"]
      },
      {
        "category": "Observability & Alerting",
        "items": ["CloudWatch Metrics", "CloudWatch Logs", "CloudWatch Alarms", "SNS Notifications", "Incident Triage"]
      },
      {
        "category": "Systems & Reliability",
        "items": ["Linux Administration", "Git Version Control", "Disaster Recovery (DR)", "Enterprise Networking", "ITIL Practices"]
      }
    ],
    "certifications": [
      {
        "id": "aws-ccp-2025",
        "name": "AWS Certified Cloud Practitioner",
        "issuer": "Amazon Web Services",
        "issueDate": "October 27, 2025",
        "expiryDate": "October 27, 2028",
        "credentialId": "7e8425e1dee2415faa2e11251f0c232d",
        "verifyUrl": "https://aws.amazon.com/verification",
        "badgeUrl": "https://drive.google.com/file/d/1egh97bzKcJ1ZFwAjHXrvY4wk0QKCwO9J/view?usp=drive_link",
        "description": "Validates overall understanding of AWS cloud platform, core architectural principles, security compliance, key services, and deployment models."
      }
    ],
    "education": [],
    "caseStudies": [
      {
        "id": "absa-operational-readiness",
        "title": "Cloud Operational Readiness & Automation",
        "subtitle": "Client: ABSA (Banking) · Delivered at LTM formerly LTIMindtree · Enterprise AWS operational readiness, governance, and cloud automation.",
        "blocks": [
          {
            "title": "Problem",
            "icon": "alert-triangle",
            "content": "Enterprise banking applications undergoing migration to AWS required structured, auditable operational readiness validation before handover to application teams. Each application demanded rigorous verification across patch management, private AMI compliance, automated CI/CD security checks, backup & disaster recovery readiness, and granular monitoring. This multi-account process initially lacked automation, resulting in labor-intensive manual inspections and potential launch bottlenecks."
          },
          {
            "title": "Approach",
            "icon": "lightbulb",
            "content": "Pioneered a systematic operational enablement framework, evolving from baseline monitoring support into full operational readiness delivery. Codified and deployed CloudWatch alarms and metric dashboards across compute, database, and container tiers via modular Terraform configurations integrated into GitHub Actions CI/CD pipelines. Authored Python automation tools to validate configuration postures across AWS accounts and deployed event-driven AWS Lambda functions to enforce tagging compliance, detect idle resources, and automatically resolve transient alerts."
          },
          {
            "title": "Tools",
            "icon": "wrench",
            "content": "AWS Ecosystem (EC2, RDS, S3, Lambda, CloudWatch, SNS, SSM, ECS) · Terraform (Modular IaC) · GitHub Actions (CI/CD Pipelines) · Python & Boto3 (Multi-Account Resource Audit & Governance)."
          },
          {
            "title": "Outcome",
            "icon": "check-circle",
            "content": "Delivered comprehensive operational readiness across mission-critical banking application workloads and achieved seamless post-hypercare handover to application teams. The custom Lambda and Python automation suites eliminated repetitive manual audits, significantly curtailed dormant cloud expenditure, and guaranteed continuous compliance standards across enterprise environments."
          }
        ]
      }
    ],
    "theme": {
      "defaultMode": "dark",
      "accentColor": "173 58% 45%",
      "fontHeading": "Plus Jakarta Sans",
      "fontBody": "Inter",
      "blurIntensity": 16,
      "grainIntensity": 4,
      "radius": 0.85
    },
    "seo": {
      "title": "Divij P — Cloud & DevOps Engineer",
      "description": "Cloud Engineer at LTM formerly LTIMindtree, specialising in AWS infrastructure, Terraform IaC, GitHub Actions CI/CD, and Python automation. Focused on DevOps & Reliability.",
      "ogImage": ""
    }
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;
