import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutate } from '../../../hooks/UseMutate';
import Button from '../../atoms/Button';
import ShowAlertMixin from '../../atoms/ShowAlertMixin';
import { Breadcrumb } from '../../molecules/BreadCrumbs';
import CourseMainData from './MainData';
import * as Yup from 'yup';
import { isArabic, isEnglish } from '../../../helper/helpers';

export default function AddCourse() {
    const { t, i18n } = useTranslation();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.courses.title'), to: '/courses/index' },
        { label: t('breadcrumb.courses.add') },
    ];
    const [formKey, setFormKey] = useState(0);
    const initialValues = {
        image: '',

        videos: [
            {
                // id: Date.now(),
                image: '',
            },
        ],

        ar_title: '',
        en_title: '',

        ar_instructor_name: '',
        en_instructor_name: '',

        ar_description: '',
        en_description: '',
        course_category_id: '',
        type: '',
        duration: '',
        price: '',
        videos_count: '',
    };

    const courseSchema = () =>
        Yup.object().shape({
            image: Yup.mixed().required(t('requiredField', { field: t('labels.image') })),

            ar_title: Yup.string()
                .trim()
                .required(t('requiredField', { field: t('labels.title') + t('inArabic') }))
                .test('is-arabic', t('validations.arabicText'), (value) => isArabic(value)),

            en_title: Yup.string()
                .trim()
                .required(t('requiredField', { field: t('labels.title') + t('inEnglish') }))
                .test('is-english', t('validations.englishText'), (value) => isEnglish(value)),

            ar_instructor_name: Yup.string()
                .trim()
                .required(
                    t('requiredField', { field: t('labels.instructor_name') + t('inArabic') })
                )
                .test('is-arabic', t('validations.arabicText'), (value) => isArabic(value)),

            en_instructor_name: Yup.string()
                .trim()
                .required(
                    t('requiredField', { field: t('labels.instructor_name') + t('inEnglish') })
                )
                .test('is-english', t('validations.englishText'), (value) => isEnglish(value)),

            ar_description: Yup.string()
                .trim()
                .required(t('requiredField', { field: t('labels.description') + t('inArabic') }))
                .test('is-arabic', t('validations.arabicText'), (value) => isArabic(value)),

            en_description: Yup.string()
                .trim()
                .required(t('requiredField', { field: t('labels.description') + t('inEnglish') }))
                .test('is-english', t('validations.englishText'), (value) => isEnglish(value)),

            course_category_id: Yup.string().required(
                t('requiredField', { field: t('labels.course_category') })
            ),

            type: Yup.string().required(t('requiredField', { field: t('labels.type') })),
            duration: Yup.number().required(t('requiredField', { field: t('labels.duration') })),
            price: Yup.number().required(t('requiredField', { field: t('labels.price') })),
            videos_count: Yup.number().required(
                t('requiredField', { field: t('labels.videos_count') })
            ),
        });

    const { mutate, isLoading } = useMutate({
        mutationKey: ['course'],
        endpoint: `course`,
        onSuccess: (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isCreatedSuccessfully', { name: t('breadcrumb.courses.title') }),
            });

            setFormKey(formKey + 1);
        },
        onError: (err: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'error',
                title: err?.response?.data?.message,
            });
        },
        formData: true,
    });

    const handleSubmit = (values: any, actions: any) => {
        const videosData: any = {};

        if (values?.videos && values?.videos?.length > 0) {
            values?.videos?.forEach((vid: any, index: number) => {
                videosData[`videos[${index}][media]`] = vid;
            });
        }

        const finalOut = {
            ...videosData,

            image: values.image,
            course_category_id: values.course_category_id,
            type: values.type,
            duration: values.duration,
            price: values.price,
            videos_count: values.videos_count,

            ar: {
                title: values?.ar_title,
                instructor_name: values?.ar_instructor_name,
                desc: values.ar_description,
            },
            en: {
                title: values?.en_title,
                instructor_name: values?.en_instructor_name,
                desc: values.en_description,
            },
        };

        // Remove undefined keys
        Object.keys(finalOut).forEach((key) => {
            if (finalOut[key] === undefined) {
                delete finalOut[key];
            }
        });

        mutate(finalOut, {
            onSuccess: () => {
                // Reset the form to initial values
                actions.setSubmitting(false);
            },
        });
    };

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />

            <Formik
                validationSchema={courseSchema()}
                key={formKey}
                initialValues={initialValues}
                onSubmit={(values, actions) => {
                    handleSubmit(values, actions);
                }}
            >
                {({ validateForm }) => {
                    // Listen for language changes and revalidate
                    useEffect(() => {
                        validateForm();
                    }, [i18n.language]);

                    return (
                        <Form>
                            <CourseMainData />
                            <div className="mt-10 mb-4 flex gap-2 justify-center">
                                <Button
                                    type="submit"
                                    className="bg-primary text-white py-3 px-5 rounded-lg hover:bg-white hover:text-primary border hover:border-primary"
                                    loading={isLoading}
                                >
                                    {t('buttons.save')}
                                </Button>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
}
