import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: any = 'home';
          if (route.name === 'diagnostic') iconName = 'construct';
          else if (route.name === 'tutoriels') iconName = 'book';
          else if (route.name === 'antiArnaques') iconName = 'warning';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    />
  );
}
