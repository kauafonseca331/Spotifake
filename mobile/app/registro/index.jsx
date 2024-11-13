import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen() {
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const navigation = useNavigation();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert('Erro: As senhas não coincidem');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: nome,
          sobrenome: sobrenome,
          email: email,
          senha: password,
          dataNascimento: dataNascimento,
        }),
      });

      if (response.status === 406) {
        alert('Erro: Todos os campos devem ser preenchidos');
        return;
      } else if (response.status === 400) {
        alert('Erro: Usuário já cadastrado');
        return;
      } else if (response.status === 201) {
        alert('Sucesso: Usuário registrado com sucesso');
        navigation.navigate('Login');
        return;
      } else {
        const errorText = await response.text();
        alert(`Erro: ${errorText}`);
        return;
      }
    } catch (error) {
      console.error(error);
      alert('Erro: Não foi possível registrar o usuário');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar-se no Spotifake</Text>
      <TextInput style={styles.input} placeholder="Nome" onChangeText={setNome} placeholderTextColor="#B3B3B3" />
      <TextInput style={styles.input} placeholder="Sobrenome" onChangeText={setSobrenome} placeholderTextColor="#B3B3B3" />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={setEmail}
        placeholderTextColor="#B3B3B3"
      />
      <TextInput
        style={styles.input}
        placeholder="Data de Nascimento (31-12-2000)"
        onChangeText={setDataNascimento}
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
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Confirmar Senha"
          secureTextEntry={!isConfirmPasswordVisible}
          onChangeText={setConfirmPassword}
          placeholderTextColor="#B3B3B3"
        />
        <TouchableOpacity
          style={styles.showButton}
          onPress={() => setConfirmPasswordVisible(!isConfirmPasswordVisible)}
        >
          <Text style={styles.showButtonText}>
            {isConfirmPasswordVisible ? "Ocultar" : "Mostrar"}
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>Já tem uma conta? Faça Login</Text>
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
    fontSize: 28,
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
