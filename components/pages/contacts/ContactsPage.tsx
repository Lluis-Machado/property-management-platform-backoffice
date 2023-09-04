'use client';

// React imports
import { memo, useCallback } from 'react';

// Libraries imports
import {
    Column,
    DataGrid,
    Item,
    Pager,
    SearchPanel,
    Toolbar,
} from 'devextreme-react/data-grid';
import AddRowButton from '@/components/buttons/AddRowButton';
import { ContactData } from '@/lib/types/contactData';
import LinkWithIcon from '@/components/buttons/LinkWithIcon';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

interface Props {
    dataSource: ContactData[];
}

const ContactsPage = ({ dataSource }: Props) => {
    const CellRender = useCallback(
        ({ data }: { data: any }): React.ReactElement => (
            <LinkWithIcon
                href={`./contacts/${data.id}/contactInfo`}
                icon={faArrowUpRightFromSquare}
            />
        ),
        []
    );

    return (
        <DataGrid
            columnMinWidth={100}
            dataSource={dataSource}
            focusedRowEnabled
            keyExpr='id'
            columnHidingEnabled={false}
            rowAlternationEnabled
            allowColumnResizing
            showBorders
            showRowLines
        >
            <SearchPanel searchVisibleColumnsOnly={false} visible width={350} />
            <Pager
                allowedPageSizes='auto'
                showInfo
                showNavigationButtons
                visible
            />

            <Toolbar>
                <Item>
                    <AddRowButton href={`./contacts/addContact`} />
                </Item>
                <Item name='searchPanel' />
            </Toolbar>

            <Column
                alignment='center'
                caption='Details / Edit'
                cellRender={CellRender}
                width={100}
            />
            <Column
                caption='First Name'
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
            {/* <Column
                caption='NIF'
                dataField='nif'
                dataType='string'
                hidingPriority={2}
            /> */}
            <Column
                caption='Email'
                dataField='email'
                dataType='string'
                hidingPriority={3}
            />
            {/* <MasterDetail enabled={true} component={DetailTemplate} /> */}
        </DataGrid>
    );
};

export default memo(ContactsPage);

// const DetailTemplate = (props: any) => {
//     return (
//         <Form
//             formData={props.data.data}
//             labelMode={'floating'}
//             readOnly={true}
//             colCount={3}
//         >
//             <SimpleItem
//                 dataField='address.addressLine1'
//                 label={{ text: 'Address Line 1' }}
//             />
//             <SimpleItem
//                 dataField='address.addressLine2'
//                 label={{ text: 'Address Line 2' }}
//             />
//             <SimpleItem dataField='address.city' label={{ text: 'City' }} />
//             <SimpleItem dataField='address.state' label={{ text: 'State' }} />
//             <SimpleItem
//                 dataField='address.postalCode'
//                 label={{ text: 'Postal Code' }}
//             />
//             <SimpleItem
//                 dataField='address.country'
//                 label={{ text: 'Country' }}
//             />
//             <SimpleItem dataField='birthDay' label={{ text: 'Birth Date' }} />
//             <SimpleItem
//                 dataField='phoneNumber'
//                 label={{ text: 'Phone Number' }}
//             />
//             <SimpleItem
//                 dataField='mobilePhoneNumber'
//                 label={{ text: 'Mobile Phone Number' }}
//             />
//         </Form>
//     );
// };
