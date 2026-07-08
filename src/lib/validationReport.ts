// Builds a downloadable Markdown report from the Validation & Troubleshooting content.
// Both source arrays are re-exported from their components so this stays traceable.

import { troubleshootingItems } from "@/components/TroubleshootingSection";
import { playbooks } from "@/components/RecoveryPlaybooks";

export interface ValidationFinding {
  field: string;
  severity: "error" | "warning" | "info";
  message: string;
  reference?: string;
}

export function buildValidationMarkdown(opts?: {
  yamlFindings?: { source: string; findings: ValidationFinding[] }[];
}): string {
  const now = new Date().toISOString();
  const lines: string[] = [];

  lines.push(`# InfoSewer → ICM — Validation & Troubleshooting Report`);
  lines.push(``);
  lines.push(`_Generated ${now}_`);
  lines.push(``);
  lines.push(`This report summarises the recovery playbooks and troubleshooting entries currently shown in the app, plus any live YAML validation results.`);
  lines.push(``);

  // YAML validation results (if any).
  if (opts?.yamlFindings && opts.yamlFindings.length > 0) {
    lines.push(`## YAML Schema Validation Results`);
    lines.push(``);
    for (const { source, findings } of opts.yamlFindings) {
      lines.push(`### ${source}`);
      lines.push(``);
      if (findings.length === 0) {
        lines.push(`- No issues found. Structure matches the reference snippet.`);
      } else {
        lines.push(`| Severity | Field | Message | Reference |`);
        lines.push(`| --- | --- | --- | --- |`);
        for (const f of findings) {
          lines.push(
            `| ${f.severity} | \`${f.field}\` | ${f.message.replace(/\|/g, "\\|")} | ${f.reference ?? "—"} |`,
          );
        }
      }
      lines.push(``);
    }
  }

  // Recovery playbooks
  lines.push(`## Recovery Playbooks`);
  lines.push(``);
  for (const pb of playbooks) {
    lines.push(`### ${pb.title}`);
    lines.push(`**Severity:** ${pb.severity}`);
    lines.push(``);
    lines.push(pb.summary);
    lines.push(``);
    lines.push(`**How to detect**`);
    for (const d of pb.detect) lines.push(`- ${d}`);
    lines.push(``);
    lines.push(`**Recovery steps**`);
    pb.recover.forEach((r, i) => {
      lines.push(`${i + 1}. ${r.step}`);
      if (r.command) lines.push(`   \`\`\`\n   ${r.command}\n   \`\`\``);
    });
    lines.push(``);
    lines.push(`**Prevent next time**`);
    for (const p of pb.prevent) lines.push(`- ${p}`);
    lines.push(``);
    if (pb.yamlExample && pb.yamlExample.length > 0) {
      lines.push(`**Reference configuration**`);
      for (const ex of pb.yamlExample) {
        lines.push(``);
        lines.push(`_${ex.label}${ex.variant ? ` (${ex.variant})` : ""}_`);
        lines.push("```yaml");
        lines.push(ex.snippet);
        lines.push("```");
      }
      lines.push(``);
    }
    lines.push(`---`);
    lines.push(``);
  }

  // Troubleshooting
  lines.push(`## Troubleshooting Guide`);
  lines.push(``);
  for (const t of troubleshootingItems) {
    lines.push(`### ${t.error}`);
    lines.push(`**Category:** ${t.category} · **Severity:** ${t.severity}`);
    lines.push(``);
    lines.push(`**Symptoms**`);
    for (const s of t.symptoms) lines.push(`- ${s}`);
    lines.push(``);
    lines.push(`**Possible causes**`);
    for (const c of t.causes) lines.push(`- ${c}`);
    lines.push(``);
    lines.push(`**Solutions**`);
    for (const s of t.solutions) lines.push(`- ${s}`);
    lines.push(``);
    lines.push(`---`);
    lines.push(``);
  }

  return lines.join("\n");
}

export function downloadMarkdown(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
