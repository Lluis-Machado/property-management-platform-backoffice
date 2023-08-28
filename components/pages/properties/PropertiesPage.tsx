'use client';

// React imports
import { memo, useCallback } from 'react';

// Library imports
import DataGrid, {
    Column,
    SearchPanel,
    Toolbar,
    Item,
    Pager,
    Lookup,
} from 'devextreme-react/data-grid';
import { PropertyData } from '@/lib/types/propertyInfo';
import AddRowButton from '@/components/buttons/AddRowButton';
import { ContactData } from '@/lib/types/contactData';
import LinkWithIcon from '@/components/buttons/LinkWithIcon';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import OwnerDropdownComponent from '@/components/dropdowns/OwnerDropdownComponent';
import { CountryData } from '@/lib/types/countriesData';
import { Locale } from '@/i18n-config';
import { TokenRes } from '@/lib/types/token';

interface Props {
    propertyData: PropertyData[];
    contactData: ContactData[];
    countryData: CountryData[];
    lang: Locale;
    token: TokenRes;
}

const PropertiesPage = ({
    propertyData,
    contactData,
    countryData,
    lang,
    token,
}: Props): React.ReactElement => {
    const addressCellRender = (e: PropertyData) => {
        const countryName: any = countryData?.find(
            (country) => country.id == e.propertyAddress.country
        );
        const country = countryName.name;

        const { addressLine1, city, postalCode } = e.propertyAddress;
        const parts = [
            addressLine1,
            postalCode && `${postalCode} - ${city}`,
            country,
        ];
        return parts.filter(Boolean).join(', ');
    };

    const CellRender = useCallback(
        ({ data }: { data: any }): React.ReactElement => (
            <LinkWithIcon
                href={`./properties/${data.id}/property`}
                icon={faArrowUpRightFromSquare}
            />
        ),
        []
    );

    return (
        <DataGrid
            columnMinWidth={100}
            dataSource={propertyData}
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
                    <AddRowButton href={`/private/properties/addProperty`} />
                </Item>
                <Item name='searchPanel' />
            </Toolbar>

            <Column
                alignment='center'
                caption='Details / Edit'
                cellRender={CellRender}
                width={100}
            />
            <Column caption='Name' dataField='name' dataType='string' />
            <Column
                caption='Address'
                dataType='string'
                calculateCellValue={addressCellRender}
                allowSearch
            />
            <Column
                dataField='contactPersonId'
                caption='Main Contact'
                editCellComponent={OwnerDropdownComponent}
            >
                <Lookup
                    dataSource={contactData}
                    valueExpr='id'
                    displayExpr='firstName'
                />
            </Column>
        </DataGrid>
    );
};

export default memo(PropertiesPage);
