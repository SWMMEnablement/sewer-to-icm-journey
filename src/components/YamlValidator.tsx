import { useMemo, useState } from "react";
import yaml from "js-yaml";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle2, ClipboardCheck, Download, ShieldCheck, XCircle } from "lucide-react";
import type { ValidationFinding } from "@/lib/validationReport";
import { buildValidationMarkdown, downloadMarkdown } from "@/lib/validationReport";

// Schemas below mirror the "correct" reference snippets in RecoveryPlaybooks.
// Each rule produces a per-field message tied to the snippet name so the user
// can jump straight to the reference.

interface SchemaId {
  id: "manhole" | "scenarios";
  label: string;
  reference: string;
  sample: string;
  validate: (parsed: unknown) => ValidationFinding[];
}

const REQUIRED_MANHOLE_ALIASES: Record<string, string[]> = {
  ground_level: ["GROUND_ELEV", "G_ELEV", "GrndElev", "ELEV_MH"],
  chamber_area: ["AREA", "CHAMBER_AREA", "MH_AREA"],
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function validateManhole(parsed: unknown): ValidationFinding[] {
  const out: ValidationFinding[] = [];
  const ref = "mappings/manhole.yaml — correct alias mapping";
  if (!isRecord(parsed)) {
    out.push({ field: "(root)", severity: "error", message: "Root must be a YAML mapping.", reference: ref });
    return out;
  }
  const hwNode = (parsed as Record<string, unknown>).hw_node;
  if (!isRecord(hwNode)) {
    out.push({
      field: "hw_node",
      severity: "error",
      message: "Missing top-level 'hw_node' mapping — every manhole mapping file must namespace fields under hw_node.",
      reference: ref,
    });
    return out;
  }
  for (const [field, expectedAliases] of Object.entries(REQUIRED_MANHOLE_ALIASES)) {
    const entry = hwNode[field];
    if (!isRecord(entry)) {
      out.push({
        field: `hw_node.${field}`,
        severity: "error",
        message: `Missing '${field}' entry. Add a mapping with 'source: [...]' and a 'default:' value.`,
        reference: ref,
      });
      continue;
    }
    const source = entry.source;
    if (!Array.isArray(source) || source.length === 0) {
      out.push({
        field: `hw_node.${field}.source`,
        severity: "error",
        message: "'source' must be a non-empty list of DBF column aliases.",
        reference: ref,
      });
    } else {
      const listed = source.map((s) => String(s));
      const missing = expectedAliases.filter((a) => !listed.includes(a));
      if (missing.length > 0) {
        out.push({
          field: `hw_node.${field}.source`,
          severity: "warning",
          message: `Missing recommended alias(es): ${missing.map((m) => `'${m}'`).join(", ")}. Values in DBFs that use these column names will fall back to 'default'.`,
          reference: ref,
        });
      }
    }
    if (!("default" in entry)) {
      out.push({
        field: `hw_node.${field}.default`,
        severity: "warning",
        message: "No 'default' provided. Rows with a missing/blank source column will import as NULL.",
        reference: ref,
      });
    } else if (typeof entry.default !== "number") {
      out.push({
        field: `hw_node.${field}.default`,
        severity: "warning",
        message: `'default' should be a number (found ${typeof entry.default}).`,
        reference: ref,
      });
    }
  }
  // Warn about unknown sibling keys
  for (const key of Object.keys(hwNode)) {
    if (!(key in REQUIRED_MANHOLE_ALIASES)) {
      out.push({
        field: `hw_node.${key}`,
        severity: "info",
        message: "Unrecognised field — not part of the manhole reference snippet. Verify it is intentional.",
        reference: ref,
      });
    }
  }
  return out;
}

function validateScenarios(parsed: unknown): ValidationFinding[] {
  const out: ValidationFinding[] = [];
  const ref = "scenarios.yaml — correct parent and SET references";
  if (!isRecord(parsed)) {
    out.push({ field: "(root)", severity: "error", message: "Root must be a YAML mapping with a 'scenarios' list.", reference: ref });
    return out;
  }
  const scenarios = (parsed as Record<string, unknown>).scenarios;
  if (!Array.isArray(scenarios)) {
    out.push({ field: "scenarios", severity: "error", message: "'scenarios' must be a list.", reference: ref });
    return out;
  }
  const names = new Set<string>();
  scenarios.forEach((s, i) => {
    const path = `scenarios[${i}]`;
    if (!isRecord(s)) {
      out.push({ field: path, severity: "error", message: "Each scenario must be a mapping.", reference: ref });
      return;
    }
    const name = s.name;
    if (typeof name !== "string" || !name) {
      out.push({ field: `${path}.name`, severity: "error", message: "'name' is required and must be a non-empty string.", reference: ref });
    } else {
      if (names.has(name)) {
        out.push({ field: `${path}.name`, severity: "error", message: `Duplicate scenario name '${name}'.`, reference: ref });
      }
      names.add(name);
    }
    const parent = s.parent;
    if (parent !== undefined && parent !== null && typeof parent !== "string") {
      out.push({ field: `${path}.parent`, severity: "error", message: "'parent' must be a string (scenario name) or omitted for BASE.", reference: ref });
    }
    if (typeof parent === "string" && typeof name === "string" && parent === name) {
      out.push({ field: `${path}.parent`, severity: "error", message: `Scenario '${name}' cannot be its own parent (circular reference).`, reference: ref });
    }
    const sets = s.sets;
    if (sets !== undefined) {
      if (!isRecord(sets)) {
        out.push({ field: `${path}.sets`, severity: "error", message: "'sets' must be a mapping of SET fields (mh, pipe, pump, wwell).", reference: ref });
      } else {
        for (const [k, v] of Object.entries(sets)) {
          if (typeof v !== "string" || !v) {
            out.push({
              field: `${path}.sets.${k}`,
              severity: "error",
              message: `SET reference must be a non-empty folder name (matches an IEDB subfolder such as 'BASE' or 'PEAK').`,
              reference: ref,
            });
          }
        }
        const expected = ["mh", "pipe", "pump"];
        for (const k of expected) {
          if (!(k in sets)) {
            out.push({
              field: `${path}.sets.${k}`,
              severity: "warning",
              message: `Missing '${k}' SET reference. Without it, the child scenario inherits the parent's ${k.toUpperCase()} data.`,
              reference: ref,
            });
          }
        }
      }
    }
  });
  // Post-pass: check parent existence within this file (BASE may be implicit)
  scenarios.forEach((s, i) => {
    if (!isRecord(s)) return;
    const parent = s.parent;
    const name = s.name;
    if (typeof parent === "string" && parent !== "BASE" && !names.has(parent)) {
      out.push({
        field: `scenarios[${i}].parent`,
        severity: "warning",
        message: `Parent '${parent}' is not declared in this file. Ensure it exists in SCENARIO.DBF and is imported first.`,
        reference: ref,
      });
    }
    if (typeof name === "string" && name !== "BASE" && parent === undefined) {
      out.push({
        field: `scenarios[${i}].parent`,
        severity: "warning",
        message: `Non-BASE scenario '${name}' has no 'parent'. BASE will be assumed — set 'parent' explicitly to avoid surprises.`,
        reference: ref,
      });
    }
  });
  return out;
}

const SCHEMAS: SchemaId[] = [
  {
    id: "manhole",
    label: "manhole.yaml",
    reference: "mappings/manhole.yaml",
    sample: `hw_node:
  ground_level:
    source: [GROUND_ELEV, G_ELEV, GrndElev, ELEV_MH]
    default: 0.0
  chamber_area:
    source: [AREA, CHAMBER_AREA, MH_AREA]
    default: 1.0`,
    validate: validateManhole,
  },
  {
    id: "scenarios",
    label: "scenarios.yaml",
    reference: "scenarios.yaml",
    sample: `scenarios:
  - name: BASE
  - name: PEAK
    parent: BASE
    sets:
      mh: PEAK
      pipe: PEAK
      pump: BASE`,
    validate: validateScenarios,
  },
];

const sevStyles: Record<ValidationFinding["severity"], { badge: string; icon: React.ElementType }> = {
  error: { badge: "bg-destructive text-destructive-foreground", icon: XCircle },
  warning: { badge: "bg-warning text-warning-foreground", icon: AlertCircle },
  info: { badge: "bg-info text-info-foreground", icon: AlertCircle },
};

interface YamlValidatorProps {
  onResultsChange?: (results: { source: string; findings: ValidationFinding[] }[]) => void;
}

const YamlValidator = ({ onResultsChange }: YamlValidatorProps) => {
  const [active, setActive] = useState<SchemaId["id"]>("manhole");
  const [inputs, setInputs] = useState<Record<string, string>>({ manhole: "", scenarios: "" });
  const [parseErrors, setParseErrors] = useState<Record<string, string | null>>({});
  const [results, setResults] = useState<Record<string, ValidationFinding[] | null>>({});

  const schema = useMemo(() => SCHEMAS.find((s) => s.id === active)!, [active]);
  const currentFindings = results[active];
  const currentParseError = parseErrors[active];

  const runValidation = () => {
    const raw = inputs[active] ?? "";
    if (!raw.trim()) {
      setParseErrors((p) => ({ ...p, [active]: "Paste your YAML first." }));
      setResults((r) => ({ ...r, [active]: null }));
      return;
    }
    let parsed: unknown;
    try {
      parsed = yaml.load(raw);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setParseErrors((p) => ({ ...p, [active]: `YAML parse error: ${msg}` }));
      setResults((r) => ({ ...r, [active]: null }));
      return;
    }
    setParseErrors((p) => ({ ...p, [active]: null }));
    const findings = schema.validate(parsed);
    const next = { ...results, [active]: findings };
    setResults(next);
    if (onResultsChange) {
      onResultsChange(
        SCHEMAS.filter((s) => next[s.id]).map((s) => ({ source: s.label, findings: next[s.id] || [] })),
      );
    }
  };

  const loadSample = () => setInputs((p) => ({ ...p, [active]: schema.sample }));
  const clear = () => {
    setInputs((p) => ({ ...p, [active]: "" }));
    setResults((r) => ({ ...r, [active]: null }));
    setParseErrors((p) => ({ ...p, [active]: null }));
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-2">
        <ShieldCheck className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-bold">YAML Schema Validator</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Paste your field-mapping YAML and get per-field errors tied to the reference snippets above.
        Validation runs entirely in your browser — nothing is uploaded.
      </p>

      <Tabs value={active} onValueChange={(v) => setActive(v as SchemaId["id"])}>
        <TabsList>
          {SCHEMAS.map((s) => (
            <TabsTrigger key={s.id} value={s.id}>{s.label}</TabsTrigger>
          ))}
        </TabsList>

        {SCHEMAS.map((s) => (
          <TabsContent key={s.id} value={s.id} className="mt-4 space-y-3">
            <Textarea
              value={inputs[s.id] ?? ""}
              onChange={(e) => setInputs((p) => ({ ...p, [s.id]: e.target.value }))}
              placeholder={`Paste ${s.label} contents…`}
              className="font-mono text-xs min-h-[180px]"
              spellCheck={false}
            />
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={runValidation} className="gap-2">
                <ClipboardCheck className="w-4 h-4" /> Validate
              </Button>
              <Button size="sm" variant="secondary" onClick={loadSample}>Load reference sample</Button>
              <Button size="sm" variant="ghost" onClick={clear}>Clear</Button>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {currentParseError && (
        <div className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm">
          <div className="flex items-start gap-2">
            <XCircle className="w-4 h-4 text-destructive mt-0.5" />
            <span className="font-mono">{currentParseError}</span>
          </div>
        </div>
      )}

      {currentFindings && (
        <div className="mt-4">
          {currentFindings.length === 0 ? (
            <div className="rounded-md border border-success/40 bg-success/10 p-3 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>Structure matches the reference snippet. No issues found.</span>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-sm font-semibold flex items-center gap-2">
                Findings <Badge variant="secondary">{currentFindings.length}</Badge>
              </div>
              <ul className="space-y-2">
                {currentFindings.map((f, i) => {
                  const style = sevStyles[f.severity];
                  const Icon = style.icon;
                  return (
                    <li key={i} className="rounded-md border p-3 flex gap-3">
                      <div className={`p-1.5 rounded ${style.badge} h-fit`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1 text-sm">
                        <div className="flex items-center gap-2 flex-wrap">
                          <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{f.field}</code>
                          <Badge variant="outline" className="text-[10px]">{f.severity}</Badge>
                        </div>
                        <p className="mt-1 text-foreground">{f.message}</p>
                        {f.reference && (
                          <p className="mt-1 text-xs text-muted-foreground">Reference: {f.reference}</p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default YamlValidator;

export const ValidationReportButton = ({
  yamlResults,
}: {
  yamlResults?: { source: string; findings: ValidationFinding[] }[];
}) => {
  const handle = () => {
    const md = buildValidationMarkdown({ yamlFindings: yamlResults });
    const stamp = new Date().toISOString().slice(0, 10);
    downloadMarkdown(`validation-report-${stamp}.md`, md);
  };
  return (
    <Button onClick={handle} className="gap-2">
      <Download className="w-4 h-4" /> Download report (Markdown)
    </Button>
  );
};
