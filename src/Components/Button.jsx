import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

//  parent panel button 
const Button = ({ text, onPress, style }) => (
  <TouchableOpacity style={[styles.btn, style]} onPress={onPress}>
    <Text style={styles.btnText}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  btn: {
    backgroundColor: "#1976d2",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 8,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold"
  }
});
export default Button;
