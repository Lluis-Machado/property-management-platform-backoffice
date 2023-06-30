"use client"
// React imports

// Libraries imports
import { Formik, Form, FormikHelpers } from 'formik';
import { Button, Input, Select } from 'pg-components';

// Local imports
import GroupItem from '../../layoutComponent/GroupItem';
import { PropertyFormInterface } from '@/lib/types/propertyInfo';

interface Props {
    initialValues: any;
}

const PropertyFormInfo = ({ initialValues }: Props) => {
    const handleSubmit = async (
        values: PropertyFormInterface,
        { setSubmitting }: FormikHelpers<PropertyFormInterface>
    ) => {
        setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
        }, 500);
    };
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
                        <Select
                            inputsList={[
                                {
                                    label: 'Private',
                                    value: 'Private'
                                },
                                {
                                    label: 'Vacational use',
                                    value: 'Vacational use'
                                }
                            ]}
                            label="Type"
                            name="type"
                            size="base"
                            defaultValue={{
                                label: 'Vacational use',
                                value: 'Vacational use'
                            }}
                        />
                        <Input
                            name="catastralRef"
                            label={"Catastral Reference"}
                        />
                        <Select
                            inputsList={[
                                {
                                    label: 'Bryon D. Rogers',
                                    value: 'Bryon D. Rogers'
                                },
                                {
                                    label: 'Joyce D. Wright',
                                    value: 'Joyce D. Wright'
                                },
                                {
                                    label: 'Laura V. Hust',
                                    value: 'Laura V. Hust'
                                },
                                {
                                    label: 'Leo Linger',
                                    value: 'Leo Linger'
                                },
                                {
                                    label: 'Milla Hamilton',
                                    value: 'Milla Hamilton'
                                },
                                {
                                    label: 'Ruby Hope',
                                    value: 'Ruby Hope'
                                }
                            ]}
                            label="Main Contact"
                            name="mainContact"
                            size="base"
                            defaultValue={{
                                label: 'Ruby Hope',
                                value: 'Ruby Hope'
                            }}
                        />
                    </GroupItem>
                    <GroupItem caption='Address Information' cols={4}>
                        <Input
                            name="addressLine1"
                            label={"Address line 1"}
                        />
                        <Input
                            label="Postal Code"
                            name="postalCode"
                        />
                        <Select
                            inputsList={[
                                {
                                    label: 'Calvia',
                                    value: 'Calvia'
                                },
                                {
                                    label: 'Palma',
                                    value: 'Palma'
                                }
                            ]}
                            label="City"
                            name="city"
                            size="base"
                            defaultValue={{
                                label: 'Palma',
                                value: 'Palma'
                            }}
                        />
                        <Select
                            inputsList={[{
                                label: 'Alava',
                                value: 'Alava'
                            }, {
                                label: 'Asturias',
                                value: 'Asturias'
                            }, {
                                label: 'Barcelona',
                                value: 'Barcelona'
                            }, {
                                label: 'Granada',
                                value: 'Granada'
                            }, {
                                label: 'Huelva',
                                value: 'Huelva'
                            }, {
                                label: 'Islas Baleares',
                                value: 'Islas Baleares'
                            }, {
                                label: 'Madrid',
                                value: 'Madrid'
                            }, {
                                label: 'Zaragoza',
                                value: 'Zaragoza'
                            }
                            ]}
                            label="Province"
                            name="provinces"
                            isSearchable={true}
                            size="base"
                            defaultValue={{
                                label: 'Islas Baleares',
                                value: 'Islas Baleares'
                            }}
                        />
                        <Select
                            inputsList={[{
                                label: 'Andorra',
                                value: 'Andorra'
                            }, {
                                label: 'Belgium',
                                value: 'Belgium'
                            }, {
                                label: 'France',
                                value: 'France'
                            }, {
                                label: 'United Kingdom',
                                value: 'United Kingdom'
                            }, {
                                label: 'Spain',
                                value: 'Spain'
                            }, {
                                label: 'Portugal',
                                value: 'Portugal'
                            }]}
                            label="Country"
                            name="country"
                            isSearchable={true}
                            size="base"
                            defaultValue={{
                                label: 'Spain',
                                value: 'Spain'
                            }}
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