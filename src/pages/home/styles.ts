import { Heading, Text, styled } from '@ignite-ui/react';

export const Container = styled('div', {
  // calc: (total width - content space = void space) divided by 2 = between void
  maxWidth: 'calc(100vw - (100vw - 1160px) / 2)',
  marginLeft: 'auto',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  gap: '$20',
});

export const Hero = styled('div', {
  maxWidth: 480,
  padding: '0 $10',

  // Overwrite Heading style when into Hero
  [`> ${Heading}`]: {
    '@media(max-width: 600px)': {
      fontSize: '$6xl',
    },
  },

  // Overwrite Text style when into Hero
  [`> ${Text}`]: {
    maskType: '$2',
    color: '$gray200',
  },
});

// app image
export const Preview = styled('div', {
  paddingRight: '$8',
  overflow: 'hidden',

  '@media(max-width: 600px)': {
    display: 'none',
  },
});
