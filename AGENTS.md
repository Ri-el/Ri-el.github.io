# Oishy Crafting Forge — Codex Project Instructions

These instructions apply to all Codex work in this repository.

## Local workspace rules

- Work directly in the currently selected local repository.
- Do not use the GitHub API or a GitHub connector.
- Do not clone the repository again.
- Do not create another copy of the project.
- Do not push, force-push, publish, or open a pull request unless the user explicitly asks.
- Do not modify files outside this repository.
- Preserve all existing local changes.
- Never run `git reset --hard`, `git clean`, destructive checkout commands, or other commands that discard work.
- Inspect `git status`, `git diff`, and relevant files before editing.
- Ask for approval before destructive commands, dependency installation, or network access.
- If uncommitted changes exist, understand and preserve them before making edits.
- Work in focused, tested vertical slices.
- Stop only at a tested slice boundary.

## Architecture constraints

The shipped application must remain:

- static HTML, CSS, and JavaScript
- compatible with GitHub Pages
- usable by opening `index.html` through `file://`
- free of a required backend
- free of a required development server
- free of a required package installation step
- compatible with the existing PWA/offline design
- compatible with classic deferred browser scripts

Do not migrate the application to React, Vue, Angular, Svelte, TypeScript build tooling, Vite, Webpack, or a backend.

Development-only Node scripts already used by the repository are allowed.

## Critical UX rule

Do not redesign or replace the existing outer item-class selection flow.

The correct interaction is:

1. The user selects an item class on the existing outer selection screen.
2. The crafting workbench opens immediately.
3. The user selects the concrete in-game base item inside the crafting workbench.
4. The user may switch concrete bases without returning to the outer selection screen.

Examples:

- Outer class: `Amulets`
- Concrete base selected inside workbench: `Crimson Amulet`

Never introduce a required full-screen concrete-base selection step before entering the workbench.

The outer screen chooses the item class.  
The workbench chooses the concrete base.

## Existing functionality that must not regress

Preserve:

- item-category selection
- direct workbench entry
- Ruby/Sapphire/Emerald Jewel switching
- item-level slider
- crafting tabs
- custom currency cursor
- crafting animations
- stash
- undo and redo
- Hinekora's Lock preview
- Desecrate flow
- save/load behavior
- service worker and offline mode
- responsive layout

## Source accuracy

- Do not invent game mechanics, probabilities, modifier weights, quality formulas, corruption outcomes, Omen behavior, socket limits, Rune effects, Soul Core effects, or item applicability.
- Use checked-in normalized data and repository provenance first.
- Keep one explicit target game version.
- Do not silently combine mechanics from different versions.
- When exact behavior is not verified, record a specific blocker rather than implementing a plausible approximation.

## Testing expectations

Inspect the relevant test files before changing behavior.

Run the appropriate subset during development and the full repository checks at a stable slice boundary:

```text
node validation.mjs
node ui-validation.mjs
node data-validation.mjs
node tools/build-normalized-data.mjs --check
node tools/build-currency-index.mjs --check
node tools/sync-poe2-data.mjs verify
node fuzz.mjs 30000 542026
```

Also verify direct `file://` use manually after runtime changes.

Update the service-worker cache version when runtime assets change.

## Documentation workflow

The implementation roadmap is in:

```text
docs/codex/MASTER_ROADMAP.md
```

Execute only the task file named in the current Codex chat instruction.

Do not begin later task files unless the current task is implemented, tested, and reported.
