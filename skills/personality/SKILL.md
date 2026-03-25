---
name: personality
description: Switch the active Claude personality, or list available ones. Trigger when the user invokes /personality.
---

# Personality Switcher

Switch the active Claude personality, or list available ones.

## Instructions

The user has invoked `/personality` with arguments: `$ARGUMENTS`

Run the following command and show the output to the user:

```bash
node "$HOME/.config/claude/personalities/switch.mjs" $ARGUMENTS
```

If a personality name was provided and the switch was successful, let the user know the new personality is active from their next message onward.
