"use client"
// react imports

// local imports
import { Formik, Form, FormikHelpers } from 'formik';
import { Input } from 'pg-components';
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
                    </GroupItem>
                    <GroupItem caption='Address Information' cols={4}>
                        <Input
                            name="addressLine1"
                            label={"Address line 1"}
                        />
                        <Input
                            name="postalCode"
                            label={"Postal Code"}
                        />
                        <Input
                            name="city"
                            label={"City"}
                        />
                        <Input
                            name="state"
                            label={"State"}
                        />
                        <Input
                            name="country"
                            label={"Country"}
                        />
                    </GroupItem>
                </Form>
            </Formik>
        </div >
    )
}

export default PropertyFormInfo