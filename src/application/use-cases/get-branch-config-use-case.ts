import type { BranchLintConfig } from "../../domain/interfaces/config.type";
import type { IConfigRepository } from "../../domain/interfaces/repository-interfaces";

/**
 * Use case for getting branch configuration
 */
export class GetBranchConfigUseCase {
	private readonly CONFIG_REPOSITORY: IConfigRepository;

	/**
	 * Constructor
	 * @param configRepository The configuration repository
	 */
	constructor(configRepository: IConfigRepository) {
		this.CONFIG_REPOSITORY = configRepository;
	}

	/**
	 * Execute the use case
	 * @param appName The application name
	 * @returns The branch configuration
	 */
	public async execute(appName: string): Promise<BranchLintConfig> {
		return this.CONFIG_REPOSITORY.getConfig(appName);
	}
}
