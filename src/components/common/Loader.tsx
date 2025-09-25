import { useTheme } from '../../hooks/useTheme';
import { AppSizes } from '../../utils/AppSizes';
import LottieView from 'lottie-react-native';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

const Loader = () => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../../assets/Loader/Loader.json')}
        autoPlay
        loop
        style={{ width: 100, height: 100 }}
      />
      {/* <ActivityIndicator size={'large'} color={theme.colors.secondary}/> */}
      <Text
        style={{
          marginTop: 12,
          fontSize: AppSizes.Font_20,
          fontWeight: 'bold',
          color: theme.colors.secondary,
        }}
      >
        Loading App Data
      </Text>
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
