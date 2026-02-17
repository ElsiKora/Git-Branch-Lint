import { TICKET_ID_PATTERN_SOURCE } from "../constant/ticket-id.constant";

/**
 * Domain policy for ticket identifier normalization and validation.
 */
export class TicketIdPolicy {
	private static readonly TICKET_ID_PATTERN: RegExp = new RegExp(`^${TICKET_ID_PATTERN_SOURCE}$`);

	public isEmpty(candidate: string): boolean {
		return candidate.trim().length === 0;
	}

	public isValid(candidate: string): boolean {
		const normalizedCandidate: string = this.normalize(candidate);

		if (normalizedCandidate.length === 0) {
			return false;
		}

		return TicketIdPolicy.TICKET_ID_PATTERN.test(normalizedCandidate);
	}

	public normalize(candidate: string): string {
		return candidate.trim().toLowerCase();
	}
}
