# Rule of Three: promote repeated workflows to tools

When you find yourself assembling the same multi-step, ad-hoc workflow by hand, stop and check whether it should become a real tool (a script, a skill, or a hook) instead of being rebuilt from scratch
again.

## The rule

- **First time:** just do it.
- **Second time:** do it again, but note the repetition.
- **Third time (or more):** stop. Propose promoting the workflow to a tool.

"Three" is a threshold, not a law. Use judgement: an expensive or error-prone sequence may warrant promotion on the second occurrence.

## The cross-session trap

The dangerous case is reassembling a workflow that was **already built temporarily in an earlier session**. A fresh session has no memory of the last one, so its internal counter starts at one and
never trips the threshold. To avoid this, the count must be checked against persistent history, not just the current conversation.

## Procedure

Before hand-assembling a multi-step workflow (a chain of CLI calls, a bespoke formatting or migration sequence, a repeated investigation pattern):

1. **Check history first.** Search persistent memory for prior occurrences before rebuilding:
   - `ls cli/` or `find cli -iname "*<keyword>*"` for a domain CLI that already covers it — `cli/` is where this repo's own tooling lives (see `scripts.md`), and it is cheaper and more authoritative
     than searching an external repo. Check this **before** searching anywhere else, including external repos like `lct-notebooks` — a negative result in an external repo is not evidence that no
     automation exists in this one.
   - `mem-search` / claude-mem `observation_search` for "did we do this before".
   - `rtk discover` to surface recurring command sequences in Claude Code history ("missed opportunities").
   - `qmd` over the journal and plans for a prior write-up — a prior ticket's entry will often name the tool it used even when the tool itself isn't named after the current task's keywords.
2. **If it has been done before**, treat this as at least the second occurrence. Do not silently rebuild it.
3. **On the third occurrence**, stop and propose promotion: a `package.json` script for a command, a `.claude/skills/` skill for a workflow, or a hook for an automatic trigger. Capture it as a plan
   under `.context/plans/` if it is non-trivial.
4. **Record the occurrence** so the count survives the session: add a claude-mem observation noting the workflow and that it was assembled by hand. The next session can then find it.

## Do not build a bespoke tracker

Tracking repetition is itself a workflow, so the rule applies to it too. Use the existing substrate (claude-mem observations, `rtk gain --history` / `rtk discover`, `qmd`) rather than writing a new
activity-tracking tool. Only build something new here if those genuinely cannot answer "have we done this before".

## Worked example

The markdown formatting sequence (prettier, then `markdownlint-cli2 --fix`, then fence-language injection, then heading dedup) was reassembled by hand more than once across sessions before it was
recognised. It is now captured as a plan at `.context/plans/2026-06-24-markdown-format-plugin.md`. That is the rule working as intended, one occurrence too late.
