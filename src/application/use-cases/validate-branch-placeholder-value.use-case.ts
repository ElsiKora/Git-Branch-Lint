import type { IInputValidationResult } from "../../domain/type/input-validation-result.type";
import type { IValidateBranchPlaceholderValueParameters } from "../type/validate-branch-placeholder-value-parameters.type";

import { InvalidBranchPatternConfigError } from "../../domain/errors/lint.error";

/**
 * Use case for validating interactive placeholder values.
 */
export class ValidateBranchPlaceholderValueUseCase {
	public execute(parameters: IValidateBranchPlaceholderValueParameters): IInputValidationResult {
		const normalizedValue: string = parameters.value.trim();

		if (parameters.isOptional && normalizedValue.length === 0) {
			return { isValid: true };
		}

		let expression: RegExp;

		try {
			expression = new RegExp(`^${parameters.patternSource}$`);
		} catch {
			throw new InvalidBranchPatternConfigError(parameters.placeholderName, parameters.patternSource);
		}

		if (!expression.test(normalizedValue)) {
			return {
				errorMessage: `Invalid ${parameters.placeholderName} format`,
				isValid: false,
			};
		}

		return { isValid: true };
	}
}
