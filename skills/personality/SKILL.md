---
name: personality
description: Switch the active Claude personality, or list available ones. Trigger when the user invokes /pantheon-ai:personality or /personality.
---

# Personality Switcher

Switch the active Claude personality, or list available ones.

## Instructions

The user has invoked `/personality` with arguments: `$ARGUMENTS`

Run the following command and show the output to the user:

```bash
node "${CLAUDE_PLUGIN_ROOT}/dist/cli/switch.mjs" $ARGUMENTS
```

If a personality name was provided and the switch was successful, let the user know the new personality will take effect at the start of the next session.
