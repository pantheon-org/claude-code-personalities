# QMD — Search Index Instructions

QMD is the local search engine over this project's markdown documents. Always prefer the MCP tools (`query`, `get`, `multi_get`, `status`) over CLI commands when inside Claude Code.

QMD covers conceptual/keyword search ("find entries about X").

## Index maintenance

The index is maintained automatically by the git post-commit hook (defined in `hk.pkl`), which runs two steps:

| Step               | Trigger                          | Action                                                                                  |
| ------------------ | -------------------------------- | --------------------------------------------------------------------------------------- |
| `qmd-update`       | every commit                     | `qmd update` — refresh the BM25 keyword index for all collections (incremental)         |
| `qmd-embed-thoroc` | commit touches `.agents/**/*.md` | `qmd embed -c thoroc` — refresh `vec`/`hyde` embeddings for changed instructions/skills |

So a normal commit touching `.agents/**/*.md` leaves both keyword and semantic search current with no manual step. If the index appears stale (search misses a file you know exists), run manually:

```bash
qmd update         # reindex all collections (incremental)
qmd status         # check doc counts, last_updated, and needsEmbedding count
```

Only `thoroc` is embedded on commit. Other collections, or a batch imported outside a commit, still need a manual embed. Vector search (`vec`/`hyde`) requires embeddings to be up to date; if
`qmd status` shows a non-zero `needsEmbedding` count, run:

```bash
qmd embed                        # embed new/changed docs only (all collections)
qmd embed -c thoroc              # embed only the thoroc collection
qmd embed -f                     # force re-embed everything
qmd embed --chunk-strategy auto  # AST-aware chunking (better for code files)
```

**Rule**: after creating or importing a batch of new entries outside the commit flow, always run `qmd update && qmd embed`.

## Staleness detection

If a search returns no results for something you know exists, check the index date:

```bash
qmd status   # look at lastUpdated per collection
```

If the date predates the file, the index is stale — run `qmd update`.

## Search query strategy

All searches go through the `query` MCP tool. Always provide `intent` to improve snippet quality.

| Query type | When to use                                                                          |
| ---------- | ------------------------------------------------------------------------------------ |
| `lex`      | You know the exact term, ticket number, or phrase                                    |
| `vec`      | Conceptual/semantic search — meaning over keywords                                   |
| `hyde`     | Write a 50–100 word passage that looks like the answer; strongest for nuanced topics |

Combine types for best recall — the first sub-query gets 2× weight:

```json
[
  { "type": "lex", "query": "CC-1151 teams webhook migration" },
  { "type": "vec", "query": "MS Teams connector deprecation migration status" }
]
```

Use `minScore: 0.5` to filter low-confidence noise.

## Document retrieval

- **Single doc**: `get(file)` — accepts path or `#docid` from search results; supports `file.md:100` line offset
- **Batch**: `multi_get(pattern)` — accepts glob (`2026/05/*.md`) or comma-separated paths/docids
  - Use `--max-bytes 20480` (20 KB) to skip large files in batch retrieval
  - Use `--json` flag for structured output in agentic pipelines

## Collections

| Name      | Path       | Pattern            |
| --------- | ---------- | ------------------ |
| `thoroc`  | this repo  | `.agents/**/*.md`  |

Scope searches to a collection when the target is known:

```json
{ "collections": ["thoroc"], "searches": [...] }
```

## Cleanup

Remove orphaned cache entries periodically:

```bash
qmd cleanup
```
