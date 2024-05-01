import React, { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import {
  Box,
  Checkbox,
  HStack,
  Link,
  ScrollView,
  Text,
  VStack,
} from "native-base";
import { useColors } from "../../../context/ColorContex";
import Input from "../../../components/UI/Input";
import ButtonBox from "../../../components/UI/ButtonBox";
import PageButton from "../../../components/UI/PageButton";
import eventEmitter from "../../../api/eventEmitter";
import { setSeeds } from "../../../redux/appSlice";
import { useDispatch } from "react-redux";
import { create } from "../../../api/api";
import { checkPasswordStrength, getPasswordStrengthProps } from "../../../utils/utils";

const CreatePassword: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { bgColor, textColor, gray, main } = useColors();
  const [checkAgreement, setCheckAgreement] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState(true);
  const [seedType, setSeedType] = useState<"24words" | "55chars">("24words");
  const [creatingStatus, setCreatingStatus] = useState(false);
  const [lengthError, setLengthError] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<{
    label: string;
    color: string;
  }>(getPasswordStrengthProps(0));

  const handlePassword = (text: string) => {
    setPassword(text);
    setPasswordStrength(getPasswordStrengthProps(checkPasswordStrength(text)));
  };

  const handleCreate = () => {
    setCreatingStatus(true);
    let passwordPrefix = "";
    if (seedType == "55chars") passwordPrefix = "Q";
    create(`login ${passwordPrefix}${password}`);
  };

  useEffect(() => {
    eventEmitter.on("S2C/create", (res) => {
      if (res.data?.value) {
        if (res.data.value.result >= 0) {
          Toast.show({ type: "success", text1: "Create Wallet Successly!" });
          const seeds = res.data.value.display.split(" ");
          if (seeds.length == 1) {
            dispatch(setSeeds(seeds[0]));
          } else {
            dispatch(setSeeds(seeds));
          }
          navigation.navigate("Reminder");
          setCreatingStatus(false);
        } else {
          Toast.show({ type: "error", text1: res.data.value.display });
        }
      } else {
        setPasswordStatus(true);
        Toast.show({ type: "error", text1: res.error });
      }
    });
  }, []);

  return (
    <VStack
      flex={1}
      justifyItems="center"
      justifyContent="end"
      space={5}
      bgColor={bgColor}
      color={textColor}
    >
      <ScrollView>
        <VStack space={5} pt={10}>
          <Text fontSize={"2xl"} color={main.jeansBlue} textAlign={"center"}>
            Create Password
          </Text>
          <Text textAlign={"center"} px={16}>
            This password will unlock your Metamask wallet only on this service
          </Text>
        </VStack>
        <VStack flex={1} pt={28} justifyItems="center" py={40} space={5}>
          <Box textAlign={"center"} px={10}>
            <Input
              onChangeText={handlePassword}
              w={"full"}
              type="password"
              placeholder="New Password"
            ></Input>
            <Box p={3}>
              <Text px={2} color={lengthError ? "red.500" : gray.gray40}>
                Must be at least 8 characters
              </Text>
              <Text px={2} color={passwordStrength.color}>
                Password Strength : {passwordStrength.label}
              </Text>
            </Box>
          </Box>
          <Box textAlign={"center"} px={10}>
            <Input
              onChangeText={(text) => setConfirmPassword(text)}
              w={"full"}
              type="password"
              placeholder="Confirm Password"
            ></Input>
            {password !== confirmPassword && (
              <Text px={6} color={"red.400"}>
                Password does not match.
              </Text>
            )}
          </Box>
          <HStack px={10}>
            <Checkbox
              value={"CheckAgreement"}
              onChange={(isSelected) => setCheckAgreement(!checkAgreement)}
              mx={2}
              size={"lg"}
              color={textColor}
            >
              <Text>
                I understand that DeGe cannot recover this password for me.
                <Link
                  href="#"
                  _text={{
                    color: main.celestialBlue,
                    textDecoration: "none",
                  }}
                  display={"inline"}
                  colorScheme={"blue"}
                >
                  Learn more
                </Link>
              </Text>
            </Checkbox>
          </HStack>
        </VStack>
      </ScrollView>
      <ButtonBox>
        <PageButton
          title="Create Password"
          type="primary"
          isDisabled={
            password == "" ||
            password !== confirmPassword ||
            passwordStrength.label == "Bad" ||
            passwordStrength.label == "Not Available" ||
            checkAgreement == false
          }
          onPress={() => {
            handleCreate();
          }}
        ></PageButton>
      </ButtonBox>
    </VStack>
  );
};

export default CreatePassword;
