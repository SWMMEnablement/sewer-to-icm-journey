import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ClipboardCheck, ArrowRight } from "lucide-react";

const LimitationsPanel = () => {
  const limitations = [
    "Requires Windows + Excel (COM automation via WIN32OLE) for DBF → CSV step",
    "Assumes standard .IEDB folder structure and consistent DBF encoding",
    "Field names must match the supplied YAML mappings (custom fields need YAML edits)",
    "Scenario inheritance is resolved via SET fields (MH_SET, PIPE_SET, …) — non-standard chains may need review",
    "ICM 2024.x or later with Ruby scripting enabled",
  ];

  const manualReview = [
    "Pump curves, on/off levels, and controls",
    "Outfall types and downstream boundary conditions",
    "Forcemain ‘Break’ node placement and pressurization",
    "Wet well surface areas and base levels",
    "Coordinate system / projection sanity check",
    "Scenario inheritance edge cases and overrides",
    "Subcatchment areas (defaulted to 0.10) and connectivity",
  ];

  const sample = [
    { kind: "Manhole", before: "MH_ID=A1, GRND=102.4, INV=95.1", after: "hw_node[A1].node_type=Manhole, ground_level=102.4, chamber_floor=95.1" },
    { kind: "Conduit", before: "LINK=A1→A2, DIA=12in, MAT=PVC, L=210ft", after: "hw_conduit[A1.1].diameter=0.3048, length=64.0, roughness from YAML" },
    { kind: "Pump", before: "PUMP link P1, ON=98.0, OFF=95.0, curve PC1", after: "hw_pump[P1] + pump curve PC1 rows inserted via SQL cleanup" },
    { kind: "Scenario", before: "SCEN=PEAK, parent=BASE, MH_SET=BASE, PIPE_SET=PEAK", after: "ICM scenario PEAK inherits BASE; PIPEHYD read from /PEAK folder" },
  ];

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="p-6 border-warning/40 bg-warning/5">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-warning" />
          <h3 className="text-xl font-bold">Known Limitations & Assumptions</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          The tool preserves mapped geometry, attributes, scenarios, and selection sets under supported
          field mappings — not arbitrary InfoSewer customizations. Read these before running an import.
        </p>
        <ul className="space-y-2 text-sm">
          {limitations.map((l) => (
            <li key={l} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-warning flex-shrink-0" />
              <span>{l}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <ClipboardCheck className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-bold">Manual Review Recommended After Import</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Post-import cleanup and validation checks are applied automatically, but every model should
          still get a hydraulic QA pass on the items below.
        </p>
        <ul className="space-y-2 text-sm">
          {manualReview.map((m) => (
            <li key={m} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
              <span>{m}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-6 lg:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Before → After Sample</h3>
          <Badge variant="secondary">Illustrative</Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          A concrete look at how one manhole, one conduit, one pump, and one scenario are transformed
          from InfoSewer DBF rows into ICM objects.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2 pr-4 font-semibold">Object</th>
                <th className="py-2 pr-4 font-semibold">InfoSewer (DBF row)</th>
                <th className="py-2 w-6"></th>
                <th className="py-2 font-semibold">InfoWorks ICM</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              {sample.map((row) => (
                <tr key={row.kind} className="border-b last:border-0 align-top">
                  <td className="py-3 pr-4 font-medium text-foreground">{row.kind}</td>
                  <td className="py-3 pr-4"><code className="text-xs">{row.before}</code></td>
                  <td className="py-3 text-primary"><ArrowRight className="w-4 h-4" /></td>
                  <td className="py-3"><code className="text-xs">{row.after}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default LimitationsPanel;
