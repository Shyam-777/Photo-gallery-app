import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/middleware';

/** Shared persist storage so every store reads/writes AsyncStorage the same way. */
export const persistStorage = createJSONStorage(() => AsyncStorage);
