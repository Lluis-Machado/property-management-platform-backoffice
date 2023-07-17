'use client'

// React imports
import { memo, useCallback } from 'react';

// Libraries imports
import { useRouter } from 'next/navigation';
import { Column, DataGrid, Item, Pager, SearchPanel, Toolbar, MasterDetail } from 'devextreme-react/data-grid';
import { Form, Formik } from 'formik';
import { Input } from 'pg-components';
import GroupItem from '@/components/layoutComponent/GroupItem';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

interface Props {
    dataSource: any[];
};

const ContactsPage = ({ dataSource }: Props) => {
    const router = useRouter();

    const handleDouleClick = useCallback(({ data }: any) => {
        router.push(`./contacts/${data.id}/contactInfo`)
    }, [router])

    const addRowButton = (): React.ReactElement => {
        return (
            <Link
                href={`/private/contacts/addContact`}
                className='cursor-pointer p-2.5 flex flex-row items-center border rounded-md text-gray-500 border-slate-300
                hover:border-primary-200 hover:text-primary-500 active:border-primary-500 active:text-primary-700'
            >
                <FontAwesomeIcon icon={faPlus} />
            </Link>
        )
    };

    return (
        <DataGrid
            columnMinWidth={100}
            dataSource={dataSource}
            focusedRowEnabled
            keyExpr='id'
            onRowDblClick={handleDouleClick}
            columnHidingEnabled={false}
            rowAlternationEnabled
            allowColumnResizing
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
                <Item render={addRowButton} />
                <Item name='searchPanel' />
            </Toolbar>

            <Column
                caption='Fisrt Name'
                dataField='firstName'
                dataType='string'
                hidingPriority={0}
            />
            <Column
                caption='Last Name'
                dataField='lastName'
                dataType='string'
                hidingPriority={1}
            />
            <Column
                caption='NIF'
                dataField='nif'
                dataType='string'
                hidingPriority={2}
            />
            <Column
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
    )
}

export default memo(ContactsPage);

const DetailTemplate = (props: any) => {
    const { birthDay, phoneNumber, mobilePhoneNumber, address } = props.data.data;
    return (
        <Formik
            initialValues={{ birthDay, phoneNumber, mobilePhoneNumber, address }}
            onSubmit={() => { }}
        >
            <Form>
                <GroupItem cols={3}>
                    <Input name='address.addressLine1' label='Address Line 1' readOnly />
                    <Input name='address.addressLine2' label='Address Line 2' readOnly />
                    <Input name='address.city' label='City' readOnly />
                    <Input name='address.state' label='State' readOnly />
                    <Input name='address.postalCode' label='Postal Code' readOnly />
                    <Input name='address.country' label='Country' readOnly />
                    <Input name='birthDay' label='Birth Date' readOnly />
                    <Input name='phoneNumber' label='Phone Number' readOnly />
                    <Input name='mobilePhoneNumber' label='Mobile Phone Number' readOnly />
                </GroupItem>
            </Form>
        </Formik>
    )
}
