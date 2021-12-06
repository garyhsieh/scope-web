import { ButtonBase, Card, CardContent, CardMedia, Typography, withTheme } from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

const CardButton = withTheme(
    styled(ButtonBase)((props) => ({
        width: '100%',
        marginBottom: props.theme.spacing(3),
    }))
);

const CardContainer = withTheme(
    styled(Card)((props) => ({
        display: 'flex',
        flexGrow: 1,
        width: '100%',
        backgroundColor: props.theme.customPalette.panel,
        borderRadius: props.theme.spacing(1),
        [props.theme.breakpoints.up('phone')]: {
            flexDirection: 'column',
        },
        [props.theme.breakpoints.up('tablet')]: {
            flexDirection: 'row',
        },
        [props.theme.breakpoints.up('laptop')]: {
            flexDirection: 'row',
        },
    }))
);

const CardMediaContainer = withTheme(
    styled(CardMedia)((props) => ({
        [props.theme.breakpoints.up('phone')]: {
            height: props.theme.spacing(16),
        },
        [props.theme.breakpoints.up('tablet')]: {
            width: props.theme.spacing(16),
        },
        [props.theme.breakpoints.up('laptop')]: {
            width: props.theme.spacing(16),
        },
    }))
);

const CardContentContainer = styled(CardContent)({
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
});

export interface IListCardProps {
    title: string;
    subtitle?: string;
    imageUrl: string;
}

export const ListCard: FunctionComponent<IListCardProps> = (props) => {
    const { title, subtitle, imageUrl } = props;

    return (
        <CardButton focusRipple>
            <CardContainer>
                <CardMediaContainer image={imageUrl} title={title} />
                <CardContentContainer>
                    <Typography component="h5" variant="h5">
                        {title}
                    </Typography>
                    {subtitle && (
                        <Typography variant="subtitle1" color="textSecondary">
                            {subtitle}
                        </Typography>
                    )}
                </CardContentContainer>
            </CardContainer>
        </CardButton>
    );
};

export default ListCard;