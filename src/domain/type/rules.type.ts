import type { TBranchSubjectPattern } from "./branch-subject-pattern.type";

export interface IRulesList {
	"branch-max-length": number;
	"branch-min-length": number;
	"branch-pattern": string;
	"branch-prohibited": Array<string>;
	"branch-subject-pattern": TBranchSubjectPattern;
}
