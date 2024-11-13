import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          senha: password,
        }),
      });

      if (response.status === 200) {
        const data = await response.json();
        navigation.navigate('Perfil');
      } else if (response.status === 401) {
        alert('Email ou senha incorretos');
      } else {
        const errorText = await response.text();
        alert('Erro', errorText);
      }
    } catch (error) {
      console.error(error);
      alert('Erro: não foi possível fazer o login');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spotifake</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={setEmail}
        placeholderTextColor="#B3B3B3"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry={!isPasswordVisible}
          onChangeText={setPassword}
          placeholderTextColor="#B3B3B3"
        />
        <TouchableOpacity
          style={styles.showButton}
          onPress={() => setPasswordVisible(!isPasswordVisible)}
        >
          <Text style={styles.showButtonText}>
            {isPasswordVisible ? "Ocultar" : "Mostrar"}
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>Não tem uma conta? Registre-se</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#191414',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1DB954',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    height: 50,
    backgroundColor: '#282828',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: '#fff',
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  showButton: {
    position: 'absolute',
    right: 15,
    padding: 5,
  },
  showButtonText: {
    color: '#1DB954',
    fontSize: 14,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#1DB954',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  linkText: {
    color: '#B3B3B3',
    textAlign: 'center',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
