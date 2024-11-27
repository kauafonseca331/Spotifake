import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Pressable, Switch, Modal, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function ProfileScreen() {
  const navigation = useNavigation();
  const [image, setImage] = useState();
  const [isDarkMode, setIsDarkMode] = useState(true); // Inicia com tema escuro
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [email, setEmail] = useState('');

  const user = {
    name: 'Kauã',
    email: 'kaua@gmail.com',
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      handleSetImage(result.assets[0].uri)
    }
  };

  const handleSetImage = async (url) => {
    try {
        const data = {
            "file": url,
            "upload_preset": 'ml_default',
        };
        const res = await fetch('https://api.cloudinary.com/v1_1/def7nkyj5/upload', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const result = await res.json();
        console.log(result)
        salvarImagemNoBackEnd(result.url)
    } catch (error) {
        console.err(error);
    }
};

const salvarImagemNoBackEnd = async(url) => {
    try {
        const response = await fetch(`http://localhost:8000/salvar_foto/${email}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({foto: url})
        });
        const result = await response.json();
        console.log(result)
       
    } catch (erro) {
        console.log(erro);
        return;
    }
}

  const handleLogout = () => {
    navigation.navigate('Login');
  };

  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const handlePasswordChange = async () => {
    if (newPassword < 3) {
      return alert('A senha deve ter pelo menos 3 dígitos')
    }

    if (newPassword !== confirmPassword) {
      return alert('As senhas devem coincidir')
    }
    try {
      await fetch(`http://localhost:8000/nova_senha/${email}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ senha: newPassword })
      })
      .then((response) => console.log(response.status))
      setModalVisible(false);
      alert('Senha alterada com sucesso!');
    } catch (error) {
      console.log(error)
    }

  };

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('email');
      if (value !== null) {
        setEmail(value)
        buscarimg(value)
      }
    } catch (e) {
      console.log(e)
    }
  };


  const buscarimg = async (email) => {
    try {
      await fetch(`http://localhost:8000/pegar_usuario/${email}`)
      .then((response) => response.json())
      .then((dados) => {console.log(dados); setImage(dados.foto_perfil) 
    })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    setIsDarkMode(true); // Garante que o tema escuro será a opção inicial
    getData()
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#191414' : '#fff' }]}>
      <Pressable onPress={pickImage}>
        <Image source={{ uri: image }} style={styles.avatar} />
      </Pressable>
      <Text style={[styles.name, { color: isDarkMode ? '#fff' : '#000' }]}>{user.name}</Text>
      <Text style={[styles.email, { color: isDarkMode ? '#B3B3B3' : '#000' }]}>{user.email}</Text>

      <TouchableOpacity style={[styles.button, { backgroundColor: isDarkMode ? '#282828' : '#f1f1f1' }]}>
        <Text style={[styles.buttonText, { color: isDarkMode ? '#1DB954' : '#191414' }]}>Editar Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: isDarkMode ? '#282828' : '#f1f1f1' }]}>
        <Text style={[styles.buttonText, { color: isDarkMode ? '#1DB954' : '#191414' }]}>Termos de uso</Text>
      </TouchableOpacity>

      {/* Botão para trocar senha */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: isDarkMode ? '#282828' : '#f1f1f1' }]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.buttonText, { color: isDarkMode ? '#1DB954' : '#191414' }]}>Trocar Senha</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <Text style={[styles.buttonText, styles.logoutButtonText]}>Deslogar</Text>
      </TouchableOpacity>

      <View style={styles.themeToggleContainer}>
        <Text style={[styles.themeToggleText, { color: isDarkMode ? '#fff' : '#000' }]}>
          Tema {isDarkMode ? 'Escuro' : 'Claro'}
        </Text>
        <Switch
          value={isDarkMode}
          onValueChange={toggleTheme}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isDarkMode ? '#1DB954' : '#f4f3f4'}
        />
      </View>

      {/* Modal de troca de senha */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Trocar Senha</Text>
            <TextInput
              placeholder="Nova Senha"
              placeholderTextColor="#999"
              secureTextEntry
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              placeholder="Confirmar Senha"
              placeholderTextColor="#999"
              secureTextEntry
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity style={styles.modalButton} onPress={handlePasswordChange}>
              <Text style={styles.modalButtonText}>Confirmar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: '#B3B3B3' }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.modalButtonText, { color: '#000' }]}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 40,
    borderWidth: 3,
    borderColor: '#1DB954',
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 20,
  },
  email: {
    fontSize: 16,
    marginBottom: 40,
  },
  button: {
    width: '85%',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#1DB954',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#1DB954',
    marginTop: 30,
  },
  logoutButtonText: {
    color: '#191414',
  },
  themeToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
  },
  themeToggleText: {
    fontSize: 16,
    marginRight: 10,
    fontWeight: 'bold',
  },
  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#191414',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#282828',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderColor: '#1DB954',
    borderWidth: 1,
  },
  modalButton: {
    backgroundColor: '#1DB954',
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  modalButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
