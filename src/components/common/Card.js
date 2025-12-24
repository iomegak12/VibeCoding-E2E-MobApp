import React from 'react';
import { Card as PaperCard, useTheme } from 'react-native-paper';
import { StyleSheet } from 'react-native';

const Card = ({ children, style, onPress, elevation = 2, ...props }) => {
  const theme = useTheme();

  return (
    <PaperCard
      style={[
        styles.card,
        { 
          backgroundColor: theme.colors.surface,
          elevation: elevation,
        },
        style,
      ]}
      onPress={onPress}
      {...props}
    >
      {children}
    </PaperCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
  },
});

export default Card;
