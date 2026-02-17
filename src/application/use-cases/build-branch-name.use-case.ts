import type { IBuildBranchNameParameters } from "../type/build-branch-name-parameters.type";

import { BranchTemplatePolicy } from "../../domain/policy/branch-template.policy";

/**
 * Use case for assembling a branch name from validated user inputs.
 */
export class BuildBranchNameUseCase {
	public constructor(private readonly branchTemplatePolicy: BranchTemplatePolicy = new BranchTemplatePolicy()) {}

	public execute(parameters: IBuildBranchNameParameters): string {
		return this.branchTemplatePolicy.buildBranchName(parameters.branchPattern, parameters.placeholderValues);
	}
}
