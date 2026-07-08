# 🌊 What This App Does

The **InfoSewer to ICM InfoWorks — Network Import Process** app is an interactive, browser-based guide that documents a Ruby automation for migrating **InfoSewer** collection-system models (stored as `.IEDB` folders of DBF files) into **Innovyze InfoWorks ICM**. It walks an engineer through the full 10-step conversion pipeline — from picking the `.IEDB` folder to running post-import SQL cleanup — with an interactive wizard, an expandable step reference, a Ruby source-code browser, and dedicated troubleshooting and recovery playbooks. The app itself does **not** perform the conversion; it is a documentation and onboarding companion for the underlying Ruby scripts that run inside ICM. According to the hero copy and stats card, the automation typically reduces a 30–45 minute manual import to under 5 minutes on the first run and under 1 minute when the DBF-to-CSV cache is warm.

*[IMAGE #1 here]*

---

# 🎯 Who It's For and Why It Matters

Utilities and consultants who own legacy **InfoSewer** sanitary-sewer models but want to work in **InfoWorks ICM** face a tedious, error-prone manual migration: exporting DBFs, converting them to CSV, importing geometry, remapping attributes, rebuilding scenarios, and stitching selection sets back together. The Ruby tool this app documents automates that pipeline, and the app itself gives the operator a single place to understand *what the automation does*, *what it assumes*, *how to run it*, and *how to recover when it fails*. That matters because the conversion touches hydraulically important objects — manholes, conduits, pumps, wet wells, forcemain break nodes, outfalls, scenario inheritance — and any silent mistranslation can distort model results downstream.

> 🔑 **Key insight:** the app is a *technical product brief* for the Ruby importer, not a modeling engine. Everything it shows corresponds to a real step, file, or failure mode in the automation.

---

# 🟢 For the Novice

If you have never opened SWMM, InfoSewer, or ICM, read this section first. Every term is defined the first time it appears.

## Domain terms you will meet right away

| Term | Plain-English meaning |
| --- | --- |
| **InfoSewer** | A legacy Innovyze sanitary-sewer modeling program. Its projects are stored in an `.IEDB` folder full of DBF database tables. |
| **InfoWorks ICM** | Innovyze's newer, more capable urban drainage / collection-system modeling platform — the *destination* of the conversion. |
| **DBF** | An old dBase-style table file. InfoSewer stores nodes, pipes, pumps, and scenarios as DBFs (`NODE.DBF`, `PIPE.DBF`, `SCENARIO.DBF`, etc.). |
| **CSV cache** | A folder of comma-separated files the tool creates by opening each DBF in Excel and saving it as UTF-8 CSV. Reused on later runs to save time. |
| **Scenario** | A named variant of the model (e.g. `BASE`, `PEAK`). Scenarios inherit data from a parent unless overridden. |
| **YAML mapping** | A small text config file that says which DBF column name maps to which ICM attribute. |

## The header (always visible)

Fixed at the top-right of every screen you will see two controls:

- **Search** — opens a documentation search box that filters across the guide.
- **Theme toggle** — flips the whole app between light and dark mode.

*[IMAGE #2 here]*

## First visit: the Onboarding modal

The very first time you load the page, an **Onboarding Guide** dialog pops up automatically (it remembers via `localStorage` so it will not reappear). It has three slides you advance with **Next**:

1. **Welcome** — what the tool preserves (geometry, hydraulic properties, scenarios, selection sets).
2. **External Assumptions & Requirements** — a yellow *Important Assumptions* block listing the Excel COM requirement, `.IEDB` folder structure expectation, coordinate-system assumption, YAML mapping dependency, and tested ICM version.
3. **Conversion Workflow Overview** — a 4-phase color-coded summary (Configuration → Data Extraction → Geometry Import → Data & Cleanup).

You can reopen it any time from the blue **View Onboarding Guide** button in the hero.

## The four main tabs

Below the hero, the page is organized into four tabs. Read them left-to-right.

### 1. **Overview**
Four stat cards at the top — **Import Time (First Run) <5 min**, **Import Time (Cached) <1 min**, **Tested Models 314 / 1.2k / 6.9k nodes**, **Compatibility ICM 2024.x · Win · Excel** — followed by the **Known Limitations & Assumptions** panel, a **Manual Review Recommended After Import** checklist, and a **Before → After Sample** table showing a Manhole, Conduit, Pump, and Scenario transformation.

*[IMAGE #3 here]*

### 2. **Process Steps**
Contains the **Interactive Conversion Wizard** and, below it, ten expandable step cards.

The wizard's controls:

- **Reset** (top right) — clears progress.
- **Progress bar** — percent complete.
- **Step indicators** — 6 circular icons for **Model → Scenarios → Convert → Geometry → Attributes → Cleanup**. Click a completed one to jump back.
- **Start Wizard** — begins the walkthrough.
- **Previous / Next Step** — move through steps; the last click becomes **Complete** and shows a green success card.

> 💡 **Tip:** the wizard is a *simulation* — it does not actually import a model. It is there to teach the flow.

Below the wizard, ten **Import Process Steps** cards (numbered 1–10) can each be clicked to expand. Every expanded card shows a **details** checklist plus three colored panels: **Inputs**, **Outputs**, and **Failure modes**, and a badge naming the Ruby source file (e.g. `data.rb`, `geo.rb`).

*[IMAGE #4 here]*

### 3. **Technical Details**
Two blocks:

- **DocumentationTab** — a **Program Overview** card (Input Format / Output Format / Processing Time), a **Data Flow Architecture** diagram (Source → Transform → Target), and additional accordion documentation.
- **Ruby Source Code** browser — a sub-tabbed viewer with the seven scripts: `InfoSewer_Import_UI.rb`, `prompts.rb`, `data.rb`, `geo.rb`, `scenario_import.rb`, `selection_sets.rb`, `sql_cleanup.rb`. Click a tab to read the code in a scroll-locked pane.

### 4. **Validation & Troubleshooting**
Contains, top to bottom:

- **Recovery Playbooks** — three deep-dive collapsible cards for the most common failures: **Excel COM automation failure**, **YAML field mapping mismatch**, and **Scenario inheritance not resolving**. Each shows recovery steps plus a **Reference configuration** section with side-by-side correct-vs-broken YAML snippets and inline `+`/`-` diff highlighting.
- **Troubleshooting** accordion — seven items: *Excel COM Automation Failed*, *Invalid IEDB Folder Structure*, *Field Mapping Mismatch*, *Scenario Data Not Inheriting*, *Pump Curves Not Created*, *Conduit Minimum Length Violations*, and *Character Encoding Issues*. Each item lists **Symptoms**, **Causes**, and **Solutions**.
- **Tested on tutorial and production models** — three cards for the Ch12Start (314 nodes), Livermore (6,900 nodes, 32 scenarios), and Bastrop (1,200 nodes) test models.

*[IMAGE #5 here]*

## A complete example first-time session

1. Load the page. The **Onboarding modal** appears; click **Next** twice, then **Get Started**.
2. Land on the **Overview** tab. Read the four stat cards and the **Known Limitations & Assumptions** panel.
3. Switch to **Process Steps**. Press **Start Wizard**. The **Model** circle turns blue and shows a spinner.
4. Read the *Step 1: Select Model* description and its three details, then press **Next Step**. Repeat through *Scenarios*, *Convert*, *Geometry*, *Attributes*, and *Cleanup*.
5. On the final step, press **Complete** to see the green *Conversion Complete!* card. Press **Start New Conversion** to reset.
6. Scroll down and click any of the numbered **Import Process Steps** cards to see the inputs/outputs/failure-modes drill-down.
7. Switch to **Technical Details** and open `sql_cleanup.rb` in the Ruby source browser to see the transactional cleanup calls.
8. Switch to **Validation & Troubleshooting**, open the **YAML field mapping mismatch** playbook, and compare the correct-vs-broken snippets before running the actual import against your own model.

---

# 🔵 For the Advanced User

The app is a documentation surface, so this section describes the algorithms, formats, and assumptions of the **underlying Ruby importer** as they are stated in the app's step definitions, source-code panes, and playbooks.

## Input data formats consumed

| File (in `.IEDB`) | Purpose in the pipeline |
| --- | --- |
| `SCENARIO.DBF` | Enumerates scenarios and their parent chain. `BASE` is always required. |
| `NODE.DBF` | XYZ coordinates for every node. |
| `LINK.DBF` | Link connectivity (upstream/downstream node IDs). |
| `VERTEX.DBF` | Intermediate bend points per link. |
| `MANHOLE.DBF` | Manhole attributes (ground `GRND`, invert `INV`, etc.). |
| `WWELL.DBF` | Wet well definitions. |
| `PIPE.DBF` | Pipe attributes (diameter, material, slope). |
| `PUMP.DBF` | Pump specifications. |
| `MHHYD.DBF` | Per-scenario manhole hydraulic loads and pattern references. |
| `PIPEHYD.DBF` | Per-scenario pipe hydraulic overrides. |
| `PUMPHYD.DBF` | Per-scenario pump settings. |
| `WWELLHYD.DBF` | Per-scenario wet-well parameters. |
| `SELSET.CSV`, `SS/{SET}/ANODE.CSV`, `SS/{SET}/ALINK.CSV` | Selection-set definitions and their node/link members. |

> ⚠️ **Warning:** the DBF-to-CSV step uses **Excel COM automation via `WIN32OLE`**. The app is explicit that this requires **Windows + a local Excel install** and that the process opens each `.DBF` and saves as UTF-8 CSV. Non-Windows hosts or locked DBFs will fail this step.

## Output objects produced in ICM

The step definitions and *Before → After Sample* table name the ICM targets:

- `hw_node` (with `node_type ∈ {Manhole, Outfall, WetWell}`, `ground_level`, `chamber_floor`)
- `hw_conduit` (with `diameter`, `length`, `roughness` from YAML)
- `hw_pump` (plus pump-curve rows inserted by SQL cleanup)
- `hw_subcatchment` (one per manhole, `area = 0.10`, sanitary system type, 100% connectivity)
- ICM **scenario** tree mirroring the InfoSewer hierarchy
- ICM **selection lists** mapped from InfoSewer selection sets

## Algorithms and numerical rules stated in the code

The app surfaces these explicit rules — no others should be assumed:

1. **DBF → CSV conversion** (`data.rb`, `convert_dbf_to_csv`): recursively globs `**/*.DBF`, opens each in a `WIN32OLE::new('Excel.Application')` instance with `DisplayAlerts = false`, and re-saves as UTF-8 CSV. Results are cached so subsequent imports drop from ~12–15 min to <1 min.
2. **Node typing** (`geo.rb`, `get_model_nodes`): nodes are classified as **Manhole**, **Outfall**, or **WetWell** by joining `MANHOLE`, `WWELL`, and `NODE` tables.
3. **Link typing** (`geo.rb`, `get_model_links`): links are classified as **Pipe**, **Forcemain**, or **Pump** from `PIPE`, `PUMP`, and `LINK` tables; `VERTEX` rows are attached as bend points.
4. **Subcatchment defaulting** (`sql_cleanup.rb`, `sql_create_subcatchments`): one `hw_subcatchment` is created per manhole with `area = 0.10`, 100% connectivity, `sanitary` system type. The Overview panel calls out that **area must be re-evaluated manually**.
5. **Minimum conduit length** (`sql_cleanup.rb`, `sql_resolve_conduit_lengths`): conduit lengths below **3.3 ft** are pushed up to that minimum.
6. **Pump conversion** (`sql_cleanup.rb`, `sql_find_and_convert_pumps` → `sql_insert_pump_curves`): links flagged as pumps are converted from conduits to `hw_pump` objects, then pump-curve rows are inserted from the `PUMP` specifications.
7. **Forcemain break nodes**: downstream nodes of forcemains are re-typed as `Break` during cleanup.
8. **Wet well surface areas**: computed during cleanup (the app notes this is a step but does not surface the formula).
9. **Scenario inheritance** (`scenario_import.rb`): parent-child chains from `SCENARIO.DBF` are recreated in ICM, and per-scenario `MH_SET` / `PIPE_SET` / `PUMP_SET` / `WWEL_SET` fields point the importer at the correct data subfolder for `MHHYD`, `PIPEHYD`, `PUMPHYD`, `WWELLHYD` overrides. The tool "resolves data inheritance from parent scenarios" via these SET fields.
10. **Selection sets** (`selection_sets.rb`): each `SELSET` row becomes an ICM selection list whose members are populated from `SS/{SET_NAME}/ANODE.CSV` and `ALINK.CSV`, mapping InfoSewer IDs to ICM compound IDs.

All SQL cleanup runs inside a single transaction (`network.transaction_begin` / `transaction_commit` in `sql_cleanup.rb`), so a constraint violation triggers a rollback.

> 💡 **Interpretation tip:** the *Before → After Sample* row `LINK=A1→A2, DIA=12in, MAT=PVC, L=210ft` → `hw_conduit[A1.1].diameter=0.3048, length=64.0` implies **imperial-to-metric unit conversion** on geometry. Confirm your unit system in ICM matches.

## Field-mapping mechanics (YAML)

Attribute assignment is driven by per-object YAML files (e.g. `manhole.yaml`). The **Recovery Playbooks** show correct-vs-broken snippets, so the effective algorithm is:

- For each DBF column, look up its YAML `alias` list.
- If the alias resolves, write to the mapped ICM attribute.
- Unmapped columns are dropped silently — this is the root cause of the *Field Mapping Mismatch* troubleshooting entry and requires a YAML edit for custom InfoSewer fields.

## Assumptions, limitations, and edge cases (from `LimitationsPanel`)

- Requires **Windows + Excel** via `WIN32OLE`.
- Assumes a **standard `.IEDB` folder structure** and consistent DBF encoding.
- Field names **must match** the supplied YAML mappings.
- Scenario inheritance is resolved **only through SET fields**; non-standard chains need manual review.
- Requires **ICM 2024.x or later** with Ruby scripting enabled.

Manual QA is explicitly recommended for: pump curves and on/off levels, outfall boundary conditions, forcemain `Break` placement and pressurization, wet-well surface areas and base levels, coordinate/projection sanity, scenario-inheritance edge cases, and the defaulted subcatchment areas.

## Validation cases claimed

The **Tested on tutorial and production models** card documents three regression cases: **Ch12Start (314 nodes, tutorial)**, **Bastrop (1,200 nodes, production)**, and **Livermore (6,900 nodes, 32 scenarios)**.

> ⚠️ **Warning:** results should still be spot-checked against the original InfoSewer model for at least one dry-weather and one peak scenario before publishing hydraulics.

*[IMAGE #6 here]*

---

# ⚙️ Under the Hood

The **guide app** and the **importer it documents** are two different code bases. Both are visible in the repo.

**Guide app (this website)**

| Layer | Tech |
| --- | --- |
| Language | TypeScript |
| Framework | React 18 |
| Build tool | Vite 5 |
| Routing | `react-router-dom` (`/` renders `Index`, catch-all `NotFound`) |
| Styling | Tailwind CSS + shadcn/ui components (`Card`, `Tabs`, `Accordion`, `Dialog`, `Progress`, `Badge`, `Button`) |
| Data fetching | `@tanstack/react-query` client provisioned in `App.tsx` (no server calls in the current code) |
| State | Local `useState` per component; onboarding "seen" flag persisted via `localStorage` under key `infosewer-onboarding-seen` |
| Icons | `lucide-react` |
| Theming | Custom `ThemeToggle` toggling a light/dark class on the root |
| Backend | None — the app is entirely client-side |

Notable UI patterns:

- **Simulated wizard** — `ConversionWizard.tsx` holds a `WizardStep[]` with `status ∈ {pending, active, completed, error}`; `handleStart`/`handleNext`/`handlePrevious`/`handleReset` mutate the array and progress percentage without touching any real importer.
- **YAML diff highlighting** — `RecoveryPlaybooks.tsx` implements a `diffLines()` helper that compares paired *correct* and *broken* snippets line-by-line, tagging each line `same | added | removed` and rendering `+`/`-` gutter markers with red/green backgrounds.
- **Fixed header** — `Index.tsx` renders `<DocumentationSearch />` and `<ThemeToggle />` in a `fixed top-4 right-4 z-50` bar so they are always reachable.
- **Onboarding auto-launch** — a `useEffect` in `Index.tsx` reads `localStorage.getItem('infosewer-onboarding-seen')` on mount and opens the modal on first visit.
- **Ruby code browser** — the seven `.rb` files are inlined as template literals at the bottom of `Index.tsx` and rendered inside a nested `Tabs` control with a scrollable `<pre>` pane.

**Importer (the thing being documented)**

| Layer | Tech |
| --- | --- |
| Language | Ruby (embedded in InfoWorks ICM) |
| Excel bridge | `WIN32OLE` COM automation |
| Config | YAML field-mapping files |
| Persistence | ICM network transactions (`transaction_begin` / `transaction_commit`) |
| Entry point | `InfoSewer_Import_UI.rb` calling `main()` after loading `data.rb`, `prompts.rb`, `geo.rb`, `sql_cleanup.rb`, `scenario_import.rb`, `selection_sets.rb` |

---

# 📸 Suggested Screenshots

1. **Hero + first-visit onboarding modal open** — *"First-time landing: the app auto-launches an onboarding modal explaining what the Ruby importer will do."*
2. **Fixed header with search open and dark mode toggled on** — *"The always-visible header keeps documentation search and the light/dark theme toggle one click away."*
3. **Overview tab, four stat cards + Limitations panel** — *"Overview tab: headline benchmarks alongside the known limitations and manual-review checklist."*
4. **Process Steps tab, wizard mid-run on the Geometry step** — *"The interactive wizard simulates each stage of the pipeline with per-step details and a live progress bar."*
5. **An expanded Import Process Step card showing Inputs / Outputs / Failure modes** — *"Every step in the pipeline drills down to its DBF inputs, ICM outputs, and known failure modes."*
6. **Technical Details tab with `sql_cleanup.rb` open in the Ruby browser** — *"The Ruby source-code browser lets you read the actual scripts — here, the transactional cleanup routines."*
7. **Recovery Playbook for YAML field mapping mismatch, showing the inline diff** — *"Recovery playbooks highlight, line-by-line, how a broken YAML mapping differs from the reference configuration."*
8. **Troubleshooting accordion expanded on "Excel COM Automation Failed"** — *"Troubleshooting entries follow a Symptoms → Causes → Solutions pattern for each common failure."*
9. **Tested-models card (Ch12Start / Livermore / Bastrop)** — *"Regression coverage: a 314-node tutorial, a 1,200-node production model, and a 6,900-node network with 32 scenarios."*

---

# ❓ FAQ

**Q: Does this website actually convert my InfoSewer model?**
No. It documents the Ruby importer and lets you *simulate* the flow through the wizard. The real conversion runs inside InfoWorks ICM via the Ruby scripts shown in the Technical Details tab.

**Q: What do I need on my machine to run the actual importer?**
Per the app: **Windows**, a local **Microsoft Excel** install (used via `WIN32OLE` COM automation for DBF-to-CSV), and **InfoWorks ICM 2024.x or later** with Ruby scripting enabled.

**Q: How long does the import take?**
The stat cards claim **<5 min on the first run** and **<1 min on cached re-runs** (the CSV cache from a previous run is reused). The step notes call out that DBF conversion drops from roughly 12–15 min to under 1 min once cached.

**Q: What is preserved and what is not?**
Preserved: mapped geometry, attributes, scenarios, and selection sets. **Not automatic:** subcatchment areas (defaulted to 0.10), pump on/off levels and controls, outfall boundary conditions, forcemain Break-node placement, wet-well surface areas, and coordinate-system checks — all listed under *Manual Review Recommended After Import*.

**Q: My custom InfoSewer field didn't import. Why?**
Because the importer only writes attributes it can resolve through the supplied YAML mappings. Add the custom column as an alias in the relevant `*.yaml` file — the **YAML field mapping mismatch** recovery playbook shows the exact snippet shape.

**Q: How is scenario inheritance handled?**
Scenarios from `SCENARIO.DBF` are recreated in ICM with the same parent-child chain. Per-scenario data is loaded from `MHHYD` / `PIPEHYD` / `PUMPHYD` / `WWELLHYD` using the `MH_SET`, `PIPE_SET`, `PUMP_SET`, `WWEL_SET` fields to locate the correct subfolder. Non-standard chains may need manual review.

**Q: Why do all my short conduits show a length of 3.3 ft?**
The `sql_resolve_conduit_lengths` cleanup enforces a **minimum conduit length of 3.3 ft** to keep the ICM hydraulic solver stable. Anything shorter is bumped up.

**Q: What models has this been validated against?**
Three cases documented in the app: **Ch12Start** (314-node tutorial), **Bastrop** (1,200-node production model), and **Livermore** (6,900 nodes, 32 scenarios).

---

# 📚 Glossary

- **`.IEDB`** — the folder-based InfoSewer project format containing DBF tables.
- **BASE scenario** — the root scenario in InfoSewer; always imported and always the parent of the inheritance tree.
- **Break node** — an ICM node type inserted at the downstream end of a forcemain to handle the pressurized-to-gravity transition.
- **CSV cache** — the mirrored folder of UTF-8 CSVs produced from DBFs on the first run and reused thereafter.
- **DBF** — the dBase-derived table format used inside `.IEDB`.
- **Forcemain** — a pressurized sewer pipe (typically downstream of a pump).
- **`hw_conduit`** — the ICM object type for a gravity or forcemain link.
- **`hw_node`** — the ICM object type for a network node (manhole, outfall, or wet well).
- **`hw_pump`** — the ICM object type for a pump.
- **`hw_subcatchment`** — the ICM object type for a subcatchment; the importer creates one per manhole with area 0.10.
- **InfoSewer** — legacy Innovyze sanitary-sewer modeling package.
- **InfoWorks ICM** — Innovyze's integrated catchment / collection-system model; the migration target.
- **Manhole** — an access structure; the dominant node type in a sanitary sewer.
- **`MHHYD` / `PIPEHYD` / `PUMPHYD` / `WWELLHYD`** — per-scenario DBFs holding hydraulic overrides for manholes, pipes, pumps, and wet wells respectively.
- **Outfall** — the boundary node where the sewer discharges (e.g. to a treatment plant or receiving water).
- **Pump curve** — the head-vs-flow characteristic of a pump; inserted from `PUMP.DBF` by `sql_insert_pump_curves`.
- **Scenario** — a named model variant with its own hydraulic overrides and an optional parent.
- **Selection set** — a named collection of nodes and/or links used for reporting or editing.
- **SET field** — a column (e.g. `MH_SET`) on a scenario that tells the importer which subfolder holds its per-scenario data.
- **SQL cleanup** — post-import transactional SQL that fixes lengths, types, pumps, and curves inside the ICM network.
- **Wet well** — a storage chamber at a pump station; represented as a special ICM node.
- **`WIN32OLE`** — the Ruby standard library used to drive Excel via COM automation for DBF-to-CSV conversion.
- **YAML mapping** — the per-object configuration file that maps DBF column names to ICM attribute names.
