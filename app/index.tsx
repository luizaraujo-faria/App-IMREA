import { useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, StyleSheet, Alert } from 'react-native';

const SigninScreen = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    

    const handleLogin = () => {

        if(email.trim() === '' && password.trim() === ''){
            return Alert.alert('Falha!', 'Todos os campos devem ser preenchidos.');
        }

        email === 'Admin' && password === 'Admin'
        ? router.push('/home')
        : Alert.alert('Erro!', 'Email e/ou senha incorretos!');
    }

    return <SafeAreaView style={styles.container}>

        <View style={styles.mainBox}>

            <View style={styles.header}>
                <Text style={styles.title}>Login</Text>
                <Text style={styles.subtitle}>Conecte-se à sua conta em nosso aplicativo.</Text>
            </View>

            <View style={styles.inputBox}>
                <TextInput
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    placeholder="Digite seu email"
                    placeholderTextColor="#666"
                />
                <TextInput
                    value={password}
                    onChangeText={setPassword}
                    style={styles.input}
                    placeholder="Digite sua senha"
                    placeholderTextColor="#666"
                    secureTextEntry
                />
            </View>

            <View style={styles.actions}>

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Entrar</Text>
                </TouchableOpacity>

                <View style={styles.signupBox}>
                    <Text style={styles.signupText}>Não possui conta?</Text>
                    <Text style={styles.signupLink}>Cadastrar-se</Text>
                </View>
            </View>
        </View>

        <View style={styles.footer}>
            <Text style={styles.footerText}>©2025 - Rede Lucy Montoro</Text>
        </View>

    </SafeAreaView>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    position: "relative",
  },
  mainBox: {
    width: "80%",
    height: "65%",
    position: "absolute",
    top: "10%",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 12,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  title: {
    fontSize: 56, // text-7xl ~ 56px
    height: 80, // h-[5rem]
    fontWeight: "300",
  },
  subtitle: {
    fontSize: 20, // text-xl
  },
  inputBox: {
    width: "100%",
    gap: 20,
  },
  input: {
    width: "100%",
    height: 56, // h-14
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    padding: 8,
    fontSize: 20,
    color: "#000",
  },
  actions: {
    width: "100%",
    height: 80,
  },
  button: {
    width: "100%",
    height: 40,
    backgroundColor: "#fbbf24", // bg-amber-400
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "300",
  },
  signupBox: {
    marginTop: 40,
  },
  signupText: {
    fontSize: 20,
    fontWeight: "300",
  },
  signupLink: {
    fontSize: 20,
    fontWeight: "300",
    color: "#fbbf24",
  },
  footer: {
    width: "100%",
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
  },
  footerText: {
    fontSize: 16,
    fontWeight: "300",
  },
});

export default SigninScreen;