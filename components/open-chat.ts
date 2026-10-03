/**
 * The page's own command a control gives the chat with the Digital Twin to open it, per DDR-100:
 * the invitation on the Digital Twin's view names the chat's panel with `commandfor` and gives it
 * this `command`, as a gallery's step control gives a larger picture its own (ADR-019). It lives
 * apart from the chat, a Client Component, so that a Server Component can name it as a string.
 */
export const openChatCommand = '--open-chat';
