import { StatusBar, View, ViewStyle } from "react-native"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { ReactNode } from "react";
import { Colors } from "../Theme/Color";



interface BasescreenProp {
  children: ReactNode
  statusBarColor? : string,
  scroable? : boolean,
  containerstyle?: ViewStyle,
  horizontal?:any,
  padding?: number,
  paddingBottom ?: number,
  paddingHorizontal?: number,
  paddingTop ?: number,
  rowGap?: number,
  alignItems?: any,
  backgroundColor? : string,
}

const Basescreen = ({
  children,
  statusBarColor,
  scroable = false,
  containerstyle,
  horizontal,
  padding = 0,
  paddingBottom = 0,
  paddingHorizontal = 0,
  paddingTop = 0,
  rowGap= 0,
  alignItems,
  backgroundColor,
}: BasescreenProp) => {
  

  const inset = useSafeAreaInsets();


  const containerPadding = {
    padding: (padding),
    // paddingBottom: mvs(paddingBottom) + inset.bottom,
     //paddingTop:  inset.top,
    paddingHorizontal: (paddingHorizontal),
    rowGap: (rowGap),
    alignItems : (alignItems)
  };

  if (scroable) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: backgroundColor ? backgroundColor: Colors.white ,overflow:'visible' }} 
        edges={['top']}
      >
        <StatusBar backgroundColor={statusBarColor} barStyle={'dark-content'} ></StatusBar>
        <KeyboardAwareScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          horizontal={horizontal}
          enableAutomaticScroll
          scrollEnabled
          nestedScrollEnabled={true}
          //keyboardShouldPersistTaps="handled"
          style={{ flex: 1 }}
          contentContainerStyle={[
            { flexGrow: 1,  },
            containerstyle,
          ]}
        >
          <View style={{  minHeight: '100%', overflow:'visible',
              justifyContent: 'flex-start',...containerPadding }}>{children}</View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView
        style={[
          { flex: 1, backgroundColor: backgroundColor ? backgroundColor: Colors.white, ...containerPadding },
          containerstyle,
        ]}
        edges={['top']}
      >
        <StatusBar backgroundColor={statusBarColor} barStyle={'light-content'}></StatusBar>
        {children}
      </SafeAreaView>
    );
  }
};

export default Basescreen;