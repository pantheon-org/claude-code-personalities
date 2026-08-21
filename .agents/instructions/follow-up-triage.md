# Follow-up triage: file, investigate, decide, close

The sequence that turns a `.context/follow-ups/*.md` note (`context-file` skill) into either a durable row on
`docs/RISK_REGISTER.md` (`risk-register` skill), a row on `docs/TECH_DEBT.md` (`tech-debt` skill), both, or nothing --
and closes the follow-up either way. Without this written down, a follow-up tends to sit `ACTIVE` indefinitely, or get
independently re-filed on the register/tech-debt list without anyone closing the original note, leaving the same item
tracked twice.

## When this applies

- A `.context/follow-ups/*.md` file's outstanding work needs to be actioned or triaged, not just filed.
- Someone asks "what's the next active follow-up" or "clear the follow-up backlog."
- A follow-up has sat `ACTIVE` long enough that it's worth checking whether its topic already made it onto the
  register or tech-debt list by another route (a review comment, a different session) without the follow-up itself
  being closed.

Filing a follow-up in the first place is still the `context-file` skill's job (file it the same turn it's noticed --
see that skill's anti-patterns). This instruction picks up once a follow-up exists and needs to be resolved.

## The flow (in order)

1. **Investigate.** Read the follow-up's `Context` and `Outstanding Work`. Confirm what's actually still open --
   don't assume the file is current. Check whether the topic already has a row on `docs/RISK_REGISTER.md` or
   `docs/TECH_DEBT.md` before assuming none exists; a follow-up and a register/tech-debt row are often filed in the
   same session by different steps and can drift out of sync with each other. See
   [Case Study: Follow-ups Filed the Same Day as Their Register Row](references/follow-up-triage-case-study.md) for
   the concrete instance this step exists to catch.
2. **Decide.** For each genuinely open item, apply the existing boundary tests -- don't re-derive them:
   - Carries a real cost or failure mode if left unaddressed, is an interim shortcut, an accepted risk, or an open
     decision blocking further work? -> `docs/RISK_REGISTER.md` (`risk-register` skill's Rule 3 due-diligence step).
   - Pure code-level cleanup with no real cost or risk? -> `docs/TECH_DEBT.md` (`tech-debt` skill's Rule 3
     due-diligence step).
   - Already resolved, or genuinely not worth tracking further (a PoC-phase judgment call, proportionate to the
     item)? -> no promotion; close as resolved instead.
   - A single follow-up can split across more than one destination -- different facets of the same investigation can
     land as several tech-debt rows and a separate risk-register row (see the case study). Don't force one follow-up
     into exactly one bucket if its outstanding work genuinely doesn't fit that way.
3. **Promote.** File the row(s) using that skill's own Workflow -- its due-diligence check, its template, its
   validation script. Never skip a skill's own Rule 3 to save a step.
4. **Close the follow-up.** Regardless of which branch above was taken:
   - Set `status: DONE` (never delete the file -- it's the investigative record the register/tech-debt row's short
     `Description` doesn't have room for).
   - Add the promoted doc(s) to `related:` (e.g. `../../docs/RISK_REGISTER.md`).
   - Update the `Action` section with one self-contained sentence: what happened, dated, and which row(s) it maps to.
     If promoted, state explicitly that the follow-up is **superseded**, not resolved -- the underlying work is still
     open and now lives at that row, not in the follow-up.
5. **Regenerate the index.** Run the `context-index` skill so `.context/index.yaml` reflects the new `status`.

## Rules

- **A closed follow-up is not evidence the underlying work is done.** Closing it only stops double-tracking the same
  item in two places. If the follow-up was promoted, the register/tech-debt row's own `Status` is the only thing that
  tells you whether the work shipped -- do not read a follow-up's `DONE` as "resolved."
- **Never promote to both docs "just in case."** Apply the boundary test per item, per facet. An item that isn't a
  real risk doesn't become one by filing it in both places for safety.
- **Never skip step 1's existing-row check.** Filing a duplicate row wastes the promotion step and leaves two records
  of the same thing with independent lifecycles that can drift (one marked `Resolved`, the other still `Open`).
- **A follow-up closed without promotion still needs a reason in `Action`.** "Not worth tracking further" is a valid
  outcome for a PoC-phase project, but it must be stated, not left implicit by the file simply going `DONE`.

## Anti-Patterns

**NEVER** flip a follow-up to `DONE` without recording where its outstanding work went.
**WHY:** A bare status flip with no `Action` update is indistinguishable from a follow-up that was silently dropped --
the next reader can't tell "superseded by register row 4" from "someone forgot about this."
**BAD:** Editing only the frontmatter `status:` field and leaving the `Action` section's original instructions in place.
**GOOD:** Update `Action` with the date, the outcome, and the specific row `#` or doc it was promoted to (or the
reason it needed no promotion).

**NEVER** treat "it's already on the register" as a reason to skip the boundary test on a new follow-up.
**WHY:** The existing-row check (step 1) is about not duplicating an item that's already tracked; it doesn't replace
deciding whether a *different*, newly-surfaced follow-up belongs on the register, the tech-debt list, or neither.
**BAD:** Assuming every follow-up must map to a register row because the last batch did.
**GOOD:** Run the decide step (step 2) independently for each follow-up, even when several in a row turn out the
same way.

## References

| Topic | Reference | When to Use |
| --- | --- | --- |
| Register-vs-tech-debt boundary test, in full | `risk-register` skill's `relationship-to-sibling-conventions.md` | Step 2's decision, when the call isn't obvious |
| Tech-debt-vs-register boundary test, in full | `tech-debt` skill's Rule 3 and Workflow | Step 2's decision, when the item might be cleanup rather than risk |
| A real instance of step 1 catching pre-existing duplicate rows | [Case Study: Follow-ups Filed the Same Day as Their Register Row](references/follow-up-triage-case-study.md) | Before assuming a follow-up's topic isn't already tracked elsewhere |
