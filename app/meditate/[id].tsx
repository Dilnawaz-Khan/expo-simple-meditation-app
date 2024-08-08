import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { View, Text, ImageBackground, Pressable } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Audio } from "expo-av";

import MEDITATION_IMAGES from "@/constants/meditation-images";
import { MEDITATION_DATA, AUDIO_FILES } from "@/constants/meditation-data";
import AppGradient from "@/components/AppGradient";
import CustomButton from "@/components/CustomButton";
import { Sound } from "expo-av/build/Audio";
import { useTimerContext } from "@/context/TimerContext";

const Meditate = () => {
  const { id } = useLocalSearchParams();
  const { duration: secondsRemaining, setDuration } = useTimerContext();
  // const [secondsRemaining, setSecondsRemaining] = useState(10);
  const [isMeditating, setIsMeditating] = useState(false);
  const [audioSound, setAudioSound] = useState<Audio.Sound>();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    let timerId: NodeJS.Timeout;

    //Exit
    if (secondsRemaining === 0) {
      setIsMeditating(false);
      return;
    }

    if (isMeditating)
      timerId = setTimeout(() => {
        setDuration((prev) => prev - 1);
      }, 1000);

    return () => {
      clearTimeout(timerId);
    };
  }, [secondsRemaining, isMeditating]);

  useEffect(() => {
    return () => {
      setDuration(10);
      audioSound?.unloadAsync();
    };
  }, [audioSound]);

  const toggleMedidationSessionStatus = async () => {
    if (secondsRemaining === 0) setDuration(10);
    setIsMeditating(!isMeditating);
    await toggleSound();
  };

  const toggleSound = async () => {
    const sound = audioSound ? audioSound : await initializeSound();
    const status = await sound?.getStatusAsync();
    if (status.isLoaded && !isPlayingAudio) {
      sound.playAsync();
      setIsPlayingAudio(true);
    } else {
      sound.pauseAsync();
      setIsPlayingAudio(false);
    }
  };

  const initializeSound = async () => {
    const audioFileName = MEDITATION_DATA[Number(id) - 1].audio;

    const { sound } = await Audio.Sound.createAsync(AUDIO_FILES[audioFileName]);
    setAudioSound(sound);
    return sound;
  };

  const handleAdjustDuration = () => {
    if (isMeditating) toggleMedidationSessionStatus();

    router.push("/(modal)/adjust-meditation-duration");
  };

  //format the time left to use two digits are displayed
  const formatedTimeMinutes = String(
    Math.floor(secondsRemaining / 60)
  ).padStart(2, "0");

  const formatedTimeSecond = String(Math.floor(secondsRemaining % 60)).padStart(
    2,
    "0"
  );

  return (
    <View className="flex flex-1">
      <ImageBackground
        source={MEDITATION_IMAGES[Number(id) - 1]}
        resizeMode="cover"
        className="flex flex-1"
      >
        <AppGradient colors={["transparent", "rgba(0, 0, 0, 0.8)"]}>
          <Pressable
            onPress={() => router.back()}
            className="absolute top-16 left-6 z-10 "
          >
            <AntDesign name="leftcircleo" size={50} color="white" />
          </Pressable>
          <View className="flex flex-1 justify-center">
            <View className="mx-auto bg-neutral-200 rounded-full w-44 h-44 justify-center items-center">
              <Text className="text-4xl text-blue-800 font-rmono">
                {formatedTimeMinutes}:{formatedTimeSecond}
              </Text>
            </View>
          </View>
          <View className="mb-5">
            <CustomButton
              title="Adjust Duration"
              onPress={handleAdjustDuration}
            />
            <CustomButton
              title={isMeditating ? "Stop" : "Start Meditation"}
              onPress={toggleMedidationSessionStatus}
              containerStyle="mt-4"
            />
          </View>
        </AppGradient>
      </ImageBackground>
    </View>
  );
};

export default Meditate;
