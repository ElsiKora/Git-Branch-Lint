export interface IBranchDetails {
	description: string;
	title: string;
}

export type TBranchList = Array<string> | Record<string, IBranchDetails>;
