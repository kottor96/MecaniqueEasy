import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';

// Wrapper pour éviter l'erreur delayLongPress null
function SafeTouchableOpacity(props: BottomTabBarButtonProps) {
  const { delayLongPress, ...rest } = props;
  return (
    <TouchableOpacity
      {...(rest as TouchableOpacityProps)}
      delayLongPress={delayLongPress ?? undefined}
    >
      {props.children}
    </TouchableOpacity>
  );
}

export default function TabLayout() {
  const diagnosticDone = false; // Remplace par ton vrai hook si besoin

  return (
    <Tabs
      screenOptions={({ route }) => {
        const isLocked = route.name !== 'diagnostic' && !diagnosticDone;

        const icons: Record<string, React.ComponentProps<typeof Ionicons>['name']> = {
          diagnostic: 'construct',
          tutoriels: 'book',
          antiArnaques: 'warning',
          home: 'home',
        };

        const iconName = icons[route.name] ?? 'home';

        return {
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={iconName} size={size} color={isLocked ? 'lightgray' : color} />
          ),
          tabBarButton: (props) =>
            isLocked ? (
              <SafeTouchableOpacity {...props} style={[props.style, { opacity: 0.5 }]} disabled>
                {props.children}
              </SafeTouchableOpacity>
            ) : (
              <SafeTouchableOpacity {...props}>{props.children}</SafeTouchableOpacity>
            ),
        };
      }}
    />
  );
}
