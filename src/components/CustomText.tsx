import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';

export default function CustomText(props: TextProps) {
  // این کامپوننت تمام ویژگی‌های Text معمولی را می‌گیرد
  // فونت Vazirmatn را به عنوان استایل پایه قرار می‌دهد و استایل‌های جدید شما را روی آن اعمال می‌کند
  return (
    <Text {...props} style={[styles.defaultFont, props.style]}>
      {props.children}
    </Text>
  );
}

const styles = StyleSheet.create({
  defaultFont: {
    fontFamily: 'Vazirmatn', // فونت ثابت برای تمام متن‌های اپلیکیشن
  },
});