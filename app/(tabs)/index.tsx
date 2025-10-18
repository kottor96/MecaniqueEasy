import React from 'react';
import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={{ flex:1, justifyContent:'center', alignItems:'center', padding:20 }}>
      <Text style={{ fontSize:24, marginBottom:20 }}>Bienvenue sur MecaniqueEasy 🚗</Text>

      <Button title="Diagnostic" onPress={() => router.push('./diagnostic')} />

      <View style={{ marginTop:10 }}>
        <Button title="Tutoriels" onPress={() => router.push('./tutoriels')} />
      </View>

      <View style={{ marginTop:10 }}>
        <Button title="Anti-Arnaques" onPress={() => router.push('./antiArnaques')} />
      </View>
    </View>
  );
}
