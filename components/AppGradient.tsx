import { SafeAreaView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface AppGradientProps {
  children: any;
  colors: string[];
}

const AppGradient = ({ children, colors }: AppGradientProps) => {
  return (
    <LinearGradient colors={colors} className="flex-1">
      <SafeAreaView className="flex flex-1 mx-5 my-3">{children}</SafeAreaView>
    </LinearGradient>
  );
};

export default AppGradient;
