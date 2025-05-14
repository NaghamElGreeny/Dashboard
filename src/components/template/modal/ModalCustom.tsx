import React, { useEffect, useState } from 'react';
import { Modal, ScrollArea } from '@mantine/core';
import Button from '../../atoms/Button';
import { C } from '@fullcalendar/core/internal-common';
import { useTranslation } from 'react-i18next';
type Modal_TP = {
    opened?: boolean;
    children?: React.ReactNode;
    setOpen?: (opened: boolean) => void;
    title?: string;
};
const ModalCustom = ({ opened, setOpen, title, children }: Modal_TP) => {
    const [windowSize, setWindowSize] = useState<number | any>();
    const { t } = useTranslation();

    useEffect(() => {
        function handleResize() {
            setWindowSize(window.innerWidth);
        }
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <Modal
            centered
            //@ts-ignore.
            opened={opened}
            size={windowSize >= 900 ? '65%' : windowSize >= 600 ? '90%' : '95%'}
            onClose={() => setOpen?.(!opened)}
            //@ts-ignore
            title={title}
            scrollAreaComponent={ScrollArea.Autosize}
            radius={15}
            className="overflow-y-visible"
        >
            {children}
        </Modal>
    );
};

export default ModalCustom;
