import React, { useState } from 'react'

const ModalHvacModes = (props: any) => {
    const [hvacModes, setHvacModes] = useState([0, 0, 0, 0,0 ]);

    const handleDropdownChange = (index: number, value: number) => {
        const updatedModes = [...hvacModes];
        updatedModes[index] = value;
        setHvacModes(updatedModes);
    }

    const handleClickSaveBtn = () => {

        const binaryString = hvacModes.join('');

        props.writeInfo('hvac_modes', binaryString, props.setter, { manual_flow: props.manual });
    }

    return (
        <>
            <input type="checkbox" id={props.id} className="modal-toggle" />
            <div className="modal text-black" role="dialog">
                <div className="modal-box">
                    <h3 className="text-lg font-bold">HVAC Modes</h3>
                    <p className="py-4">Set the HVAC Modes</p>

                    <div className="space-y-4">
                        {/* Wrapper with flex layout for label and select */}
                        {[
                            { label: 'AC Status', value: hvacModes[4], index: 4 },
                            { label: 'Air Recirculation', value: hvacModes[1], index: 1 },
                            { label: 'Defrost', value: hvacModes[0], index: 0 },
                            { label: 'Front', value: hvacModes[2], index: 2 },
                            { label: 'Legs', value: hvacModes[3], index: 3 }
                        ].map(({ label, value, index }) => (
                            <div key={index} className="flex items-center gap-2">
                                <label className="w-32">{label}</label>
                                <select
                                    className="select select-bordered w-full max-w-xs"
                                    value={value}
                                    onChange={(e) => handleDropdownChange(index, parseInt(e.target.value))}
                                >
                                    <option value={0}>Off</option>
                                    <option value={1}>On</option>
                                </select>
                            </div>
                        ))}

                    </div>

                    <div className="modal-action">
                        <label htmlFor={props.id} className="btn">Close</label>
                        <label htmlFor={props.id} className="btn" onClick={handleClickSaveBtn}>Save</label>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ModalHvacModes;