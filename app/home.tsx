import React, { useEffect, useState } from "react";
import { View, SafeAreaView, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import RNBluetoothClassic, { BluetoothDevice } from "react-native-bluetooth-classic";

const HomeScreen = () => {
    
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<BluetoothDevice | null>(null);
  const [message, setMessage] = useState<string>("");
  const [status, setStatus] = useState<string>("Desconectado");

  // Listar dispositivos emparelhados
  const listDevices = async () => {

    try{
      const paired: BluetoothDevice[] = await RNBluetoothClassic.getBondedDevices();
      setDevices(paired);
      Alert.alert("Dispositivos encontrados", paired.map(d => d.name).join(", "));
    }
    catch(error: any){
      Alert.alert("Erro", error.message);
    }
  };

  // Conectar com ESP32
  const connectDevice = async (device: BluetoothDevice) => {

    try{

      const connected: boolean = await device.connect();

      if(connected){
        setConnectedDevice(device);
        setStatus(`Conectado a ${device.name}`);
        Alert.alert("Conectado", `Conectado a ${device.name}`);

        // Receber dados do ESP32
        device.onDataReceived((data: { data: string }) => {
          console.log("Recebido:", data);
          Alert.alert("Recebido do ESP32", data.data);
        });
      }
    }
    catch(error: any){
      console.log('Erro ao conectar!', error.message)
      Alert.alert("Erro ao conectar!", error.message);
    }
  };

  // Enviar comando LED
  const toggleLED = async () => {
    if(!connectedDevice) return Alert.alert("Erro", "Nenhum dispositivo conectado");

    try{
      await connectedDevice.write("LED"); // ESP32 deve interpretar "LED"
      Alert.alert("Comando enviado", "LED acionado!");
    } 
    catch(error: any){
      Alert.alert("Erro ao enviar", error.message);
    }
  };

  // Enviar mensagem personalizada
  const sendMessage = async () => {

    if(!connectedDevice) return Alert.alert("Erro", "Nenhum dispositivo conectado");

    try{
      await connectedDevice.write(message);
      Alert.alert("Mensagem enviada", message);
      setMessage("");
    }
    catch(error: any){
      Alert.alert("Erro ao enviar", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Controle Bluetooth com Expo</Text>
      
      <Text style={styles.status}>Status: {status}</Text>

      <TouchableOpacity style={styles.button} onPress={listDevices}> 
        <Text style={styles.buttonText}>Procurar ESP32</Text>
      </TouchableOpacity>

      {devices.map((device) => (
        <TouchableOpacity key={device.address} style={styles.button} onPress={() => connectDevice(device)}>
          <Text style={styles.buttonText}>Conectar: {device.name}</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.connectedText}>
        Conectado: {connectedDevice ? connectedDevice.name : "Nenhum"}
      </Text>

      <View style={styles.messageContainer}>
        <TouchableOpacity style={styles.ledButton} onPress={toggleLED}>
          <Text style={styles.buttonText}>Acionar LED</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.messageContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite sua mensagem"
          placeholderTextColor="#666"
          value={message}
          onChangeText={setMessage}
        />

        <TouchableOpacity style={styles.button} onPress={sendMessage}>
          <Text style={styles.buttonText}>Enviar Mensagem</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.note}>
        Nota: Para Bluetooth Clássico, o app precisa estar rodando instalado no dispositivo (não funciona no Expo Go).
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  status: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  connectedText: {
    fontSize: 18,
    color: "green",
    fontWeight: "bold",
    marginBottom: 20,
  },
  messageContainer: {
    width: '100%',
    alignItems: "center",
    gap: 16,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    padding: 8,
    fontSize: 20,
    color: "#000",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginBottom: 10,
  },
  ledButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#FF9500",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  note: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic",
  }
});

export default HomeScreen;


// import { View, SafeAreaView, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

// const HomeScreen = () => {

//     return (
//         <SafeAreaView style={styles.container}>
            
//             <Text style={styles.title}>Controle Bluetooth com Expo</Text>
            
//             <Text style={styles.status}>
//                 Bluetooth: 
//             </Text>

//             <TouchableOpacity style={styles.button}> 
//                 <Text style={styles.buttonText}>Procurar ESP32</Text>
//             </TouchableOpacity>


//                     <Text style={styles.connectedText}>
//                         Conectado: 
//                     </Text>

//                     <View style={styles.messageContainer}>
//                         <TouchableOpacity style={styles.ledButton}>
//                             <Text style={styles.buttonText}>Acionar LED</Text>
//                         </TouchableOpacity>
//                     </View>

//                     <View style={styles.messageContainer}>
//                         <TextInput
//                             style={styles.input}
//                             placeholder="Digite sua mensagem"
//                             placeholderTextColor="#666"
//                         />

//                         <TouchableOpacity style={styles.button}>
//                             <Text style={styles.buttonText}>Enviar Mensagem</Text>
//                         </TouchableOpacity>
//                     </View>

//             <Text style={styles.note}>
//                 Nota: Expo tem limitações para comunicação serial Bluetooth. Para funcionalidade completa, considere usar EAS Build.
//             </Text>

//         </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         alignItems: "center",
//         justifyContent: "center",
//         backgroundColor: "#ffffff",
//         padding: 20,
//     },
//     title: {
//         fontSize: 24,
//         fontWeight: "bold",
//         marginBottom: 20,
//         color: "#333",
//     },
//     status: {
//         fontSize: 16,
//         color: "#666",
//         marginBottom: 20,
//     },
//     connectedText: {
//         fontSize: 18,
//         color: "green",
//         fontWeight: "bold",
//         marginBottom: 20,
//     },
//     messageContainer: {
//         width: '100%',
//         alignItems: "center",
//         gap: 16,
//         marginBottom: 20,
//     },
//     input: {
//         width: "100%",
//         height: 56,
//         borderBottomWidth: 1,
//         borderBottomColor: "#000",
//         padding: 8,
//         fontSize: 20,
//         color: "#000",
//     },
//     button: {
//         width: "100%",
//         height: 50,
//         backgroundColor: "#007AFF",
//         alignItems: "center",
//         justifyContent: "center",
//         borderRadius: 8,
//         marginBottom: 10,
//     },
//     ledButton: {
//         width: "100%",
//         height: 50,
//         backgroundColor: "#FF9500",
//         alignItems: "center",
//         justifyContent: "center",
//         borderRadius: 8,
//         marginBottom: 10,
//     },
//     buttonText: {
//         fontSize: 18,
//         fontWeight: "600",
//         color: "white",
//     },
//     note: {
//         fontSize: 12,
//         color: "#666",
//         textAlign: "center",
//         marginTop: 20,
//         fontStyle: "italic",
//     }
// });

// export default HomeScreen;