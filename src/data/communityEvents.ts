import { CommunityEvent, EventRegistration } from '../types/dating';

/**
 * Clean baseline: Zero mock events and zero mock registrations.
 * Real events are created by users/organizers via the Event Creator.
 * Real attendees are registered via the Registration & Donation flow.
 */
export const INITIAL_COMMUNITY_EVENTS: CommunityEvent[] = [];

export const INITIAL_REGISTRATIONS: EventRegistration[] = [];
