import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import { View, SafeAreaView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const RootLayout = () => {

    const insets = useSafeAreaInsets();

    return(
        <SafeAreaView 
        style={{
            flex: 1,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
            backgroundColor: "#c7c7c7ff",
        }}>
            
        <StatusBar backgroundColor="#838383ff" translucent={false} />
        <Stack screenOptions={{ animation: "slide_from_right" }}>
            <Stack.Screen name="index" options={{ title: "Sign In" }} />
            <Stack.Screen name="home" options={{ title: "Home" }} />
        </Stack>
        </SafeAreaView>
  );
}

export default RootLayout;