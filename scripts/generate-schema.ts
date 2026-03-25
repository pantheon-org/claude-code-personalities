import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { PersonalityConfigSchema } from "../src/lib/types.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const schema = {
	$schema: "https://json-schema.org/draft/2020-12/schema",
	$id: "https://raw.githubusercontent.com/pantheon-org/claude-code-personalities/main/schema/personality.schema.json",
	title: "PersonalityConfig",
	description:
		"Defines a Claude Code personality injected via UserPromptSubmit hook.",
	...z.toJSONSchema(PersonalityConfigSchema),
};

const dest = join(ROOT, "schema", "personality.schema.json");
writeFileSync(dest, `${JSON.stringify(schema, null, 2)}\n`);
console.log(`Generated ${dest}`);
