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
        return
      } else if (response.status === 400) {
        alert('Erro: Usuário já cadastrado');
        return
      } else if (response.status === 201) {
        alert('Sucesso: Usuário registrado com sucesso');
        navigation.navigate('Login');
        return
      } else {
        const errorText = await response.text();
        alert(`Erro: ${errorText}`);
        return
      }
    } catch (error) {
      console.error(error);
      alert('Erro: Não foi possível registrar o usuário');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar-se no Spotfake</Text>
      <TextInput style={styles.input} placeholder="Nome" onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="Sobrenome" onChangeText={setSobrenome} />
      <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" autoCapitalize="none" onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Data de Nascimento (AAAA-MM-DD)" onChangeText={setDataNascimento} />
      <TextInput style={styles.input} placeholder="Senha" secureTextEntry onChangeText={setPassword} />
      <TextInput style={styles.input} placeholder="Confirmar Senha" secureTextEntry onChangeText={setConfirmPassword} />
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
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#1DB954',
    borderRadius: 5,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  linkText: {
    color: '#1DB954',
    textAlign: 'center',
  },
});