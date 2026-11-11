import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Animated, Dimensions, ScrollViewProps } from 'react-native';

const { width } = Dimensions.get('window');

export interface AnimatedScrollWrapperRef {
  close: (callback?: () => void) => void;
}

interface AnimatedScrollProps extends ScrollViewProps {
  children: React.ReactNode;
  delay?: number; 
}

const AnimatedScrollWrapper = forwardRef<AnimatedScrollWrapperRef, AnimatedScrollProps>(
  ({ children, delay = 0, contentContainerStyle, style, ...rest }, ref) => {
    const slideAnim = useRef(new Animated.Value(width)).current;

    useEffect(() => {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        delay: delay,
        useNativeDriver: true,
      }).start();
    }, [slideAnim, delay]);

    useImperativeHandle(ref, () => ({
      close: (callback) => {
        Animated.timing(slideAnim, {
          toValue: width,
          duration: 250,
          useNativeDriver: true,
        }).start(() => {
          if (callback) callback();
        });
      }
    }));

    return (
      <Animated.ScrollView
        style={[
          style,
          { transform: [{ translateX: slideAnim }] }
        ]}
        contentContainerStyle={contentContainerStyle}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
        
        {...rest}
      >
        {children}
      </Animated.ScrollView>
    );
  }
);

export default AnimatedScrollWrapper;