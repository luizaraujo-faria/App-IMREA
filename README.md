# Template App Com Bluetooth - IMREA

  Projeto base como template para testes e aprendizado com conexão e comunicação com arduino via Bluetooth
  e contem tela de Login simples sem banco de dados e HomePage para conexão com Bluetooth.

  Através da interface de usuário (UI) é possível realizar o envio de sinal para acionar o LED e
  uma mensagem para exibir no display disponível no ESP32.

# Ferramentas Utilizadas

- React-Native - Framework base da aplicação.
- TypeScript - Linguagem base da aplicação.
- Expo-Router - Ferramenta para build e roteamento da aplicação.
- RNBluetoothClassic - Biblioteca para conexão com bluetooth clássico.


# Comandos Uteis

-- buildar --
npx expo prebuild --clean

-- Se mudar configurações nativas no app.json --
eas build --profile development --platform android

-- executar buildado --
npx expo start --dev-client