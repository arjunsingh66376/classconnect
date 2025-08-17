import React from 'react';
import { Text, StyleSheet } from 'react-native';

// parent panel header 
const Header = ({ title }) => (
  <Text style={styles.header}>{title}</Text>
);

const styles = StyleSheet.create({
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2e2e2e'
  }
});

export default Header;
