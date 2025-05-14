import { MRT_ColumnDef } from 'mantine-react-table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdOutlineCancel, MdOutlineCheckCircle } from 'react-icons/md';
import showAlert from '../../components/atoms/ShowAlert';
import ShowAlertMixin from '../../components/atoms/ShowAlertMixin';
import { Breadcrumb } from '../../components/molecules/BreadCrumbs';
import LightBox from '../../components/molecules/LightBox/LightBox';
import TableCompCustom from '../../components/template/tantable/TableCutsom';
import useFetch from '../../hooks/UseFetch';
import { useMutate } from '../../hooks/UseMutate';
import type { FetchProviderRequestsData, ProviderRequest } from './types';
import { hasPermission } from '../../helper/permissionHelpers';

export default function ProviderRequests() {
    const { t } = useTranslation();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.providers.title') },
    ];

    const [providerId, setProviderId] = useState<Object>('');
    const [page, setPage] = useState(1);
    const [type, setType] = useState<Object>('');

    const columns: MRT_ColumnDef<ProviderRequest>[] = [
        {
            header: '#',
            Cell: ({ row }: any) => row.index + 1,
            size: 40,
        },
        {
            header: t('labels.image'),
            Cell: ({ row }: { row: { original: ProviderRequest } }) => (
                <div className="flex gap-5">
                    <LightBox
                        getItems={[
                            {
                                src: row.original?.image,
                                // title: row.original.image,
                            },
                        ]}
                    />
                </div>
            ),
            accessorKey: 'image',
        },

        {
            header: t('labels.full_name'),
            Cell: ({ row }: { row: { original: ProviderRequest } }) => {
                const full_name = row.original?.full_name || t('not_found');
                return <span>{full_name}</span>;
            },
            accessorKey: 'full_name',
        },

        {
            header: t('labels.email'),
            Cell: ({ row }: { row: { original: ProviderRequest } }) => {
                const email = row.original?.email || t('not_found');
                return <span>{email}</span>;
            },
            accessorKey: 'email',
        },

        {
            header: t('labels.university'),
            Cell: ({ row }: { row: { original: ProviderRequest } }) => {
                const university = row.original.university || t('not_found');
                return <span>{university}</span>;
            },
            accessorKey: 'university',
        },

        {
            header: t('labels.work_experience'),
            Cell: ({ row }: { row: { original: ProviderRequest } }) => {
                return <span>{row.original?.work_experience || t('not_found')}</span>;
            },
            accessorKey: 'work_experience',
        },

        {
            header: t('labels.license_number'),
            Cell: ({ row }: { row: { original: ProviderRequest } }) => {
                const license_number = row.original.license_number || t('not_found');
                return <span>{license_number}</span>;
            },
            accessorKey: 'license_number',
        },

        {
            header: t('labels.medical_associations'),
            Cell: ({ row }: { row: { original: ProviderRequest } }) => {
                const medical_associations = row.original.medical_associations;
                return <span>{medical_associations}</span>;
            },
            accessorKey: 'medical_associations',
        },

        {
            header: t('labels.scientific_experience'),
            Cell: ({ row }: { row: { original: ProviderRequest } }) => {
                const scientific_experience = row.original.scientific_experience;
                return <span>{scientific_experience}</span>;
            },
            accessorKey: 'scientific_experience',
        },

        {
            accessorKey: 'status',
            header: t('labels.status'),
            Cell: ({ row }: any) => {
                const status = t(`status.${row.original.is_accepted}`) || t('not_found');
                return (
                    <>
                        <span className={`${row.original.is_accepted} statuses `}>{status}</span>
                    </>
                );
            },
        },

        ...(hasPermission('provider-request.accept') || hasPermission('provider-request.reject')
            ? [
                  {
                      header: t('labels.actions'),
                      Cell: ({ renderedCellValue, row }: any) => (
                          <>
                              {(row.original?.is_accepted === 'pending' && (
                                  <div className="flex gap-2 items-center ms-1">
                                      {hasPermission('provider-request.accept') && (
                                          <MdOutlineCheckCircle
                                              onClick={() => {
                                                  setProviderId(row.original?.id);
                                                  setType('accept');
                                                  acceptConfirmation();
                                              }}
                                              className="text-[22px] text-success ms-8 cursor-pointer"
                                          />
                                      )}
                                      {hasPermission('provider-request.reject') && (
                                          <MdOutlineCancel
                                              onClick={() => {
                                                  setProviderId(row.original?.id);
                                                  setType('reject');
                                                  rejectConfirmation();
                                              }}
                                              className="text-[22px] text-red-500 ms-8 cursor-pointer"
                                          />
                                      )}
                                  </div>
                              )) || (
                                  <div
                                      className="flex gap-2 items-center"
                                      style={{ marginInlineStart: '1rem' }}
                                  >
                                      ---
                                  </div>
                              )}
                          </>
                      ),
                      accessorKey: 'x',
                  },
              ]
            : []),
    ];

    const { mutate: acceptOrRejectMutate } = useMutate({
        mutationKey: [`provider-request/${type}/${providerId}`],
        endpoint: `provider-request/${type}/${providerId}`,
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

    const acceptConfirmation = () => {
        showAlert(t('accept_confirmation'), '', false, t('ok'), true, 'warning', () =>
            acceptOrRejectMutate({})
        );
    };

    const rejectConfirmation = () => {
        showAlert(t('reject_confirmation'), '', false, t('ok'), true, 'warning', () =>
            acceptOrRejectMutate({})
        );
    };

    const queryParams = {
        page: page,
    };

    const searchParams = new URLSearchParams(queryParams as any);
    const endpoint = `provider-request?${searchParams.toString()}`;

    const {
        data: terms,
        refetch,
        isLoading,
    } = useFetch<FetchProviderRequestsData>({
        endpoint: endpoint,
        queryKey: [endpoint],
    });

    return (
        <>
            <Breadcrumb items={breadcrumbItems} />

            <TableCompCustom
                showOnly={true}
                columns={columns}
                data={terms?.data || []}
                paginationData={terms?.meta || []}
                title={t('breadcrumb.providers.add')}
                page={page}
                setPage={setPage}
                isLoading={isLoading}
            />
        </>
    );
}
