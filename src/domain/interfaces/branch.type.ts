export interface BranchDetails {
	description: string;
	title: string;
}

export type BranchList = Array<string> | Record<string, BranchDetails>;
