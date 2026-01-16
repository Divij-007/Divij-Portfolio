import { 
  SiAmazonwebservices, 
  SiTerraform, 
  SiGithubactions, 
  SiJenkins, 
  SiLinux, 
  SiGit 
} from "react-icons/si";
import { Cloud, Activity, Shield, Network, Server, Bell, Database, Lock, FolderOpen } from "lucide-react";

interface TechIconProps {
  name: string;
  className?: string;
}

const iconMap: Record<string, React.ReactNode> = {
  aws: <SiAmazonwebservices className="w-5 h-5" />,
  terraform: <SiTerraform className="w-5 h-5" />,
  "github-actions": <SiGithubactions className="w-5 h-5" />,
  jenkins: <SiJenkins className="w-5 h-5" />,
  linux: <SiLinux className="w-5 h-5" />,
  git: <SiGit className="w-5 h-5" />,
  cloud: <Cloud className="w-5 h-5" />,
  monitoring: <Activity className="w-5 h-5" />,
  security: <Shield className="w-5 h-5" />,
  network: <Network className="w-5 h-5" />,
  server: <Server className="w-5 h-5" />,
  alerting: <Bell className="w-5 h-5" />,
  database: <Database className="w-5 h-5" />,
  iam: <Lock className="w-5 h-5" />,
  storage: <FolderOpen className="w-5 h-5" />,
};

const TechIcon = ({ name, className = "" }: TechIconProps) => {
  const icon = iconMap[name.toLowerCase()];
  
  if (!icon) return null;
  
  return <span className={className}>{icon}</span>;
};

export default TechIcon;
