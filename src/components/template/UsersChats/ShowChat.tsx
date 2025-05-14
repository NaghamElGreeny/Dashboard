import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import useFetch from '../../../hooks/UseFetch';
import Loading from '../../atoms/loading';
import { Breadcrumb } from '../../molecules/BreadCrumbs';
import LightBox from '../../molecules/LightBox/LightBox';
import imageError from '/assets/images/logo.png';

// Component for rendering user info (reusable for client/provider)
const UserInfo = ({ image, name }: { image: string; name: string }) => (
    <div className="flex items-center gap-3">
        <img
            src={image || imageError}
            alt="user"
            className="w-[80px] h-[80px] object-contain rounded-full border border-border-primary"
        />
        <p className="font-bold">{name || 'Unknown User'}</p>
    </div>
);

export default function ShowChat() {
    const { t, i18n } = useTranslation();
    const locale = i18n.language;
    const { id } = useParams();

    const breadcrumbItems = [
        { label: t('breadcrumb.home'), to: '/' },
        { label: t('breadcrumb.users_chats.title'), to: '/users-chats/index' },
        { label: t('breadcrumb.users_chats.show') },
    ];

    const {
        data: showData,
        isError: showDataError,
        isLoading: showDataLoading,
        isSuccess: showDataSuccess,
    } = useFetch<any>({
        endpoint: `chat/${id}`,
        queryKey: [`chat/${id}`],
    });

    if (showDataLoading) {
        return <Loading />;
    }

    return (
        <>
            <Breadcrumb items={breadcrumbItems} />
            {showDataSuccess && (
                <div className="grid grid-cols-1 rounded-xl">
                    <div className="bg-white shadow-md rounded-lg h-[100px] flex justify-between items-center p-3">
                        <UserInfo
                            image={showData?.data?.sender?.image}
                            name={showData?.data?.sender?.full_name}
                        />
                        <UserInfo
                            image={showData?.data?.receiver?.image}
                            name={showData?.data?.receiver?.full_name}
                        />
                    </div>

                    {/* Chat Messages */}
                    <div className="p-4 bg-white shadow-md rounded-lg h-[70vh] overflow-y-auto overflow-x-hidden mt-5">
                        {showData?.data?.messages?.length > 0 ? (
                            showData?.data?.messages?.map(
                                (
                                    message: {
                                        message: string;
                                        sent_at: string;
                                        message_type: string;
                                    },
                                    index: number
                                ) => {
                                    // Determine the message type based on index
                                    const messageType = index % 2 === 0 ? 'sender' : 'receiver';

                                    return (
                                        <div
                                            key={index}
                                            className={`mb-5 flex ${
                                                messageType === 'sender'
                                                    ? 'justify-start'
                                                    : 'justify-end'
                                            }`}
                                        >
                                            {messageType === 'sender' ? (
                                                <div className="max-w-[365px] px-4 py-2 rounded-lg bg-primary text-white">
                                                    {message?.message_type === 'text' ? (
                                                        <p className="font-bold text-start">
                                                            {message.message}
                                                        </p>
                                                    ) : (
                                                        <LightBox
                                                            isChat={true}
                                                            getItems={[
                                                                {
                                                                    src:
                                                                        message?.message ||
                                                                        imageError,
                                                                },
                                                            ]}
                                                        />
                                                    )}
                                                    <p className="text-md text-end">
                                                        {message.sent_at}
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="flex items-end">
                                                    <div className="max-w-[365px] px-4 py-2 rounded-lg border">
                                                        {message?.message_type === 'text' ? (
                                                            <p className="font-bold text-start text-primary">
                                                                {message.message}
                                                            </p>
                                                        ) : (
                                                            <LightBox
                                                                isChat={true}
                                                                getItems={[
                                                                    {
                                                                        src:
                                                                            message?.message ||
                                                                            imageError,
                                                                    },
                                                                ]}
                                                            />
                                                        )}
                                                        <p className="text-md text-end text-primary">
                                                            {message.sent_at}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                }
                            )
                        ) : (
                            <h5 className="text-center text-2xl font-bold text-primary my-auto">
                                {t('labels.no_messages')}
                            </h5>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
