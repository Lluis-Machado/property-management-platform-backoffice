import { Form, Formik, FormikHelpers } from "formik"
import { Button, TextArea } from "pg-components"

const initialValues: {
    notes: string;
} = {
    notes: 'Side notes',
};

const PropertyTextArea = () => {
    const handleSubmit = async (
        values: any,
        { setSubmitting }: FormikHelpers<any>
    ) => {
        setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
        }, 500);
    };

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
        >
            <Form className="mt-2">
                <TextArea
                    name="notes"
                    label="Save your notes"
                    isSecondary
                />
                <div className='flex justify-end py-4'>
                    <div className='flex flex-row justify-between gap-2'>
                        <Button
                            elevated
                            style='outline'
                            type='submit'
                            text='Save'
                        />
                    </div>
                </div>
            </Form>
        </Formik>
    )
}

export default PropertyTextArea