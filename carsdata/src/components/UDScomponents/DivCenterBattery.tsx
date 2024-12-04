'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import ModalUDS from './ModalUDS';
import './style.css';
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

/* Function that reads the data about the Battery. It takes three arguments:
 * setData: setter function
 * manual_flow: true if the function is called from Stand alone app; false otherwise
 * item: optional argument; if provided, only the given item will be read
 */
export const readInfoBattery = async (setData:any,
                                      options: {manual_flow?: boolean; item?: BatteryItems | null} = {}) => {

    /* Set default values using destructuring for the options that were not provided */
    const { manual_flow = false, item = null } = options;

    console.log("Reading battery info...");

    /* Use API Manager to do the API call */
    const response = await apiManager.apiCall(Endpoints.READ_BATTERY, {manual_flow: options.manual_flow,
                                                                       item: options.item});
                                                                   
    if (response) {
        console.log("Read battery data: ", response);
        setData(response);
    } else {
        console.error("API call failed or was interrupted.");
    }
};

/* Function that writes data to Battery. It takes four arguments:
 * item: the parameter that will be written
 * newValue: the new value for the parameter
 * setData: setter function
 * manual_flow: true if the function is called from Stand alone app; false otherwise
 */
export const writeInfoBattery = async (item: BatteryItems, newValue: string, setData: any,
                                        options: {manual_flow?: boolean} = {}) => {

    /* Set default values using destructuring for the options that were not provided */
    const { manual_flow = false } = options;

    console.log("Writing battery info...");

    /* Set a dictionary for easier mapping over the values */
    const variableMapping: { [key: string]: any } = {
        battery_level: {is_manual_flow: manual_flow, battery_level: parseInt(newValue) },
        battery_state_of_charge: {is_manual_flow: manual_flow, battery_state_of_charge: parseInt(newValue) },
        percentage: {is_manual_flow: manual_flow, percentage: parseInt(newValue) },
        voltage: {is_manual_flow: manual_flow, voltage: parseInt(newValue) },
    };

    const data_sent = variableMapping[item];

    /* Error case: variable cannot be written */
    if (!data_sent) {
        console.error(`Variable ${item} cannot be written.`);
        return;
    }
    console.log("Data sent: ",data_sent);

    /* Use API Manager to do the API call */
    const response = await apiManager.apiCall(Endpoints.WRITE_BATTERY, {
        json: data_sent,
        manual_flow: manual_flow,
    });

    if (response) {
        console.log("Response: ", response);
    } else {
        console.error("API call failed or was interrupted.");
    }
    
    readInfoBattery(setData, {manual_flow: manual_flow});
};

const DivCenterBattery = (props: any) => {
    logger.init();
    
    const [data, setData] = useState<batteryData | null>(null);

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
                        <label htmlFor="battery_modal_1"
                            className="inline-flex items-center justify-center p-2 bg-blue-500 rounded-full border-4 border-gray-700 transition duration-300 ease-in-out hover:bg-blue-700">
                            {data?.battery_level}Wh
                        </label>
                        <ModalUDS id="battery_modal_1" cardTitle={'Battery level'} writeInfo={writeInfoBattery} param="battery_level" manual={false} setter={setData}/>
                        <p>Energy level</p>
                    </div>

                    {/* Battery State of Charge */}
                    <div className="w-[30%] m-7 grid justify-items-end">
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn m-1 text-white inline-flex items-center justify-center p-2 bg-red-500 rounded-full border-4 border-gray-700 transition duration-300 ease-in-out hover:bg-red-700">
                                {data?.battery_state_of_charge}
                            </div>
                            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                                <li><a onClick={() => writeInfoBattery("battery_state_of_charge", "1", setData)}>Charging</a></li>
                                <li><a onClick={() => writeInfoBattery("battery_state_of_charge", "2", setData)}>Discharging</a></li>
                                <li><a onClick={() => writeInfoBattery("battery_state_of_charge", "3", setData)}>Empty</a></li>
                                <li><a onClick={() => writeInfoBattery("battery_state_of_charge", "4", setData)}>Fully charged</a></li>
                                <li><a onClick={() => writeInfoBattery("battery_state_of_charge", "5", setData)}>Pending charge</a></li>
                                <li><a onClick={() => writeInfoBattery("battery_state_of_charge", "6", setData)}>Pending discharge</a></li>
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
                    <label htmlFor="battery_modal_2"
                        className="inline-flex items-center justify-center p-2 bg-green-500 rounded-full border-4 border-gray-700 transition duration-300 ease-in-out hover:bg-green-700">
                        {data?.percentage}%
                    </label>
                    <ModalUDS id="battery_modal_2" cardTitle={'Battery percentage'} writeInfo={writeInfoBattery} param="percentage" manual={false} setter={setData}/>
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
                    <label htmlFor="battery_modal_3"
                        className="inline-flex items-center justify-center p-2 bg-purple-500 rounded-full border-4 border-gray-700 transition duration-300 ease-in-out hover:bg-purple-700">
                        {data?.voltage}V
                    </label>
                    <ModalUDS id="battery_modal_3" cardTitle={'Voltage'} writeInfo={writeInfoBattery} param="voltage" manual={false} setter={setData}/>
                    <p>Voltage</p>
                </div>

            </div>
        </div>
    )
}

export default DivCenterBattery