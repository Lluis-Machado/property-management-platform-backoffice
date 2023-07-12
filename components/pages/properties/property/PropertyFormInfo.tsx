"use client"
// React imports
import { useState } from 'react';

// Libraries imports
import { Formik, Form } from 'formik';
import { Button, Input, Select } from 'pg-components';

// Local imports
import { ContactData } from '@/lib/types/contactData';
import { PropertyData } from '@/lib/types/propertyInfo';
import GroupItem from '@/components/layoutComponent/GroupItem';

interface Props {
    initialValues: PropertyData;
    contactData: ContactData[];
    handleSubmit: any;
    isLoading?: boolean;
    isEditing?: boolean;
};

const PropertyFormInfo = ({ initialValues, contactData, handleSubmit, isLoading, isEditing }: Props) => {
    const [formattedContacts, setFormattedContacts] = useState<{ label: string; value: string }[]>(
        contactData.map(({ firstName, lastName, id }) => {
            return {
                label: `${firstName} ${lastName}`,
                value: `${id}`,
            };
        })
    );

    return (
        <div>
            <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
            >
                <Form>
                    <GroupItem caption='Property Information' cols={4}>
                        <Input
                            name="name"
                            label="Name"
                            readOnly={isLoading || !isEditing}
                        />
                        <Input
                            name="type"
                            label="Type"
                            readOnly={isLoading || !isEditing}
                        />
                        <Input
                            name="cadastreRef"
                            label="Catastral Reference"
                            readOnly={isLoading || !isEditing}
                        />
                        <Select
                            inputsList={formattedContacts}
                            name='mainOwnerId'
                            label='Main Owner'
                            size='large'
                            defaultValue={{
                                label: initialValues.mainOwner.ownerName,
                                value: initialValues.mainOwner.id
                            }}
                            isSearchable
                            readOnly={isLoading || !isEditing}
                        />
                    </GroupItem>
                    <GroupItem caption='Address Information' cols={4}>
                        <Input
                            name="address.addressLine1"
                            label="Address line 1"
                            readOnly={isLoading || !isEditing}
                        />
                        <Input
                            name="address.addressLine2"
                            label="Address line 2"
                            readOnly={isLoading || !isEditing}
                        />
                        <Input
                            name="address.postalCode"
                            label="Postal Code"
                            readOnly={isLoading || !isEditing}
                        />
                        <Input
                            name="address.city"
                            label="City"
                            readOnly={isLoading || !isEditing}
                        />
                        <Input
                            name="address.state"
                            label="State"
                            readOnly={isLoading || !isEditing}
                        />
                        <Input
                            name="address.country"
                            label="Country"
                            readOnly={isLoading || !isEditing}
                        />
                    </GroupItem>
                    <div className='flex justify-end'>
                        <div className='flex flex-row justify-between gap-2'>
                            {
                                isEditing &&
                                <Button
                                    elevated
                                    type='submit'
                                    text='Submit Changes'
                                    disabled={isLoading}
                                    isLoading={isLoading}
                                />
                            }
                        </div>
                    </div>
                </Form>
            </Formik>
        </div >
    )
}

export default PropertyFormInfo