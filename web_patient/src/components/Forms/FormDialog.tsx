import {
    AppBar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    MobileStepper,
    Slide,
    Snackbar,
    Toolbar,
    Typography,
    withTheme,
} from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import CloseIcon from '@material-ui/icons/Close';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import { Alert } from '@material-ui/lab';
import { action, runInAction } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react';
import React, { FunctionComponent } from 'react';
import { useHistory } from 'react-router';
import { getString } from 'src/services/strings';
import styled from 'styled-components';

export interface IFormPage {
    content: React.ReactElement;
    canGoNext?: boolean;
}

export interface IFormDialogProps {
    isOpen: boolean;
    title: string;
    canClose?: boolean;
    onClose?: () => void;
    onSubmit?: () => Promise<boolean>;
    onNext?: (prev: number, next: number) => void;
    pages: IFormPage[];
    submitToast?: string;
}

const ContentContainer = styled.div({
    marginTop: 56,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    overflow: 'hidden',
});

const PageContent = withTheme(
    styled.div((props) => ({
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: props.theme.spacing(2),
        [props.theme.breakpoints.up('phone')]: {
            padding: props.theme.spacing(2),
        },
        [props.theme.breakpoints.up('tablet')]: {
            padding: props.theme.spacing(4),
        },
        [props.theme.breakpoints.up('laptop')]: {
            padding: props.theme.spacing(8),
        },
    }))
);

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const FormDialog: FunctionComponent<IFormDialogProps> = observer((props) => {
    const { isOpen, title, pages, canClose, onClose, onSubmit, onNext, submitToast } = props;
    const history = useHistory();

    const state = useLocalObservable<{
        closeConfirmOpen: boolean;
        activePage: number;
        submitErrorOpen: boolean;
        submitSuccessOpen: boolean;
    }>(() => ({
        closeConfirmOpen: false,
        activePage: 0,
        submitErrorOpen: false,
        submitSuccessOpen: false,
    }));

    const forceClose = action(() => {
        state.closeConfirmOpen = false;
        onClose && onClose();

        history.goBack();
    });

    const closeAction = action(() => {
        if (!!canClose) {
            forceClose();
        } else {
            state.closeConfirmOpen = true;
        }
    });

    const dismissConfirmClose = action(() => {
        state.closeConfirmOpen = false;
    });

    const maxPages = pages.length;
    const setActivePage = action((index: number) => {
        state.activePage = index;
    });

    const handleNext = action(async () => {
        if (state.activePage == maxPages - 1) {
            state.submitErrorOpen = false;
            if (onSubmit) {
                const success = await onSubmit();

                runInAction(() => {
                    if (success) {
                        state.submitSuccessOpen = true;
                    } else {
                        state.submitErrorOpen = true;
                    }
                });
            } else {
                forceClose();
            }
        }

        const nextPage = Math.min(maxPages - 1, state.activePage + 1);

        if (!!onNext) {
            onNext(state.activePage, nextPage);
        }

        setActivePage(nextPage);
    });

    const handleBack = action(() => {
        setActivePage(Math.max(0, state.activePage - 1));
    });

    const handleSubmitSuccessClose = action(() => {
        state.submitSuccessOpen = false;
        forceClose();
    });

    return (
        <Dialog fullScreen open={isOpen} onClose={closeAction} TransitionComponent={Transition}>
            <AppBar>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={closeAction} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6">{title}</Typography>
                </Toolbar>
            </AppBar>
            <ContentContainer>
                <PageContent>{pages[state.activePage].content}</PageContent>
                <MobileStepper
                    steps={maxPages}
                    position="static"
                    variant="text"
                    activeStep={state.activePage}
                    nextButton={
                        <Button onClick={handleNext} disabled={!pages[state.activePage].canGoNext}>
                            {state.activePage === maxPages - 1
                                ? getString('Form_button_submit')
                                : getString('Form_button_next')}
                            <KeyboardArrowRight />
                        </Button>
                    }
                    backButton={
                        <Button onClick={handleBack} disabled={state.activePage === 0}>
                            {<KeyboardArrowLeft />}
                            {getString('Form_button_back')}
                        </Button>
                    }
                />
            </ContentContainer>
            <Dialog open={state.closeConfirmOpen}>
                <DialogContent>
                    <DialogContentText>{getString('Form_confirm_close')}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={() => forceClose()}>
                        {getString('Form_button_yes')}
                    </Button>
                    <Button color="primary" autoFocus onClick={dismissConfirmClose}>
                        {getString('Form_button_no')}
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={state.submitErrorOpen}>
                <Alert
                    severity="error"
                    action={
                        <Button color="primary" size="small" onClick={handleNext}>
                            {getString('Form_submit_error_retry')}
                        </Button>
                    }>
                    {getString('Form_submit_error_message')}
                </Alert>
            </Snackbar>
            {submitToast && (
                <Dialog open={state.submitSuccessOpen} onClose={handleSubmitSuccessClose}>
                    <DialogTitle>{getString('Form_submit_thankyou')}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>{submitToast}</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" onClick={handleSubmitSuccessClose}>
                            {getString('Form_button_ok')}
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Dialog>
    );
});

export default FormDialog;