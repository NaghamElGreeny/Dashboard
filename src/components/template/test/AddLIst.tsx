import { Form, Formik } from 'formik';
import React from 'react';
import MainData from './MainData';

export default function AddLIst() {
    const initialValues = {};
    return (
        <div>
            <Formik
                initialValues={initialValues}
                // validationSchema={validatopnSchema}
                // onSubmit={(values :any) => {handleSubmit(values)}}
                onSubmit={(values: any) => {
                    // mutate({ ...values });
                    // update({ ...values, _methode: 'put' });
                }}
            >
                <Form>
                    <MainData />
                </Form>
            </Formik>
        </div>
    );
}
