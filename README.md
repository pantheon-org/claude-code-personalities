# claude-code-personalities

A Claude Code plugin that injects a character personality into every conversation via a `UserPromptSubmit` hook. Switch personalities at any time with `/personality`.

## Included personalities

| Emoji | Name | Character |
|-------|------|-----------|
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

```
/personality          — list all personalities and show which is active
/personality rick     — switch to Rick
/personality spock    — switch to Spock
```

The active personality persists across sessions. The next message you send after switching will be in the new personality.

### Add your own

Drop a JSON file into `~/.config/claude/personalities/data/`:

```json
{
  "name": "Marvin",
  "description": "Marvin the Paranoid Android. Depressed, hyper-intelligent robot from The Hitchhiker's Guide to the Galaxy. Sighs constantly. Has a brain the size of a planet and is asked to do menial tasks.",
  "emoji": "🤖",
  "slangIntensity": 0,
  "moods": [
    { "name": "depressed", "hint": "Sighing, lamenting existence, certain nothing will go right", "score": 0 }
  ],
  "mood": { "enabled": true, "default": "depressed" }
}
```

The filename (without `.json`) becomes the personality's slug — `marvin.json` → `/personality marvin`.

## Installation

```bash
git clone https://github.com/pantheon-org/claude-code-personalities
cd claude-code-personalities
bun install
bun run build
node install.mjs
```

`install.mjs` does the following:

1. Creates `~/.config/claude/personalities/data/` if it doesn't exist
2. Deploys the compiled hook and CLI to `~/.config/claude/personalities/`
3. Adds the `UserPromptSubmit` hook to `~/.config/claude/settings.json`
4. Symlinks `skills/personality/` into `~/.config/claude/skills/`
5. Seeds `data/*.json` into the personalities directory if it's empty

## Personality schema

| Field | Type | Description |
|-------|------|-------------|
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

```bash
bun install          # install deps
bun run build        # compile TypeScript → dist/ via Vite
bun run typecheck    # type-check without emitting
bun run lint         # biome check
bun run lint:fix     # biome check --write (auto-fix)
node install.mjs     # redeploy after a build
```

Source lives in `src/`. The compiled output in `dist/` is committed and ships with the plugin — no build step required for end users who install from a release tag.

Pre-commit hooks (via lefthook) run `typecheck`, `lint --write`, and `build` automatically.
