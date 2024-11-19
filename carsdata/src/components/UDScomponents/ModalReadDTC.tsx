import React, { useState } from 'react'

const ModalReadDTC = (props: any) => {
    const [selectedSubfunction, setSelectedSubfunction] = useState<string>('');
    const [selectedDTCOptions, setSelectedDTCOptions] = useState<string[]>([]);

    /* Available subfunction options */
    const subfunctionOptions = [
        { label: 'Report the number of DTCs by status mask', value: '1' },
        { label: 'Report DTCs by status mask', value: '2' },
    ];

    /* Available DTC options */
    const dtcOptions = [
        "testFailed",
        "testFailedThisOperationCycle",
        "pendingDTC",
        "confirmedDTC",
        "testNotCompletedSinceLastClear",
        "testFailedSinceLastClear",
        "testNotCompletedThisOperationCycle",
        "warningIndicatorRequested"
    ];

    /* Handle subfunction change */
    const handleSubfunctionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedSubfunction(event.target.value);
    };

    /* Handle DTC option selection */
    const handleDTCOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSelectedDTCOptions(prevState => {
            if (prevState.includes(value)) {
                // Remove from array if already selected
                return prevState.filter(option => option !== value);
            } else {
                // Add to array if not selected
                return [...prevState, value];
            }
        });
    };

    /* Handle Save button click */
    const handleClickSaveBtn = () => {
        props.readDTC(props.ecu_id, selectedSubfunction, selectedDTCOptions, props.setter);
    };

    /* Save button will enable only if a subfunction and at least one DTC option are selected */
    const isSaveDisabled = !selectedSubfunction || selectedDTCOptions.length === 0;

    return (
        <>
            <input type="checkbox" id={props.id} className="modal-toggle" />
            <div className="modal text-black" role="dialog">
                <div className="modal-box">
                    <h3 className="text-lg font-bold">Read DTC</h3>
                    <p className="py-4">Please select the subfunction and DTC options</p>

                    {/* Subfunction Selection */}
                    <div className="flex flex-col space-y-4">
                        <p className="font-semibold">Select Subfunction:</p>
                        {subfunctionOptions.map((option, index) => (
                            <label key={index} className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="subfunction"
                                    value={option.value}
                                    checked={selectedSubfunction === option.value}
                                    onChange={handleSubfunctionChange}
                                    className="radio"
                                />
                                <span>{option.label}</span>
                            </label>
                        ))}
                    </div>

                    {/* DTC Options Selection */}
                    <div className="flex flex-col space-y-4 mt-4">
                        <p className="font-semibold">Select DTC Options:</p>
                        {dtcOptions.map((option, index) => (
                            <label key={index} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    value={option}
                                    checked={selectedDTCOptions.includes(option)}
                                    onChange={handleDTCOptionChange}
                                    className="checkbox"
                                />
                                <span>{option}</span>
                            </label>
                        ))}
                    </div>

                    {/* Modal Action Buttons */}
                    <div className="modal-action">
                        <label htmlFor={props.id} className="btn">Close</label>
                        <label
                            htmlFor={props.id}
                            className={`btn ${isSaveDisabled ? 'btn-disabled' : ''}`}
                            onClick={handleClickSaveBtn}
                        >
                            Save
                        </label>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ModalReadDTC;