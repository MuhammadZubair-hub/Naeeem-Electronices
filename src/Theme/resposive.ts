
import { Dimensions, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const scale = (size :number) => (width / guidelineBaseWidth) * size;

const verticalScale = (size :number) => (height / guidelineBaseHeight) * size;


const moderateScale = (size : number, factor = 0.5) => size + (scale(size) - size) * factor;

const xdHeight = (xdHeight :number) => {
  const heightPercent = Math.round((xdHeight / 852) * 100);
  return PixelRatio.roundToNearestPixel((height * heightPercent) / 100);
};

const xdWidth = (xdWidth:number) => {
  const widthPercent = Math.round((xdWidth / 392) * 100);
  return PixelRatio.roundToNearestPixel((width * widthPercent) / 100);
};


const isTablet = () => {
  const aspectRatio = height / width;
  return width >= 600 && aspectRatio <= 1.6;
};

export {
  scale,
  verticalScale,
  moderateScale,
  isTablet,
  width as screenWidth,
  height as screenHeight,
  xdHeight,
  xdWidth
};
