"use client"
// React imports

// Libraries imports
import { Formik, Form } from 'formik';
import { Button, Input } from 'pg-components';

// Local imports
import GroupItem from '../../layoutComponent/GroupItem';
import { PropertyInterface, CreateProperty } from '@/lib/types/propertyInfo';

interface Props {
    initialValues: PropertyInterface | CreateProperty;
    handleSubmit: any;
}

const PropertyFormInfo = ({ initialValues, handleSubmit }: Props) => {
    console.log(initialValues)
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
                        />
                        <Input
                            name="type"
                            label="Type"
                        />
                        <Input
                            name="cadastreRef"
                            label="Catastral Reference"
                        />
                        <Input
                            name="mainContact.firstName"
                            label="Main Contact"
                        />
                    </GroupItem>
                    <GroupItem caption='Address Information' cols={4}>
                        <Input
                            name="address.addressLine1"
                            label="Address line 1"
                        />
                        <Input
                            name="address.postalCode"
                            label="Postal Code"
                        />
                        <Input
                            name="address.city"
                            label="City"
                        />
                        <Input
                            name="address.state"
                            label="State"
                        />
                        <Input
                            name="address.country"
                            label="Country"
                        />
                    </GroupItem>
                    <div className='flex justify-end'>
                        <div className='flex flex-row justify-between gap-2'>
                            <Button
                                elevated
                                style='outline'
                                type='reset'
                                text='Reset'
                            />
                            <Button
                                elevated
                                type='submit'
                                text='Submit'
                            />
                        </div>
                    </div>
                </Form>
            </Formik>
        </div >
    )
}

export default PropertyFormInfo