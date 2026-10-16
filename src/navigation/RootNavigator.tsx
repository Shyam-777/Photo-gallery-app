import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { LoadingView } from '../components/StateViews';
import { useHydrated } from '../hooks/useHydrated';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ImageDetailsScreen } from '../screens/ImageDetailsScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { useCurrentUser } from '../store/authStore';
import { useTheme } from '../theme/useTheme';
import type { AppStackParamList, AuthStackParamList, TabParamList } from './types';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const TAB_ICONS: Record<keyof TabParamList, { on: keyof typeof Ionicons.glyphMap; off: keyof typeof Ionicons.glyphMap }> = {
  Home: { on: 'images', off: 'images-outline' },
  Favorites: { on: 'heart', off: 'heart-outline' },
  Profile: { on: 'person', off: 'person-outline' },
};

function ThemeToggle() {
  const { isDark, toggle, colors } = useTheme();
  return (
    <Pressable
      onPress={toggle}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{ marginRight: 16 }}
    >
      <Ionicons name={isDark ? 'sunny-outline' : 'moon-outline'} size={22} color={colors.text} />
    </Pressable>
  );
}

function Tabs() {
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerRight: () => <ThemeToggle />,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons name={TAB_ICONS[route.name][focused ? 'on' : 'off']} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Gallery' }} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const hydrated = useHydrated();
  const user = useCurrentUser();
  const { navTheme, isDark } = useTheme();

  if (!hydrated) return <LoadingView />;

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      {user ? (
        <AppStack.Navigator>
          <AppStack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
          <AppStack.Screen name="ImageDetails" component={ImageDetailsScreen} options={{ title: 'Image Details' }} />
        </AppStack.Navigator>
      ) : (
        <AuthStack.Navigator screenOptions={{ headerRight: () => <ThemeToggle /> }}>
          <AuthStack.Screen name="Login" component={LoginScreen} options={{ title: 'Welcome back' }} />
          <AuthStack.Screen name="Register" component={RegisterScreen} options={{ title: 'Create account' }} />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
}
