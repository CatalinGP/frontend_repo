'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import ModalUDS from './ModalUDS';
import './style.css';
import { displayLoadingCircle, displayErrorPopup, removeLoadingCicle } from '../sharedComponents/LoadingCircle';
import logger from '@/src/utils/Logger';

export interface HVACData {
    ambient_air_temperature: number;
    cabin_temperature: number;
    cabin_temperature_driver_set: number;
    fan_speed: number;
    mass_air_flow: number;
    ac_status: boolean;
    air_recirculation: boolean;
    defrost: boolean;
    front: boolean;
    legs: boolean;
}

export const readInfoHVAC = async (isManualFlow: boolean, setData: any) => {
    displayLoadingCircle();
    console.log("Reading HVAC info...");
    try {
        const response = await fetch(`http://127.0.0.1:5000/api/read_info_hvac?is_manual_flow=${isManualFlow}`, {
            method: "GET",
        });

        const data = await response.json();
        console.log(data);

        if (data) {
            setData(data);
            if (data?.ERROR === "interrupted") {
                displayErrorPopup("Connection failed");
            }
        } else {
            displayErrorPopup("No data received");
        }
    } catch (error) {
        console.log(error);
        displayErrorPopup("Connection failed");
    } finally {
        removeLoadingCicle();
    }
};

export const writeInfoHvac = async (variable: string, newValue: string, setData: any) => {
    console.log("Writing HVAC info...");
    let data: any = { is_manual_flow: true };

    // setez valorile pentru variabile
    switch (variable) {
        case "ambient_air_temperature":
            data.ambient_air_temperature = parseInt(newValue);
            break;
        case "cabin_temperature":
            data.cabin_temperature = parseInt(newValue);
            break;
        case "cabin_temperature_driver_set":
            data.cabin_temperature_driver_set = parseInt(newValue);
            break;
        case "fan_speed":
            data.fan_speed = parseInt(newValue);
            break;
        case "ac_status":
            data.ac_status = parseInt(newValue);
            break;
        case "air_recirculation":
            data.air_recirculation = parseInt(newValue);
            break;
        case "defrost":
            data.defrost = parseInt(newValue);
            break;
        case "front":
            data.front = parseInt(newValue);
            break;
        case "legs":
            data.legs = parseInt(newValue);
            break;
        case "mass_air_flow":
            data.mass_air_flow = parseInt(newValue);
            break;
        default:
            console.error("Unknown variable", variable);
            return;
    }

    console.log(data);
    displayLoadingCircle();
    try {
        const response = await fetch(`http://127.0.0.1:5000/api/write_info_hvac`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();
        console.log(responseData);

        readInfoHVAC(true, setData); // aici se face refresh de data dupa ce se apeleaza serviciul de write
    } catch (error) {
        console.error(error);
        displayErrorPopup("Connection failed");
    } finally {
        removeLoadingCicle();
    }
}

// componenta principla 
const DivCenterHVAC = (props: any) => {
    logger.init();

    // aici se initializeaza starea data cu o structura implicita de tip HVACData, continand valori prestabilite pentru parametrii HVAC
    const [data, setData] = useState<HVACData>({
        ambient_air_temperature: 0,
        cabin_temperature: 0,
        cabin_temperature_driver_set: 0,
        fan_speed: 0,
        mass_air_flow: 0,
        ac_status: false,
        air_recirculation: false,
        defrost: false,
        front: false,
        legs: true,

    });


    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        readInfoHVAC(false, setData);
    }, []);

    console.log(data);
    return (
        <div className="w-[65%] flex h-screen bg-indigo-950 math-paper">
            <div className="w-[35%] flex flex-col items-center">
                <h3 className="text-white text-3xl">Vehicle Model</h3>
                <div className="w-full h-full flex flex-col items-center justify-center">

                    <div className="w-[30%] m-7 text-white grid justify-items-end">
                        <label htmlFor="my_modal_1"
                            className="inline-flex items-center justify-center p-2 bg-blue-500 rounded-full border-4 border-gray-700 transition duration-300 ease-in-out hover:bg-blue-700">
                            {data.ambient_air_temperature}°C
                        </label>
                        <ModalUDS id="my_modal_1" cardTitle={'Ambient air temperature'} writeInfo={writeInfoHvac} param="ambient_air_temperature" setter={setData} />
                        <p>Ambient air temperature</p>
                    </div>

                    <div className="w-[30%] m-7 text-white grid justify-items-end">
                        <label htmlFor="my_modal_2"
                            className="inline-flex items-center justify-center p-2 bg-red-500 rounded-full border-4 border-gray-700 transition duration-300 ease-in-out hover:bg-red-700">
                            {data.cabin_temperature}°C
                        </label>
                        <ModalUDS id="my_modal_2" cardTitle={'Cabin temperature'} writeInfo={writeInfoHvac} param="cabin_temperature" setter={setData} />
                        <p>Cabin temperature</p>
                    </div>

                    <div className="w-[30%] m-7 text-white grid justify-items-end">
                        <label htmlFor="my_modal_3"
                            className="inline-flex items-center justify-center p-2 bg-green-500 rounded-full border-4 border-gray-700 transition duration-300 ease-in-out hover:bg-green-700">
                            {data.cabin_temperature_driver_set}°C
                        </label>
                        <ModalUDS id="my_modal_3" cardTitle={'Cabin temperature driver set'} writeInfo={writeInfoHvac} param="cabin_temperature_driver_set" setter={setData} />
                        <p>Cabin temperature driver set</p>
                    </div>

                    <div className="w-[30%] m-7 text-white grid justify-items-end">
                        <label htmlFor="my_modal_4"
                            className="inline-flex items-center justify-center p-2 bg-blue-500 rounded-full border-4 border-gray-700 transition duration-300 ease-in-out hover:bg-blue-700">
                            {data.fan_speed} ||
                        </label>
                        <ModalUDS id="my_modal_4" cardTitle={'Fan Speed'} writeInfo={writeInfoHvac} param="fan_speed" setter={setData} />
                        <p>Fan Speed</p>
                    </div>

                    <div className="w-[30%] m-7 p-4 transform translate-x-32 text-white grid justify-items-center">
                        <label htmlFor="my_modal_10"
                            className="inline-flex items-center justify-center p-2 bg-red-500 rounded-full border-4 border-gray-700 transition duration-300 ease-in-out hover:bg-red-700">
                            {data.mass_air_flow} %
                        </label>
                        <ModalUDS id="my_modal_10" cardTitle={'Mass air flow'} writeInfo={writeInfoHvac} param="Mass air flow" setter={setData} />
                        <p>Mass air flow</p>
                    </div>

                    <div className="w-[30%] m-7 text-white grid justify-items-end">
                    </div>
                </div>
            </div>

            <div className="w-[30%] h-screen flex">
                <Image src={props.image} alt="car sketch" width={400} height={204} className="invert" />
            </div>

            <div className="w-[35%] flex flex-col items-center justify-center">
                <div className="w-[30%] m-7 text-white grid justify-items-end transform -translate-x-40 -translate-y-20">
                    <label htmlFor="my_modal_5"
                        className="inline-flex items-center justify-center p-2 bg-blue-500 rounded-full border-4 border-gray-700 transition duration-300 ease-in-out hover:bg-green-700">
                        {data.ac_status}
                    </label>
                    <ModalUDS id="my_modal_5" cardTitle={'AC status'} writeInfo={writeInfoHvac} param="ac_status" setter={setData} />
                    <p>AC Status</p>
                </div>

                <div className="w-[55%] m-7 text-white grid justify-items-end transform -translate-x-32 -translate-y-12">
                    <label htmlFor="my_modal_6"
                        className="inline-flex items-center justify-center p-2 bg-red-500 rounded-full border-4 border-gray-700 transition duration-300 ease-in-out hover:bg-red-700">
                        {data.air_recirculation ? "On" : "Off"}
                    </label>
                    <ModalUDS id="my_modal_6" cardTitle={'Air Recirculation'} writeInfo={writeInfoHvac} param="air_recirculation" setter={setData} />
                    <p>Air Recirculation</p>
                </div>

                <div className="w-[20%] m-7 text-white grid justify-items-end">
                    <label htmlFor="my_modal_7"
                        className="inline-flex items-center justify-center p-2 bg-green-500 rounded-full border-4 border-gray-700 transition duration-300 ease-in-out hover:bg-red-700">
                        {data.defrost ? "On" : "Off"}
                    </label>
                    <ModalUDS id="my_modal_7" cardTitle={'Defrost'} writeInfo={writeInfoHvac} param="defrost" setter={setData} />
                    <p>Defrost</p>
                </div>

                <div className="w-[55%] m-7 text-white grid justify-items-end transform -translate-x-32 translate-y-8">
                    <label htmlFor="my_modal_8"
                        className="inline-flex items-center justify-center p-2 bg-blue-500 rounded-full border-4 border-gray-700 transition duration-300 ease-in-out hover:bg-red-700">
                        {data.front ? "On" : "Off"}
                    </label>
                    <ModalUDS id="my_modal_8" cardTitle={'Front'} writeInfo={writeInfoHvac} param="front" setter={setData} />
                    <p>Front vents</p>
                </div>

                <div className="w-[30%] m-7 text-white grid justify-items-end transform -translate-x-32 translate-y-10">
                    <label htmlFor="my_modal_9"
                        className="inline-flex items-center justify-center p-2 bg-red-500 rounded-full border-4 border-gray-700 transition duration-300 ease-in-out hover:bg-red-700">
                        {data.legs ? "On" : "Off"}
                    </label>
                    <ModalUDS id="my_modal_9" cardTitle={'Leg vents'} writeInfo={writeInfoHvac} param="legs" setter={setData} />
                    <p>Leg vents</p>
                </div>


            </div>
        </div>
    );
}

export default DivCenterHVAC;
