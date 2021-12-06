import { amber, teal } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';
import React from 'react';

declare module '@material-ui/core/styles/createMuiTheme' {
    interface Theme {
        customPalette: {
            subtle: React.CSSProperties['color'];
            discrete10: string[];
            panel: React.CSSProperties['color'];
        };
        customSizes: {
            drawerWidth: number;
            contentsMenuWidth: number;
            headerHeight: number;
            footerHeight: number;
        };
    }
    interface ThemeOptions {
        customPalette: {
            subtle: React.CSSProperties['color'];
            discrete10: string[];
            panel: React.CSSProperties['color'];
        };
        customSizes: {
            drawerWidth: number;
            contentsMenuWidth: number;
            headerHeight: number;
            footerHeight: number;
        };
    }
}

declare module '@material-ui/core/styles/createBreakpoints' {
    interface BreakpointOverrides {
        xs: false; // removes the `xs` breakpoint
        sm: false;
        md: false;
        lg: false;
        xl: false;
        phone: true;
        tablet: true;
        laptop: true;
        desktop: true;
    }
}

export default function createAppTheme() {
    return createMuiTheme({
        palette: { type: 'light', primary: teal, secondary: amber },
        customPalette: {
            subtle: '#eeeeee',
            panel: '#ffffffcc',
            discrete10: [
                '#1f77b4',
                '#ff7f0e',
                '#2ca02c',
                '#d62728',
                '#9467bd',
                '#8c564b',
                '#e377c2',
                '#7f7f7f',
                '#bcbd22',
                '#17becf',
            ],
        },
        customSizes: {
            drawerWidth: 240,
            contentsMenuWidth: 240,
            headerHeight: 64,
            footerHeight: 80,
        },
        breakpoints: {
            values: {
                phone: 0,
                tablet: 480,
                laptop: 1024,
                desktop: 1280,
            },
        },
    });
}