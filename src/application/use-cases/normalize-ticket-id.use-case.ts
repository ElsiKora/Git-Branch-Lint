import { TicketIdPolicy } from "../../domain/policy/ticket-id.policy";

/**
 * Use case for normalizing optional ticket identifier input.
 */
export class NormalizeTicketIdUseCase {
	public constructor(private readonly ticketIdPolicy: TicketIdPolicy = new TicketIdPolicy()) {}

	public execute(ticketId: string): string {
		return this.ticketIdPolicy.normalize(ticketId);
	}
}
