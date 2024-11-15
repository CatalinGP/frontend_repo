'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import ModalUDS from './ModalUDS';
import ModalHvacModes from './ModalHvacModes';
import './style.css';
import { displayLoadingCircle, displayErrorPopup, removeLoadingCicle } from '../sharedComponents/LoadingCircle';
import logger from '@/src/utils/Logger';
import {HvacItems, apiManager, Endpoints} from '@/src/utils/ApiManager';

export interface HvacModes {
    ac_status: boolean;
    air_recirculation: boolean;
    defrost: boolean;
    front: boolean;
    legs: boolean;
}

export interface HVACData {
    ambient_air_temperature: number;
    cabin_temperature: number;
    cabin_temperature_driver_set: number;
    fan_speed: number;
    hvac_modes: HvacModes;
    mass_air_flow: number;
    time_stamp: any;
}

/* Function that reads the data about the HVAC. It takes three arguments:
 * setData: setter function
 * manual_flow: true if the function is called from Stand alone app; false otherwise
 * items: the item that will be read; if item is null, read all parameters
 */
export const readInfoHVAC = async (setData:any,
                                   options: {manual_flow?: boolean; item?: HvacItems | null} = {}) => {

        /* Set default values using destructuring for the options that were not provided */
        const { manual_flow = false, item = null } = options;

        displayLoadingCircle();
        console.log("Reading hvac info...");
    
        try {
            /* Use API Manager to do the API call */
            const data = await apiManager.apiCall(Endpoints.READ_HVAC, {manual_flow: options.manual_flow,
                                                                           item: options.item});
    
            console.log("Read hvac data: ", data);
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

/* Function that writes data to HVAC. It takes four arguments:
 * item: the parameter that will be written
 * newValue: the new value for the parameter
 * setData: setter function
 * manual_flow: true if the function is called from Stand alone app; false otherwise
 */
export const writeInfoHvac = async (item: HvacItems, newValue: string, setData: any,
                                    options: {manual_flow?: boolean} = {}) => {

    /* Set default values using destructuring for the options that were not provided */
    const { manual_flow = false } = options;

    console.log("Writing hvac info...");

    /* Set a dictionary for easier mapping over the values */
    const variableMapping: { [key: string]: any } = {
        ambient_air_temperature: {is_manual_flow: manual_flow, ambient_air_temperature: parseInt(newValue) },
        cabin_temperature: {is_manual_flow: manual_flow, cabin_temperature: parseInt(newValue) },
        cabin_temperature_driver_set: {is_manual_flow: manual_flow, cabin_temperature_driver_set: parseInt(newValue) },
        fan_speed: {is_manual_flow: manual_flow, fan_speed: parseInt(newValue) },
        mass_air_flow: {is_manual_flow: manual_flow, mass_air_flow: parseInt(newValue) },
        hvac_modes: {is_manual_flow: manual_flow, hvac_modes: parseInt(newValue, 2) },
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
        const response = await apiManager.apiCall(Endpoints.WRITE_HVAC, {
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
        readInfoHVAC(setData, {manual_flow: manual_flow});
    }
}

const DivCenterHVAC = (props: any) => {
    logger.init();

    const [data, setData] = useState<HVACData | null>(null);

    useEffect(() => {
        readInfoHVAC(setData);
    }, []);

    console.log(data);
    return (
        <div className="w-[65%] flex h-screen bg-indigo-950 math-paper">

            {/* Left Section - HVAC Information */}
            <div className="w-[35%] flex flex-col items-center">
                <h3 className="text-white text-3xl">Vehicle Model</h3>
                <div className="w-full h-full flex flex-col items-center justify-center">

                    {/* Ambient Air Temperature */}
                    <div className="w-[30%] m-7 text-white grid justify-items-end">
                        <label htmlFor="hvac_modal_1"
                            className="inline-flex items-center justify-center p-2 bg-blue-500 rounded-full border-4 border-gray-700 transition duration-300 ease-in-out hover:bg-blue-700">
                            {data?.ambient_air_temperature}°C
                        </label>
                        <ModalUDS id="hvac_modal_1" cardTitle={'Ambient air temperature'} writeInfo={writeInfoHvac} param="ambient_air_temperature" manual={false} setter={setData} />
                        <p>Ambient air</p>
                    </div>

                    {/* Cabin Temperature */}
                    <div className="w-[30%] m-7 text-white grid justify-items-center">
                        <label htmlFor="hvac_modal_2"
                            className="inline-flex items-center justify-center p-2 bg-red-500 rounded-full border-4 border-gray-700 transition duration-300 ease-in-out hover:bg-red-700">
                            {data?.cabin_temperature}°C
                        </label>
                        <ModalUDS id="hvac_modal_2" cardTitle={'Cabin temperature'} writeInfo={writeInfoHvac} param="cabin_temperature" manual={false} setter={setData} />
                        <p>Cabin</p>
                    </div>

                    {/* Cabin Temperature Driver Set */}
                    <div className="w-[30%] m-7 text-white grid justify-items-start">
                        <label htmlFor="hvac_modal_3"
                            className="inline-flex items-center justify-center p-2 bg-green-500 rounded-full border-4 border-gray-700 transition duration-300 ease-in-out hover:bg-green-700">
                            {data?.cabin_temperature_driver_set}°C
                        </label>
                        <ModalUDS id="hvac_modal_3" cardTitle={'Cabin temperature driver set'} writeInfo={writeInfoHvac} param="cabin_temperature_driver_set" manual={false} setter={setData} />
                        <p>Cabin driver set</p>
                    </div>

                    {/* Fan Speed */}
                    <div className="w-[30%] m-7 text-white grid justify-items-center">
                        <label htmlFor="hvac_modal_4"
                            className="inline-flex items-center justify-center p-2 bg-blue-500 rounded-full border-4 border-gray-700 transition duration-300 ease-in-out hover:bg-blue-700">
                            {data?.fan_speed} ||
                        </label>
                        <ModalUDS id="hvac_modal_4" cardTitle={'Fan Speed'} writeInfo={writeInfoHvac} param="fan_speed" manual={false} setter={setData} />
                        <p>Fan Speed</p>
                    </div>

                    {/* Mass Air Flow */}
                    <div className="w-[30%] m-7 text-white grid justify-items-end">
                        <label htmlFor="hvac_modal_5"
                            className="inline-flex items-center justify-center p-2 bg-red-500 rounded-full border-4 border-gray-700 transition duration-300 ease-in-out hover:bg-red-700">
                            {data?.mass_air_flow} %
                        </label>
                        <ModalUDS id="hvac_modal_5" cardTitle={'Mass air flow'} writeInfo={writeInfoHvac} param="mass_air_flow" manual={false} setter={setData} />
                        <p>Mass air flow</p>
                    </div>

                </div>
            </div>

            {/* Middle Section - Image */}
            <div className="w-[30%] h-screen flex">
                <Image src={props.image} alt="car sketch" width={400} height={204} className="invert" />
            </div>

            {/* Right Section - HVAC Info */}
            <div className="w-[35%] flex flex-col items-center justify-center">

                {/* AC Status */}
                <div className="w-[30%] m-7 text-white grid justify-items-start">
                    <label htmlFor="hvac_modes_modal"
                        className="inline-flex items-center justify-center p-2 bg-blue-500 rounded-full border-4 border-gray-700 transition duration-300 ease-in-out hover:bg-blue-700">
                        {data?.hvac_modes?.ac_status ? "On" : "Off"}
                    </label>
                    <ModalHvacModes id="hvac_modes_modal" writeInfo={writeInfoHvac} manual={false} setter={setData} />
                    <p>AC Status</p>
                </div>

                {/* Air Recirculation */}
                <div className="w-[55%] m-7 text-white grid justify-items-center">
                    <label htmlFor="hvac_modes_modal"
                        className="inline-flex items-center justify-center p-2 bg-red-500 rounded-full border-4 border-gray-700 transition duration-300 ease-in-out hover:bg-red-700">
                        {data?.hvac_modes?.air_recirculation ? "On" : "Off"}
                    </label>
                    <ModalHvacModes id="hvac_modes_modal" writeInfo={writeInfoHvac} manual={false} setter={setData} />
                    <p>Air Recirculation</p>
                </div>

                {/* Defrost */}
                <div className="w-[20%] m-7 text-white grid justify-items-end">
                    <label htmlFor="hvac_modes_modal"
                        className="inline-flex items-center justify-center p-2 bg-green-500 rounded-full border-4 border-gray-700 transition duration-300 ease-in-out  hover:bg-green-700">
                        {data?.hvac_modes?.defrost ? "On" : "Off"}
                    </label>
                    <ModalHvacModes id="hvac_modes_modal" writeInfo={writeInfoHvac} manual={false} setter={setData} />
                    <p>Defrost</p>
                </div>

                {/* Front */}
                <div className="w-[55%] m-7 text-white grid justify-items-center">
                    <label htmlFor="hvac_modes_modal"
                        className="inline-flex items-center justify-center p-2 bg-blue-500 rounded-full border-4 border-gray-700 transition duration-300 ease-in-out hover:bg-blue-700">
                        {data?.hvac_modes?.front ? "On" : "Off"}
                    </label>
                    <ModalHvacModes id="hvac_modes_modal" writeInfo={writeInfoHvac} manual={false} setter={setData} />
                    <p>Front</p>
                </div>

                {/* Legs */}
                <div className="w-[30%] m-7 text-white grid justify-items-start">
                    <label htmlFor="hvac_modes_modal"
                        className="inline-flex items-center justify-center p-2 bg-red-500 rounded-full border-4 border-gray-700 transition duration-300 ease-in-out hover:bg-red-700">
                        {data?.hvac_modes?.legs ? "On" : "Off"}
                    </label>
                    <ModalHvacModes id="hvac_modes_modal" writeInfo={writeInfoHvac} manual={false} setter={setData} />
                    <p>Legs</p>
                </div>
            </div>
        </div>
    );
}

export default DivCenterHVAC;
