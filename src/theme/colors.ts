import '@rneui/themed';

type ColorType = {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
};

type ColorTypeOpacity = {
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
    7: string;
    8: string;
    9: string;
    10: string;
};

declare module '@rneui/themed' {
    export interface Colors {
        transparent: string;
        bgMain: string;
        primaryGradient: Array<string>;
        teal: ColorType;
        cyan: ColorType;
        red: ColorType;
        main: ColorType;
        blue: ColorType;
        pink: ColorType;
        green: ColorType;
        slate: ColorType;
        black_: ColorTypeOpacity;
        white_: ColorTypeOpacity & {
            grey1: string;
        };
        grey_: ColorType & {
            1: string;
        };
    }
}

export const lightColors = {
    transparent: 'transparent',
    primaryGradient: ['rgba(255, 178, 0, 1)', 'rgba(255, 185, 53, 1)'],
    bgMain: '#f6f6f6',
    main: {
        50: '#fff8e1',
        100: '#ffecb3',
        200: '#ffe082',
        300: '#ffd54f',
        400: '#ffca28',
        500: '#ffc107',
        600: '#ffb300',
        700: '#ffa000',
        800: '#ff8f00',
        900: '#ff6f00',
    },
    teal: {
        50: '#e0f2f1',
        100: '#b2dfdb',
        200: '#80cbc4',
        300: '#4db6ac',
        400: '#26a69a',
        500: '#009688',
        600: '#00897b',
        700: '#00796b',
        800: '#00695c',
        900: '#004d40',
    },

    cyan: {
        50: '#e0f7fa',
        100: '#b2ebf2',
        200: '#80deea',
        300: '#4dd0e1',
        400: '#26c6da',
        500: '#00bcd4',
        600: '#00acc1',
        700: '#0097a7',
        800: '#00838f',
        900: '#006064',
    },

    red: {
        50: '#ffebee',
        100: '#ffcdd2',
        200: '#ef9a9a',
        300: '#e57373',
        400: '#ef5350',
        500: '#f44336',
        600: '#e53935',
        700: '#d32f2f',
        800: '#c62828',
        900: '#b71c1c',
    },

    blue: {
        50: '#e3f2fd',
        100: '#bbdefb',
        200: '#90caf9',
        300: '#64b5f6',
        400: '#42a5f5',
        500: '#2196f3',
        600: '#1e88e5',
        700: '#1976d2',
        800: '#1565c0',
        900: '#0d47a1',
    },

    green: {
        50: '#e8f5e9',
        100: '#c8e6c9',
        200: '#a5d6a7',
        300: '#81c784',
        400: '#66bb6a',
        500: '#4caf50',
        600: '#43a047',
        700: '#388e3c',
        800: '#2e7d32',
        900: '#1b5e20',
    },

    pink: {
        50: '#fce4ec',
        100: '#f8bbd0',
        200: '#f48fb1',
        300: '#f06292',
        400: '#ec407a',
        500: '#e91e63',
        600: '#d81b60',
        700: '#c2185b',
        800: '#ad1457',
        900: '#880e4f',
    },

    slate: {
        50: '#eceff1',
        100: '#cfd8dc',
        200: '#b0bec5',
        300: '#90a4ae',
        400: '#78909c',
        500: '#607d8b',
        600: '#546e7a',
        700: '#455a64',
        800: '#37474f',
        900: '#263238',
    },

    grey_: {
        50: '#fafafa',
        100: '#f5f5f5',
        200: '#eeeeee',
        300: '#e0e0e0',
        400: '#bdbdbd',
        500: '#9e9e9e',
        600: '#757575',
        700: '#616161',
        800: '#424242',
        900: '#212121',
        // transparent
        1: 'rgba(158, 158, 158, 0.1)',
    },

    //black
    black_: {
        1: 'rgba(0, 0, 0, 0.1)',
        2: 'rgba(0, 0, 0, 0.2)',
        3: 'rgba(0, 0, 0, 0.3)',
        4: 'rgba(0, 0, 0, 0.4)',
        5: 'rgba(0, 0, 0, 0.5)',
        6: 'rgba(0, 0, 0, 0.6)',
        7: 'rgba(0, 0, 0, 0.7)',
        8: 'rgba(0, 0, 0, 0.8)',
        9: 'rgba(0, 0, 0, 0.9)',
        10: 'rgba(0, 0, 0, 1)',
    },
    white_: {
        1: 'rgba(255, 255, 255, 0.1)',
        2: 'rgba(255, 255, 255, 0.2)',
        3: 'rgba(255, 255, 255, 0.3)',
        4: 'rgba(255, 255, 255, 0.4)',
        5: 'rgba(255, 255, 255, 0.5)',
        6: 'rgba(255, 255, 255, 0.6)',
        7: 'rgba(255, 255, 255, 0.7)',
        8: 'rgba(255, 255, 255, 0.8)',
        9: 'rgba(255, 255, 255, 0.9)',
        10: 'rgba(255, 255, 255, 1)',
        grey1: 'rgba(253, 253, 253, 1)',
    },
};
