import type { IBranchLintConfig } from "../../domain/type/config.type";

/**
 * Use case for retrieving effective branch pattern.
 */
export class GetBranchPatternUseCase {
	private readonly DEFAULT_BRANCH_PATTERN: string = ":type/:name";

	public execute(config: IBranchLintConfig): string {
		return config.rules?.["branch-pattern"] ?? this.DEFAULT_BRANCH_PATTERN;
	}
}
