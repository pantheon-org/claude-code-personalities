# AGENTS.md

Agent instructions for this repository.

## What this is

A Claude Code plugin: a `SessionStart` hook injects a character personality into every conversation, and a `/claude-code-personalities:personality` slash command switches it. TypeScript + Bun, built with Vite, distributed as a Claude Code plugin (`.claude-plugin/plugin.json`). See `README.md` for the personality JSON schema and end-user install/config docs — this file covers agent-facing conventions and commands, not user docs.

## Shared agent configuration

- **Single agent tool**: this repo is developed with Claude Code only (no opencode/shared `.agents` config across tools).
- **Meta-skills**: `.agents/skills/<name>/SKILL.md` holds skills for *developing this plugin* (not shipped to end users). `.claude/skills/<name>` symlinks to each one so Claude Code discovers them locally. See `.agents/skills/README.md` for the list.
- **End-user skills** ship from `skills/` at the repo root (currently `skills/personality/SKILL.md`), registered via `.claude-plugin/plugin.json`'s `"skills"` field. Claude Code's auto-discovery only scans `skills/` for subdirectories containing a `SKILL.md` — a flat `skills/<name>.md` file is never discovered.

## Instructions

- `.agents/instructions/aislop.md`
- `.agents/instructions/code-review-graph.md`
- `.agents/instructions/context-mode.md`
- `.agents/instructions/follow-up-triage.md`
- `.agents/instructions/planning-flow.md`
- `.agents/instructions/qmd.md`
- `.agents/instructions/rtk.md`
- `.agents/instructions/rule-of-three.md`
- `.agents/instructions/skill-authoring.md`
- `.agents/instructions/theme-vocabulary.md`
- `.agents/instructions/typescript-standards.md`
- `.agents/instructions/value-rubric.md`
- `.agents/instructions/ways-of-working.md`

**Known drift, not yet reconciled:**

- `typescript-standards.md` mandates arrow-function-only, one-function-per-file, Cliffy CLI parsing. This repo's actual `src/` uses plain `function` declarations with multiple exports per file and no Cliffy dependency — see [Conventions](#conventions) below for what's really in place. Treat the file as aspirational until the codebase is brought in line or the file is revised.
- `theme-vocabulary.md` documents a `.context/` `themes` frontmatter vocabulary written for a different project's action-candidate corpus. This repo's `.context/` only holds `knowledge-base/` docs — no learnings/follow-ups/plans structure exists here yet.
- `ways-of-working.md`, `planning-flow.md`, `follow-up-triage.md`, `rule-of-three.md`, and `value-rubric.md` assume a `.context/learnings|follow-ups|plans/` layout and `docs/RISK_REGISTER.md`/`docs/TECH_DEBT.md`, none of which exist in this repo yet. The git workflow guidance in `ways-of-working.md` (branch/PR/squash-merge, `EnterWorktree`) is generally applicable; its specific references to this repo's remote and to `hk` jobs (e.g. `mermaid-validate`, `plan-staleness`) are not — this repo's `hk.pkl` has no such jobs.

## Repo layout

| Path | Purpose |
| --- | --- |
| `src/hooks/inject.ts` | `SessionStart` hook — builds and injects the active personality prompt |
| `src/cli/switch.ts` | `/personality` slash-command CLI |
| `src/install.ts` | Seeds personality data + skill symlink on plugin install |
| `src/lib/personalities.ts` | Load/save personality state, build prompts |
| `src/lib/types.ts` | Zod schemas (`PersonalityConfigSchema`, `MoodSchema`, `PersonalityStateSchema`) — source of truth for `schema/personality.schema.json` |
| `data/*.json` | Bundled personality definitions |
| `schema/personality.schema.json` | Generated — run `mise run generate:schema` after editing `src/lib/types.ts`, never hand-edit |
| `hooks/hooks.json` | Plugin hook manifest, points at `${CLAUDE_PLUGIN_ROOT}/dist/hooks/inject.mjs` |
| `.claude-plugin/plugin.json` | Plugin manifest (name, version, skills path) |
| `dist/` | Build output. Gitignored locally; built and committed to `main` by CI (`bundle.yml`) — do not hand-edit or hand-commit it |

## Tooling

- Package manager/runtime: Bun. Tool versions pinned in `mise.toml`; run `mise install` once after cloning (also triggers `hk install --mise` via a `postinstall` hook).
- Commands:
  - `bunx tsc --noEmit` — type-check
  - `biome check src/` (add `--write` to fix) — lint/format
  - `mise run test` (or `bun test`) — run the unit test suite (`src/**/*.test.ts`)
  - `mise run build` — compile `src/` to `dist/` via Vite
  - `mise run generate:schema` — regenerate `schema/personality.schema.json` from the Zod types
  - `mise run install:plugin` — seed personality data + skill symlink for local dev
  - `mise run dev:hook` / `mise run dev:cli` — run the hook/CLI directly against `src/` without building
- Pre-commit hooks (`hk.pkl`, installed via `hk install --mise`) run automatically: typecheck, biome, markdownlint, actionlint, `aislop ci --staged`, plus generic hygiene checks (trailing whitespace, EOF newline, merge-conflict markers, large files, case conflicts, private keys, executable shebangs, mixed line endings). `hk run pre-commit` runs the same checks on demand. The same set (minus auto-fix, using `aislop ci` over the whole repo instead of `--staged`) runs again at pre-push as a final gate, plus `bun test` (deliberately pre-push only, not pre-commit, since it's slower and every commit doesn't need it re-run) — `hk run pre-push` on demand. `ctxharness` is intentionally not in either hook yet (see [Instructions](#instructions) above).
- CI: `ci.yml` (typecheck + lint + `bun test`), `bundle.yml` (builds and commits `dist/` to `main`), `release-please.yml` (versioning/releases), `ai-hygiene.yml` (aislop + ctxharness report, advisory only), `plumber.yml` (workflow security scan, config in `.plumber.yaml`; only a Critical finding blocks a PR).

### Quality gates

- **aislop** — AI-slop/code-quality scanner. No committed `.aislop/config.yaml`/`rules.yaml` in this repo yet, so it runs on defaults. Runs on staged files in pre-commit (`aislop ci --staged`) and as a Claude Code PostToolUse hook (see your global `AISLOP.md` instructions — treat its findings as blocking). CI runs it over changed files on PRs and the whole repo on `main` (`mise run slop:changes` / `slop:check`), report-only.
- **ctxharness** — agent-doc drift checker (`mise run ctx`). Configured via `.ctxharness.yml`: 38 `fileExists`/`literalInMd` assertions checking that every path `AGENTS.md`/`CLAUDE.md` references actually exists. `ctxharness init`'s auto-generated assertions needed tailoring — it produced duplicate basename-only paths, extension fragments (`.js`/`.ts`), and paths the "Known drift" section explicitly documents as *not* existing yet (`docs/RISK_REGISTER.md`, `.aislop/rules.yaml`, etc.); those were removed rather than left to fail forever, and the workflow-file paths were corrected to their real `.github/workflows/` location. Still report-only in CI, and still not wired into the pre-commit/pre-push hooks (see `hk.pkl`) — that would make doc drift block a push, which is a separate decision from just having the report be accurate.

## Conventions

Follow what's actually in `src/` — this repo does **not** use the arrow-function-only / one-function-per-file conventions from other Pantheon/thoroc projects:

- Plain `function`/`async function` declarations, multiple exports per file (see `src/lib/personalities.ts`).
- Relative imports include the `.js` extension (e.g. `from "./types.js"`) even though the source is `.ts` — required by `moduleResolution: "bundler"` in `tsconfig.json`.
- Zod schemas use `.strict()` on every object schema; derive types with `z.infer<typeof Schema>` rather than hand-writing interfaces.
- Formatting is enforced by Biome, not by convention: tabs, double quotes, trailing commas (`biome.json`). Run `biome check --write src/` rather than hand-formatting.
- Tests live next to the code they cover as `*.test.ts` (e.g. `src/lib/personalities.test.ts`), run via `bun test` / `mise run test`. `src/hooks/inject.ts`, `src/cli/switch.ts`, and `src/install.ts` execute their logic at module scope on import, so they're tested by spawning them as subprocesses (`Bun.spawn`) with `HOME`/`CLAUDE_PLUGIN_DATA_DIR` pointed at a temp directory, rather than importing them directly. `src/lib/personalities.ts` is tested by importing it directly after setting those same env vars, using a cache-busting query string on the import so each test gets a fresh module instance with `PERSONALITIES_DIR`/`STATE_FILE` recomputed. Not wired into `hk.pkl` or CI yet — that's a separate decision from having the suite exist.

## Before finishing a session

If you touched `src/`, config, or CI: update `README.md` if user-facing behaviour or setup steps changed, and re-run `mise run generate:schema` if `src/lib/types.ts` changed. Never commit directly to `main` — branch, PR, and follow this repo's normal review flow.
