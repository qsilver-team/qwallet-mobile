import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Image, VStack, Text, Box } from "native-base";
import { useColors } from "@app/context/ColorContex";
import { getPasswordStrengthProps } from "@app/utils/utils";
import ButtonBox from "@app/components/UI/ButtonBox";
import PageButton from "@app/components/UI/PageButton";
import ReminderBar from "./Components/ReminderBar";
import local from "@app/utils/locales";

interface IProps {}

const Reminder: React.FC<IProps> = () => {
  const navigation = useNavigation();
  const { bgColor, textColor, main, gray } = useColors();
  const [step, setStep] = useState<1 | 2>(1);
  const handleNext = () => {
    if (step == 1) setStep(2);
    else navigation.navigate("SelectSeedType");
  };

  return (
    <VStack
      space={10}
      alignItems="center"
      bgColor={bgColor}
      flex={1}
      justifyContent="end"
      justifyItems="center"
    >
      {step == 1 && (
        <VStack
          space={10}
          alignItems="center"
          flex={1}
          justifyContent="center"
          justifyItems="center"
        >
          <Image
            source={require("@assets/images/02/01.png")}
            style={{ width: 214, height: 220 }}
            resizeMode="contain"
            alt="Splash Image"
          />
          <Box px={12}>
            <Text color={textColor} fontSize={"3xl"} textAlign={"center"}>
              {local.Create.Reminder.Secure}
            </Text>
            <Text color={textColor} textAlign={"center"}>
              {local.Create.Reminder.Caption1}
            </Text>
          </Box>
        </VStack>
      )}
      {step == 2 && (
        <VStack
          space={10}
          alignItems="center"
          flex={1}
          pt={10}
          justifyItems="center"
        >
          <VStack px={12} space={5}>
            <Text color={textColor} fontSize={"3xl"} textAlign={"center"}>
              {local.Create.Reminder.Secure}
            </Text>
            <Text color={gray.gray30} fontSize={"xl"} fontWeight={"bold"}>
              {local.Create.Reminder.Caption2}
            </Text>
            <VStack color={textColor} textAlign={"center"} space={"2"}>
              <Text fontWeight={"bold"} ml={-3}>
                {local.Create.Reminder.Manual}
              </Text>
              <Text>{local.Create.Reminder.Caption3}</Text>
              <Text>
                {local.Create.Reminder.SecurityLevel}:{" "}
                {getPasswordStrengthProps(1).label}
              </Text>
              <ReminderBar strength={1} />

              <VStack space={"2"}>
                <Text fontWeight={"bold"} ml={-3}>
                  {local.Create.Reminder.Risks}:{" "}
                </Text>
                <Text>{local.Create.Reminder.Risk1}</Text>
                <Text>{local.Create.Reminder.Risk2}</Text>
                <Text>{local.Create.Reminder.Risk3}</Text>
              </VStack>
              <VStack space={2}>
                <Text>{local.Create.Reminder.OtherOption}</Text>
                <Text fontWeight={"bold"} ml={-3}>
                  {local.Create.Reminder.Tips}:{" "}
                </Text>
                <Text>{local.Create.Reminder.Tip1}</Text>
                <Text>{local.Create.Reminder.Tip2}</Text>
                <Text>{local.Create.Reminder.Tip3}</Text>
              </VStack>
            </VStack>
          </VStack>
        </VStack>
      )}
      <ButtonBox>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text
            textAlign={"center"}
            fontWeight={"bold"}
            color={main.moonStoneBlue}
          >
            {local.Create.Reminder.RemiderLater}
          </Text>
        </TouchableOpacity>
        <PageButton
          title={
            step == 1
              ? local.Create.Reminder.button_Next
              : step == 2
              ? local.Create.Reminder.button_Start
              : ""
          }
          type="primary"
          onPress={handleNext}
        ></PageButton>
      </ButtonBox>
    </VStack>
  );
};

export default Reminder;
