import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  FileCode,
  Settings,
  Network,
  AlertCircle,
  CheckCircle2,
  Terminal,
  ShieldAlert,
  Code,
} from "lucide-react";

type Severity = "critical" | "warning";

interface Playbook {
  id: string;
  title: string;
  severity: Severity;
  icon: React.ElementType;
  summary: string;
  detect: string[];
  recover: { step: string; command?: string }[];
  prevent: string[];
  yamlExample?: { label: string; snippet: string }[];
}

const playbooks: Playbook[] = [
  {
    id: "excel-com",
    title: "Excel COM automation failure",
    severity: "critical",
    icon: FileCode,
    summary:
      "DBF → CSV stage fails because the Ruby script cannot drive Excel via WIN32OLE. Without this stage no downstream import can proceed.",
    detect: [
      "WIN32OLE::RuntimeError or 0x800401F3 (CLSID not found) in the ICM log",
      "data.rb hangs at convert_dbf_to_csv with no CSV files appearing in the cache folder",
      "Excel.exe visible in Task Manager but no workbook activity",
    ],
    recover: [
      { step: "Close every Excel instance, including any hidden Excel.exe processes." },
      { step: "Kill orphan COM servers." , command: "taskkill /F /IM EXCEL.EXE" },
      { step: "Re-register Excel automation as Administrator.", command: "\"C:\\Program Files\\Microsoft Office\\rootOffice16\\EXCEL.EXE\" /regserver" },
      { step: "Restart InfoWorks ICM as Administrator and rerun the import." },
      { step: "If still failing, delete the csv cache folder and rerun (forces a fresh conversion)." },
    ],
    prevent: [
      "Install desktop Excel 2016+ (Office 365 click-to-run works; Excel viewer / web Excel does not).",
      "Avoid running the import while another macro or add-in has Excel busy.",
      "Disable Excel add-ins that show modal dialogs on startup.",
    ],
  },
  {
    id: "yaml-mapping",
    title: "YAML field mapping mismatch",
    severity: "warning",
    icon: Settings,
    summary:
      "Attributes load as blank or wrong values because DBF column names in the source model do not match the YAML mapping keys.",
    detect: [
      "ICM objects exist but key fields (diameter, invert, roughness, ground_level) are NULL or zero",
      "Ruby log: \"key not found\" or \"undefined method `[]' for nil\" near a mapping lookup",
      "Spot-check: a known manhole's ground level in InfoSewer does not match hw_node.ground_level in ICM",
    ],
    recover: [
      { step: "Open the source DBF in Excel and list its column headers." },
      { step: "Open the matching YAML (e.g. mappings/manhole.yaml) and compare keys side by side." },
      { step: "Add an alias for each unmapped or renamed column under the correct ICM attribute." },
      { step: "Delete the csv cache folder so the next run reflects the new mapping.", command: "rmdir /S /Q <iedb>\\_csv_cache" },
      { step: "Rerun only the BASE data import step to validate before importing scenarios." },
    ],
    prevent: [
      "Keep a project-specific YAML override file rather than editing the shared default.",
      "Validate YAML syntax with a linter before running (indent errors silently drop mappings).",
      "Document any custom InfoSewer fields the modeling team adds during export.",
    ],
  },
  {
    id: "scenario-inheritance",
    title: "Scenario inheritance not resolving",
    severity: "warning",
    icon: Network,
    summary:
      "Child scenarios show missing or duplicated data because the SET fields point to folders that don't exist or the parent wasn't imported first.",
    detect: [
      "Child scenario in ICM looks identical to BASE even though it should differ",
      "Ruby log: \"data folder not found for MH_SET=...\" or \"parent scenario not yet created\"",
      "PIPEHYD/MHHYD CSVs missing under the expected /<SCENARIO>/ subfolder",
    ],
    recover: [
      { step: "Open SCENARIO.DBF in Excel and confirm each row's PARENT, MH_SET, PIPE_SET, PUMP_SET, WWELL_SET point to real folder names." },
      { step: "Verify the corresponding subfolder exists under the IEDB root (e.g. <iedb>\\PEAK\\MHHYD.DBF)." },
      { step: "Drop any partially-created scenarios in ICM before reimporting.", command: "DELETE FROM hw_scenario WHERE name <> 'BASE'" },
      { step: "Re-run the import selecting BASE first, then children in parent-before-child order." },
      { step: "Confirm inheritance by inspecting a child scenario value that should differ from BASE." },
    ],
    prevent: [
      "Always import BASE alone first when onboarding a new model.",
      "Reject scenarios with circular PARENT chains during step 2 instead of letting them through.",
      "Standardize SET field naming so 'BASE' always means the BASE folder (avoid blanks).",
    ],
  },
];

const severityStyles: Record<Severity, { badge: string; ring: string; label: string }> = {
  critical: {
    badge: "bg-destructive text-destructive-foreground",
    ring: "border-destructive/30",
    label: "Critical — blocks import",
  },
  warning: {
    badge: "bg-warning text-warning-foreground",
    ring: "border-warning/30",
    label: "Warning — data integrity",
  },
};

const RecoveryPlaybooks = () => {
  const [open, setOpen] = useState<string | null>("excel-com");

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-2">
        <ShieldAlert className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-bold">Recovery Playbooks</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        Deep-dive recovery steps for the three issues that account for most failed imports. Each card
        is collapsible — expand only the one you need.
      </p>

      <div className="space-y-3">
        {playbooks.map((pb) => {
          const Icon = pb.icon;
          const s = severityStyles[pb.severity];
          const isOpen = open === pb.id;

          return (
            <Collapsible
              key={pb.id}
              open={isOpen}
              onOpenChange={(v) => setOpen(v ? pb.id : null)}
            >
              <Card className={`overflow-hidden border ${s.ring}`}>
                <CollapsibleTrigger asChild>
                  <button className="w-full flex items-center gap-4 p-4 text-left hover:bg-muted/40 transition-colors">
                    <div className={`p-2 rounded-md ${s.badge}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold">{pb.title}</span>
                        <Badge variant="secondary" className="text-xs">{s.label}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{pb.summary}</p>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="px-4 pb-5 pt-1 grid lg:grid-cols-3 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-muted-foreground" /> How to detect
                      </h4>
                      <ul className="space-y-1.5 text-sm text-muted-foreground">
                        {pb.detect.map((d) => (
                          <li key={d} className="flex gap-2"><span>•</span><span>{d}</span></li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-success" /> Recovery steps
                      </h4>
                      <ol className="space-y-2 text-sm">
                        {pb.recover.map((r, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">{i + 1}</span>
                            <div className="flex-1">
                              <div className="text-foreground">{r.step}</div>
                              {r.command && (
                                <div className="mt-1 flex items-center gap-2 rounded bg-muted px-2 py-1 font-mono text-xs">
                                  <Terminal className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                                  <code className="break-all">{r.command}</code>
                                </div>
                              )}
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-primary" /> Prevent next time
                      </h4>
                      <ul className="space-y-1.5 text-sm text-muted-foreground">
                        {pb.prevent.map((p) => (
                          <li key={p} className="flex gap-2"><span>•</span><span>{p}</span></li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          );
        })}
      </div>

      <div className="mt-4 flex gap-2">
        <Button variant="ghost" size="sm" onClick={() => setOpen(null)}>Collapse all</Button>
      </div>
    </Card>
  );
};

export default RecoveryPlaybooks;
