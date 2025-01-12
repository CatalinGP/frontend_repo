'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import ModalUDS from './ModalUDS';
import './style.css';
import { displayLoadingCircle , displayErrorPopup , removeLoadingCicle } from '../sharedComponents/LoadingCircle';
import logger from '@/src/utils/Logger';
import {BatteryItems, apiManager, Endpoints} from '@/src/utils/ApiManager';

export interface batteryData {
    battery_level: any,
    voltage: any,
    battery_state_of_charge: any,
    percentage: any,
    life_cycle: any,
    fully_charged: any,
    serial_number: any,
    range_battery: any,
    charging_time: any,
    device_consumption: any,
    time_stamp: any,
}

/* Function that reads the data about the Battery. It takes two arguments:
 * isManualFlow: true if the function is called from Stand alone app; false otherwise
 * setData: setter function
 */
export const readInfoBattery = async (setData:any,
                                      options: {manual_flow?: boolean; item?: BatteryItems | null} = {}) => {

    /* Set default values using destructuring for the options that were not provided */
    const { manual_flow = false, item = null } = options;

    displayLoadingCircle();
    console.log("Reading battery info...");

    try {
        /* Use API Manager to do the API call */
        const data = await apiManager.apiCall(Endpoints.READ_BATTERY, {manual_flow: options.manual_flow,
                                                                       item: options.item});

        console.log("Read battery data: ", data);
        setData(data);

        /* If communication was intrerrupted, log error */
        if(data?.ERROR === 'interrupted') {
            console.error("Connection interrupted");
            displayErrorPopup("Connection failed");
        }
    } catch (error) {
        /* Handler for errors returned by API Manager */
        console.error("Error during read operation: ", error);
        displayErrorPopup("Connection failed");
    } finally { removeLoadingCicle(); }
};

export const writeInfoBattery = async (item: BatteryItems, newValue: string, setData: any,
                                       options: {manual_flow?: boolean} = {}) => {

    /* Set default values using destructuring for the options that were not provided */
    const { manual_flow = false } = options;

    console.log("Writing battery info...");

    /* Set a dictionary for easier mapping over the values */
    const variableMapping: { [key: string]: any } = {
        battery_level: {is_manual_flow: manual_flow, battery_level: parseInt(newValue) },
        state_of_charge: {is_manual_flow: manual_flow, battery_state_of_charge: parseInt(newValue) },
        percentage: {is_manual_flow: manual_flow, percentage: parseInt(newValue) },
        voltage: {is_manual_flow: manual_flow, voltage: parseInt(newValue) },
    };

    const data_sent = variableMapping[item];

    /* Error case: variable cannot be written */
    if (!data_sent) {
        console.error(`Invalid variable for write: ${item}`);
        return;
    }

    console.log(data_sent);
    displayLoadingCircle();

    try {
        /* Use API Manager to do the API call */
        const response = await apiManager.apiCall(Endpoints.WRITE_BATTERY, {
            json: data_sent,
            manual_flow: manual_flow,
        });

        /* If communication was intrerrupted, log error */
        if (response?.ERROR === 'interrupted') {
            console.error("Connection interrupted");
            displayErrorPopup("Connection failed");
        }

        console.log(response);
    } catch (error) {
        console.error("Error during write operation: ", error);
        displayErrorPopup("Connection failed");
    } finally {
        removeLoadingCicle();
        readInfoBattery(setData, {manual_flow: manual_flow});
    }
}

const DivCenterBattery = (props: any) => {
    logger.init();
    
    const [data, setData] = useState<batteryData | null>(null);
    let popupElement: HTMLDivElement | null = null;
    let popupStyleElement: HTMLStyleElement | null = null;
    let overlayElement: HTMLDivElement | null = null;

    useEffect(() => {
        readInfoBattery(setData);
    }, []);

    return (
        <div className="w-[65%] flex h-screen bg-indigo-950 math-paper" >

            {/* Left Section - Battery Information */}
            <div className="w-[35%] flex flex-col items-center">
                <h3 className="text-white text-3xl">Vehicle Model</h3>
                <div className="w-full h-full flex flex-col items-center justify-center">

                    {/* Battery Level */}
                    <div className="w-[30%] m-7 text-white grid justify-items-end">
                        <label htmlFor="my_modal_2"
                            className="inline-flex items-center justify-center p-2 bg-blue-500 rounded-full border-4 border-gray-700 transition duration-300 ease-in-out hover:bg-blue-700">
                            {data?.battery_level}%
                        </label>
                        <ModalUDS id="my_modal_2" cardTitle={'Battery level'} writeInfo={writeInfoBattery} param="battery_level" manual={false} setter={setData}/>
                        <p>Battery level</p>
                    </div>

                    {/* Battery State of Charge */}
                    <div className="w-[30%] m-7 grid justify-items-end">
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn m-1 text-white inline-flex items-center justify-center p-2 bg-red-500 rounded-full border-4 border-gray-700 transition duration-300 ease-in-out hover:bg-red-700">
                                {data?.battery_state_of_charge}
                            </div>
                            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                                <li><a onClick={() => writeInfoBattery("state_of_charge", "1", setData)}>Charging</a></li>
                                <li><a onClick={() => writeInfoBattery("state_of_charge", "2", setData)}>Discharging</a></li>
                                <li><a onClick={() => writeInfoBattery("state_of_charge", "3", setData)}>Empty</a></li>
                                <li><a onClick={() => writeInfoBattery("state_of_charge", "4", setData)}>Fully charged</a></li>
                                <li><a onClick={() => writeInfoBattery("state_of_charge", "5", setData)}>Pending charge</a></li>
                                <li><a onClick={() => writeInfoBattery("state_of_charge", "6", setData)}>Pending discharge</a></li>
                            </ul>
                        </div>
                        <p className="text-white">State of charge</p>
                    </div>

{/*                     <div className="w-[30%] m-7 text-white grid justify-items-start">
                        <label htmlFor="my_modal_3"
                            className="inline-flex items-center justify-center p-2 bg-green-500 rounded-full border-4 border-gray-700 transition duration-300 ease-in-out hover:bg-green-700">
                            {data?.charging_time}
                        </label>
                             <ModalUDS id="my_modal_3" cardTitle={'Charging time'} />
                        <p>Charging time</p>
                    </div> */}

{/*                     <div className="w-[30%] m-7 text-white grid justify-items-center">
                        <label htmlFor="my_modal_4"
                            className="inline-flex items-center justify-center p-2 bg-blue-500 rounded-full border-4 border-gray-700 transition duration-300 ease-in-out hover:bg-blue-700">
                            {data?.device_consumption}
                        </label>
                            <ModalUDS id="my_modal_4" cardTitle={'Device consumption'} />
                        <p>Device consumption</p>
                    </div> */}

{/*                     <div className="w-[30%] m-7 text-white grid justify-items-end">
                        <label htmlFor="my_modal_5"
                            className="inline-flex items-center justify-center p-2 bg-purple-500 rounded-full border-4 border-gray-700 transition duration-300 ease-in-out hover:bg-purple-700">
                            {data?.fully_charged}
                        </label>
                            <ModalUDS id="my_modal_5" cardTitle={'Full charged'} />
                        <p>Full charged</p>
                    </div> */}

                </div>
            </div>

            {/* Middle Section - Image */}
            <div className="w-[30%] h-screen flex justify-center items-center">
                <Image src={props.image} alt="car sketch" width={400} height={204} className="invert" />
            </div>

            {/* Right Section - Battery Info */}
            <div className="w-[35%] flex flex-col items-center justify-center">
{/*                 <div className="w-[30%] m-7 text-white">
                    <label htmlFor="my_modal_6"
                        className="inline-flex items-center justify-center p-2 bg-blue-500 rounded-full border-4 border-gray-700 transition duration-300 ease-in-out hover:bg-blue-700">
                        {data?.life_cycle}
                    </label>
                        <ModalUDS id="my_modal_6" cardTitle={'Life cycle'} />
                    <p>Life cycle</p>
                </div> */}

{/*                 <div className="w-[30%] m-7 text-white grid justify-items-center">
                    <label htmlFor="my_modal_7"
                        className="inline-flex items-center justify-center p-2 bg-red-500 rounded-full border-4 border-gray-700 transition duration-300 ease-in-out hover:bg-red-700">
                        {data?.life_cycle}
                    </label>
                        <ModalUDS id="my_modal_7" cardTitle={'Life cycle'} />
                    <p>Life cycle</p>
                </div> */}

                {/* Battery percentage */}
                <div className="w-[30%] m-7 text-white grid justify-items-start">
                    <label htmlFor="my_modal_8"
                        className="inline-flex items-center justify-center p-2 bg-green-500 rounded-full border-4 border-gray-700 transition duration-300 ease-in-out hover:bg-green-700">
                        {data?.percentage}%
                    </label>
                    <ModalUDS id="my_modal_8" cardTitle={'Battery percentage'} writeInfo={writeInfoBattery} param="percentage" manual={false} setter={setData}/>
                    <p>Battery percentage</p>
                </div>

{/*             <div className="w-[30%] m-7 text-white grid justify-items-center">
                    <label htmlFor="my_modal_9"
                        className="inline-flex items-center justify-center p-2 bg-purple-500 rounded-full border-4 border-gray-700 transition duration-300 ease-in-out hover:bg-purple-700">
                        {data?.serial_number}
                    </label>
                        <ModalUDS id="my_modal_9" cardTitle={'Serial number'} />
                    <p>Serial number</p>
                </div> */}

                {/* Voltage */}
                <div className="w-[30%] m-7 text-white grid justify-items-start">
                    <label htmlFor="my_modal_10"
                        className="inline-flex items-center justify-center p-2 bg-purple-500 rounded-full border-4 border-gray-700 transition duration-300 ease-in-out hover:bg-purple-700">
                        {data?.voltage}V
                    </label>
                    <ModalUDS id="my_modal_10" cardTitle={'Voltage'} writeInfo={writeInfoBattery} param="voltage" manual={false} setter={setData}/>
                    <p>Voltage</p>
                </div>

            </div>
        </div>
    )
}

export default DivCenterBattery