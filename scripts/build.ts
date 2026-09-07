import { build } from "vite";
import { execSync } from "node:child_process";

execSync("bun run scripts/generate-schema.ts", { stdio: "inherit" });
execSync("bun run scripts/generate-shipped-hashes.ts", { stdio: "inherit" });

const shared = {
	build: {
		target: "node20" as const,
		rollupOptions: {
			external: [/^node:/],
		},
		outDir: "dist",
		emptyOutDir: false,
		minify: true as const,
	},
};

async function buildEntry(entry: string, fileName: string) {
	await build({
		...shared,
		build: {
			...shared.build,
			lib: {
				entry,
				fileName: () => fileName,
				formats: ["es" as const],
			},
		},
	});
}

await buildEntry("src/hooks/inject.ts", "hooks/inject.mjs");
await buildEntry("src/cli/switch.ts", "cli/switch.mjs");
await buildEntry("src/install.ts", "install.mjs");
