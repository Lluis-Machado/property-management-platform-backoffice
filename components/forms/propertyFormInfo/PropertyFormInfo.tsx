"use client"
// react imports

// local imports
import { Formik, Form, FormikHelpers } from 'formik';
import { Button, Input } from 'pg-components';
import GroupItem from '../../layoutComponent/GroupItem';
interface PropertyValues {
    name: string;
    type: string;
    catastralRef: string;
    mainContact: string;
    addressLine1: string
    addressLine2: string;
    city: string;
    region: string;
    state: string;
    postalCode: string;
    country: string;
}

const PropertyFormInfo = () => {

    const initialValues: PropertyValues = {
        name: 'Villa Sonnenschein',
        type: 'Apartment',
        catastralRef: '13 077 A 018 00039 0000 FP',
        mainContact: 'Sr. Schaller',
        addressLine1: 'Calle...',
        addressLine2: '',
        city: 'Palma',
        region: 'Mallorca',
        state: 'Illes Balears',
        postalCode: '07010',
        country: 'España',
    };

    const handleSubmit = async (
        values: PropertyValues,
        { setSubmitting }: FormikHelpers<PropertyValues>
    ) => {
        setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
        }, 500);
    };

    return (
        <div className='m-2'>
            <h5 className="mb-4 text-xl font-bold leading-tight text-secondary-500">
                Property Information
            </h5>
            <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
            >
                <Form >
                    <GroupItem cols={2} >
                        <Input
                            name="name"
                            label={"Name"}
                        />
                        <Input
                            name="type"
                            label={"Type"}
                        />
                        <Input
                            name="catastralRef"
                            label={"Catastral Reference"}
                        />
                        <Input
                            name="mainContact"
                            label={"Main Contact"}
                        />
                        <div className='text-ml font-semibold leading-tight text-secondary-500'>Address</div>
                        <></>
                        <Input
                            name="addressLine1"
                            label={"Address line 1"}
                        />
                        <Input
                            name="addressLine2"
                            label={"Address line 2"}
                        />
                        <Input
                            name="city"
                            label={"City"}
                        />
                        <Input
                            name="region"
                            label={"Region"}
                        />
                        <Input
                            name="state"
                            label={"State"}
                        />
                        <Input
                            name="postalCode"
                            label={"Postal Code"}
                        />
                        <Input
                            name="country"
                            label={"Country"}
                        />
                    </GroupItem>
                    <div className='flex justify-end py-4'>
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
                                text='Submit Changes'
                            />
                        </div>
                    </div>
                </Form>
            </Formik>
        </div >
    )
}

export default PropertyFormInfo