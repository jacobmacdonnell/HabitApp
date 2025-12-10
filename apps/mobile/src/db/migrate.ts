import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';

import { db } from './client';
import migrations from '../../drizzle/migrations';

export const useMigrationHelper = () => {
    const { success, error } = useMigrations(db, migrations);
    return { success, error };
};
