const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-border py-8">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <p className="text-sm text-muted-foreground">
          © {currentYear} Divij P. Built with focus on infrastructure.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
