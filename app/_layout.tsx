import { useEffect } from "react";
import { useFonts } from "expo-font";
import { Slot, SplashScreen, Stack } from "expo-router";
import TimerProvider from "@/context/TimerContext";

//this will prevent splash screen from auto hiding until loading all the fonts assets
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // return <Slot />;
  const [fontsLoaded, error] = useFonts({
    "Roboto-Mono": require("../assets/fonts/RobotoMono-Regular.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  if (!fontsLoaded) return null;
  if (!fontsLoaded && !error) return null;
  return (
    <TimerProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="meditate/[id]" options={{ headerShown: false }} />
        <Stack.Screen
          name="(modal)/adjust-meditation-duration"
          options={{ headerShown: false, presentation: "modal" }}
        />
      </Stack>
    </TimerProvider>
  );
}
