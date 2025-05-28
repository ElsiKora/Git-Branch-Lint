import type { IConfigRepository } from "../../domain/interface/config.repository.interface";
import type { IBranchLintConfig } from "../../domain/type/config.type";

/**
 * Use case for retrieving branch configuration
 */
export class GetBranchConfigUseCase {
	public constructor(private readonly configRepository: IConfigRepository) {}

	/**
	 * Execute the use case
	 * @param appName - The application name
	 * @returns The branch configuration
	 */
	public async execute(appName: string): Promise<IBranchLintConfig> {
		try {
			return await this.configRepository.getConfig(appName);
		} catch (error) {
			throw new Error(`Failed to get branch config: ${(error as Error).message}`);
		}
	}
}
