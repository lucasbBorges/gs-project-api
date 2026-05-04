export const USER_PROFILES = ['Admin', 'Operação', 'Franchising'] as const;

export type UserProfile = (typeof USER_PROFILES)[number];
