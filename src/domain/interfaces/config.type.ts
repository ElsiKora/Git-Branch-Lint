import type { BranchList } from "./branch.type";
import type { RulesList } from "./rules.type";

export interface BranchLintConfig {
	branches: BranchList;
	ignore?: Array<string>;
	rules?: Partial<RulesList>;
}
