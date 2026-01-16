import { motion } from "framer-motion";
import { Mail, Linkedin, Github } from "lucide-react";
import { SiLinkedin } from "react-icons/si";

const HeroSection = () => {
  return (
    <section className="min-h-[60vh] flex items-center justify-center">
      <div className="section-container text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 tracking-tight">
            DIVIJ P
          </h1>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <p className="text-xl md:text-2xl text-muted-foreground mb-3">
            Cloud Engineer <span className="text-accent">(Aiming DevOps)</span>
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-base md:text-lg text-muted-foreground mb-8 tracking-wide">
            AWS &nbsp;|&nbsp; Terraform &nbsp;|&nbsp; CI/CD &nbsp;
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="mailto:divijdivij007@gmail.com"
            className="cta-button"
          >
            <Mail className="w-4 h-4" />
            Email Me
          </a>
          <a
            href="https://www.linkedin.com/in/divijp"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-button-outline"
          >
            <SiLinkedin className="w-4 h-4" />
            LinkedIn
          </a>
          <a
            href="https://github.com/Divij-007"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-button-outline"
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
