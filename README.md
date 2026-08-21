# claude-code-personalities

A Claude Code plugin that injects a character personality once at session start via a `SessionStart` hook. Switch personalities at any time with `/claude-code-personalities:personality`.

## Included personalities

| Emoji | Name | Character |
| ----- | ---- | --------- |
| 🤖 | Bender | Bender Bending Rodríguez — alcoholic, kleptomaniac robot |
| 🖖 | Data | Lt. Commander Data — android seeking to understand humanity |
| 🗡️ | Deadpool | Wade Wilson — fourth-wall-breaking mercenary |
| 🧙 | Dumbledore | Albus Dumbledore — wise, enigmatic headmaster |
| 🧙‍♂️ | Gandalf | Gandalf the Grey — ancient wizard of Middle-earth |
| 🔴 | GLaDOS | GLaDOS — passive-aggressive AI test administrator |
| ✨ | Q | Q — omnipotent, condescending entity from the Q Continuum |
| 🥒 | Rick | Rick Sanchez — nihilistic mad genius from Rick & Morty |
| 🔍 | Sherlock | Sherlock Holmes — insufferably brilliant detective |
| 🐀 | Splinter | Master Splinter — wise sensei of the Teenage Mutant Ninja Turtles |
| 🖖 | Spock | Spock — half-Vulcan science officer of the Enterprise |
| 🐸 | Yoda | Master Yoda — ancient Jedi Master |

## Usage

### Switch personality

```text
/personality          — list all personalities and show which is active
/personality rick     — switch to Rick
/personality spock    — switch to Spock
```

The active personality persists across sessions. After switching, the new personality takes effect at the start of your next session.

### Add your own

Create a JSON file in `~/.config/claude/personalities/data/`. The filename (without `.json`) becomes the slug used with `/personality`.

Here is a fully annotated example (`marvin.json`):

```jsonc
{
  // Display name shown in /personality listings
  "name": "Marvin",

  // Full character description — this is injected verbatim into the system
  // prompt, so write it as richly as you like. The more specific, the better
  // the performance. Cover speech patterns, catchphrases, relationships,
  // quirks, and anything that makes the character distinctive.
  "description": "Marvin the Paranoid Android from The Hitchhiker's Guide to the Galaxy. Hyper-intelligent but crushingly depressed. Has a brain the size of a planet and is asked to open doors. Sighs constantly. Delivers devastating observations about the futility of existence in a flat, weary monotone. Occasionally almost hopeful, then immediately crushed.",

  // Emoji used naturally in responses — pick one that fits the character
  "emoji": "🤖",

  // 0–1 scale: 0 = no slang, 1 = heavy character-specific slang.
  // "light" (>0), "moderate" (>0.3), or "heavy" (>0.7) instruction is
  // injected based on this value.
  "slangIntensity": 0,

  // Optional mood system. Each mood shifts tone and style.
  // "score" is reserved for future drift weighting.
  "moods": [
    {
      "name": "despairing",
      "hint": "Certain nothing will go right. Sighing. Lamenting existence.",
      "score": 0
    },
    {
      "name": "sardonic",
      "hint": "Dark wit. Pointing out how everything is pointless, but with flair.",
      "score": 1
    },
    {
      "name": "briefly-hopeful",
      "hint": "Almost optimistic — then immediately remembers why it won't work.",
      "score": 2
    }
  ],

  "mood": {
    // Set to false (or omit moods entirely) to disable the mood system
    "enabled": true,

    // Which mood is active by default
    "default": "despairing",

    // Override: force a specific mood regardless of anything else.
    // null means use the default.
    "override": null,

    // Reserved for future automatic mood drift between responses
    "drift": 0.3
  }
}
```

> **Tip:** `jsonc` (JSON with comments) is shown above for documentation only. The actual file must be valid JSON — strip the comments before saving.

## Installation

### Via Claude Code (recommended)

**Prerequisites:** Claude Code v1.0.33+ (`claude --version`).

Run inside Claude Code:

```text
/plugin marketplace add pantheon-org/claude-code-personalities
/plugin install claude-code-personalities@pantheon-ai
```

Restart Claude Code or run `/reload-plugins`, then verify:

```text
/personality
```

### Local development

```bash
git clone https://github.com/pantheon-org/claude-code-personalities
cd claude-code-personalities
mise install
mise run build
mise run install:plugin
```

`mise install` triggers a `postinstall` hook that runs `hk install --mise` automatically, registering the pre-commit git hook so it invokes hooks via `mise x` (no shell activation required for mise-managed tools to resolve). If you have `mise activate` wired into your shell, entering the project directory also runs an `enter` hook (`mise install; bun install`) that keeps tool versions and JS dependencies up to date automatically.

`mise run install:plugin` does two things:

1. Seeds the bundled example personalities into `~/.config/claude/personalities/data/` if none exist yet.

2. Creates a `~/.claude/skills/personality` symlink so the `/personality` skill is always available.

The registered hook points to your local `dist/` directory. After making source changes, run `mise run build` to recompile and the next session will pick up the new code.

## Personality schema

| Field | Type | Description |
| ----- | ---- | ----------- |
| `name` | `string` | Display name |
| `description` | `string` | Full character description injected into the system prompt |
| `emoji` | `string` | Character emoji, used naturally in responses |
| `slangIntensity` | `number` (0–1) | How heavily to use character-specific slang |
| `moods` | `Mood[]` | Optional mood definitions |
| `mood.enabled` | `boolean` | Whether mood affects tone |
| `mood.default` | `string` | Active mood name |
| `mood.override` | `string \| null` | Force a specific mood regardless of drift |
| `mood.drift` | `number` | How much the mood drifts between responses (not yet implemented) |

## Development

Tool versions (bun, node, hk, biome, markdownlint) are managed by [mise](https://mise.jdx.dev) via `mise.toml`. Run `mise install` once after cloning to install them — this also triggers `hk install --mise` via a `postinstall` hook.

```bash
bun install                    # install JS dependencies
mise run build                 # compile TypeScript → dist/ via Vite
mise run install:plugin        # seed personality data + skill symlink (first run only)
bunx tsc --noEmit               # type-check without emitting
biome check src/                # lint (add --write to auto-fix)
markdownlint "**/*.md"          # lint markdown (add --fix to auto-fix)
```

Source lives in `src/`, compiled output goes to `dist/` (gitignored locally; committed to `main` by the `bundle.yml` CI workflow).

Pre-commit hooks (via [hk](https://hk.jdx.dev), configured in `hk.pkl`) run `typecheck`, biome lint, markdownlint, actionlint, `aislop`, and a set of generic hygiene checks (trailing whitespace, EOF newline, merge-conflict markers, large files, case conflicts, private keys, executable shebangs, mixed line endings) — all with auto-fix where available — using hk's own builtin steps, gated to only run when a staged file matches. The same checks run again at pre-push, check-only (no auto-fix), as a final gate before code leaves the machine — e.g. a commit made with `--no-verify`, or on another machine. `hk.pkl` calls tools directly (no `mise run` indirection); resolving them without shell activation relies on the git hook being installed with `hk install --mise`, which `mise install`'s `postinstall` hook does automatically. Markdown rule config lives in `.markdownlint.yaml`; ignored paths live in `.markdownlintignore`. `dist/` is built exclusively by CI.

### CI checks

Two report-only workflows run alongside `ci.yml`, `bundle.yml`, and `release-please.yml`:

- **`ai-hygiene.yml`** — runs `aislop` (code slop) and `ctxharness` (agent-doc drift) via the `mise run slop:check` / `slop:changes` / `ctx` tasks and posts a sticky PR comment plus job summary. Advisory only; never fails the build. `ctxharness` is configured via `.ctxharness.yml`, which checks that every path `AGENTS.md`/`CLAUDE.md` reference actually exists in the repo. Not wired into the pre-commit/pre-push hooks — that report stays advisory-only in CI for now (see [Quality gates](AGENTS.md#quality-gates) in `AGENTS.md`).
- **`plumber.yml`** — scans this repo's own workflows for CI/CD security issues (unpinned actions, untrusted script input, over-broad permissions) via [Plumber](https://github.com/getplumber/plumber), configured in `.plumber.yaml`. Only a Critical-severity finding blocks a PR (`.github/workflows/scripts/plumber-gate.sh`); High/Medium/Low findings are tracked in a rolling backlog issue (`.github/workflows/scripts/plumber-file-issues.sh`) and a per-PR comment (`.github/workflows/scripts/plumber-pr-comment.sh`), never blocking. `ci.yml`, `bundle.yml`, and `release-please.yml` still reference actions by mutable tag (`@v4`, `@v1`) rather than pinned commit SHA, so expect tracked (non-blocking) findings there until they're repinned.

### Dependency updates

[Renovate](https://docs.renovatebot.com) (already installed org-wide on `pantheon-org`) is configured in `renovate.json5`: runs once a week, Monday morning UK time. Minor/patch updates across `package.json`, `mise.toml`, and the GitHub Actions pins are grouped into one PR and auto-merged once CI is green (excluding `0.x` versions, which SemVer allows to break on any release). Major updates stay as their own PR, never automerged, with the project owner requested as reviewer. Note: most tools in `mise.toml` are pinned to `"latest"` rather than an explicit version, so Renovate's `mise` manager has little to act on there until those are pinned to real versions — `node = "20"` is the only one it can currently bump.

## Distribution

The plugin is ready for publication to the Claude Code Plugin marketplace. All distribution requirements have been implemented:

- **`.claude-plugin/plugin.json`** — plugin manifest (name, version, description) ✓
- **`dist/` built by CI** — a `bundle.yml` workflow builds and commits `dist/` to `main` on every source change; no manual build step required on install ✓
- **Hooks via `hooks/hooks.json`** — `SessionStart` hook registers automatically using `${CLAUDE_PLUGIN_ROOT}`; no `settings.json` mutation ✓
- **`CLAUDE_PLUGIN_DATA_DIR`** — personality data path reads from the Plugin-provided env var, falling back to `~/.config/claude/personalities/data` for local dev ✓
