import type { TBranchList } from "./branch.type";
import type { IRulesList } from "./rules.type";

export interface IBranchLintConfig {
	branches: TBranchList;
	ignore?: Array<string>;
	rules?: Partial<IRulesList>;
}
