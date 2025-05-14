import { MRT_ColumnDef } from 'mantine-react-table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaEye, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Breadcrumb } from '../../components/molecules/BreadCrumbs';
import LightBox from '../../components/molecules/LightBox/LightBox';
import TableCompCustom from '../../components/template/tantable/TableCutsom';
import useFetch from '../../hooks/UseFetch';
import Rating from '../../components/molecules/Rating/Rating';
import Switcher from '../../components/molecules/Switcher';
import { useMutate } from '../../hooks/UseMutate';
import ShowAlertMixin from '../../components/atoms/ShowAlertMixin';
import showAlert from '../../components/atoms/ShowAlert';
import ModalCustom from '../../components/template/modal/ModalCustom';
import BanUser from '../../components/template/BanUser/BanUser';

export default function NewProviders() {
    const { t, i18n } = useTranslation();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.new_providers.title') },
    ];

    const [providerId, setProviderId] = useState<Object>('');
    const [page, setPage] = useState(1);
    const [opened, setOpen] = useState<boolean>(false);

    const columns: MRT_ColumnDef[] = [
        {
            header: '#',
            Cell: ({ row }: any) => row.index + 1,
            size: 40,
        },
        {
            header: t('labels.image'),
            Cell: ({ renderedCellValue, row }: any) => (
                <div className="flex gap-5">
                    <LightBox
                        getItems={[
                            {
                                src: row.original.image,
                                // title: row.original.image,
                            },
                        ]}
                    />
                </div>
            ),
            accessorKey: 'image',
        },

        {
            header: t('labels.charge_name'),
            Cell: ({ row }: any) => {
                const charge_name = row.original?.charge_name || t('not_found');
                return <span>{charge_name}</span>;
            },
            accessorKey: 'charge_name',
        },

        {
            header: t('labels.store_name'),
            Cell: ({ row }: any) => {
                const store_name = row.original?.store_name || t('not_found');
                return <span>{store_name}</span>;
            },
            accessorKey: 'store_name',
        },

        {
            header: t('labels.commercial_registration_number'),
            Cell: ({ row }: any) => {
                const num_commercial_register =
                    row.original.num_commercial_register || t('not_found');
                return <span>{num_commercial_register}</span>;
            },
            accessorKey: 'num_commercial_register',
        },

        {
            header: t('labels.phone'),
            Cell: ({ row }: any) => {
                return <span>{row.original?.phone_complete_form || t('not_found')}</span>;
            },
            accessorKey: 'phone_complete_form',
        },

        {
            header: t('labels.email'),
            Cell: ({ row }: any) => {
                const email = row.original.email || t('not_found');
                return <span>{email}</span>;
            },
            accessorKey: 'email',
        },

        {
            header: t('labels.app_dues_amount'),
            Cell: ({ row }: any) => {
                const app_dues_amount = row.original.app_dues_amount;
                return <span>{app_dues_amount}</span>;
            },
            accessorKey: 'app_dues_amount',
        },

        {
            header: t('labels.bank_account_number'),
            Cell: ({ row }: any) => {
                const bank_account_number = row.original.bank_account_number;
                return <span>{bank_account_number}</span>;
            },
            accessorKey: 'bank_account_number',
        },
        {
            header: t('labels.rate'),
            Cell: ({ row }: any) => (
                <Rating value={row.original?.rate} onChange={row.original?.rate} />
            ),
            accessorKey: 'rate',
        },

        {
            accessorKey: 'is_admin_active_provider',
            header: t('labels.status'),
            Cell: ({ row }: any) => {
                return (
                    <Switcher
                        label={
                            row.original?.is_admin_active_provider
                                ? t('labels.active')
                                : t('labels.inactive')
                        }
                        checked={row.original?.is_admin_active_provider}
                        onChange={() => {
                            const newStatus =
                                row.original?.is_admin_active_provider === true ? 0 : 1;
                            setProviderId(row.original?.id);
                            changeActive(newStatus);
                        }}
                    />
                );
            },
        },

        {
            accessorKey: 'is_ban',
            header: t('labels.ban_status'),
            Cell: ({ row }: any) => {
                return (
                    <Switcher
                        label={row.original?.is_ban ? t('labels.ban') : t('labels.un_ban')}
                        checked={!row.original?.is_ban}
                        onChange={() => {
                            setProviderId(row.original?.id);
                            row.original?.is_ban === true
                                ? changeBan(row.original?.id)
                                : setOpen(true);
                        }}
                    />
                );
            },
        },

        {
            header: t('labels.actions'),
            Cell: ({ row }: any) => (
                <div className="flex gap-2 items-center ms-1">
                    <Link to={`/providers/show/${row.original.id}`} className="flex gap-5">
                        <FaEye className="text-[19px] text-[#50cd89] ms-8" />
                    </Link>
                </div>
            ),
            accessorKey: 'actions',
        },
    ];

    const { mutate: ChangeActiveMutate } = useMutate({
        mutationKey: [`admin_active_provider/${providerId}`],
        endpoint: `admin_active_provider/${providerId}`,
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
            // () => ChangeActiveMutate({ status: newStatus, _method: 'put' })
            () => ChangeActiveMutate({ is_admin_active_provider: newStatus })
        );
    };

    const { mutate: ChangeBanMutate } = useMutate({
        mutationKey: [`admin_ban_provider`],
        endpoint: `admin_ban_provider`,
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

    const changeBan = (id: any) => {
        showAlert(
            t('toggle_status_confirmation'),
            '',
            false,
            t('ok'),
            true,
            'warning',
            // () => ChangeActiveMutate({ is_admin_active_provider: newStatus, _method: 'put' })
            () => ChangeBanMutate({ id: id })
        );
    };

    const queryParams = {
        page: page,
    };

    const searchParams = new URLSearchParams(queryParams as any);
    const endpoint = `povider_not_active?${searchParams.toString()}`;

    const {
        data: terms,
        refetch,
        isLoading,
    } = useFetch<any>({
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
                title={t('breadcrumb.new_providers.add')}
                page={page}
                setPage={setPage}
                isLoading={isLoading}
            />

            <ModalCustom
                opened={opened}
                setOpen={setOpen}
                title={t('labels.ban_user', { name: t('labels.provider') })}
            >
                <div>
                    <BanUser
                        setOpen={setOpen}
                        refetch={refetch}
                        dataInfo={providerId}
                        apiName="admin_ban_provider"
                    />
                </div>
            </ModalCustom>
        </>
    );
}
