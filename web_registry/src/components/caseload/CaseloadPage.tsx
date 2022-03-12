import { FormControl, MenuItem, Select } from '@mui/material';
import withTheme from '@mui/styles/withTheme';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import React, { FunctionComponent } from 'react';
import { useHistory } from 'react-router-dom';
import { AllClinicCode, ClinicCode } from 'shared/enums';
import CaseloadTable from 'src/components/caseload/CaseloadTable';
import PageLoader from 'src/components/chrome/PageLoader';
import { Page, PageHeaderContainer, PageHeaderTitle } from 'src/components/common/Page';
import { useStores } from 'src/stores/stores';
import styled from 'styled-components';

const TitleSelectContainer = withTheme(
    styled.div({
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        height: 48,
    }),
);

const SelectForm = withTheme(
    styled(FormControl)((props) => ({
        margin: props.theme.spacing(0, 2),
        minWidth: 240,
    })),
);

const SelectInput = withTheme(
    styled(Select)((props) => ({
        ...props.theme.typography.h5,
        '>.MuiSelect-select': {
            minHeight: 'auto',
        },
    })),
);

export const CaseloadPage: FunctionComponent = observer(() => {
    const rootStore = useStores();
    const history = useHistory();

    const onCareManagerSelect = action((event: React.ChangeEvent<{ name?: string; value: string }>) => {
        const careManager = event.target.value;
        if (!!careManager) {
            rootStore.patientsStore.filterCareManager(careManager);
        }
    });

    const onClinicSelect = action((event: React.ChangeEvent<{ name?: string; value: ClinicCode | AllClinicCode }>) => {
        const clinic = event.target.value;
        if (!!clinic) {
            rootStore.patientsStore.filterClinic(clinic);
        }
    });

    const onPatientClick = (recordId: string) => {
        history.push(`/patient/${recordId}`);
    };

    React.useEffect(() => {
        rootStore.patientsStore.load();
    }, []);

    return (
        <Page>
            <PageLoader
                state={rootStore.patientsStore.state}
                name="the registry"
                hasValue={rootStore.patientsStore.patients.length > 0}>
                <PageHeaderContainer>
                    <TitleSelectContainer>
                        <PageHeaderTitle>Caseload for</PageHeaderTitle>
                        <SelectForm>
                            <SelectInput
                                value={rootStore.patientsStore.filteredCareManager}
                                onChange={onCareManagerSelect}
                                inputProps={{
                                    name: 'caremanager',
                                    id: 'caremanager',
                                }}>
                                {rootStore.patientsStore.filterableCareManagers.map((cm) => (
                                    <MenuItem key={cm} value={cm}>
                                        {cm}
                                    </MenuItem>
                                ))}
                            </SelectInput>
                        </SelectForm>
                        <PageHeaderTitle>in</PageHeaderTitle>
                        <SelectForm>
                            <SelectInput
                                value={rootStore.patientsStore.filteredClinic}
                                onChange={onClinicSelect}
                                inputProps={{
                                    name: 'clinic',
                                    id: 'clinic',
                                }}>
                                {rootStore.patientsStore.filterableClinics.map((c) => (
                                    <MenuItem key={c} value={c}>
                                        {c}
                                    </MenuItem>
                                ))}
                            </SelectInput>
                        </SelectForm>
                    </TitleSelectContainer>
                </PageHeaderContainer>
                <CaseloadTable patients={rootStore.patientsStore.filteredPatients} onPatientClick={onPatientClick} />
            </PageLoader>
        </Page>
    );
});

export default CaseloadPage;
