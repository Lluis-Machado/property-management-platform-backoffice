// React imports
import { useCallback, useRef, useState } from 'react';

// Libraries imports
import { Popup, Position } from 'devextreme-react/popup';
import { SelectBox } from 'devextreme-react/select-box';
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import Form, { Item } from 'devextreme-react/form';

// Local imports
import { Button } from 'pg-components';
import { updateSuccessToast } from '@/lib/utils/customToasts';
import { customError } from '@/lib/utils/customError';
import { BusinessPartners } from '@/lib/types/businessPartners';
import { apiPostAccounting } from '@/lib/utils/apiPostAccounting';

interface PopupProps {
    message: string;
    isVisible: boolean;
    onClose: () => void;
    id: string;
    allBusinessPartners: BusinessPartners[];
    setValue: any;
}

const BpPopup = ({
    message,
    isVisible,
    onClose,
    id,
    allBusinessPartners,
    setValue,
}: PopupProps) => {
    const selectBoxRef = useRef<SelectBox>(null);
    const [businessPartnerName, setBusinessPartnerName] = useState<string>('');
    const [businessPartnerVatNumber, setBusinessPartnerVatNumber] =
        useState<string>('');

    let businessPartnerValues: any = {
        name: businessPartnerName,
        vatNumber: businessPartnerVatNumber,
    };

    const [isLoading, setIsLoading] = useState<boolean>(false);
    let arrayCIF: any[] = [];

    const saveBP = useCallback(async () => {
        const toastId = toast.loading('Saving Business Partner');
        const values = {
            name: businessPartnerName,
            vatNumber: businessPartnerVatNumber,
        };
        setValue(values);

        try {
            console.log('Valores a enviar: ', values);
            console.log('Valores a enviar en JSON: ', JSON.stringify(values));

            const data = await apiPostAccounting(
                '/api/accounting/businessPartners',
                id!,
                values
            );

            console.log('TODO CORRECTO, valores de vuelta: ', data);
            updateSuccessToast(toastId, 'Business Partner saved correctly!');
        } catch (error: unknown) {
            customError(error, toastId);
        } finally {
            setIsLoading(false);
        }
    }, [id, businessPartnerName, businessPartnerVatNumber]);

    const onCustomNameItemCreating = (args: any) => {
        if (!args.text) {
            args.customItem = null;
            return;
        }

        const { component, text } = args;
        const currentItems = component.option('items');

        const newItem = {
            name: text,
        };
        setBusinessPartnerName(newItem.name);

        const itemInDataSource = currentItems.find(
            (item: any) => item.text === newItem.name
        );

        if (itemInDataSource) {
            args.customItem = itemInDataSource;
        } else {
            currentItems.push(newItem);
            component.option('items', currentItems);
            args.customItem = newItem;
        }
    };

    const onCustomVatNumberItemCreating = (args: any) => {
        if (!args.text) {
            args.customItem = null;
            return;
        }

        const { component, text } = args;
        const currentItems = component.option('items');

        const newItem = {
            vatNumber: text,
        };

        setBusinessPartnerVatNumber(newItem.vatNumber);

        const itemInDataSource = currentItems.find(
            (item: any) => item.text === newItem.vatNumber
        );

        if (itemInDataSource) {
            args.customItem = itemInDataSource;
        } else {
            currentItems.push(newItem);
            component.option('items', currentItems);
            args.customItem = newItem;
        }
    };

    const displayValue = (e: any) => {
        for (const businessParter of allBusinessPartners) {
            console.log(businessParter);
            if (e === businessParter.name) {
                arrayCIF = [businessPartnerVatNumber];
                selectBoxRef.current!.instance.option('dataSource', arrayCIF);
                selectBoxRef.current!.instance.option('value', arrayCIF[0]);
            }
        }
    };

    const contentRender = useCallback(
        () => (
            <>
                <Form formData={businessPartnerValues}>
                    <Item dataField='name' label={{ text: 'Name' }}>
                        <SelectBox
                            items={allBusinessPartners}
                            displayExpr='name'
                            valueExpr='name'
                            searchEnabled={true}
                            acceptCustomValue={true}
                            onCustomItemCreating={onCustomNameItemCreating}
                            onValueChange={displayValue}
                        />
                    </Item>
                    <Item
                        dataField='vatNumber'
                        label={{ text: 'CIF' }}
                        editorType='dxSelectBox'
                    >
                        <SelectBox
                            items={arrayCIF}
                            displayExpr='vatNumber'
                            acceptCustomValue={true}
                            onCustomItemCreating={onCustomVatNumberItemCreating}
                            ref={selectBoxRef}
                        />
                    </Item>
                </Form>
                <div className='mt-6 flex flex-col gap-4'>
                    <div className='flex gap-4'>
                        <Button
                            text='Cancel'
                            style='outline'
                            onClick={onClose}
                        />
                        <Button
                            text='Save'
                            icon={faFloppyDisk}
                            onClick={() => {
                                onClose();
                                saveBP();
                            }}
                        />
                    </div>
                </div>
            </>
        ),
        [onClose, saveBP, allBusinessPartners, arrayCIF, businessPartnerValues]
    );

    const titleComponent = useCallback(
        () => (
            <div className='flex items-center justify-center text-2xl font-bold text-secondary-500'>
                {message || 'Adding a new Business Partner'}
            </div>
        ),
        [message]
    );

    return (
        <Popup
            contentRender={contentRender}
            titleComponent={titleComponent}
            dragEnabled={false}
            height='auto'
            hideOnOutsideClick={false}
            visible={isVisible}
            width='40vw'
        >
            <Position of='#content' />
        </Popup>
    );
};

export default BpPopup;
