import { MRT_ColumnDef } from 'mantine-react-table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaEye, FaPlus, FaRegEdit } from 'react-icons/fa';
import { Link, useSearchParams } from 'react-router-dom';
import showAlert from '../../components/atoms/ShowAlert';
import ShowAlertMixin from '../../components/atoms/ShowAlertMixin';
import { Breadcrumb } from '../../components/molecules/BreadCrumbs';
import CrudIconDelete from '../../components/molecules/CrudIconDelete';
import TableCompCustom from '../../components/template/tantable/TableCutsom';
import { hasPermission } from '../../helper/permissionHelpers';
import useFetch from '../../hooks/UseFetch';
import { useMutate } from '../../hooks/UseMutate';
import type { Course, FetchCourseData } from './types';
import ModalCustom from '../../components/template/modal/ModalCustom';
import LightBox from '../../components/molecules/LightBox/LightBox';
import imageError from '/assets/images/logo.png';
import FilterSection from '../../components/atoms/filters/Filters';
import VideoLightBox from '../../components/molecules/VideoLightBox/VideoLightBox';

export default function Courses() {
    const { t } = useTranslation();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.courses.title') },
    ];

    const [courseCategoryId, setCourseId] = useState<Object>('');
    const [page, setPage] = useState(1);

    const [opened, setOpen] = useState<boolean>(false);
    const [selectedDescription, setSelectedDescription] = useState<string>('');
    const [searchParams, setSearchParams] = useSearchParams();

    const columns: MRT_ColumnDef<Course>[] = [
        {
            header: '#',
            Cell: ({ row }: any) => row.index + 1,
            size: 40,
        },

        {
            header: t('labels.image'),
            Cell: ({ row }: { row: { original: Course } }) => (
                <div className="flex gap-5">
                    <LightBox
                        getItems={[
                            {
                                src: row.original.image || imageError,
                            },
                        ]}
                    />
                </div>
            ),
            accessorKey: 'image',
        },

        {
            header: t('labels.videos'),
            Cell: ({ row }: { row: { original: Course } }) => (
                <div className="flex gap-5">
                    {row.original?.videos && row.original?.videos.length > 0 ? (
                        <VideoLightBox
                            videos={row.original?.videos} // Pass all videos to the lightbox
                            startIndex={0} // Ensure it starts with the first video
                            showFirstOnly={true} // prop to display only the first video in the table
                        />
                    ) : (
                        <span>{t('not_found')}</span>
                    )}
                </div>
            ),
            accessorKey: 'videos',
        },

        {
            header: t('labels.title'),
            Cell: ({ row }: { row: { original: Course } }) => {
                const title = row.original?.title || t('not_found');
                return <span>{title}</span>;
            },
            accessorKey: 'title',
        },

        {
            header: t('labels.instructor_name'),
            Cell: ({ row }: { row: { original: Course } }) => {
                const instructor_name = row.original?.instructor_name || t('not_found');
                return <span>{instructor_name}</span>;
            },
            accessorKey: 'instructor_name',
        },

        {
            header: t('labels.description'),
            Cell: ({ row }: { row: { original: Course } }) => {
                const description = row.original?.desc || t('not_found');
                return (
                    <>
                        <FaEye
                            className="text-[19px] text-black ms-10 cursor-pointer"
                            onClick={() => {
                                setSelectedDescription(description ?? '');
                                // setSelectedDescription(description as string);
                                setOpen(true);
                            }}
                        />
                    </>
                );
            },

            accessorKey: 'description',
        },

        {
            header: t('labels.course_category'),
            Cell: ({ row }: { row: { original: Course } }) => {
                const course_category = row.original?.course_category_data?.name || t('not_found');
                return <span>{course_category}</span>;
            },
            accessorKey: 'course_category',
        },

        // {
        //     header: t('labels.videos_count'),
        //     Cell: ({ row }: { row: { original: Course } }) => {
        //         const videos_count = row.original?.videos_count || 0;
        //         return <span>{videos_count}</span>;
        //     },
        //     accessorKey: 'videos_count',
        // },

        // {
        //     header: t('labels.duration'),
        //     Cell: ({ row }: { row: { original: Course } }) => {
        //         const duration = row.original?.duration || 0;
        //         return <span>{duration}</span>;
        //     },
        //     accessorKey: 'duration',
        // },

        {
            header: t('labels.price'),
            Cell: ({ row }: { row: { original: Course } }) => {
                const price = row.original?.price || 0;
                return <span>{price}</span>;
            },
            accessorKey: 'price',
        },

        {
            header: t('labels.type'),
            Cell: ({ row }: { row: { original: Course } }) => {
                const type = row.original?.type || t('not_found');
                return <span>{t(`labels.${type}`)}</span>;
            },
            accessorKey: 'type',
        },

        {
            accessorKey: 'is_active',
            header: t('labels.status'),
            Cell: ({ row }: { row: { original: Course } }) => (
                <span className={`${row?.original?.is_active ? 'active' : 'inactive'} statuses`}>
                    {row?.original?.is_active ? t('labels.active') : t('labels.inactive')}
                </span>
            ),
        },

        ...(hasPermission('course.update') ||
        hasPermission('course.destroy') ||
        hasPermission('course.show')
            ? [
                  {
                      header: t('labels.actions'),
                      Cell: ({ renderedCellValue, row }: any) => (
                          <div
                              className="flex gap-2 items-center"
                              style={{ marginInlineStart: '1rem' }}
                          >
                              {hasPermission('course.show') && (
                                  <Link
                                      to={`/courses/show/${row.original.id}`}
                                      className="flex gap-5"
                                  >
                                      <FaEye className="text-[19px] text-[#50cd89] ms-8" />
                                  </Link>
                              )}

                              {hasPermission('course.update') && (
                                  <Link
                                      to={`/courses/edit/${row.original?.id}`}
                                      className="flex gap-5"
                                  >
                                      <FaRegEdit className="text-[19px] text-warning ms-8" />
                                  </Link>
                              )}
                              {hasPermission('course.destroy') && (
                                  <CrudIconDelete
                                      deleteAction={() => {
                                          setCourseId(row.original?.id);
                                          deleteItem();
                                      }}
                                  />
                              )}
                          </div>
                      ),
                      accessorKey: 'x',
                  },
              ]
            : []),
    ];

    const { mutate: Delete } = useMutate({
        mutationKey: [`course/${courseCategoryId}`],
        endpoint: `course/${courseCategoryId}`,

        onSuccess: async (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isDeletedSuccessfully', { name: t('breadcrumb.courses.title') }),
            });

            refetch();
        },
        onError: async (err: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'error',
                title: err?.response?.data?.message,
            });
        },
        formData: true,
        method: 'delete',
    });

    const deleteItem = () => {
        showAlert(t('delete_confirmation'), '', false, t('ok'), true, 'warning', () => Delete({}));
    };

    const initialValues = {
        course_name: searchParams.get('course_name') || '',
        instructor_name: searchParams.get('instructor_name') || '',
        price_from: searchParams.get('price_from') || '',
        price_to: searchParams.get('price_to') || '',
        category_id: searchParams.get('category_id') || '',
    };

    const buildEndpoint = (params: {
        course_name: string;
        instructor_name: string;
        price_from: string;
        price_to: string;
        category_id: string;
    }) => {
        const queryParams = new URLSearchParams({ ...params, page: page.toString() });

        return `course?${queryParams.toString()}`;
    };

    const {
        data: terms,
        refetch,
        isLoading,
    } = useFetch<FetchCourseData>({
        endpoint: buildEndpoint(initialValues),
        queryKey: [buildEndpoint(initialValues)],
    });

    const handleReset = (
        resetForm: () => void,
        setFieldValue: (field: string, value: any) => void
    ) => {
        // Clear search params
        setSearchParams({});
        // Reset form values in Formik
        resetForm();

        // Explicitly reset the category_id field
        setFieldValue('category_id', '');
    };

    return (
        <>
            <Breadcrumb items={breadcrumbItems} />

            {/* filter section */}
            <FilterSection
                isGeneralApi={true}
                apiName="course-category/list-without-pag"
                initialValues={initialValues}
                onSubmit={(values) => {
                    const params = {
                        course_name: values.course_name,
                        instructor_name: values.instructor_name,
                        price_from: values.price_from,
                        price_to: values.price_to,
                        category_id: values.category_id,
                    };
                    setSearchParams(params);
                }}
                onReset={handleReset}
                isLoading={isLoading}
                keywords={['course_name', 'instructor_name', 'price_from', 'price_to']}
                selectKeys={['category_id']}
            />

            <TableCompCustom
                showOnly={true}
                columns={columns}
                data={terms?.data || []}
                paginationData={terms?.meta || []}
                title={t('breadcrumb.courses.add')}
                page={page}
                setPage={setPage}
                isLoading={isLoading}
                downloadAndExport={
                    <>
                        {hasPermission('course.store') && (
                            <Link
                                to="/courses/add"
                                className="bg-gradient-to-r from-primary to-secondary p-2 px-5 text-white font-semibold rounded-[0.25rem]"
                            >
                                <div className="flex items-center gap-2">
                                    <FaPlus />
                                    <span>{t('buttons.add')}</span>
                                </div>
                            </Link>
                        )}
                    </>
                }
            />

            <ModalCustom opened={opened} setOpen={setOpen} title={t('labels.description')}>
                <div
                    dangerouslySetInnerHTML={{
                        __html: selectedDescription || t('not_found'),
                    }}
                ></div>
            </ModalCustom>
        </>
    );
}
