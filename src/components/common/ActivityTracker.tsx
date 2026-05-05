import React, { useRef } from 'react';
import { View, PanResponder, ViewProps } from 'react-native';

interface ActivityTrackerProps extends ViewProps {
  children: React.ReactNode;
  onActivity?: () => void;
}

export const ActivityTracker: React.FC<ActivityTrackerProps> = ({
  children,
  style,
  onActivity,
  ...props
}) => {
  // Stable ref so PanResponder is created once but always calls the latest callback
  const onActivityRef = useRef(onActivity);
  onActivityRef.current = onActivity;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: () => {
        onActivityRef.current?.();
        return false;
      },
      onMoveShouldSetPanResponderCapture: () => {
        onActivityRef.current?.();
        return false;
      },
    }),
  );

  return (
    <View style={style} {...panResponder.current.panHandlers} {...props}>
      {children}
    </View>
  );
};
