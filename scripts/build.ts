import { build } from "vite";
import { execSync } from "node:child_process";

execSync("bun run scripts/generate-schema.ts", { stdio: "inherit" });

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

await build({
	...shared,
	build: {
		...shared.build,
		lib: {
			entry: "src/hooks/inject.ts",
			fileName: () => "hooks/inject.mjs",
			formats: ["es" as const],
		},
	},
});

await build({
	...shared,
	build: {
		...shared.build,
		lib: {
			entry: "src/cli/switch.ts",
			fileName: () => "cli/switch.mjs",
			formats: ["es" as const],
		},
	},
});

await build({
	...shared,
	build: {
		...shared.build,
		minify: false as const,
		lib: {
			entry: "src/install.ts",
			fileName: () => "install.mjs",
			formats: ["es" as const],
		},
	},
});
