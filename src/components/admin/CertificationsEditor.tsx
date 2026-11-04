import type { Certification } from "@/types/content";
import { Plus, Trash2, Award } from "lucide-react";

interface CertificationsEditorProps {
  certifications: Certification[];
  onChange: (updated: Certification[]) => void;
}

export function CertificationsEditor({
  certifications,
  onChange,
}: CertificationsEditorProps) {
  const addCertification = () => {
    const newCert: Certification = {
      id: `cert-${Date.now()}`,
      name: "New Certification Name",
      issuer: "Amazon Web Services",
      issueDate: "2025",
      expiryDate: "2028",
      credentialId: "",
      verifyUrl: "",
      badgeUrl: "",
      description: "Credential details and verified proficiencies...",
    };
    onChange([...certifications, newCert]);
  };

  const updateCert = (index: number, updated: Certification) => {
    const list = [...certifications];
    list[index] = updated;
    onChange(list);
  };

  const removeCert = (index: number) => {
    onChange(certifications.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading font-bold text-lg text-foreground">
            Industry Certifications & Credentials
          </h3>
          <p className="text-xs text-muted-foreground">
            Display your AWS, HashiCorp, Linux, or Kubernetes certifications with validation links.
          </p>
        </div>
        <button
          type="button"
          onClick={addCertification}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[hsl(var(--accent-hsl))] text-[hsl(var(--accent-foreground))] hover:opacity-90"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Certification</span>
        </button>
      </div>

      {certifications.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-[hsl(var(--surface-border))] bg-[hsl(var(--surface-glass))]">
          <Award className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-sm font-medium text-foreground">No certifications added</p>
          <p className="text-xs text-muted-foreground mt-1 mb-4">
            Add your AWS or cloud certifications to strengthen recruiter trust.
          </p>
          <button
            type="button"
            onClick={addCertification}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[hsl(var(--accent-hsl))] text-[hsl(var(--accent-foreground))]"
          >
            Add Credential
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {certifications.map((cert, index) => (
            <div
              key={cert.id}
              className="p-6 rounded-2xl border border-[hsl(var(--surface-border))] bg-[hsl(var(--surface-glass))] backdrop-blur-xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[hsl(var(--surface-border))]">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span className="font-heading font-bold text-sm text-foreground">
                    #{index + 1}: {cert.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeCert(index)}
                  className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                  title="Delete certification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground/80 mb-1 uppercase tracking-wider">
                    Certification Name
                  </label>
                  <input
                    type="text"
                    value={cert.name}
                    onChange={(e) => updateCert(index, { ...cert, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[hsl(var(--bg))] border border-[hsl(var(--surface-border))] text-foreground focus:outline-none focus:border-[hsl(var(--accent-hsl))]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground/80 mb-1 uppercase tracking-wider">
                    Issuing Organization
                  </label>
                  <input
                    type="text"
                    value={cert.issuer}
                    onChange={(e) => updateCert(index, { ...cert, issuer: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[hsl(var(--bg))] border border-[hsl(var(--surface-border))] text-foreground focus:outline-none focus:border-[hsl(var(--accent-hsl))]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground/80 mb-1 uppercase tracking-wider">
                    Issue Date
                  </label>
                  <input
                    type="text"
                    value={cert.issueDate}
                    onChange={(e) => updateCert(index, { ...cert, issueDate: e.target.value })}
                    placeholder="e.g. October 2025"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[hsl(var(--bg))] border border-[hsl(var(--surface-border))] text-foreground focus:outline-none focus:border-[hsl(var(--accent-hsl))]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground/80 mb-1 uppercase tracking-wider">
                    Expiry Date (Optional)
                  </label>
                  <input
                    type="text"
                    value={cert.expiryDate || ""}
                    onChange={(e) =>
                      updateCert(index, { ...cert, expiryDate: e.target.value || undefined })
                    }
                    placeholder="e.g. October 2028"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[hsl(var(--bg))] border border-[hsl(var(--surface-border))] text-foreground focus:outline-none focus:border-[hsl(var(--accent-hsl))]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground/80 mb-1 uppercase tracking-wider">
                    Credential ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={cert.credentialId || ""}
                    onChange={(e) =>
                      updateCert(index, { ...cert, credentialId: e.target.value || undefined })
                    }
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[hsl(var(--bg))] border border-[hsl(var(--surface-border))] text-foreground focus:outline-none focus:border-[hsl(var(--accent-hsl))]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground/80 mb-1 uppercase tracking-wider">
                    Badge / Credential View URL
                  </label>
                  <input
                    type="text"
                    value={cert.badgeUrl || ""}
                    onChange={(e) =>
                      updateCert(index, { ...cert, badgeUrl: e.target.value || undefined })
                    }
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[hsl(var(--bg))] border border-[hsl(var(--surface-border))] text-foreground focus:outline-none focus:border-[hsl(var(--accent-hsl))]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-foreground/80 mb-1 uppercase tracking-wider">
                    Credential Summary
                  </label>
                  <textarea
                    rows={2}
                    value={cert.description || ""}
                    onChange={(e) =>
                      updateCert(index, { ...cert, description: e.target.value || undefined })
                    }
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[hsl(var(--bg))] border border-[hsl(var(--surface-border))] text-foreground focus:outline-none focus:border-[hsl(var(--accent-hsl))]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
