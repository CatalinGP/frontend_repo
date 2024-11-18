import React, { useState } from 'react'

const ModalClearDTC = (props: any) => {
    const [selectedOption, setSelectedOption] = useState<string>('');

    /* Options that can be selected */
    const options = [
        { label: "Powertrain-related DTCs", value: "p" },
        { label: "Chassis-related DTCs", value: "c" },
        { label: "Body-related DTCs", value: "b" },
        { label: "Network-related DTCs", value: "u" },
        { label: "All DTCs", value: "a" }
    ];

    /* Handle the change of selected radio button */
    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedOption(event.target.value);
    }

    const handleClickSaveBtn = () => {
        props.clearDTC(props.ecu_id, selectedOption, props.setter);
    }

    return (
        <>
            <input type="checkbox" id={props.id} className="modal-toggle" />
            <div className="modal text-black" role="dialog">
                <div className="modal-box">
                    <h3 className="text-lg font-bold">Clear DTC</h3>
                    <p className="py-4">Please select an option:</p>
                    <div className="flex flex-col space-y-4">
                        {options.map((option: { label: string, value: string }, index: number) => (
                            <label key={index} className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="option"
                                    value={option.value}
                                    checked={selectedOption === option.value}
                                    onChange={handleOptionChange}
                                    className="radio"
                                />
                                <span>{option.label}</span>
                            </label>
                        ))}
                    </div>
                    <div className="modal-action">
                        <label htmlFor={props.id} className="btn">Close</label>
                        <label
                            htmlFor={props.id}
                            className={`btn ${!selectedOption ? 'btn-disabled' : ''}`}
                            onClick={handleClickSaveBtn}
                        >
                            Save
                        </label>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ModalClearDTC;