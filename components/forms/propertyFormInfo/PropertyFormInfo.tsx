"use client"
// React imports

// Libraries imports
import { Formik, Form } from 'formik';
import { Button, Input, Select } from 'pg-components';

// Local imports
import GroupItem from '../../layoutComponent/GroupItem';
import { PropertyInterface } from '@/lib/types/propertyInfo';
import { ContactData } from '@/lib/types/contactData';
import { useEffect, useState } from 'react';

interface Props {
    initialValues: PropertyInterface;
    contactData: ContactData[];
    handleSubmit: any;
    isLoading?: boolean;
};

const PropertyFormInfo = ({ initialValues, contactData, handleSubmit, isLoading }: Props) => {
    const [formattedContacts, setFormattedContacts] = useState<{ label: string; value: string }[]>([]);

    useEffect(() => {
        setFormattedContacts(contactData.map(({ firstName, lastName, id }) => {
            return {
                label: `${firstName} ${lastName}`,
                value: `${id}`,
            };
        }));
    }, [contactData])

    return (
        <div className='m-2 '>
            <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
            >
                <Form>
                    <GroupItem caption='Property Information' cols={4}>
                        <Input
                            name="name"
                            label="Name"
                            readOnly={isLoading}
                        />
                        <Input
                            name="type"
                            label="Type"
                            readOnly={isLoading}
                        />
                        <Input
                            name="cadastreRef"
                            label="Catastral Reference"
                            readOnly={isLoading}
                        />
                        <Select
                            inputsList={formattedContacts}
                            name='mainContact'
                            label='Main Contact'
                            size='large'
                            defaultValue={{
                                value: initialValues.mainContact.id,
                                label: `${initialValues.mainContact.firstName} ${initialValues.mainContact.lastName}`
                            }}
                            isSearchable
                        />
                    </GroupItem>
                    <GroupItem caption='Address Information' cols={4}>
                        <Input
                            name="address.addressLine1"
                            label="Address line 1"
                            readOnly={isLoading}
                        />
                        <Input
                            name="address.addressLine2"
                            label="Address line 2"
                            readOnly={isLoading}
                        />
                        <Input
                            name="address.postalCode"
                            label="Postal Code"
                            readOnly={isLoading}
                        />
                        <Input
                            name="address.city"
                            label="City"
                            readOnly={isLoading}
                        />
                        <Input
                            name="address.state"
                            label="State"
                            readOnly={isLoading}
                        />
                        <Input
                            name="address.country"
                            label="Country"
                            readOnly={isLoading}
                        />
                    </GroupItem>
                    <div className='flex justify-end'>
                        <div className='flex flex-row justify-between gap-2'>
                            <Button
                                elevated
                                type='submit'
                                text='Submit Changes'
                                disabled={isLoading}
                                isLoading={isLoading}
                            />
                        </div>
                    </div>
                </Form>
            </Formik>
        </div >
    )
}

export default PropertyFormInfo