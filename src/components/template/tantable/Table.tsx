// @ts-nocheck
import {
    MantineReactTable,
    useMantineReactTable,
    type MRT_ColumnDef,
    type MRT_Row,
    MRT_PaginationState,
} from 'mantine-react-table';
import { Box, Button, Pagination } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import { mkConfig, generateCsv, download } from 'export-to-csv'; //or use your library of choice here
import { AddIcon } from '../../atoms/icons';
import React, { useEffect, useState } from 'react';
import PaginationComponent from '../../molecules/Pagination/Pagination';
import Paginate from '../../molecules/Pagination/Pagination';
import NextPaginationIc from '../../atoms/NextPaginationIc';
import { useTranslation } from 'react-i18next';

const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
});

const TableComp = ({
    columns,
    setOpen,
    data,
    paginationData,
    title,
    page,
    setPage,
    showOnly,
    isLoading,
}: any) => {
    const { t } = useTranslation();
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    useEffect(() => {
        setPage(pagination.pageIndex + 1);
    }, [pagination.pageIndex]);

    const handleExportRows = (rows: MRT_Row<any>[]) => {
        const rowData = rows.map((row) => row.original);
        const csv = generateCsv(csvConfig)(rowData);
        download(csvConfig)(csv);
    };

    const handleExportData = () => {
        const csv = generateCsv(csvConfig)(data);
        download(csvConfig)(csv);
    };

    const table = useMantineReactTable({
        columns,
        data,
        manualPagination: true,
        onPaginationChange: setPagination,
        rowCount: paginationData?.total,
        state: {
            pagination,
        },
        mantinePaginationProps: {
            rowsPerPageOptions: ['10'],
            withEdges: false,
        },
        enablePagination: false,
        enableBottomToolbar: false,

        columnFilterDisplayMode: 'popover',
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',

        renderTopToolbarCustomActions: ({ table }) => (
            <Box
                sx={{
                    display: 'flex',
                    gap: '16px',
                    padding: '8px',
                    flexWrap: 'wrap',
                }}
            >
                <Button
                    color="lightblue"
                    //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                    onClick={handleExportData}
                    leftIcon={<IconDownload />}
                    variant="filled"
                    className="bg-[#000000]"
                >
                    {t('Export All Data')}
                </Button>
                <Button
                    disabled={table.getPrePaginationRowModel().rows.length === 0}
                    //export all rows, including from the next page, (still respects filtering and sorting)
                    onClick={() => handleExportRows(table.getPrePaginationRowModel().rows)}
                    leftIcon={<IconDownload />}
                    variant="filled"
                    className="bg-[#000000]"
                >
                    {t('Export All Rows')}
                </Button>
                <Button
                    disabled={table.getRowModel().rows.length === 0}
                    //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
                    onClick={() => handleExportRows(table.getRowModel().rows)}
                    leftIcon={<IconDownload />}
                    variant="filled"
                    className="bg-[#000000]"
                >
                    {t('Export Page Rows')}
                </Button>
                {!showOnly && (
                    <Button
                        // disabled={table.getRowModel().rows.length === 0}
                        //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
                        onClick={() => setOpen(true)}
                        leftIcon={<AddIcon />}
                        variant="filled"
                        className="bg-[#000000]"
                    >
                        {t(title)}
                    </Button>
                )}

                <Button
                    disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                    //only export selected rows
                    onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
                    leftIcon={<IconDownload />}
                    variant="filled"
                    className="bg-[#000000]"
                >
                    {t('Export Selected Rows')}
                </Button>
            </Box>
        ),
    });

    return (
        <>
            {isLoading && (
                <div className="screen_loader fixed inset-0 bg-[#fafafa] dark:bg-[#060818] z-[60] grid place-content-center animate__animated">
                    <svg
                        width="64"
                        height="64"
                        viewBox="0 0 135 135"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#000000"
                    >
                        <path d="M67.447 58c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10zm9.448 9.447c0 5.523 4.477 10 10 10 5.522 0 10-4.477 10-10s-4.478-10-10-10c-5.523 0-10 4.477-10 10zm-9.448 9.448c-5.523 0-10 4.477-10 10 0 5.522 4.477 10 10 10s10-4.478 10-10c0-5.523-4.477-10-10-10zM58 67.447c0-5.523-4.477-10-10-10s-10 4.477-10 10 4.477 10 10 10 10-4.477 10-10z">
                            <animateTransform
                                attributeName="transform"
                                type="rotate"
                                from="0 67 67"
                                to="-360 67 67"
                                dur="2.5s"
                                repeatCount="indefinite"
                            />
                        </path>
                        <path d="M28.19 40.31c6.627 0 12-5.374 12-12 0-6.628-5.373-12-12-12-6.628 0-12 5.372-12 12 0 6.626 5.372 12 12 12zm30.72-19.825c4.686 4.687 12.284 4.687 16.97 0 4.686-4.686 4.686-12.284 0-16.97-4.686-4.687-12.284-4.687-16.97 0-4.687 4.686-4.687 12.284 0 16.97zm35.74 7.705c0 6.627 5.37 12 12 12 6.626 0 12-5.373 12-12 0-6.628-5.374-12-12-12-6.63 0-12 5.372-12 12zm19.822 30.72c-4.686 4.686-4.686 12.284 0 16.97 4.687 4.686 12.285 4.686 16.97 0 4.687-4.686 4.687-12.284 0-16.97-4.685-4.687-12.283-4.687-16.97 0zm-7.704 35.74c-6.627 0-12 5.37-12 12 0 6.626 5.373 12 12 12s12-5.374 12-12c0-6.63-5.373-12-12-12zm-30.72 19.822c-4.686-4.686-12.284-4.686-16.97 0-4.686 4.687-4.686 12.285 0 16.97 4.686 4.687 12.284 4.687 16.97 0 4.687-4.685 4.687-12.283 0-16.97zm-35.74-7.704c0-6.627-5.372-12-12-12-6.626 0-12 5.373-12 12s5.374 12 12 12c6.628 0 12-5.373 12-12zm-19.823-30.72c4.687-4.686 4.687-12.284 0-16.97-4.686-4.686-12.284-4.686-16.97 0-4.687 4.686-4.687 12.284 0 16.97 4.686 4.687 12.284 4.687 16.97 0z">
                            <animateTransform
                                attributeName="transform"
                                type="rotate"
                                from="0 67 67"
                                to="360 67 67"
                                dur="8s"
                                repeatCount="indefinite"
                            />
                        </path>
                    </svg>
                </div>
            )}
            <MantineReactTable table={table} />
            <div className="my-6 flex justify-end">
                <Pagination value={page} onChange={setPage} total={paginationData?.last_page} />
            </div>
        </>
    );
};

export default TableComp;
