import React, { useState } from 'react';
import { View, Text, TextInput, FlatList } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

export default function TutorielsScreen() {
  const [search, setSearch] = useState('');

  const videos = [
    { id: '1', title: 'Changer une roue', url: 'https://www.youtube.com/shorts/K15B7Iw26AI' },
    { id: '2', title: 'Vidange moteur',   url: 'https://www.w3schools.com/html/movie.mp4' },
    { id: '3', title: 'Remplacer une batterie', url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  ];

  const filteredVideos = videos.filter(v =>
    v.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f9f9f9', padding: 15 }}>
      <Text style={{ fontSize: 26, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' }}>
        🔧 Tutoriels Mécanique
      </Text>

      <TextInput
        placeholder="Rechercher une réparation (ex: batterie)"
        value={search}
        onChangeText={setSearch}
        style={{
          backgroundColor: '#fff',
          padding: 10,
          borderRadius: 10,
          marginBottom: 15,
          borderWidth: 1,
          borderColor: '#ccc',
        }}
      />

      <FlatList
        data={filteredVideos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 30 }}
        renderItem={({ item }) => (
          <View
            style={{
              marginBottom: 25,
              backgroundColor: '#fff',
              borderRadius: 10,
              padding: 10,
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 3,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 }}>
              {item.title}
            </Text>

            <Video
              source={{ uri: item.url }}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              style={{ width: '100%', height: 200, borderRadius: 8, backgroundColor: '#000' }}
            />
          </View>
        )}
      />

      {filteredVideos.length === 0 && (
        <Text style={{ textAlign: 'center', color: '#888' }}>
          Aucun tutoriel trouvé pour "{search}"
        </Text>
      )}
    </View>
  );
}
