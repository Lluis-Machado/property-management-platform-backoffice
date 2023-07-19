// Libraries imports
import { Formik, Form } from 'formik';
import { Select } from 'pg-components';

interface Props {
    years: string[];
    onSelectionChanged: (year: string) => void;
}

const YearSelector = ({
    years,
    onSelectionChanged,
}: Props): React.ReactElement => {
    const initialValues = years.map((year) => {
        return { label: year, value: year };
    });
    return (
        <Formik
            initialValues={{ selectedYear: initialValues[0].value }}
            onSubmit={(e) => onSelectionChanged(e.selectedYear)}
        >
            <Form className='w-[30vw]'>
                <Select
                    name='selectedYear'
                    inputsList={initialValues}
                    defaultValue={initialValues[0]}
                    submitOnChange
                    isSecondary
                    needsErrorMessage={false}
                />
            </Form>
        </Formik>
    );
};

export default YearSelector;
