# Repository agent workflow

Repository development workflows target GPT-6 Astra exclusively. Use `gpt-6-astra` when
configuring a coding agent for this repository. This does not select models used by the example
application or change provider contracts.

## Context and authority

- [scope.md](scope.md) owns product scope and adapter/application boundaries.
- [Adapter instructions](packages/adapter-linq/AGENTS.md) own adapter implementation invariants.
- [FEATURE_PARITY.md](packages/adapter-linq/FEATURE_PARITY.md) owns capability status and evidence
  definitions; consult and update affected rows when behavior changes.
- The [adapter README](packages/adapter-linq/README.md) owns consumer contracts; the
  [maintenance guide](packages/adapter-linq/MODERNIZATION.md) owns validation and release policy.
- Repository skills route Chat SDK and Linq integration work to relevant contracts and resources.
  Load the portions needed for the task, rather than every source for every edit.

Keep durable requirements in tracked documentation. Local notes under `local/linq-adapter/`, when
present, hold active or paused work, remaining obligations, and handoff context; consult them when
resuming that work. They do not override tracked scope or create additional completion gates.
Keep historical evidence separate from current requirements. Before removing a local note, move
any unique current requirement to its canonical home.

## Completion and authorization

Reviews and planning are read-only unless changes are requested. For authorized changes, finish
implementation, affected contracts/documentation, appropriate validation, and repairs caused by
the change. Do not stop at a first draft or ask again for routine work already authorized.
Surface scope or security decisions that require new authority while continuing independent work.
Use the maintenance guide to distinguish focused development checks from release verification.
External evidence is not a universal completion gate; report the evidence actually obtained.

Keep commits coherent and preserve unrelated work. Use `codex/` branches and Conventional Commits.
`main` is Forma's development branch; `upstream/main` is a read-only update source. Publication
and immutable release requirements are in the maintenance guide.
