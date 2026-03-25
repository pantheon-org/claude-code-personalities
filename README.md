# claude-code-personalities

A Claude Code plugin that injects a character personality into every conversation via a `UserPromptSubmit` hook. Switch personalities at any time with `/personality`.

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

The active personality persists across sessions. The next message you send after switching will be in the new personality.

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

```bash
bun install          # install deps
bun run build        # compile TypeScript → dist/ via Vite
bun run typecheck    # type-check without emitting
bun run lint         # biome check
bun run lint:fix     # biome check --write (auto-fix)
node install.mjs     # redeploy after a build
```

Source lives in `src/`, compiled output goes to `dist/` (gitignored).

Pre-commit hooks (via lefthook) run `typecheck`, `lint --write`, and `build` automatically.
