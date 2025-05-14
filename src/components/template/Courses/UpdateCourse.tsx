import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import useFetch from '../../../hooks/UseFetch';
import { useMutate } from '../../../hooks/UseMutate';
import Button from '../../atoms/Button';
import { Breadcrumb } from '../../molecules/BreadCrumbs';
import CourseMainData from './MainData';
import * as Yup from 'yup';
import ShowAlertMixin from '../../atoms/ShowAlertMixin';
import { isArabic, isEnglish } from '../../../helper/helpers';

export default function UpdateCourse() {
    const { t, i18n } = useTranslation();

    const { id } = useParams();
    const navigate = useNavigate();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.courses.title'), to: '/courses/index' },
        { label: t('breadcrumb.courses.edit') },
    ];
    const [formKey, setFormKey] = useState(0);

    const {
        data: showData,
        isError: showDataError,
        isLoading: showDataLoading,
        isSuccess: showDataSuccess,
        refetch: refetch,
    } = useFetch<any>({
        endpoint: `course/${id}`,
        queryKey: [`course/${id}`],
    });

    useEffect(() => {
        setFormKey(formKey + 1);
    }, [showDataSuccess]);

    const initialValues = {
        image: showData?.data?.image || '',

        videos:
            (showData?.data?.videos?.length &&
                showData?.data?.videos?.map((video: any) => ({
                    id: video?.id,
                    media: video?.media, // Correct video URL
                }))) ||
            [],

        ar_title: showData?.data?.ar?.title || '',
        en_title: showData?.data?.en?.title || '',

        ar_instructor_name: showData?.data?.ar?.instructor_name || '',
        en_instructor_name: showData?.data?.en?.instructor_name || '',

        ar_description: showData?.data?.ar?.desc || '',
        en_description: showData?.data?.en?.desc || '',
        course_category_id: showData?.data?.course_category_data?.id || '',
        type: showData?.data?.type || '',
        duration: showData?.data?.duration || '',
        price: showData?.data?.price || '',
        videos_count: showData?.data?.videos_count || '',
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

    // update data
    const { mutate: update, isLoading: LoadingUpdate } = useMutate({
        mutationKey: [`course/${id}`],
        endpoint: `course/${id}`,

        onSuccess: (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isEditSuccessfully', { name: t('breadcrumb.courses.title') }),
            });

            // refetch();
            // refetch().then(() => {
            //     setFormKey(formKey + 1);
            // });
            navigate('/courses/index');
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

    const handleSubmit = (values: any) => {
        const videosData: any = {};

        if (values?.videos && values?.videos?.length > 0) {
            values.videos.forEach((vid: any, index: number) => {
                if (typeof vid !== 'number') {
                    // Only add non-number videos to the payload
                    videosData[`videos[${index}][media]`] = vid;
                }
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

        if (initialValues.image === finalOut.image) {
            delete finalOut.image;
        }

        // Remove undefined keys
        Object.keys(finalOut).forEach((key) => {
            if (finalOut[key] === undefined) {
                delete finalOut[key];
            }
        });

        update({
            ...finalOut,
            //  _method: 'put'
        });
    };

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />

            <Formik
                validationSchema={courseSchema()}
                key={formKey}
                enableReinitialize={true} // Ensure Formik updates when initialValues change
                initialValues={initialValues}
                onSubmit={(values: any) => {
                    handleSubmit(values);
                }}
            >
                {({ validateForm }) => {
                    // Listen for language changes and revalidate
                    useEffect(() => {
                        validateForm();
                    }, [i18n.language]);

                    return (
                        <Form>
                            <CourseMainData isLoading={showDataLoading} refetch={refetch} />
                            <div className="mt-10 mb-4 flex gap-2 justify-center">
                                <Button
                                    type="submit"
                                    className="bg-primary text-white py-3 px-5 rounded-lg hover:bg-white hover:text-primary border hover:border-primary"
                                    loading={LoadingUpdate}
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
