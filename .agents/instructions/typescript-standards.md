# TypeScript/Bun Standards

Rules that apply to **all** TypeScript/Bun code in this project.

## Rule 1: Arrow Functions Only

Every function must be an arrow function assigned to a `const`.

```ts
// ❌
function parseArgs() { ... }
export default function main() { ... }

// ✅
export const parseArgs = (): Args => { ... }
export const main = async (): Promise<void> => { ... }
```

## Rule 2: One Function Per Module

Each `.ts` file contains exactly **one** function — exported or not. No exceptions.

Helper functions are not a loophole: if you need a helper, extract it to its own file and import it. Types and interfaces directly associated with the file's function (args, return type, deps) may be
co-located. Everything else must live in its own file:

- ❌ A second function of any kind — extract to its own file
- ❌ An exported constant — move to a dedicated `constants.ts`
- ❌ An exported class (use a function instead per Rule 1)

```ts
// ❌  — two functions in one file (even if one is not exported)
const helper = (x: string) => x.trim()
export const foo = () => helper("  bar  ")

// ❌  — two exported functions in one file
export const foo = () => { ... }
export const bar = () => { ... }

// ✅  — each function in its own file
// helper.ts
export const helper = (x: string) => x.trim()

// foo.ts
import { helper } from "./helper"
export interface FooArgs { id: string }
export type FooDeps = { write?: (s: string) => void }
export const foo = (args: FooArgs, deps: FooDeps = {}): void => { ... }

// bar.ts
export const bar = () => { ... }

// constants.ts  (if the constant must be shared)
export const JOB_QUERY = `fields @message | filter ...`;
```

## Rule 3: Barrel Modules Always

Every directory must have an `index.ts` that re-exports all sibling modules.

```ts
// cli/my-feature/index.ts
export * from "./types.ts";
export * from "./parse-args.ts";
export * from "./fetch-data.ts";
// ...every module in the directory
```

## Rule 4: Unit Test Coverage ≥90% + Test Collocation

- Tests live **beside** the source file: `foo.ts` → `foo.test.ts`
- No separate `__tests__/` folders
- Coverage threshold: 90% (enforced in `bunfig.toml`)

```sh
cli/my-feature/
├── parse-args.ts
├── parse-args.test.ts   ← collocated
├── pool.ts
├── pool.test.ts         ← collocated
└── index.ts             ← barrel
```

Run `bun test --coverage` from within the feature directory to verify.

## Rule 5: Group Modules by Domain

Files within a feature must be placed in domain subdirectories, not flat. Identify the domain first, then create the subdirectory.

```sh
// ❌  — flat layout
cli/my-feature/
├── auth-header.ts
├── fetch-data.ts
├── format-table.ts
├── format-csv.ts
└── index.ts

// ✅  — domain-grouped
cli/my-feature/
├── api/
│   ├── auth-header.ts
│   ├── fetch-data.ts
│   └── index.ts       ← barrel for this domain
├── output/
│   ├── format-table.ts
│   ├── format-csv.ts
│   └── index.ts       ← barrel for this domain
├── types.ts           ← shared across domains, stays at root
└── index.ts           ← root barrel re-exports via subdirectory barrels
```

Shared types, config, and utilities used across multiple domains stay at the feature root.

## Rule 6: Use Cliffy for CLI Tooling

All CLI scripts must use the [cliffy](https://cliffy.io) library suite. Do not use `process.argv` parsing by hand or other CLI libraries.

| Need                     | Cliffy package                                         |
| ------------------------ | ------------------------------------------------------ |
| Argument parsing         | `@cliffy/command` — `Command`, `Type`, `ArgumentValue` |
| Coloured terminal output | `@cliffy/ansi/colors`                                  |
| Terminal tables          | `@cliffy/table`                                        |

### Short and long flags

Flags used frequently at the command line (output format, key filters, common overrides) **must** declare both a short (`-x`) and a long (`--xxx`) form — short flags reduce typing for daily use.

Flags that are infrequently typed, exploratory, or advanced (inverse/include filters, obscure tunables) should be **long-only**. Adding a short flag to everything dilutes the value of short flags for
the flags that matter, and burns single-character slots unnecessarily.

**Decision rule**: if you'd type this flag manually several times a day, give it a short form. If it's a one-off or a power-user option, long-only is correct.

```ts
// ❌ — common flag missing its short form
.option("--json", "Output as JSON")
.option("--output <path:string>", "Write to file")

// ✅ — common flags have both forms
.option("-o, --output <path:string>", "Write to file")

// ✅ — advanced/infrequent flags are long-only
.option("--include-project <pattern:string>", "Include only projects matching pattern")
.option("--include-stage <pattern:string>", "Include only failures at matching stage")
```

### Consistent naming within a flag group

When several flags control the same mechanism, all flags in the group must use the same noun. Mixed nouns in a group force the user to remember two names for one concept.

**Decision rule**: identify the shared concept first (e.g. "cache", "filter", "output"), then use that word in every flag that touches it.

```ts
// ❌ — "projects" and "cache" both refer to the same mechanism
.option("--save-projects",   "Save discovered project list to config")
.option("--refresh-projects","Re-fetch from views, then save")
.option("--skip-cache",      "Ignore cache for this run")
.option("--clear-cache",     "Remove cache and exit")

// ✅ — consistent noun "cache" across all four flags
.option("--save-cache",    "Save discovered project list to config")
.option("--refresh-cache", "Re-fetch from views, then save")
.option("--skip-cache",    "Ignore cache for this run")
.option("--clear-cache",   "Remove cache and exit")
```

Similarly, filter pairs must match:

```ts
// ❌ — asymmetric: "exclude-job" vs "include-pipeline"
.option("--exclude-job <pattern:string>",      "Exclude matching jobs")
.option("--include-pipeline <pattern:string>", "Include only matching pipelines")

// ✅ — symmetric nouns
.option("--exclude-project <pattern:string>", "Exclude matching projects")
.option("--include-project <pattern:string>", "Include only matching projects")
```

### Output format flags + file output

Output format flags (`--json`, `--csv`, `--markdown`) must be **long-only** — no short forms. Choosing an output format is a deliberate, infrequent decision; giving it a short flag burns
single-character slots and implies it is a common, daily-use option. Only `--output` (the path override) gets a short form because it is typed alongside the format flag and benefits from brevity.

Use boolean format flags for output format selection. No flag means table to stdout. Format flags always write to a file — `--output` overrides the default filename.

```ts
// ❌ — format flags have short forms (burns -j/-c/-m for an infrequent decision)
.option("-j, --json",     "Write output as JSON")
.option("-c, --csv",      "Write output as CSV")
.option("-m, --markdown", "Write output as Markdown")

// ✅ — format flags are long-only; --output keeps its short form
.option("--json",                      "Write output as JSON  (default: failed-orders-YYYY-MM-DD.json)")
.option("--csv",                       "Write output as CSV   (default: failed-orders-YYYY-MM-DD.csv)")
.option("--markdown",                  "Write output as Markdown (default: failed-orders-YYYY-MM-DD.md)")
.option("-o, --output <path:string>",  "Override output filename (requires --json/--csv/--markdown)")
```

`--output` without a format flag is an error. Default filenames include the current date in `YYYY-MM-DD` format and are written to `./output/` relative to the working directory. `--output` accepts any
path and is used as-is.

When no time-window flags are supplied, the default lookback must be **1h**, expressed as a named constant:

```ts
const DEFAULT_DURATION_MS = 60 * 60_000;
// fallback: end = now, start = now − 1h
```

Do **not** use a `--since <N:integer>` option — `--duration` (with `DurationType`) covers the same case more expressively.

The `now` date used to build the default filename must be an injectable parameter so tests can assert on a deterministic path:

```ts
export const parseArgs = async (argv: string[] = process.argv.slice(2), env: NodeJS.ProcessEnv = process.env, now: Date = new Date()): Promise<Args> => {
  const dateStr = now.toISOString().slice(0, 10);
  // ...
  outputPath = options.output ?? `output/my-feature-${dateStr}.json`;
};
```

### Entry point pattern — `import.meta.main`

Every `main.ts` that defines a CLI entry point must be directly runnable via `bun run main.ts` as well as importable as a module. Use Bun's `import.meta.main` guard to achieve both without a separate
`run.ts`.

`import.meta.main` is `true` only when Bun executes the file as the entry point; it is `false` when the file is imported by another module or by a test. This means the guard never fires during tests.

```ts
// ❌ — main.ts only exports; running it directly does nothing
export const bedrockCommand = new Command().name("bedrock")…;

// run.ts (separate file needed, confusing)
await bedrockCommand.parse(Bun.argv.slice(2));

// ✅ — main.ts is both importable and directly runnable
export const bedrockCommand = new Command().name("bedrock")…;

if (import.meta.main) {
    await bedrockCommand.parse(Bun.argv.slice(2));
}
```

For the function-style entry point:

```ts
export const main = async (argv = process.argv.slice(2)): Promise<void> => {
    await new Command()…parse(argv);
};

if (import.meta.main) {
    await main();
}
```

A `run.ts` that does nothing but call `main()` is redundant once this guard is in place and should not be created.

### Custom option types

Options that require parsing or validation beyond a primitive type must use a custom class extending `Type<T>` from `@cliffy/command` ([docs](https://cliffy.io/docs/command/types/custom-types)). One
class per file, following the same module rules as all other source files.

```ts
import { Type } from "@cliffy/command";
import type { ArgumentValue } from "@cliffy/command";

export class MyOptionType extends Type<string> {
  public parse({ label, name, value }: ArgumentValue): string {
    if (isValid(value)) return value;
    throw new Error(`${label} "${name}" must be …, but got "${value}".`);
  }
}
```

Register with `.type("name", new MyType())` before any option that uses it.

## Rule 7: Dependency Injection via Function Parameters

Every I/O boundary must be an injectable parameter with a production default. Do not call `process.argv`, `process.env`, `console.log`, or external service clients directly inside a function body —
pass them in so tests can substitute them without mocks or a DI framework.

When there are **3 or more injectable dependencies**, group them into a `Deps` interface rather than listing them as positional parameters. This lets callers override only what they need without
filling in every preceding default.

```ts
// ❌ — positional list becomes unwieldy beyond 2-3 deps
export const main = async (
    argv = process.argv.slice(2),
    env = process.env,
    write = console.log,
    runQuery: RunQueryFn = defaultRunQuery,
    poll: PollFn = defaultPoll,
    resolve: ResolveFn = defaultResolve,
): Promise<void> => { … };

// ✅ — argv/env stay positional (always present); deps grouped into an interface
type Deps = {
    write?: (s: string) => void;
    runQuery?: RunQueryFn;
    poll?: PollFn;
    resolve?: ResolveFn;
};

export const main = async (
    argv: string[] = process.argv.slice(2),
    env: NodeJS.ProcessEnv = process.env,
    deps: Deps = {},
): Promise<void> => {
    const {
        write = console.log,
        runQuery = defaultRunQuery,
        poll = defaultPoll,
        resolve = defaultResolve,
    } = deps;
    …
};
```

In tests, pass only what needs to differ:

```ts
// ✅ — no need to fill every positional slot
await main(["--duration", "5m"], {}, { poll: mockPoll });
```

Apply the same pattern to `parseArgs` and any function that reads `env` or `argv`.

## Rule 8: stderr for Diagnostics, stdout for Data

Status messages, progress indicators, and error output go to `console.error` (stderr). Only the final data payload goes to `write`/stdout.

This keeps stdout pipeable — `./main.ts --csv | xq` or `./main.ts --json > out.json` work without stripping noise.

```ts
// ❌ — progress mixed into stdout, breaks piping
write("Querying CloudWatch…");
write(csvData);

// ✅ — progress on stderr, data on stdout
console.error(colors.dim("Querying CloudWatch…"));
write(csvData);
```

## Rule 9: Use Luxon for All Date/Time Operations

All date and time handling must use [Luxon](https://moment.github.io/luxon/). Do not use `Date`, `Date.now()`, or manual ms arithmetic.

| Need                               | Luxon API                                       |
| ---------------------------------- | ----------------------------------------------- |
| Current instant                    | `DateTime.now()`                                |
| Parse ISO string                   | `DateTime.fromISO(s, { zone: "utc" })`          |
| Format for filename                | `dt.toFormat("yyyy-MM-dd")`                     |
| Serialize to ISO                   | `dt.toISO()`                                    |
| Convert to epoch seconds (AWS SDK) | `dt.toUnixInteger()`                            |
| Convert to ms                      | `dt.toMillis()`                                 |
| Add/subtract duration              | `dt.plus(dur)` / `dt.minus(dur)`                |
| Parse duration string              | `Duration.fromObject({ hours, minutes, days })` |
| Duration ISO                       | `dur.toISO()` — e.g. `"PT1H30M"`                |

### Custom Cliffy types return Luxon objects

```ts
// ❌ — returns raw number (ms)
export class DurationType extends Type<number> { … }

// ✅ — returns Duration
import type { Duration } from "luxon";
export class DurationType extends Type<Duration> { … }
```

### Injectable `now` parameter

Any function that derives a default time window from "now" must accept an injectable `now: DateTime` parameter so tests can assert on deterministic output:

```ts
export const parseArgs = async (argv: string[] = process.argv.slice(2), env: NodeJS.ProcessEnv = process.env, now: DateTime = DateTime.now()): Promise<Args> => {
  const dateStr = now.toFormat("yyyy-MM-dd");
  // default window: now − 1 h → now
  const DEFAULT_DURATION = Duration.fromObject({ hours: 1 });
  start = now.minus(DEFAULT_DURATION);
  end = now;
};
```

Do **not** set a cliffy `default:` on `--duration` — it makes `options.duration !== undefined` always true, breaking branches that check for explicit `--start`/`--end`. Use a named constant in
post-parse fallback logic instead.

### Conversion boundary (AWS SDK)

The AWS SDK requires JS `Date` / epoch integers. Convert at the call site only:

```ts
// ✅ — convert only when handing off to AWS
startTime: start.toUnixInteger(),
endTime:   end.toUnixInteger(),
```

## Rule 10: Test-Driven Development (TDD)

**Write the test file before the implementation file. No exceptions.**

The cycle is: Red → Green → Refactor.

1. **Red** — write a failing test that describes the behaviour you need.
2. **Green** — write the minimum implementation to make the test pass.
3. **Refactor** — clean up without breaking the tests.

```sh
# Correct order
touch parse-args.test.ts   # write tests first
touch parse-args.ts        # then implement

# Wrong order
touch parse-args.ts        # implement first → tests become confirmatory, not design-driven
touch parse-args.test.ts
```

### What this means in practice

- Before creating any `.ts` module, create `<module>.test.ts` with at least one failing test.
- Run `bun test <module>.test.ts` to confirm the test fails for the right reason before writing the implementation.
- When adding a feature to an existing module, add the test first, watch it fail, then implement.
- Never write a test purely to hit coverage — tests must specify behaviour.

### Design benefit

TDD forces the public API to be designed before the internals. If the test is awkward to write, the API is wrong — fix the API, not the test.

## Rule 11: Extension-free Imports

Never include a file extension or an explicit `/index` segment in an import path.

```ts
// ❌
import { foo } from "./foo.ts";
import { bar } from "./utils/index.ts";
import { baz } from "./utils/index";

// ✅
import { foo } from "./foo";
import { bar } from "./utils";
```

Bun resolves bare module names and directory imports automatically. Extensions tie imports to a specific file format and add noise to every import line. No linter rule enforces this in the current
Biome setup — it is a manual convention.

## Rule 12: Load Environment Variables via dotenvx

Scripts that need `.env` values must call `dotenvx.config({ quiet: true })` as the first statement of `main`. Do not rely on the caller to prefix the command with `dotenvx run --`.

```ts
// ❌ — requires caller to run: dotenvx run -- bun run main.ts
export const main = async (env = process.env): Promise<void> => {
  const token = env.MY_TOKEN;
  // ...
};

// ✅ — self-contained; bun run main.ts works directly
import dotenvx from "@dotenvx/dotenvx";

export const main = async (env = process.env): Promise<void> => {
  dotenvx.config({ quiet: true });
  const token = env.MY_TOKEN;
  // ...
};
```

`quiet: true` suppresses the `⟐ injected env…` banner so stdout stays clean for piping. Tests are unaffected because they pass their own `env` and never depend on `.env` values.

## Rule 13: Verbose Flag

All CLI scripts that emit diagnostic output **must** support a `-V, --verbose` flag. When set, it prints additional detail to stderr about what is being queried — resolved config, active filters,
per-item progress.

The flag uses `{ collect: true }` so each repetition increments a count. The verbosity level is `options.verbose?.length ?? 0`, supporting `-V` (1), `-VV` (2), and `-VVV` (3).

- Short: `-V` (uppercase, reserved for verbose across all scripts)
- Long: `--verbose`
- Type: `boolean` with `{ collect: true }`
- Output: `console.error` (stderr) — consistent with Rule 8

**Verbosity level mapping:**

- Level 0 (no flag): normal operation — minimal progress lines only
- Level 1 (`-V`): resolved config (URL, depth, duration, views, projects)
- Level 2 (`-V -V`): active filters (exclude/include patterns)
- Level 3 (`-V -V -V`): per-item scan output

```ts
// parse-args.ts
.option("-V, --verbose", "Verbosity level: -V, -V -V, or -V -V -V", { collect: true })

// types.ts
export interface Args {
    // ...
    verbosity: number;
}

// In parseArgs return:
verbosity: options.verbose?.length ?? 0,

// main.ts
if (verbosity >= 1) {
    console.error(colors.dim(`  URL:      ${baseUrl}`));
    console.error(colors.dim(`  Projects: ${projects?.length ? projects.join(", ") : "(all)"}`));
    // ...resolved config
}
if (verbosity >= 2) {
    // ...active filters
}
if (verbosity >= 3) {
    // ...per-item progress inside the pool callback
}
```

Tests must cover `verbosity: 0` as the default, and `-V`/`-VV`/`-VVV` setting it to 1/2/3.

## Rule 14: Command Declaration / Action Separation

Every CLI subcommand must be split across two dedicated modules:

- `command.ts` — exports exactly one thing: the `Command` object, named `<name>Command`
- `action.ts` — exports exactly one thing: the action handler function, named `<name>Action`, plus its `<Name>ActionArgs` interface and `Deps` interface

### Naming conventions

| Artifact              | Name pattern       | Example         |
| --------------------- | ------------------ | --------------- |
| Command export        | `<name>Command`    | `fooCommand`    |
| Action export         | `<name>Action`     | `fooAction`     |
| Action args interface | `<Name>ActionArgs` | `FooActionArgs` |
| Deps interface        | `<Name>Deps`       | `FooDeps`       |

`command.ts` owns the cliffy option wiring and delegates execution to the action. `action.ts` contains all testable logic with dependency injection. Do NOT colocate action functions inside
`command.ts`.

### Action args contract

The `<Name>ActionArgs` interface must be defined in `action.ts` and must exactly match the shape that `command.ts` constructs before calling the action. The command must not pass raw cliffy option
objects — it must map options to `<Name>ActionArgs` explicitly.

```ts
// ❌  — wrong names; action receives raw cliffy opts; args type defined outside action.ts
export const runFoo = async (args: FooArgs, deps: FooDeps = {}): Promise<void> => { … };
export const fooCommand = new Command()
    .name("foo")
    .option("--bar <bar:string>", "Bar value")
    .action(async (opts) => { await runFoo(opts); });

// ✅  — correct names; action.ts defines FooActionArgs; command maps opts → args
// action.ts
export interface FooActionArgs {
    bar: string;
    verbosity: number;
}
export type FooDeps = {
    write?: (s: string) => void;
};
export const fooAction = async (args: FooActionArgs, deps: FooDeps = {}): Promise<void> => { … };

// command.ts
import { fooAction } from "./action";
import type { FooActionArgs } from "./action";
export const fooCommand = new Command()
    .name("foo")
    .option("--bar <bar:string>", "Bar value")
    .option("-V, --verbose", "Verbosity", { collect: true })
    .action(async (opts): Promise<void> => {
        const args: FooActionArgs = {
            bar: opts.bar ?? "",
            verbosity: opts.verbose?.length ?? 0,
        };
        await fooAction(args);
    });
```

For subcommands that are also standalone entry points (directly runnable via `bun run main.ts`), `main.ts` serves as the action module — same naming rules apply:

```text
subcommand/
├── command.ts   # cliffy Command declaration only — exports <name>Command
├── main.ts      # action logic (<name>Action) + <Name>ActionArgs + import.meta.main guard
└── index.ts     # barrel re-exports command, main, and domain subdirs
```

When the subcommand is not a standalone entry point:

```text
subcommand/
├── command.ts   # cliffy Command declaration only — exports <name>Command
├── action.ts    # <name>Action + <Name>ActionArgs interface + Deps interface
└── index.ts     # barrel re-exports command, action, and domain subdirs
```

The barrel `index.ts` must re-export from both `./command` and `./action`.

### Standalone entry-point: reusing command.ts for direct invocation

For standalone entry points, `main.ts` must reuse the command declared in `command.ts` rather than duplicating option declarations. Import it dynamically inside the `import.meta.main` guard to avoid
circular dependencies (command.ts imports from main.ts for the action; main.ts only imports command.ts at runtime when run directly):

```ts
// main.ts
export interface FooActionArgs { … }
export type FooDeps = { … }
export const fooAction = async (args: FooActionArgs, deps: FooDeps = {}): Promise<void> => { … };

if (import.meta.main) {
    const { fooCommand } = await import("./command");
    await fooCommand.parse(Bun.argv.slice(2));
}
```

This ensures `--help` output is identical whether the subcommand is invoked via the parent CLI or directly.

---

### Anti-patterns — explicitly forbidden

#### ❌ Hollow `command.ts` with `.useRawArgs()` + hidden Command in `parse-args.ts`

This is the most common violation. It produces two parallel, disconnected command declarations: the outer one in `command.ts` (which declares no options and adds no value) and a secret one buried
inside `parse-args.ts` (which is actually the real command).

Symptoms:

- `command.ts` calls `.useRawArgs()` and forwards a raw `string[]` to `main()`
- `parse-args.ts` contains `new Command()…parse(argv)` — a full standalone CLI definition
- `--help` at the parent CLI level shows no options for the subcommand
- Options are parsed twice (outer useRawArgs pass-through + inner parse-args Command)

```ts
// ❌ parse-args.ts — BANNED: Command declaration belongs in command.ts
export const parseArgs = async (argv: string[]): Promise<Args> => {
  const { options } = await new Command().name("foo").option("--bar <bar:string>", "Bar value").parse(argv);
  return { bar: options.bar };
};

// ❌ command.ts — BANNED: .useRawArgs() bypasses all option wiring
export const fooCommand = new Command()
  .name("foo")
  .useRawArgs()
  .action(async (_opts, ...args: string[]) => {
    await main(args); // main re-parses argv internally
  });
```

Fix: move option declarations into `command.ts`, map opts to `FooActionArgs`, and call `fooAction` directly. If a `parse-args.ts` module is needed for the standalone `import.meta.main` path, it must
be a thin mapping function — **not** a Cliffy `Command` factory.

#### ❌ `parse-args.ts` that instantiates `new Command()`

`parse-args.ts` is a mapping module. It may exist to convert raw env/argv into a typed `Args` struct, but it must never create a `Command` object. Command declarations belong exclusively in
`command.ts`.

```ts
// ❌ BANNED — Command lives in parse-args.ts
export const parseArgs = async (argv: string[]) => {
    const { options } = await new Command().option(…).parse(argv);
    return options;
};

// ✅ parse-args.ts may only contain pure mapping logic (no Command instantiation)
export const parseArgs = (options: ReturnType<typeof myCommand.parse>): FooActionArgs => ({
    bar: options.bar ?? "",
    verbosity: options.verbose?.length ?? 0,
});
```

If the mapping logic is trivial, inline it directly in `command.ts`'s `.action()` handler and delete `parse-args.ts` entirely.

#### ❌ `.useRawArgs()` anywhere in `command.ts`

`.useRawArgs()` is unconditionally banned in `command.ts`. It bypasses cliffy's type system, hides options from parent-command help output, and forces `main()` to re-parse argv. There is no valid use
case for it in this codebase.

## Rule 15: Zod for Shared Types and Config Schemas

All shared types and config file shapes must be defined as Zod schemas. Do not write plain TypeScript interfaces for structures that cross a system boundary (config files, API payloads, CLI flag
shapes passed between modules). Derive the TypeScript type from the schema with `z.infer`.

```ts
// ❌ — plain interface; no runtime validation, no JSON Schema generation
export interface Config {
  baseUrl: string;
  projects: string[];
}

// ✅ — Zod schema is the source of truth; type is derived
import { z } from "zod";

export const ConfigSchema = z.object({
  baseUrl: z.string().url(),
  projects: z.array(z.string()).min(1),
});

export type Config = z.infer<typeof ConfigSchema>;
```

### JSON Schema generation

When a CLI tool uses a config file, a JSON Schema must be generated from the Zod schema and committed alongside the config. Use `zod-to-json-schema`:

```ts
import { zodToJsonSchema } from "zod-to-json-schema";
import { ConfigSchema } from "./schema";

export const generateSchema = (): object => zodToJsonSchema(ConfigSchema, { name: "Config", target: "jsonSchema7" });
```

### Required CLI targets

Every CLI tool that reads a config file **must** expose three subcommands (or npm script targets):

| Target            | Description                                                            |
| ----------------- | ---------------------------------------------------------------------- |
| `config init`     | Write a new config file populated with documented defaults             |
| `config schema`   | Print or write the JSON Schema derived from the Zod schema             |
| `config validate` | Parse an existing config file against the Zod schema and report errors |

```ts
// command.ts skeleton
export const configCommand = new Command().name("config").description("Manage configuration").command("init", initCommand).command("schema", schemaCommand).command("validate", validateCommand);
```

`config validate` must exit with a non-zero code and print structured Zod error messages when the config is invalid, so CI pipelines can catch bad configs before they reach runtime:

```ts
// validate/action.ts
const result = ConfigSchema.safeParse(raw);
if (!result.success) {
  console.error(JSON.stringify(result.error.format(), null, 2));
  process.exit(1);
}
```

### File layout

```text
cli/my-feature/
├── config/
│   ├── schema.ts          # Zod schema + z.infer type export
│   ├── init/
│   │   ├── command.ts
│   │   ├── action.ts
│   │   └── index.ts
│   ├── schema-cmd/        # "schema" subcommand (avoids naming clash with schema.ts)
│   │   ├── command.ts
│   │   ├── action.ts
│   │   └── index.ts
│   ├── validate/
│   │   ├── command.ts
│   │   ├── action.ts
│   │   └── index.ts
│   └── index.ts           # barrel
└── index.ts
```
