/**
 * Interface for branch configuration
 */
export interface IBranchConfig {
	readonly MAXLENGTH?: number;
	readonly MINLENGTH?: number;
	PARAMS: IBranchParameters;
	readonly PATTERN: string;
	readonly PROHIBITED: ReadonlyArray<string>;
}

/**
 * Interface for branch parameters
 */
export interface IBranchParameters {
	readonly NAME: ReadonlyArray<string>;
	readonly TYPE: ReadonlyArray<string>;
}

/**
 * Type definition for a branch name
 * We explicitly keep this type for semantic clarity
 */
// eslint-disable-next-line @elsikora-sonar/redundant-type-aliases
export type TBranchName = string;
