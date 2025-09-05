import React, { useEffect, useState } from "react";
import { View, SafeAreaView, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';
import RNBluetoothClassic, { BluetoothDevice } from "react-native-bluetooth-classic";

interface DeviceItem {
  label: string;
  value: string;
  device: BluetoothDevice;
};

const HomeScreen = () => {
    
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<BluetoothDevice | null>(null);
  const [message, setMessage] = useState<string>("");
  const [ledState, setLedState] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState<{ label: string; value: string; device: BluetoothDevice }[]>([]);

  // Listar dispositivos emparelhados
  const listDevices = async () => {

    try{
      const paired: BluetoothDevice[] = await RNBluetoothClassic.getBondedDevices(); // Lista todos os dispositivos pareados.
      setDevices(paired);
      Alert.alert("Dispositivos encontrados", paired.map(d => d.name).join(', '));
    }
    catch(err: any){
      console.error(`Falha ao listar dispositivos!`, err.message);
      Alert.alert('Falha ao listar dispositivos', err.message);
    }
  };

  // Conectar-se com o dispositivo
  const connectDevice = async (device: BluetoothDevice) => {

    try{

      const connected: boolean = await device.connect();

      if(connected){

        setConnectedDevice(device);
        Alert.alert('Conectado', `Conectado a ${device.name}`);

        // Receber dados do dispositivo
        device.onDataReceived((data: { data: string }) => {
          console.log('Recebido:', data);
          Alert.alert('Recebido do ESP32', data.data);
        });
      }
    }
    catch(err: any){
      console.log('Erro ao conectar!', err.message)
      Alert.alert('Erro ao conectar!', err.message);
    }
  };

  // Desconectar-se do dispositivo
  const disconnectDevice = async (device: BluetoothDevice) => {
    if(!connectedDevice){ return Alert.alert('Erro!', 'Nenhum dispositivo conectado.'); }

    try{
      device.disconnect();
      setConnectedDevice(null);

      console.log(`Dispositivo conectado: ${connectedDevice}`)
    }
    catch(err: any){
      console.log('Falha ao se desconectar!', err.message);
      Alert.alert('Falha ao se desconectar!', err.message);
    }
  };

  // Enviar comando LED
  const toggleLED = async (state: boolean) => {
    if(!connectedDevice) return Alert.alert('Erro', 'Nenhum dispositivo conectado');

    try{
      const command = state ? '1\n' : '0\n';
      await connectedDevice.write(command); // Envia os dados para o arduino

      setLedState(state);

      console.log(`Comando enviado: ${command}`)
      Alert.alert('Comando enviado', state ? 'LED ligado!' : 'LED desligado!');
    } 
    catch(err: any){
      Alert.alert('Erro ao enviar', err.message);
    }
  };

  // Enviar mensagem para o display
  const sendDisplayMessage = async (text: string) => {

    if(!connectedDevice) return Alert.alert("Erro", "Nenhum dispositivo conectado");
    if(!message.trim()) return Alert.alert('Erro!', 'Escreva uma mensagem antes.');

    try{
      await connectedDevice.write(`display:${text}\n`);
      Alert.alert('Sucesso!', `Mensagem enviada para o display: "${text}".`);
      setMessage('');
    }
    catch(err: any){
      console.log('Falha ao enviar mensagem', err.message);
      Alert.alert('Falha ao enviar mensagem', err.message);
    }
  };

  // Limpar mensagem no display
  const clearDisplayMessage = async () => {

    if(!connectedDevice){ return Alert.alert('Erro!', 'Nenhum dispositivo conectado.') }

    try{
      await connectedDevice?.write(`display:${''}\n`)
      Alert.alert('Sucesso!', 'Display limpo com sucesso.')
    }
    catch(err: any){
      console.error('Falha ao limpar display!', err.message);
      Alert.alert('Falha ao limpar display!', err.message);
    }
  };

  // Atualiza lista de dispositivos dinamicamente
  useEffect(() => {
    const deviceItems = devices.map((device) => ({
      label: device.name || 'Sem nome',
      value: device.address,
      device,
    }));
    setItems(deviceItems);
  }, [devices]);

  // Quando o usuário seleciona um dispositivo
  useEffect(() => {
    if (value && !connectedDevice) {
      const selected = items.find((item) => item.value === value);
      if (selected) {
        connectDevice(selected.device);
      }
    }
  }, [value]);

  const dropdownPlaceholder = connectedDevice ? `Conectado a: ${connectedDevice.name}` : 'Dispositivos';

  return (

    <SafeAreaView style={styles.container}>

      <View style={{ width: '100%' }}>

          <View style={{ alignItems: 'center', justifyContent: 'center' }}>

            <Text style={styles.title}>Controle Bluetooth</Text>

            <Text style={styles.connectedText}>
                {connectedDevice ? `Conectado a ${connectedDevice.name}`: 'Desconectado'}
            </Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={listDevices}> 
            <Text style={styles.buttonText}>Buscar dispositivos</Text>
          </TouchableOpacity>

          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            placeholder={dropdownPlaceholder}
            // disabled={!!connectedDevice} // desabilita dropdown se já conectado
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            labelStyle={styles.dropdownLabel}
            placeholderStyle={styles.dropdownPlaceholder}
            selectedItemContainerStyle={styles.selectedItemContainer}
            selectedItemLabelStyle={styles.selectedItemLabel}
          />

          {/* {devices.map((device) => (

            connectedDevice ? 
            ''
            : <TouchableOpacity key={device.address} style={styles.button} onPress={() => connectDevice(device)}>
              <Text style={styles.buttonText}>Conectar-se a:  {device.name}</Text>
            </TouchableOpacity>
          ))} */}

          {/* Botão de desconectar apenas se houver dispositivo conectado */}
          {connectedDevice && (
            <View style={{ width: "100%", marginTop: 10 }}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => disconnectDevice(connectedDevice)}
              >
                <Text style={styles.buttonText}>
                  Desconectar-se de: {connectedDevice.name}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* <View style={{ width: '100%' }}>
            {devices.map((device) => (
              connectedDevice ? 
                <TouchableOpacity key={device.address} style={styles.button} onPress={() => disconectDevice(device)}>
                  <Text style={styles.buttonText}>Desconectar-se de: {connectedDevice.name}</Text>
                </TouchableOpacity>
                : undefined
            ))}
          </View> */}
      </View>

      <View style={{ width: '100%' }}>

          <View style={styles.messageContainer}>

            {ledState ? 
              <TouchableOpacity style={styles.button} onPress={() => toggleLED(false)}>
                <Text style={styles.buttonText}>Desligar LED</Text>
              </TouchableOpacity>
            : <TouchableOpacity style={styles.button} onPress={() => toggleLED(true)}>
                <Text style={styles.buttonText}>Ligar LED</Text>
              </TouchableOpacity> }
          </View>

          <View style={styles.messageContainer}>

            <TextInput
              style={styles.input}
              placeholder="Digite sua mensagem"
              placeholderTextColor="#666"
              value={message}
              onChangeText={setMessage}
              maxLength={80}/>

            <TouchableOpacity style={styles.button} onPress={() => sendDisplayMessage(message)}>
              <Text style={styles.buttonText}>Enviar Mensagem</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={clearDisplayMessage} style={{ width: '50%', height: 40, backgroundColor: '#ffb54cff', borderRadius: 4, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={styles.buttonText}>Limpar display</Text>
            </TouchableOpacity>
          </View>
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
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
    color: "#008cffff",
    fontWeight: "normal",
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
    backgroundColor: "#ffb54cff",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  dropdown: {
    backgroundColor: "#ffb54c",
    borderWidth: 0,
    borderRadius: 4,
    height: 50,
  },
  dropdownContainer: {
    backgroundColor: "#f5f5f5",
    borderWidth: 0,
    borderRadius: 4,
  },
  dropdownLabel: {
    fontSize: 18,
    color: "#ffffff",
  },
  dropdownPlaceholder: {
    fontSize: 18,
    color: "#ffffff",
  },
  selectedItemContainer: {
    backgroundColor: "#a7a7a7",
  },
  selectedItemLabel: {
    fontWeight: "bold",
    color: "#ffffff",
  },
});

export default HomeScreen;