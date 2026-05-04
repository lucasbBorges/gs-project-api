import { SetMetadata } from '@nestjs/common';

import { UserProfile } from '../constants/user-profiles.constants';

export const PROFILES_KEY = 'profiles';

export const Profiles = (...profiles: UserProfile[]) => SetMetadata(PROFILES_KEY, profiles);
