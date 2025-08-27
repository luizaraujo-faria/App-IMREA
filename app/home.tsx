import { View, SafeAreaView, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { useState, useEffect } from 'react';
// import { BleManager } from 'react-native-ble-plx';

// const manager = new BleManager();

const HomeScreen = () => {

    const [message, setMessage] = useState('');
    // const [status, setStatus] = useState("Desconectado");

    // const connectToArduino = () => {
    //     setStatus("Procurando dispositivos...");

    //     manager.startDeviceScan(null, null, (error: any, device: any) => {
    //     if (error) {
    //         setStatus("Erro ao escanear: " + error.message);
    //         return;
    //     }

    //     // Filtrar pelo nome que o Arduino anuncia
    //     if (device?.name?.includes("Arduino")) {
    //         setStatus("Conectando a " + device.name);
    //         manager.stopDeviceScan();

    //         device.connect()
    //         .then((d: any) => {
    //             setStatus("Conectado a " + d.name);
    //             return d.discoverAllServicesAndCharacteristics();
    //         })
    //         .catch((err: any) => setStatus("Erro de conexão: " + err.message));
    //     }
    //     });
    // };

    const handleMessage = () => {

        message.trim() === '' ? Alert.alert('Falha!', 'Preencha o campo.')
        : (Alert.alert('Sucesso!', 'Mensagem enviada com sucesso.'), setMessage(''));
    }

    return <SafeAreaView style={styles.container}>

        {/* onPress={connectToArduino} */}
        <TouchableOpacity > 
            <Text style={styles.buttonText}>Bluetooth</Text>
        </TouchableOpacity>

        <View style={styles.messageContainer}>
            <TouchableOpacity style={styles.button} onPress={() => Alert.alert('Sucesso!', 'Sinal para o led enviado.')}>
                <Text style={styles.buttonText}>Botão Led</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.messageContainer}>

            <TextInput
                style={styles.input}
                value={message}
                onChangeText={setMessage}
                placeholder="Mensagem"
                placeholderTextColor="#666"
            />

            <TouchableOpacity style={styles.button} onPress={handleMessage}>
                <Text style={styles.buttonText}>Enviar</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#ffffffff",
    position: "relative",
  },
  messageContainer: {
    width: '80%',
    alignItems: "center",
    justifyContent: "center",
    gap: 16
  },
  bluetoothButton: {
    width: '80%',
    flexDirection: 'row',
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
});

export default HomeScreen;