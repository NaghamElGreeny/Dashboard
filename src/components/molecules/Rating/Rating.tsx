import React from 'react';
import { Rating as MantineRating } from '@mantine/core';

type Rating_TP = {
    value: number;
    onChange: (value: number) => void;
};

export default function Rating({ value, onChange }: Rating_TP) {
    return (
        <>
            <MantineRating value={value} onChange={onChange} readOnly />
        </>
    );
}
