// rnbt.d.ts
declare module 'react-native-bluetooth-classic' {
  export interface Device {
    name: string;
    address: string;
    bonded: boolean;
    write(data: string): Promise<void>;  // adiciona write
    read(): Promise<string>;  
  }

  export interface BluetoothModule {
    isEnabled(): Promise<boolean>;
    list(): Promise<Device[]>;
    connect(address: string): Promise<Device>;
    write(data: string): Promise<void>;
    // adicione outros métodos que você for usar
  }

  const RNBluetoothClassic: BluetoothModule;
  export default RNBluetoothClassic;
}

-- buildar --

npx expo prebuild --clean

# Se mudar configurações nativas no app.json:
eas build --profile development --platform android

-- executar buildado --
npx expo start --dev-client