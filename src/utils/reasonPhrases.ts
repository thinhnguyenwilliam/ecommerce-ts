// src/utils/reasonPhrases.ts
export const ReasonPhrases = {
    CONTINUE: 'Continue',
    OK: 'OK',
    CREATED: 'Created',
    ACCEPTED: 'Accepted',
    NO_CONTENT: 'No Content',
    BAD_REQUEST: 'Bad Request',
    UNAUTHORIZED: 'Unauthorized',
    FORBIDDEN: 'Forbidden',
    NOT_FOUND: 'Not Found',
    CONFLICT: 'Conflict',
    INTERNAL_SERVER_ERROR: 'Internal Server Error',
    SERVICE_UNAVAILABLE: 'Service Unavailable'
} as const;

export type ReasonPhraseKey = keyof typeof ReasonPhrases;
export type ReasonPhraseValue = typeof ReasonPhrases[ReasonPhraseKey];
