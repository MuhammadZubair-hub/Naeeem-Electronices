import React from 'react';
import{ MaterialIcons }from "@react-native-vector-icons/material-icons";
import {Ionicons} from "@react-native-vector-icons/ionicons"
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import Entypo from 'react-native-vector-icons/Entypo';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import Feather from 'react-native-vector-icons/Feather';
// import Octicons from 'react-native-vector-icons/Octicons';
// import EvilIcons from 'react-native-vector-icons/EvilIcons';
// import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
// import Foundation from 'react-native-vector-icons/Foundation';
// import Zocial from 'react-native-vector-icons/Zocial';


const iconTypes = {
  MaterialIcons,
  Ionicons,
  
//   MaterialCommunityIcons,
//   FontAwesome,
//   FontAwesome5,
//   Ionicons,
//   Entypo,
//   AntDesign,
//   Feather,
//   Octicons,
//   EvilIcons,
//   SimpleLineIcons,
//   Foundation,
//   Zocial,
};

interface IconProps {
  type: keyof typeof iconTypes;
  name: any;
  size?: number;
  color: string;
  onPress?: () => void;
  iconType?: 'solid' | 'regular' | 'light' | 'thin' | 'duotone' | 'brands'; // for FA5/FA6
  [key: string]: any;
}

const Icon = ({
  type = 'MaterialIcons',
  name ,
  size = 24,
  color = '#000',
  onPress,
  iconType,
  ...props
}: IconProps) => {
  const IconComponent = iconTypes[type];

  if (!IconComponent) {
    console.warn(`Icon type "${type}" is not supported.`);
    return null;
  }

  return (
    <IconComponent
      name={name}
      size={size}
      color={color}
      onPress={onPress}
      {...(iconType ? { iconType } : {})}
      {...props}
    />
  );
};

export default Icon;



