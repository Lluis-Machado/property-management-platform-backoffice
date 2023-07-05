'use client'

// React imports
import { useCallback } from 'react';

// Libraries imports
import { useRouter } from 'next/navigation';
import { Column as DxColumn, DataGrid, Item, Pager, SearchPanel, Toolbar, MasterDetail } from 'devextreme-react/data-grid';
import { Form, Formik } from 'formik';
import { Input } from 'pg-components';
import GroupItem from '@/components/layoutComponent/GroupItem';

interface Props {
    dataSource: any[];
};

const ContactsPage = ({ dataSource }: Props) => {
    const router = useRouter();

    const handleDouleClick = useCallback(({ data }: any) => {
        router.push(`./contacts/${data.id}/contact`)
    }, [router])

    return (
        <div>
            <DataGrid
                allowColumnResizing
                columnHidingEnabled={false}
                columnMinWidth={100}
                dataSource={dataSource}
                focusedRowEnabled
                keyExpr='id'
                onRowDblClick={handleDouleClick}
                showBorders
                showRowLines
            >
                <SearchPanel
                    searchVisibleColumnsOnly={false}
                    visible
                    width={350}
                />
                <Pager
                    allowedPageSizes='auto'
                    showInfo
                    showNavigationButtons
                    visible
                />

                <Toolbar>
                    <Item name='searchPanel' />
                </Toolbar>

                <DxColumn
                    caption='Fisrt Name'
                    dataField='firstName'
                    dataType='string'
                    hidingPriority={0}
                />
                <DxColumn
                    caption='Last Name'
                    dataField='lastName'
                    dataType='string'
                    hidingPriority={1}
                />
                <DxColumn
                    caption='NIF'
                    dataField='nif'
                    dataType='string'
                    hidingPriority={2}
                />
                <DxColumn
                    caption='Email'
                    dataField='email'
                    dataType='string'
                    hidingPriority={3}
                />
                <MasterDetail
                    enabled={true}
                    component={DetailTemplate}
                />
            </DataGrid>
        </div>
    )
}

const DetailTemplate = (props: any) => {
    const { birthDay, phoneNumber, mobilePhoneNumber, addressLine1, addressLine2, city, state, postalCode, country } = props.data.data;
    return (
        <Formik
            initialValues={{ birthDay, phoneNumber, mobilePhoneNumber, addressLine1, addressLine2, city, state, postalCode, country }}
            onSubmit={() => { }}
        >
            <Form>
                <GroupItem cols={2}>
                    <Input name='addressLine1' label='Address Line 1' readOnly />
                    <Input name='addressLine2' label='Address Line 2' readOnly />
                    <Input name='phoneNumber' label='Phone Number' readOnly />
                    <Input name='mobilePhoneNumber' label='Mobile Phone Number' readOnly />
                    <Input name='birthDay' label='Birth Day' readOnly />
                    <Input name='city' label='City' readOnly />
                    <Input name='state' label='State' readOnly />
                    <Input name='postalCode' label='Postal Code' readOnly />
                    <Input name='country' label='Country' readOnly />
                </GroupItem>
            </Form>
        </Formik>
    )
}

export default ContactsPage