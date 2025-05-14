import { Skeleton } from '@mantine/core';

type TableSkelton_TP = {
    loading?: boolean;
    rowsNum?: number;
};

const TableSkelton = ({
    loading,
    rowsNum,
}: TableSkelton_TP) => {
    const rows = Array(rowsNum)
        .fill(rowsNum)
        .map(() => (
            <tr className="border-b hover:bg-gray-50 dark:hover:bg-dark-dark-light border-[#f3f3f3]  dark:border-dark">
                {Array(rowsNum)
                    .fill(rowsNum)
                    .map(() => (
                        <td className="md:p-5 p-2">
                            <Skeleton
                                className="md:w-[80%] w-[100%] dark:bg-dark-dark-light"
                                height={10}
                                radius="md"
                                visible={loading}
                            />
                        </td>
                    ))}
            </tr>
        ));

    return (
        <table className="w-full p-5  rounded bg-white dark:bg-black dark:border-black-dark-light border-gray-50 shadow">
            <tr className="border-b  dark:bg-dark-dark-light dark:border-dark bg-gray-100">
                {Array(rowsNum)
                    .fill(rowsNum)
                    .map(() => (
                        <th className="text-left md:p-5 p-2">
                            <Skeleton
                                className="md:w-[80%] w-[100%]"
                                radius="md"
                                height={10}
                                visible={loading}
                            />
                        </th>
                    ))}
            </tr>
            {rows}
        </table>
    );
};

export default TableSkelton;
