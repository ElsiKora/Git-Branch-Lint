import type { BranchList } from "../../../domain/interfaces/branch.type";

const EMPTY_SPACING_OFFSET: number = 5; // in spaces

interface IAlignChoicesResult {
	name: string;
	short: string;
	value: string;
}

// Функция для выравнивания текста
export const alignChoices = (branchList: BranchList): Array<IAlignChoicesResult> => {
	if (Array.isArray(branchList)) {
		return branchList.map((branchName: string) => {
			return {
				name: branchName,
				short: branchName,
				value: branchName,
			};
		});
	} else {
		const nameOfBranchesArray: Array<string> = Object.keys(branchList);
		const maxNameLength: number = Math.max(...nameOfBranchesArray.map((branchName: string) => branchName.length));

		// Формируем choices с выравниванием
		return nameOfBranchesArray.map((branchName: string) => {
			const padding: string = " ".repeat(maxNameLength - branchName.length + EMPTY_SPACING_OFFSET);

			return {
				name: `${branchList[branchName].title}:${padding}${branchList[branchName].description}`,
				short: branchList[branchName].title,
				value: branchName,
			};
		});
	}
};
