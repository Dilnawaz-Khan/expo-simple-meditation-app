import { useEffect, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  Pressable,
  ScrollView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";

import { GalleryPreviewData } from "@/constants/models/AffirmationsCategory";
import AFFIRMATION_GALLERY from "@/constants/affirmation-gallery";
import AppGradient from "@/components/AppGradient";
import { StatusBar } from "expo-status-bar";

const AffirmationsPractice = () => {
  const { itemId } = useLocalSearchParams();

  const [affirmations, setAffirmations] = useState<GalleryPreviewData>();
  const [sentences, setSentences] = useState<string[]>([]);

  useEffect(() => {
    for (let i = 0; i < AFFIRMATION_GALLERY.length; i++) {
      const affirmationData = AFFIRMATION_GALLERY[i].data;
      const affirmationToStart = affirmationData.find(
        (item) => item.id === Number(itemId)
      );
      if (affirmationToStart) {
        setAffirmations(affirmationToStart);
        const affirmationsArray = affirmationToStart.text.split(".");

        //remove the last element if it's an empty string
        if (affirmationsArray[affirmationsArray.length - 1] === "") {
          affirmationsArray.pop();
        }
        setSentences(affirmationsArray);
        return;
      }
    }
  }, []);
  if (!affirmations) return <Text>No Found Affirmation</Text>;
  return (
    <View className="flex flex-1">
      <ImageBackground
        source={affirmations.image}
        resizeMode="cover"
        className="flex flex-1"
      >
        <AppGradient colors={["rgba(0,0,0,0.3)", "rgba(0, 0, 0,0.9)"]}>
          <Pressable
            onPress={() => router.back()}
            className="absolute top-16 left-6 z-10"
          >
            <AntDesign name="leftcircleo" size={50} color="white" />
          </Pressable>
          <ScrollView className="mt-20" showsVerticalScrollIndicator={false}>
            <View className="h-full justify-center">
              <View className="h-4/5 justify-center">
                {sentences.map((sentence, index) => (
                  <Text
                    key={index}
                    className="text-white text-3xl mb-12 font-bold text-center"
                  >
                    {sentence}.
                  </Text>
                ))}
              </View>
            </View>
          </ScrollView>
        </AppGradient>
        <StatusBar style="light" />
      </ImageBackground>
    </View>
  );
};

export default AffirmationsPractice;
