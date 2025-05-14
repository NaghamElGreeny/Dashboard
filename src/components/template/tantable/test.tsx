import {
    MantineReactTable,
    useMantineReactTable,
    type MRT_ColumnDef,
    type MRT_Row,
    MRT_PaginationState,
    MRT_RowSelectionState,
} from 'mantine-react-table';
import { Box, Button, Pagination } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import { mkConfig, generateCsv, download } from 'export-to-csv'; //or use your library of choice here
import { AddIcon } from '../../atoms/icons';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';

const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
});

const TableCompCustom = ({
    columns,
    setOpen,
    data,
    paginationData,
    downloadAndExport,
    title,
    page,
    setPage,
    showOnly,
    customButtonAddTop,
    isEnableRowSelect,
    isLoading,
    selectedRowIds,
    name,
}: any) => {
    let setFieldValue: any;
    let values;

    if (isEnableRowSelect) {
        const formik = useFormikContext();

        if (formik) {
            ({ setFieldValue, values } = formik);
        }
    }
    const [previousSelectedRows, setPreviousSelectedRows] = useState<any[]>([]);

    // Initialize row selection state based on selectedRowIds prop
    const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});

    const { t } = useTranslation();
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    useEffect(() => {
        // setPage(pagination.pageIndex + 1);
    }, [pagination.pageIndex]);

    const globalFilterFn = (row: MRT_Row<any>, columnIds: string[], filterValue: string) => {
        const searchValue = filterValue?.toLowerCase();

        return columnIds?.some((columnId) => {
            const cellValue = row.original[columnId];
            // Safely convert cellValue to a string or fallback to an empty string
            return (cellValue ? cellValue.toString().toLowerCase() : '').includes(searchValue);
        });
    };

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

        enableRowSelection: isEnableRowSelect,

        manualPagination: true,
        getRowId: (originalRow: any) => originalRow.id,

        onRowSelectionChange: setRowSelection,

        onPaginationChange: setPagination,
        rowCount: paginationData?.total,
        state: {
            pagination,
            rowSelection,
        },

        mantinePaginationProps: {
            rowsPerPageOptions: ['10'],
            withEdges: false,
        },
        enablePagination: false,
        enableBottomToolbar: false,
        enableColumnActions: false,
        enableColumnFilters: false, // Hide the Show/Hide Filters button
        enableGlobalFilter: true, // Retain the search functionality

        // @ts-ignore
        globalFilterFn, // Use the custom global filter function

        // enableGlobalFilter: false,
        // columnFilterDisplayMode: 'popover',

        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',

        mantineTableBodyRowProps: ({ row }) => ({
            onClick: row.getToggleSelectedHandler(),
            sx: { cursor: 'pointer' },
        }),

        renderEmptyRowsFallback: () => (
            <div className="text-center p-10 font-semibold">{t('no_data')}</div>
        ),
        renderTopToolbarCustomActions: ({ table }) => (
            <Box
                sx={{
                    display: 'flex',
                    gap: '16px',
                    padding: '8px',
                    flexWrap: 'wrap',
                }}
            >
                {/* <Button
                    color="lightblue"
                    //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                    onClick={handleExportData}
                    leftIcon={<IconDownload />}
                    variant="filled"
                    className="bg-primary"
                >
                    Export All Data
                </Button>
                <Button
                    disabled={table.getPrePaginationRowModel().rows.length === 0}
                    //export all rows, including from the next page, (still respects filtering and sorting)
                    onClick={() => handleExportRows(table.getPrePaginationRowModel().rows)}
                    leftIcon={<IconDownload />}
                    variant="filled"
                    className="bg-primary"
                >
                    Export All Rows
                </Button>
                <Button
                    disabled={table.getRowModel().rows.length === 0}
                    //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
                    onClick={() => handleExportRows(table.getRowModel().rows)}
                    leftIcon={<IconDownload />}
                    variant="filled"
                    className="bg-primary"
                >
                    Export Page Rows
                </Button> */}

                {downloadAndExport && downloadAndExport}

                {customButtonAddTop && (
                    <Link
                        to="add"
                        className="bg-primary h-[2.25rem] text-white px-[1.125rem] flex items-center rounded-[0.25rem] font-bold"
                    >
                        {t('buttons.add')}
                    </Link>
                )}

                {!showOnly && (
                    <Button
                        // disabled={table.getRowModel().rows.length === 0}
                        //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
                        onClick={() => setOpen(true)}
                        leftIcon={<AddIcon />}
                        variant="filled"
                        className="bg-gradient-to-r from-primary to-secondary"
                    >
                        {title}
                    </Button>
                )}

                {/* <Button
                    disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                    //only export selected rows
                    onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
                    leftIcon={<IconDownload />}
                    variant="filled"
                    className="bg-primary"
                >
                    Export Selected Rows
                </Button> */}
            </Box>
        ),
    });

    // Function to handle row selection
    const handleRowSelectionChange = () => {
        if (!isEnableRowSelect || !setFieldValue) return; // Skip if row selection or Formik context is not enabled

        const selectedRows = table.getSelectedRowModel().rows;

        // Extract the IDs from the selected rows
        const selectedProductDetails = selectedRows.map((row: any, index: number) => ({
            [`${name}[${index}][id]`]: row.original.id,
        }));

        // Only update Formik if the selection has changed to prevent an infinite loop
        if (JSON.stringify(selectedProductDetails) !== JSON.stringify(previousSelectedRows)) {
            setFieldValue(name, selectedProductDetails);
            setPreviousSelectedRows(selectedProductDetails); // Track the previous selection to avoid re-renders
        }
    };

    useEffect(() => {
        // Initialize row selection state based on selectedRowIds prop if it changes
        if (selectedRowIds && Array.isArray(selectedRowIds)) {
            const initialSelection: MRT_RowSelectionState = {};
            selectedRowIds.forEach((id) => {
                initialSelection[id] = true;
            });
            setRowSelection((prevSelection) => ({
                ...prevSelection,
                ...initialSelection,
            }));
        }
    }, [selectedRowIds]);

    // Use effect to listen for changes in selected rows but prevent continuous triggering
    useEffect(() => {
        if (isEnableRowSelect) {
            handleRowSelectionChange();
        }
    }, [table.getSelectedRowModel().rows]);

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
            {page && (
                <div className="my-6 flex justify-end">
                    <Pagination value={page} onChange={setPage} total={paginationData?.last_page} />
                </div>
            )}
        </>
    );
};

export default TableCompCustom;
