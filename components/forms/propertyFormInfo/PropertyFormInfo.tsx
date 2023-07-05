"use client"
// React imports

// Libraries imports
import { Formik, Form } from 'formik';
import { Button, Input, Select } from 'pg-components';

// Local imports
import GroupItem from '../../layoutComponent/GroupItem';
import { PropertyInterface, CreatePropertyInterface } from '@/lib/types/propertyInfo';

interface Props {
    initialValues: PropertyInterface | CreatePropertyInterface;
    handleSubmit: any;
    isLoading?: boolean;
}

const PropertyFormInfo = ({ initialValues, handleSubmit, isLoading }: Props) => {
    
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
                        <Input
                            name="mainContact.firstName"
                            label="Main Contact"
                            readOnly={isLoading}
                        />

                  
                    </GroupItem>
                    <GroupItem caption='Address Information' cols={4}>
                        <Input
                            name="address.addressLine1"
                            label="Address line 1"
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