/** Lets any part of the site (like the search bar) open the CraftSprint Assistant with a question. */
export const OPEN_ASSISTANT_EVENT = 'cs-open-assistant';

export function openAssistant(question?: string) {
  window.dispatchEvent(new CustomEvent<string | undefined>(OPEN_ASSISTANT_EVENT, { detail: question }));
}
