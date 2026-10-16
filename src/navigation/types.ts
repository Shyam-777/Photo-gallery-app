import type { NavigatorScreenParams } from '@react-navigation/native';
import type { GalleryImage } from '../types';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type TabParamList = {
  Home: undefined;
  Favorites: undefined;
  Profile: undefined;
};

export type AppStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList>;
  ImageDetails: { image: GalleryImage };
};
