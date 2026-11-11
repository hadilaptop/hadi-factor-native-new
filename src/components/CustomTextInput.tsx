import React, { useState } from 'react';
import { TextInput, TextInputProps, StyleSheet } from 'react-native';

interface CustomTextInputProps extends TextInputProps {
  disableFocusStyle?: boolean; 
}

export default function CustomTextInput({ 
  style, 
  onFocus, 
  onBlur, 
  disableFocusStyle = false, 
  ...props 
}: CustomTextInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  // تشخیص خودکار فیلدهای عددی بر اساس نوع کیبورد
  const isNumeric = props.keyboardType === 'numeric' || props.keyboardType === 'phone-pad';

  return (
    <TextInput
      selectionColor={disableFocusStyle ? undefined : "rgba(255, 255, 255, 0.7)"} 
      cursorColor={disableFocusStyle ? "#0f4c75" : "#ffffff"} 
      
      onFocus={(e) => {
        setIsFocused(true);
        if (onFocus) onFocus(e);
      }}
      onBlur={(e) => {
        setIsFocused(false);
        if (onBlur) onBlur(e);
      }}
      
      scrollEnabled={props.multiline ? false : undefined} 
      
      {...props}
      
      style={[
        styles.defaultFont,
        style,
        (isFocused && !disableFocusStyle) && styles.inputFocused, 
        { 
          // ✨ ترفند اصلی: اگر کیبورد عددی بود، متن چپ‌چین می‌شود تا کرسر پرش نکند
          // در غیر این صورت (برای نام مشتری و آدرس) همان راست‌چین باقی می‌ماند
          textAlign: isNumeric ? 'left' : 'right',
        }
      ]}
    />
  );
}

const styles = StyleSheet.create({
  defaultFont: {
    fontFamily: 'Vazirmatn', // استفاده از نسخه FD فونت باعث می‌شود تمام اعداد انگلیسی در ظاهر فارسی دیده شوند
  },
  inputFocused: {
    borderColor: "#ffffff",
    backgroundColor: "rgba(20, 58, 123, 0.35)",
  },
});