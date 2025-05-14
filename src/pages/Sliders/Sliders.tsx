import { MRT_ColumnDef } from 'mantine-react-table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaPlus, FaRegEdit } from 'react-icons/fa';
import { Link, useSearchParams } from 'react-router-dom';
import showAlert from '../../components/atoms/ShowAlert';
import ShowAlertMixin from '../../components/atoms/ShowAlertMixin';
import { Breadcrumb } from '../../components/molecules/BreadCrumbs';
import CrudIconDelete from '../../components/molecules/CrudIconDelete';
import LightBox from '../../components/molecules/LightBox/LightBox';
import Switcher from '../../components/molecules/Switcher';
import TableCompCustom from '../../components/template/tantable/TableCutsom';
import { hasPermission } from '../../helper/permissionHelpers';
import useFetch from '../../hooks/UseFetch';
import { useMutate } from '../../hooks/UseMutate';
import type { FetchSlidersData, Slider } from './types';
import imageError from '/assets/images/logo.png';
import FilterSection from '../../components/atoms/filters/Filters';

export default function Sliders() {
    const { t } = useTranslation();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.sliders.title') },
    ];

    const [sliderId, setSliderId] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [searchParams, setSearchParams] = useSearchParams();

    const statusList = [
        { id: 0, value: 1, label: t('status.active') },
        { id: 1, value: 0, label: t('status.inactive') },
    ];

    const columns: MRT_ColumnDef<Slider>[] = [
        {
            header: '#',
            Cell: ({ row }: any) => row.index + 1,
            size: 40,
        },
        {
            header: t('labels.image'),
            Cell: ({ row }: { row: { original: Slider } }) => (
                <div className="flex gap-5">
                    <LightBox
                        getItems={[
                            {
                                src: row.original?.media || imageError,
                            },
                        ]}
                    />
                </div>
            ),
            accessorKey: 'image',
        },

        {
            accessorKey: 'name',
            header: t('labels.name'),
            Cell: ({ row }: { row: { original: Slider } }) => {
                const name = row.original?.name || '---';
                return <span>{name}</span>;
            },
        },

        {
            accessorKey: 'external_link',
            header: t('labels.external_link'),
            Cell: ({ row }: { row: { original: Slider } }) => {
                const external_link = row.original?.external_link || '---';
                return <span>{external_link}</span>;
            },
        },

        {
            accessorKey: 'start_date',
            header: t('labels.start_date'),
            Cell: ({ row }: { row: { original: Slider } }) => {
                const start_date = row.original?.start_date || '---';
                return <span>{start_date}</span>;
            },
        },

        {
            accessorKey: 'end_date',
            header: t('labels.end_date'),
            Cell: ({ row }: { row: { original: Slider } }) => {
                const end_date = row.original?.end_date || '---';
                return <span>{end_date}</span>;
            },
        },

        ...(hasPermission('slider.toggle')
            ? [
                  {
                      accessorKey: 'is_active',
                      header: t('labels.status'),
                      Cell: ({ row }: any) => {
                          return (
                              <Switcher
                                  label={
                                      row.original?.is_active
                                          ? t('labels.active')
                                          : t('labels.inactive')
                                  }
                                  checked={row.original?.is_active}
                                  onChange={() => {
                                      const newStatus = row.original?.is_active === true ? 0 : 1;
                                      setSliderId(row.original?.id);
                                      changeActive(newStatus);
                                  }}
                              />
                          );
                      },
                  },
              ]
            : [
                  {
                      accessorKey: 'is_active',
                      header: t('labels.status'),
                      Cell: ({ row }: any) => (
                          <span
                              className={`${
                                  row?.original?.is_active ? 'active' : 'inactive'
                              } statuses`}
                          >
                              {row?.original?.is_active ? t('labels.active') : t('labels.inactive')}
                          </span>
                      ),
                  },
              ]),

        ...(hasPermission('slider.update') || hasPermission('slider.destroy')
            ? [
                  {
                      header: t('labels.actions'),
                      Cell: ({ row }: any) => (
                          <div
                              className="flex gap-2 items-center"
                              style={{ marginInlineStart: '1rem' }}
                          >
                              {hasPermission('slider.update') && (
                                  <Link
                                      to={`/sliders/edit/${row.original?.id}`}
                                      className="flex gap-5"
                                  >
                                      <FaRegEdit className="text-[19px] text-warning ms-8" />
                                  </Link>
                              )}

                              {hasPermission('slider.destroy') && (
                                  <CrudIconDelete
                                      deleteAction={() => {
                                          setSliderId(row.original?.id);
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

    const { mutate: ChangeActiveMutate } = useMutate({
        mutationKey: [`slider/toggle/${sliderId}`],
        endpoint: `slider/toggle/${sliderId}`,
        onSuccess: (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title: t('status_changed_successfully'),
            });

            refetch();
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

    const changeActive = (newStatus: any) => {
        showAlert(
            t('toggle_status_confirmation'),
            '',
            false,
            t('ok'),
            true,
            'warning',
            // () => ChangeActiveMutate({ is_active: newStatus, _method: 'put' })
            () => ChangeActiveMutate({ is_active: newStatus })
        );
    };

    const { mutate: Delete } = useMutate({
        mutationKey: [`slider/${sliderId}`],
        endpoint: `slider/${sliderId}`,
        onSuccess: async (data: any) => {
            ShowAlertMixin({
                type: 15,
                icon: 'success',
                title:
                    data?.data?.message ||
                    t('isDeletedSuccessfully', { name: t('labels.sliders') }),
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
        start_date: searchParams.get('start_date') || '',
        end_date: searchParams.get('end_date') || '',
        name: searchParams.get('name') || '',
        status: searchParams.get('status') || '',
    };

    const buildEndpoint = (params: {
        start_date: string;
        end_date: string;
        name: string;
        status: string;
    }) => {
        const queryParams = new URLSearchParams({ ...params, page: page.toString() });

        return `slider?${queryParams.toString()}`;
    };

    const {
        data: terms,
        refetch,
        isLoading,
    } = useFetch<FetchSlidersData>({
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
        // Explicitly reset the status field
        setFieldValue('status', '');
    };

    return (
        <>
            <Breadcrumb items={breadcrumbItems} />

            {/* filter section */}
            <FilterSection
                initialValues={initialValues}
                optionsList={statusList}
                onSubmit={(values) => {
                    const params = {
                        start_date: values.start_date,
                        end_date: values.end_date,
                        name: values.name,
                        status: values.status,
                    };
                    setSearchParams(params);
                }}
                onReset={handleReset}
                isLoading={isLoading}
                keywords={['name']}
                startDateName="start_date"
                endDateName="end_date"
                selectKeys={['status']}
            />

            <TableCompCustom
                showOnly={true}
                columns={columns}
                data={terms?.data || []}
                paginationData={terms?.meta || []}
                title={t('breadcrumb.sliders.add')}
                page={page}
                setPage={setPage}
                isLoading={isLoading}
                downloadAndExport={
                    <>
                        {hasPermission('slider.store') && (
                            <Link
                                to="/sliders/add"
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
        </>
    );
}
