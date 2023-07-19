'use client';

// React imports
import { memo, useCallback } from 'react';

// Libraries imports
import { useRouter } from 'next/navigation';
import {
    Column,
    DataGrid,
    Item,
    Pager,
    SearchPanel,
    Toolbar,
    MasterDetail,
} from 'devextreme-react/data-grid';
import Form, { SimpleItem } from 'devextreme-react/form';
import AddRowButton from '@/components/buttons/AddRowButton';
import { CompanyData } from '@/lib/types/companyData';

interface Props {
    dataSource: CompanyData[];
}

const CompaniesPage = ({ dataSource }: Props) => {
    const router = useRouter();

    const handleDouleClick = useCallback(
        ({ data }: any) => {
            router.push(`./companies/${data.id}/companyInfo`);
        },
        [router]
    );

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
            <SearchPanel searchVisibleColumnsOnly={false} visible width={350} />
            <Pager
                allowedPageSizes='auto'
                showInfo
                showNavigationButtons
                visible
            />

            <Toolbar>
                <Item>
                    <AddRowButton href={`./companies/addCompany`} />
                </Item>
                <Item name='searchPanel' />
            </Toolbar>

            <Column caption='Company Name' dataField='name' dataType='string' />
            <Column caption='NIF' dataField='nif' dataType='string' />
            <Column caption='Email' dataField='email' dataType='string' />
            <Column
                caption='Phone Number'
                dataField='phoneNumber'
                dataType='string'
            />
            {/* <MasterDetail enabled={true} component={DetailTemplate} /> */}
        </DataGrid>
    );
};

export default memo(CompaniesPage);

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
