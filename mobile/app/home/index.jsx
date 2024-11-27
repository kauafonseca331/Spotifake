import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ScrollView, TouchableOpacity, Modal, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);

  const playlists = [
    { id: '1', title: 'Mix Brasil', cover: 'https://i.pinimg.com/originals/29/5c/dd/295cdd917545a1f9a93f07dddb30254c.jpg' },
    { id: '2', title: 'Chill Vibes', cover: 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da84208adb263349d9c836439816' },
    { id: '3', title: 'Workout Mix', cover: 'https://t2.tudocdn.net/700696?w=824&h=494' },
    { id: '4', title: 'Focus Time', cover: 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da84e9fb66d28f2c6041bbb15353' },
    { id: '5', title: 'Party Hits', cover: 'https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da842e36575f67a4ac39f577e0cd' },
  ];

  const recentlyPlayed = [
    { id: '6', title: 'Daily Mix 1', cover: 'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/spotify-minimal-playlist-album-cover-floral-design-template-386954a3206172a6251e3639ba986976_screen.jpg?ts=1681851633' },
    { id: '7', title: 'Daily Mix 2', cover: 'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/spotify-minimal-playlist-album-cover-cyan-design-template-fff58702d4947264deeb11e1e1737bd9_screen.jpg?ts=1651478054' },
    { id: '8', title: 'BadBoys', cover: 'https://cdn-images.dzcdn.net/images/cover/5c04758d86aefac7b7e4d7b615744ace/0x1900-000000-80-0-0.jpg' },
    { id: '9', title: 'NUME', cover: 'https://www.djsound.com.br/wp-content/uploads/2024/11/unnamed-17.jpg' },
  ];

  const songs = [
    { id: '1', title: 'Bad Boys', artist: 'Mc IG, Mc Ryan SP, Mc PH, DJ Glenner, Mano Brown' },
    { id: '2', title: 'Nois Já Tá Rico', artist: 'Mc IG, Mc Ryan SP, Orochi, DJ Glenner, DJ Negret' },
    { id: '3', title: 'Fernando de Noronha 2', artist: 'MC IG, MC Ryan SP, Murillo e LT no Beat' },
    { id: '4', title: 'Filha do Deputado', artist: 'Mc IG, Mc Ryan SP, DJ Glenner, Mc Poze do Rodo, Oruam' },
    { id: '5', title: 'Casal Celebridade', artist: 'Mc IG, Mc Ryan SP, DJ Glenner, Fepache' },
  ];

  const renderPlaylistItem = ({ item }) => (
    <View style={styles.playlistItem}>
      <Image source={{ uri: item.cover }} style={styles.playlistImage} />
      <Text style={styles.playlistTitle}>{item.title}</Text>
    </View>
  );

  const renderSongItem = ({ item }) => (
    <View style={styles.songItem}>
      <Text style={styles.songTitle}>{item.title}</Text>
      <Text style={styles.songArtist}>{item.artist}</Text>
    </View>
  );

  const openModal = (title) => {
    if (title === 'BadBoys') {
      setModalVisible(true);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Perfil')}>
          <Ionicons name="settings-outline" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.greeting}>Bom dia</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Ionicons name="log-out-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Conteúdo */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.quickPlayContainer}>
          {playlists.slice(0, 6).map((item) => (
            <View key={item.id} style={styles.quickPlayItem}>
              <Image source={{ uri: item.cover }} style={styles.quickPlayImage} />
              <Text style={styles.quickPlayTitle}>{item.title}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Tocadas Recentemente</Text>
        <FlatList
          data={recentlyPlayed}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => openModal(item.title)}>
              {renderPlaylistItem({ item })}
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />

        <Text style={styles.sectionTitle}>Playlists Populares</Text>
        <FlatList
          data={playlists}
          renderItem={renderPlaylistItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />
      </ScrollView>

      {/* Modal de Músicas */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Músicas do Álbum "BadBoys"</Text>
            <FlatList
              data={songs}
              renderItem={renderSongItem}
              keyExtractor={(item) => item.id}
            />
            <Button title="Fechar" onPress={closeModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  contentContainer: {
    paddingBottom: 20, 
    flexGrow: 1,  // Permite que o conteúdo dentro do ScrollView cresça e seja rolável
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#121212',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  quickPlayContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 20,
  },
  quickPlayItem: {
    width: '48%',
    backgroundColor: '#282828',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
  },
  quickPlayImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  quickPlayTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginHorizontal: 16,
    marginBottom: 10,
  },
  horizontalList: {
    paddingHorizontal: 16,
  },
  playlistItem: {
    marginRight: 16,
    alignItems: 'center',
  },
  playlistImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  playlistTitle: {
    color: '#fff',
    fontSize: 14,
    marginTop: 8,
  },
  songItem: {
    marginBottom: 10,
  },
  songTitle: {
    fontSize: 16,
    color: '#fff',
  },
  songArtist: {
    fontSize: 14,
    color: '#bbb',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#121212',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
});

