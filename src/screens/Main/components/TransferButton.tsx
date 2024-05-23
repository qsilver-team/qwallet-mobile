import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import React from "react";
import { Box, Button, Pressable, Text, VStack } from "native-base";
import { useColors } from "@app/context/ColorContex";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

interface Iprops extends TouchableOpacityProps {
  icon: IconProp;
  title: string;
  toggleModal?: () => void;
  bgColor?: string;
}

const TransferButton: React.FC<Iprops> = ({
  icon,
  title,
  toggleModal,
  bgColor,
  ...props
}) => {
  const { main, textColor } = useColors();
  return (
    <TouchableOpacity onPress={toggleModal} {...props}>
      <VStack p={2} space={2} alignItems={"center"}>
        <VStack
          bgColor={bgColor || main.celestialBlue}
          p={2}
          rounded={"full"}
          justifyItems={"center"}
          justifyContent={"center"}
        >
          <FontAwesomeIcon
            icon={icon}
            color="white"
            size={24}
          ></FontAwesomeIcon>
        </VStack>
        {/* <Text color={textColor}>{title}</Text> */}
      </VStack>
    </TouchableOpacity>
  );
};

export default TransferButton;
