import { View, Text, Modal } from "react-native";
import React from "react";

const ChangePasswordDialog = () => {
  return (
    <Modal transparent visible animationType="fade" onRequestClose={() => {}}>
      <View>
        <Text>ChangePasswordDialog</Text>
      </View>
    </Modal>
  );
};

export default ChangePasswordDialog;