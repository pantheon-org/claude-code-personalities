# Theme Vocabulary and Tagging Rules

> **Proposed vocabulary.** The six themes below were adapted for thoroc-signal from the source skill set's vocabulary.
> Treat them as the working set; ratify or amend via an ADR once the `.context/` corpus is large enough to test them.

The `themes` frontmatter field records **what area of the system** a `.context/` action-candidate is about. It is the
subject axis, orthogonal to the magnitude axes (`value`, `effort`, `severity`): those say how big or urgent an item is,
`themes` says what it touches.

`themes` applies to the three action-candidate types: `PLAN`, `FINDING`, and `KNOWN_ISSUE`. It does not apply to
`ANALYSIS`, `INSTRUCTION`, or `AUDIT`, which are reference material rather than things to do next.

## Shape

`themes` is a **multi-valued, ordered list** — an entry can genuinely belong to several areas, so it is not a single
enum. Every member is drawn from the controlled vocabulary below; free-form text is not permitted, so the axis stays
queryable.

```yaml
themes:
  - COLLECTION
  - INFRA
```

The list is **ordered, and the first entry (`themes[0]`) is the primary theme.** The primary answers "what is this
mainly about?" and is the only member that participates in the read-protocol tie-break (see below). The remaining
members are for filtering and cluster views, never for ordering. Authors write the list primary-first.

## Controlled vocabulary

Six themes, kept deliberately coarse. A too-fine vocabulary is as useless as none. They map to the system's phases
(ADR-006) plus its cross-cutting concerns.

| Theme        | Covers                                                                                                                                                   |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `COLLECTION` | Evidence gathering: the JIRA, Confluence, and GitLab collectors, SSM PAT retrieval, business-day date-range windowing, and raw payload storage in S3 (Phase 2). |
| `DIGEST`     | Analysis and rendering: Bedrock prompt construction, model invocation, and the generated digest output (Phase 3, ADR-002).                               |
| `DELIVERY`   | Getting digests out: SES email, DynamoDB delivery-status records, EventBridge schedules, and retry logic (Phase 4).                                      |
| `INFRA`      | Terraform and AWS plumbing: the numbered layers (`100ci`/`100foundation`/`200compute`), KMS, IAM and GitLab OIDC, the state backend, and the CI/CD deploy pipeline. |
| `GOVERNANCE` | The `.context/` system and project docs: the index, frontmatter contract, ADR capture, ROADMAP, and cross-reference integrity.                           |
| `TOOLING`    | Developer workflow and tooling: the mise toolchain, lefthook hooks, vendored Claude Code skills, the local runner, and lint/format config.               |

## Split-on-evidence rule

The vocabulary ships coarse and is refined only on observed need, not speculatively. If, after backfill, a single theme
carries a disproportionate share of entries (rough guide: more than ~30% of active/draft action-candidates, with
`INFRA` or `GOVERNANCE` the likely first candidates), split it into finer themes. Any split is recorded as an amendment
to the ADR that ratifies this vocabulary, not an ad-hoc edit. This mirrors how the `value` signal deferred a numeric
scale until within-bucket ties proved to block the sort: ship the simple thing, refine on evidence.

## Choosing the primary theme — worked examples

The primary is the area the item most changes, not merely one it touches.

- **A plan to add a Bitbucket collector → `[COLLECTION]`.** It extends the evidence-gathering layer; single theme.
- **A finding about the deploy pipeline failing to assume its OIDC role → `[INFRA]`.** It is about the Terraform/CI
  plumbing, so infra leads. No second theme needed.
- **A plan to wire the Bedrock digest prompt → `[DIGEST]`.** Purely about the analysis phase.
- **A plan to change the `.context/` frontmatter contract or the ADR index → `[GOVERNANCE]`.** It changes the
  governance system itself.
- **A plan to add a new lefthook check that also lints the collectors → `[TOOLING, COLLECTION]`.** Primarily a
  workflow/tooling change (`TOOLING`), but it touches collection code, so `COLLECTION` is a genuine secondary — the
  primary is still the tooling mechanism.

## Read protocol interaction

`themes[0]` is the final tie-breaker in the "what's next" sort, below `value` then `effort`:

1. Filter to `DRAFT`/`ACTIVE` `PLAN`/`FINDING`/`KNOWN_ISSUE`.
2. Sort by `value` descending (`HIGH` > `MEDIUM` > `LOW`).
3. Then `effort` ascending (`S` < `M` < `L` < `TBD`) where present.
4. Then, only to break a remaining tie, prefer the item whose `themes[0]` matches the area already in focus. Theme
   expresses preference-of-area, not priority, which is why it sits below both magnitude axes.

`themes` is also a filter/slice dimension in its own right: "show me all `COLLECTION` work" or "which theme carries the
most open debt" are queries the index answers by reading the field directly, independent of the sort. See
[`value-rubric.md`](value-rubric.md) for the full read protocol.
