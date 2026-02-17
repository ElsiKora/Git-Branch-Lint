import type { TBranchSubjectPattern } from "../../domain/type/branch-subject-pattern.type";
import type { IBranchPlaceholderDefinition } from "../type/branch-placeholder-definition.type";
import type { IGetBranchPlaceholderDefinitionsParameters } from "../type/get-branch-placeholder-definitions-parameters.type";

import { TICKET_ID_EXAMPLE } from "../../domain/constant/ticket-id.constant";
import { BranchTemplatePolicy } from "../../domain/policy/branch-template.policy";

/**
 * Use case for resolving placeholder definitions from branch pattern config.
 */
export class GetBranchPlaceholderDefinitionsUseCase {
	public constructor(private readonly branchTemplatePolicy: BranchTemplatePolicy = new BranchTemplatePolicy()) {}

	public execute(parameters: IGetBranchPlaceholderDefinitionsParameters): Array<IBranchPlaceholderDefinition> {
		const branchPattern: string | undefined = parameters.config.rules?.["branch-pattern"];
		const subjectPattern: TBranchSubjectPattern | undefined = parameters.config.rules?.["branch-subject-pattern"];

		if (!branchPattern) {
			return [];
		}

		const branchTypes: Array<string> = Array.isArray(parameters.config.branches) ? parameters.config.branches : Object.keys(parameters.config.branches);
		const placeholderNames: Array<string> = this.branchTemplatePolicy.getPlaceholders(branchPattern);

		return placeholderNames.map((placeholderName: string) => {
			if (placeholderName === "type") {
				return {
					isOptional: false,
					isTypePlaceholder: true,
					placeholderName,
				};
			}

			return {
				...(placeholderName === "ticket" && { example: TICKET_ID_EXAMPLE }),
				isOptional: this.branchTemplatePolicy.isPlaceholderOptional(branchPattern, placeholderName),
				isTypePlaceholder: false,
				patternSource: this.branchTemplatePolicy.resolvePlaceholderPatternSource(placeholderName, branchTypes, subjectPattern),
				placeholderName,
			};
		});
	}
}
