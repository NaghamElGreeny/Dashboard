import { useTranslation } from 'react-i18next';
import { FaTransgender } from 'react-icons/fa';
import { MdAdminPanelSettings, MdEmail, MdPhone } from 'react-icons/md';
import Loading from '../../components/atoms/loading';
import { Breadcrumb } from '../../components/molecules/BreadCrumbs';
import CardItem from '../../components/molecules/CardItem';
import LightBox from '../../components/molecules/LightBox/LightBox';
import useFetch from '../../hooks/UseFetch';
import defaultAvatar from '/assets/images/avatar.jpg';

export default function ProfilePage() {
    const { t } = useTranslation();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.profile.title') },
        { label: t('breadcrumb.profile.show') },
    ];

    const {
        data: showProfile,
        isError: showProfileError,
        isLoading: showProfileLoading,
        isSuccess: showProfileSuccess,
        refetch: refetch,
    } = useFetch<any>({
        endpoint: `profile`,
        queryKey: [`profile`],
    });

    return (
        <>
            {(showProfileLoading && <Loading />) || (
                <>
                    <Breadcrumb items={breadcrumbItems} />
                    {showProfileSuccess && (
                        <div className="flex flex-col items-center dark:bg-black bg-white shadow-lg rounded-lg p-6 w-full">
                            <LightBox
                                isShow
                                getItems={[
                                    {
                                        src: showProfile?.data?.image?.url || defaultAvatar,
                                        title: showProfile?.data?.full_name,
                                    },
                                ]}
                            />
                            <h2 className="text-2xl font-bold text-primary mt-4">
                                {showProfile?.data?.full_name || 'User'}
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 w-full">
                                {/* email */}
                                <CardItem
                                    icon={<MdEmail className="w-8 h-8" />}
                                    label={t('labels.email')}
                                    value={showProfile?.data?.email || t('not_found')}
                                />

                                {/* gender */}
                                <CardItem
                                    icon={<FaTransgender className="w-8 h-8" />}
                                    label={t('labels.gender')}
                                    value={
                                        t(`labels.${showProfile?.data?.gender}`) || t('not_found')
                                    }
                                />

                                {/* Phone Number
                                <CardItem
                                    icon={<MdPhone className="w-8 h-8" />}
                                    label={t('labels.phone')}
                                    value={
                                        showProfile?.data?.phone_code && showProfile?.data?.phone
                                            ? `${showProfile.data.phone_code}${showProfile.data.phone}`
                                            : t('not_found')
                                    }
                                /> */}

                                {/* user_type */}
                                <CardItem
                                    icon={<MdAdminPanelSettings className="w-8 h-8" />}
                                    label={t('labels.user_type')}
                                    value={`${showProfile?.data?.user_type ||
                                        // t(`labels.${showProfile?.data?.user_type}`) ||
                                        t('not_found')
                                        }`}
                                />
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    );
}
