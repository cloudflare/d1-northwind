# Issue tracker: Local Markdown

Issues and specs for this repo live as Markdown files in `.scratch/`.

## Conventions

- One feature per directory: `.scratch/<feature-slug>/`
- The spec is `.scratch/<feature-slug>/spec.md`
- Implementation issues are one file per ticket at `.scratch/<feature-slug>/issues/<NN>-<slug>.md`, numbered from `01`—never a single combined tickets file
- Triage state is recorded as a `Status:` line near the top of each issue file; see `triage-labels.md` for the role strings
- Comments and conversation history append to the bottom of the file under a `## Comments` heading

## When a skill says “publish to the issue tracker”

Create a new file under `.scratch/<feature-slug>/`, creating the directory if needed.

## When a skill says “fetch the relevant ticket”

Read the file at the referenced path. The user will normally pass the path or issue number directly.

## Wayfinding operations

Used by `/wayfinder`. The map is a file with one child file per ticket.

- **Map:** `.scratch/<effort>/map.md`—the Notes, Decisions-so-far, and Fog body
- **Child ticket:** `.scratch/<effort>/issues/NN-<slug>.md`, numbered from `01`, with the question in the body
- A `Type:` line records the ticket type: `research`, `prototype`, `grilling`, or `task`
- A `Status:` line records `claimed` or `resolved`
- **Blocking:** a `Blocked by: NN, NN` line near the top; a ticket is unblocked when every listed file is `resolved`
- **Frontier:** scan `.scratch/<effort>/issues/` for open, unblocked, and unclaimed files; first by number wins
- **Claim:** set `Status: claimed` and save before starting work
- **Resolve:** append the answer under an `## Answer` heading, set `Status: resolved`, then append a context pointer—gist and link—to the map’s Decisions-so-far
