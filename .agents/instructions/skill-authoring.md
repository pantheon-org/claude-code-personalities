# Skill Authoring: Structured Markdown Artifacts

When a skill creates or updates a markdown artifact that has a **structured, machine-checkable shape** -- YAML
frontmatter fields (context-file, adr-capture), or a table with fixed columns (risk-register), or any other
sub-structure a schema can describe -- the skill MUST ship three things, not just prose instructions:

1. **A YAML template** (`assets/templates/*.yaml`) describing the shape with example values and inline comments
   explaining each field. This is the human-readable illustration -- what an agent or contributor copies from.
2. **A JSON schema** (`assets/schemas/*.schema.json`) formalizing the same shape as enforceable constraints (`type`,
   `enum`, `pattern`, `required`, `minLength`, ...). This is the machine-readable source of truth the template
   illustrates and the script enforces.
3. **A shell script** (`scripts/validate-*.sh`) that automates checking a real artifact instance against that schema.
   Read constraints (enum values, patterns, required fields) from the schema file itself at runtime (e.g. via `jq`)
   rather than hardcoding them a second time in the script -- otherwise the schema and the script drift out of sync
   silently, and the schema stops being the actual source of truth.

The skill's `SKILL.md` MUST reference all three explicitly: list the schema/template paths under **Prerequisites**,
list the validation script(s) under a **Scripts** section, and say in **Workflow** when to run validation (at minimum:
before committing, and ideally wired into a pre-commit hook so it's not optional).

## Why

A schema and template that exist but that no SKILL.md ever mentions are invisible to whoever (human or agent) is
actually about to create or edit the artifact -- they'll improvise a shape from memory instead. A validation script
that hardcodes the same rules the schema declares, rather than reading the schema, silently diverges from it the
first time someone updates one but not the other, and nobody notices until a malformed artifact ships anyway.

## State enforcement scope precisely, not just the rule

When a skill's artifact has an immutability or append-only rule (`risk-register` rows after commit, an accepted ADR
per `adr-capture`), state two things separately for each such rule, not just the rule itself:

- **What mechanism enforces it, and at what boundary.** A local pre-commit hook only stops a normal local git
  workflow -- it does not stop a commit made via the GitLab web UI/API, `git commit --no-verify`, or from a machine
  without the hook installed. Say so explicitly rather than letting "there's a hook for that" imply more coverage
  than it has.
- **Which parts of the rule are convention-only.** A guard that checks one property (e.g. "did this row survive?")
  does not mean every property implied by the rule's spirit is also checked (e.g. "and none of its other columns
  changed?"). If a rule is deliberately unenforced beyond a certain point, say that too, and say why an unenforced
  rule still matters (usually: a trustworthy history matters more than a tamper-proof one, and the honest gap is
  more useful than a false sense of completeness).

## When NOT to require this

- A markdown artifact with no structured sub-content (plain prose, e.g. a one-off `.context/analysis/*.md` body) --
  frontmatter conventions still apply generically via `context-file`'s existing schema, but the body itself doesn't
  need its own schema.
- A skill that only *reads* artifacts (e.g. `mr-review`) rather than creating/updating them.

## Existing examples

| Skill            | Template                                            | Schema                                              | Script(s)                                                                                     |
| ---------------- | ---------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `adr-capture`    | `assets/templates/adr-template.yaml`                | `assets/schemas/adr-frontmatter.schema.json`         | `scripts/validate-adr-frontmatter.sh`                                                           |
| `context-file`   | `assets/templates/context-file-template.yaml`       | `assets/schemas/context-frontmatter.schema.json`     | none yet -- gap, tracked in `docs/RISK_REGISTER.md`                                             |
| `risk-register`  | `assets/templates/risk-register-row-template.yaml`  | `assets/schemas/risk-register-row.schema.json`       | `scripts/validate-risk-register-append-only.sh` (history) + `validate-risk-register-schema.sh` (content) |
| `tech-debt`      | `assets/templates/tech-debt-row-template.yaml`      | `assets/schemas/tech-debt-row.schema.json`           | `scripts/validate-tech-debt-schema.sh` (content only -- no append-only companion; rows are deleted, not archived) |

A skill can need more than one script when the artifact has more than one independent invariant to check (as
`risk-register` does: row survival is a different question from row well-formedness). One template and one schema
per structured shape is still the norm -- split those too only if the artifact genuinely has more than one distinct
structured shape, not just to mirror an unrelated multi-script skill.

## Anti-Patterns

**NEVER** hand-duplicate a schema's `enum`/`pattern`/`required` values inside the validation script.
**WHY:** The schema and the script will drift the moment one is updated without the other.
**BAD:** `[[ "$type" =~ ^(Deferred|Shortcut)$ ]]` written literally in the script, next to a schema that also lists
`Accepted Risk` and `Open Decision`.
**GOOD:** `jq -r '.properties.type.enum | join("|")' "$SCHEMA"`, read at runtime.

**NEVER** ship a schema/template with no SKILL.md reference to it.
**WHY:** Nobody creating an artifact for the first time will discover it exists.
**GOOD:** Prerequisites and Scripts sections name the exact paths.
