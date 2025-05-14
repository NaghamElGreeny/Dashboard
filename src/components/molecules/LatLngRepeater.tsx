import React, { useState } from 'react';
import { BaseInputField } from '../atoms/BaseInputField';

const LatLngInputsRepeater = () => {
    const [inputs, setInputs] = useState([{ id: 1, lat: '', lng: '' }]);

    const addInput = () => {
        setInputs([...inputs, { id: Date.now(), lat: '', lng: '' }]);
    };

    const removeInput = (id: any) => {
        setInputs(inputs.filter((input) => input.id !== id));
    };

    return (
        <>
            {inputs.map((input, index) => (
                <React.Fragment key={input.id}>
                    <div className="col-span-5">
                        <BaseInputField
                            label={`area lat ${index + 1}`}
                            name={`area_lat_${input.id}`}
                            id={`lat_${input.id}`}
                            type="text"
                            placeholder="area lat"
                            value={input.lat}
                            onChange={(e) => {
                                const newInputs = [...inputs];
                                newInputs[index].lat = e.target.value;
                                setInputs(newInputs);
                            }}
                        />
                    </div>
                    <div className="col-span-5">
                        <BaseInputField
                            label={`area lng ${index + 1}`}
                            name={`area_lng_${input.id}`}
                            id={`lng_${input.id}`}
                            type="text"
                            placeholder="area lng"
                            value={input.lng}
                            onChange={(e) => {
                                const newInputs = [...inputs];
                                newInputs[index].lng = e.target.value;
                                setInputs(newInputs);
                            }}
                        />
                    </div>
                    {inputs.length > 1 && (
                        <div className="col-span-2 flex gap-3 items-end pb-3">
                            <img
                                src="/assets/images/icons8-add-50.png"
                                className="w-[25px] h-[25px] cursor-pointer"
                                onClick={() => addInput()}
                            />
                            <img
                                src="/assets/images/Trash Bin Trash.png"
                                className="w-[25px] h-[25px] cursor-pointer"
                                onClick={() => removeInput(input.id)}
                            />
                        </div>
                    )}
                </React.Fragment>
            ))}
            {inputs.length === 1 && (
                <div className="col-span-2 flex gap-3 items-end pb-3">
                    <img
                        src="/assets/images/icons8-add-50.png"
                        className="w-[25px] h-[25px] cursor-pointer"
                        onClick={() => addInput()}
                    />
                </div>
            )}
        </>
    );
};

export default LatLngInputsRepeater;
