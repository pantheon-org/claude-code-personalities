# Changelog

## [1.1.1](https://github.com/pantheon-org/claude-code-personalities/compare/v1.1.0...v1.1.1) (2026-08-21)


### Bug Fixes

* move personality skill into required SKILL.md subdirectory shape ([#33](https://github.com/pantheon-org/claude-code-personalities/issues/33)) ([404568f](https://github.com/pantheon-org/claude-code-personalities/commit/404568f368f1c286003c9813deb2d7c03caf6627))

## [1.1.0](https://github.com/pantheon-org/claude-code-personalities/compare/v1.0.3...v1.1.0) (2026-08-21)


### Features

* configure ctxharness to fix ai-hygiene report warning ([#24](https://github.com/pantheon-org/claude-code-personalities/issues/24)) ([3998828](https://github.com/pantheon-org/claude-code-personalities/commit/3998828988ae3a4c39a4d641e60ed79e57a712b7))


### Bug Fixes

* pin jdx/mise-action by commit SHA and add ci.yml permissions ([#21](https://github.com/pantheon-org/claude-code-personalities/issues/21)) ([b2e8573](https://github.com/pantheon-org/claude-code-personalities/commit/b2e8573528b25b13cf28de345d4d32c4c729de3e))
* wrap SessionStart hook output in hookSpecificOutput ([#27](https://github.com/pantheon-org/claude-code-personalities/issues/27)) ([986d1fb](https://github.com/pantheon-org/claude-code-personalities/commit/986d1fb040dec171721ec916ceca2a5dcdaf24ed))

## [1.0.3](https://github.com/pantheon-org/claude-code-personalities/compare/v1.0.2...v1.0.3) (2026-03-25)


### Bug Fixes

* register skills directory and minify all dist outputs ([#14](https://github.com/pantheon-org/claude-code-personalities/issues/14)) ([e7d6f97](https://github.com/pantheon-org/claude-code-personalities/commit/e7d6f97c35d2494d0ddde3eaa766fa1a6e718328))

## [1.0.2](https://github.com/pantheon-org/claude-code-personalities/compare/v1.0.1...v1.0.2) (2026-03-25)


### Bug Fixes

* address plugin structural issues ([#12](https://github.com/pantheon-org/claude-code-personalities/issues/12)) ([ee6c8bc](https://github.com/pantheon-org/claude-code-personalities/commit/ee6c8bc065cf48f372565387873d2a964c8a43e4))

## [1.0.1](https://github.com/pantheon-org/claude-code-personalities/compare/v1.0.0...v1.0.1) (2026-03-25)


### Bug Fixes

* add marketplace.json for claude plugin marketplace ([#9](https://github.com/pantheon-org/claude-code-personalities/issues/9)) ([afd0645](https://github.com/pantheon-org/claude-code-personalities/commit/afd0645302f4f907f6074d8120470c2029303402))
* **ci:** trigger bundle on .claude-plugin/** changes ([#11](https://github.com/pantheon-org/claude-code-personalities/issues/11)) ([dbd7223](https://github.com/pantheon-org/claude-code-personalities/commit/dbd72234e555a2a22f3d602870f6d9d56c82044c))

## 1.0.0 (2026-03-25)


### Features

* add bundled personality data and README ([72a3936](https://github.com/pantheon-org/claude-code-personalities/commit/72a393687063d2d99b91b45ec0285bc35ab6fe36))
* add Claude Code plugin manifest (pantheon-ai namespace) ([0715a93](https://github.com/pantheon-org/claude-code-personalities/commit/0715a93e12379752782d7e35a3df681ca3c34add))
* add markdownlint-cli2 to pre-commit hook ([1716cf3](https://github.com/pantheon-org/claude-code-personalities/commit/1716cf3fd41e94bb9c3efe561bc934607b6df09f))
* add personality JSON schema and tighten Zod types ([a5cda8e](https://github.com/pantheon-org/claude-code-personalities/commit/a5cda8ec3eabbb5028835d8cb13218bcb58d31b9))
* distribution-ready with automated GitHub releases ([#2](https://github.com/pantheon-org/claude-code-personalities/issues/2)) ([d20c9ce](https://github.com/pantheon-org/claude-code-personalities/commit/d20c9ce4d48c6f3b0faea73673a1b4412b1ab8c0))
* initial plugin — personality injection for Claude Code ([63a3767](https://github.com/pantheon-org/claude-code-personalities/commit/63a37672b5c244b709a5da2804821603307caeee))
* prepare plugin for marketplace distribution ([#1](https://github.com/pantheon-org/claude-code-personalities/issues/1)) ([bb6c416](https://github.com/pantheon-org/claude-code-personalities/commit/bb6c41685c97060bb377107cc50b763b4487fece))
* prepare plugin for marketplace distribution with automated releases ([#4](https://github.com/pantheon-org/claude-code-personalities/issues/4)) ([c2b404e](https://github.com/pantheon-org/claude-code-personalities/commit/c2b404e439d36deec1573e7579f6345d1f2d4d07))
* switch hook from UserPromptSubmit to SessionStart ([734d213](https://github.com/pantheon-org/claude-code-personalities/commit/734d213685e1032958ab306db1cd028607febed3))


### Bug Fixes

* fallback to github.token when RELEASE_PLEASE_TOKEN is unset ([#5](https://github.com/pantheon-org/claude-code-personalities/issues/5)) ([1cb6a6c](https://github.com/pantheon-org/claude-code-personalities/commit/1cb6a6c06fb0cc9e25a8ff246b26bc20fefbd9d9))
* **install:** register hook and skill symlink in settings.json for local dev ([0ae4431](https://github.com/pantheon-org/claude-code-personalities/commit/0ae4431697ee6a271b2e54924ea250dd44ff665e))
* reframe persona prompt to layer over Claude's identity, not replace it ([724b16c](https://github.com/pantheon-org/claude-code-personalities/commit/724b16c4e1763af84b071053a5559dea30537bb8))
* strengthen persona prompt to prevent drift in long conversations ([f683a4e](https://github.com/pantheon-org/claude-code-personalities/commit/f683a4e2dff7c4898124a116f8aef8c860ec9846))
