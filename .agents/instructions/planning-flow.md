# Planning flow: no implementation without reviewed supporting documents

Before implementing any non-trivial change, produce supporting documents and take them through a review gate. Never
start coding from a prompt alone -- no "vibe coding". Implementation is the **last** step, not the first.

## When the flow applies (trigger)

Run the flow when **any** of these observable signals hold, regardless of the change's apparent size:

- It crosses a module or package boundary, or touches more than a couple of files that are not all the same kind of edit.
- It changes a public interface, a shared contract, or an infrastructure resource.
- It changes a dependency, a version pin, or anything in the supply chain (for example a toolchain version).
- It touches a **regulated domain**: participant data, draws, prize claims, marketing, or responsible-play content.
- It is large enough to warrant its own branch and MR for reasons other than convenience.

Skip the flow for genuinely trivial or mechanical edits (a typo, a one-line fix, a rename) and for review-comment fixes
that do not themselves introduce a design decision. Do **not** self-classify a change down to dodge the flow: when in
doubt, run the light version. A change that starts mechanical and grows past a signal above must re-enter the flow at
that point.

## The flow (in order)

Each step maps to an existing skill -- use it rather than re-inventing the step.

1. **Findings.** Investigate first; establish what is true before proposing what to do. Use the `context-file` skill for
   a plain finding or analysis. When the step is really "should we do this, or approach A vs B", use `design-debate`,
   which grounds independent opposing subagents in real repo facts and persists a verdict finding. If `design-debate`
   returns do-not-proceed it writes a `KNOWN_ISSUE` and the flow **stops** here.
2. **Draft plan.** Use `plan-create` to scaffold a `.context/plans/` file at `status: DRAFT` with valid frontmatter
   (including `effort`, `value`, `themes`). Ground it in the findings, with explicit open questions.
3. **Review, synthesis, and decision (steps 3-5).** Use `plan-review`. It dispatches three independent subagent lenses
   (Technical, Strategic, Risk), consolidates them into one report (the synthesis), and then resolves the open decisions
   with the user as a **one-question-at-a-time interview** ending in a confirmed recap. `plan-review` therefore already
   covers the subagent review, the main-agent synthesis, and the user interview -- do **not** run `guided-interview`
   separately afterwards or the user is interviewed twice.
   - `plan-review` first asks which models to assign to each reviewer; that interaction is expected.
   - If you deliberately bypass `plan-review` (for example spawning read-only reviewers directly per this document), you
     are no longer using it, so you must also do the synthesis and the one-question-at-a-time interview yourself, and you
     lose its decision-capture and ADR hand-off. Treat that as a real fork, not a toggle.
4. **Implementation.** Only now write code. Follow the usual discipline (TDD, verify, feature branch, MR). This repo is
   **GitLab**: author the MR via the GitLab MR path, not `pr-author` (which is GitHub-only). Capture any resulting
   architectural decision as an ADR via `adr-capture` (see ADR-worthiness below).

## Rules

- **NEVER** begin implementing before findings **and** a reviewed draft plan exist. If asked to build something, produce
  the documents first and stop at the review-and-decision gate.
- The plan stays `status: DRAFT` until the user approves it; promote to `ACTIVE` on approval.
- Subagent reviews are strictly read-only (no edits) and should use diverse, adversarial lenses -- redundant reviewers
  add little.
- The main agent must add value at the synthesis step: reconcile and decide, do not just forward subagent output.
- The user-review gate is an interview: **one question at a time**, never a batched multi-question prompt.
- **Committed record, not scratch.** `.context/` is gitignored working scratch, not an audit trail. A governed change's
  durable record is the committed ADR (`docs/adr/`) and the MR description. Do not treat gitignored files as evidence.
  This covers decisions; for a worked example meant to ground a skill's or instruction's own rule rather than record a
  decision, see [Case Study vs. Finding vs. ADR](references/case-study-vs-finding.md).
- **Scrub before fan-out.** Findings and plans can quote logs, config, or sample data. Before dispatching them to
  reviewer subagents or models, scrub secrets and PII; never route regulated content (participant data, IBANs, BSNs,
  tokens) to arbitrary models.
- **Decision-support for individuals.** A plan affecting decisions about individuals (eligibility, prize disputes, fraud
  flags, profiling) is decision-support and routes to the accountable function (Legal, Compliance, DPO, Risk). In-chat
  approval is not that sign-off.

## ADR-worthiness

Not every decision needs an ADR. Write an ADR when the decision is **consequential, hard to reverse, and
architecture-level** (a data store, an integration boundary, a cross-cutting pattern, a security posture). Do **not**
spend an ADR on toolchain, config, or version pins -- capture those declaratively in the config that enforces them (a CI
variable, a lockfile, a `.tool-versions`), where the mechanism is its own documentation. When unsure, a short
`.context/` analysis note is the proportionate weight, not an ADR.
