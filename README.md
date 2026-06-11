# Sewer to ICM Journey

> _README added by Robert Dickinson via Comet._

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white) ![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black) ![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=white) ![shadcn/ui](https://img.shields.io/badge/shadcn--ui-000000?logo=shadcnui&logoColor=white)

## About

**Sewer to ICM Journey** is an interactive, client-side guide that walks engineers through the process of importing and converting sewer collection-system models into InfoWorks ICM. It pairs a step-by-step conversion wizard with a visual flowchart, searchable documentation, and troubleshooting guidance so users can follow the migration journey from a legacy sewer model to a working ICM network.

It is part of the SWMMEnablement collection and is built on a modern Vite + React + TypeScript frontend styled with Tailwind CSS and shadcn/ui, including light/dark theming.

## What's Inside

| Feature | Description |
| --- | --- |
| Conversion wizard | Step-by-step guided workflow for moving a sewer model into InfoWorks ICM. |
| Conversion flowchart | Visual representation of the importer steps and decision points in the migration process. |
| Documentation search | Searchable in-app documentation for reference during the conversion. |
| Documentation tab | Organized reference material and import guidance. |
| Onboarding modal | First-run introduction that orients new users to the workflow. |
| Troubleshooting section | Common issues and resolutions encountered during import/conversion. |
| Theme toggle | Light and dark mode support. |

## Tech Stack

| Layer | Technology |
| --- | --- |
| Language | TypeScript |
| Framework | React 18 |
| Build tool | Vite |
| Styling | Tailwind CSS + shadcn/ui |
| Runtime | Entirely client-side (no backend, no database) |

## Key Components

| Component | Role |
| --- | --- |
| `ConversionWizard` | Drives the guided, step-by-step conversion workflow. |
| `ConversionFlowchart` | Renders the visual importer-steps flowchart. |
| `DocumentationSearch` | Provides searchable in-app documentation. |
| `DocumentationTab` | Organizes reference and import documentation. |
| `OnboardingModal` | Introduces the workflow to first-time users. |
| `TroubleshootingSection` | Surfaces common problems and fixes. |
| `ThemeToggle` | Switches between light and dark themes. |

## Getting Started

```bash
# Clone the repository
git clone https://github.com/SWMMEnablement/sewer-to-icm-journey.git
cd sewer-to-icm-journey

# Install dependencies
npm install

# Start the development server
npm run dev
```

Then open the local URL printed by Vite (typically http://localhost:5173) in your browser.

```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

## License

Released under the MIT License unless otherwise noted in this repository.
