'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import ModalUDS from './ModalUDS';
import './style.css';
import { displayLoadingCircle, displayErrorPopup, removeLoadingCicle } from '../sharedComponents/LoadingCircle';
import logger from '@/src/utils/Logger';
import {EngineItems, apiManager, Endpoints} from '@/src/utils/ApiManager';

export interface engineData {
    coolant_temperature: any,
    engine_load: any,
    engine_rpm: any,
    fuel_level: any,
    fuel_pressure: any,
    intake_air_temperature: any,
    oil_temperature: any,
    throttle_position: any,
    vehicle_speed: any,
}

/* Function that reads the data about the Engine. It takes three arguments:
 * isManualFlow: true if the function is called from Stand alone app; false otherwise
 * item: optional argument; if provided, only the given item will be read
 * setData: setter function
 */
export const readInfoEngine = async (setData:any,
                                     options: {manual_flow?: boolean; item?: EngineItems | null} = {}) => {

    /* Set default values using destructuring for the options that were not provided */
    const { manual_flow = false, item = null } = options;

    displayLoadingCircle();
    console.log("Reading engine info...");

    try {
        /* Use API Manager to do the API call */
        const data = await apiManager.apiCall(Endpoints.READ_ENGINE, {manual_flow: options.manual_flow,
                                                                       item: options.item});

        console.log("Read engine data: ", data);
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

/* Function that writes data to Engine. It takes four arguments:
 * item: the parameter that will be written
 * newValue: the new value for the parameter
 * setData: setter function
 * manual_flow: true if the function is called from Stand alone app; false otherwise
 */
export const writeInfoEngine = async (item: EngineItems, newValue: string, setData: any,
                                      options: {manual_flow?: boolean} = {}) => {

    /* Set default values using destructuring for the options that were not provided */
    const { manual_flow = false } = options;

    console.log("Writing engine info...");

    /* Set a dictionary for easier mapping over the values */
    const variableMapping: { [key: string]: any } = {
        coolant_temperature: {is_manual_flow: manual_flow, coolant_temperature: parseInt(newValue) },
        engine_load: {is_manual_flow: manual_flow, engine_load: parseInt(newValue) },
        engine_rpm: {is_manual_flow: manual_flow, engine_rpm: parseInt(newValue) },
        fuel_level: {is_manual_flow: manual_flow, fuel_level: parseInt(newValue) },
        intake_air_temperature: {is_manual_flow: manual_flow, intake_air_temperature: parseInt(newValue) },
        fuel_pressure: {is_manual_flow: manual_flow, fuel_pressure: parseInt(newValue) },
        oil_temperature: {is_manual_flow: manual_flow, oil_temperature: parseInt(newValue) },
        throttle_position: {is_manual_flow: manual_flow, throttle_position: parseInt(newValue) },
        vehicle_speed: {is_manual_flow: manual_flow, vehicle_speed: parseInt(newValue) },
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
        const response = await apiManager.apiCall(Endpoints.WRITE_ENGINE, {
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
        readInfoEngine(setData, {manual_flow: manual_flow});
    }
};

const DivCenterEngine = (props: any) => {
    logger.init();

    const [data, setData] = useState<engineData | null>(null);

    useEffect(() => {
        readInfoEngine(setData);
    }, []);

    return (
        <div className="w-[65%] flex h-screen bg-indigo-950 math-paper">

            {/* Left Section - Engine Information */}
            <div className="w-[35%] flex flex-col items-center">
                <h3 className="text-white text-3xl">Vehicle Model</h3>
                <div className="w-full h-full flex flex-col items-center justify-center">

                    {/* Coolant Temperature */}
                    <div className="w-[30%] m-7 text-white grid justify-items-end">
                        <label htmlFor="engine_modal_1"
                            className="inline-flex items-center justify-center p-2 bg-blue-500 rounded-full border-4 border-gray-700 transition duration-300 ease-in-out hover:bg-blue-700">
                            {data?.coolant_temperature}°C
                        </label>
                        <ModalUDS id="engine_modal_1" cardTitle={'Coolant temperature'} writeInfo={writeInfoEngine} param="coolant_temperature" manual={false} setter={setData}/>
                        <p>Coolant temperature</p>
                    </div>

                    {/* Engine Load */}
                    <div className="w-[30%] m-7 text-white grid justify-center">
                        <label htmlFor="engine_modal_2"
                            className="inline-flex items-center justify-center p-2 bg-red-500 rounded-full border-4 border-gray-700 transition duration-300 ease-in-out hover:bg-red-700">
                            {data?.engine_load}
                        </label>
                        <ModalUDS id="engine_modal_2" cardTitle={'Engine load'} writeInfo={writeInfoEngine} param="engine_load" manual={false} setter={setData}/>
                        <p>Engine load</p>
                    </div>

                    {/* Engine RPM */}
                    <div className="w-[30%] m-7 text-white grid justify-start">
                        <label htmlFor="engine_modal_3"
                            className="inline-flex items-center justify-center p-2 bg-green-500 rounded-full border-4 border-gray-700 transition duration-300 ease-in-out hover:bg-green-700">
                            {data?.engine_rpm}
                        </label>
                        <ModalUDS id="engine_modal_3" cardTitle={'Engine rpm'} writeInfo={writeInfoEngine} param="engine_rpm" manual={false} setter={setData}/>
                        <p>Engine rpm</p>
                    </div>

                    {/* Fuel Level */}
                    <div className="w-[30%] m-7 text-white grid justify-center">
                        <label htmlFor="engine_modal_4"
                            className="inline-flex items-center justify-center p-2 bg-purple-500 rounded-full border-4 border-gray-700 transition duration-300 ease-in-out hover:bg-purple-700">
                            {data?.fuel_level}%
                        </label>
                        <ModalUDS id="engine_modal_4" cardTitle={'Fuel level'} writeInfo={writeInfoEngine} param="fuel_level" manual={false} setter={setData}/>
                        <p>Fuel level</p>
                    </div>

                    {/* Fuel Pressure */}
                    <div className="w-[30%] m-7 text-white grid justify-items-end">
                        <label htmlFor="engine_modal_5"
                            className="inline-flex items-center justify-center p-2 bg-blue-500 rounded-full border-4 border-gray-700 transition duration-300 ease-in-out hover:bg-blue-700">
                            {data?.fuel_pressure}
                        </label>
                        <ModalUDS id="engine_modal_5" cardTitle={'Fuel pressure'} writeInfo={writeInfoEngine} param="fuel_pressure" manual={false} setter={setData}/>
                        <p>Fuel pressure</p>
                    </div>
                </div>
            </div>

            {/* Middle Section - Image */}
            <div className="w-[30%] h-screen flex">
                <Image src={props.image} alt="car sketch" width={400} height={204} className="invert" />
            </div>

            {/* Right Section - Engine Info */}
            <div className="w-[35%] flex flex-col items-center justify-center">

                {/* Intake Air Temperature */}
                <div className="w-[30%] m-7 text-white">
                    <label htmlFor="engine_modal_6"
                        className="inline-flex items-center justify-center p-2 bg-blue-500 rounded-full border-4 border-gray-700 transition duration-300 ease-in-out hover:bg-blue-700">
                        {data?.intake_air_temperature}°C
                    </label>
                    <ModalUDS id="engine_modal_6" cardTitle={'Intake air temperature'} writeInfo={writeInfoEngine} param="intake_air_temperature" manual={false} setter={setData}/>
                    <p>Intake air temperature</p>
                </div>

                {/* Oil Temperature */}
                <div className="w-[30%] m-7 text-white grid justify-items-end">
                    <label htmlFor="engine_modal_7"
                        className="inline-flex items-center justify-center p-2 bg-red-500 rounded-full border-4 border-gray-700 transition duration-300 ease-in-out hover:bg-red-700">
                        {data?.oil_temperature}°C
                    </label>
                    <ModalUDS id="engine_modal_7" cardTitle={'Oil temperature'} writeInfo={writeInfoEngine} param="oil_temperature" manual={false} setter={setData}/>
                    <p>Oil temperature</p>
                </div>

                {/* Throttle Position */}
                <div className="w-[30%] m-7 text-white grid justify-items-end">
                    <label htmlFor="engine_modal_8"
                        className="inline-flex items-center justify-center p-2 bg-green-500 rounded-full border-4 border-gray-700 transition duration-300 ease-in-out hover:bg-green-700">
                        {data?.throttle_position}
                    </label>
                    <ModalUDS id="engine_modal_8" cardTitle={'Torque'} writeInfo={writeInfoEngine} param="throttle_position" manual={false} setter={setData}/>
                    <p>Throttle Position</p>
                </div>

                {/* Vehicle Speed */}
                <div className="w-[30%] m-7 text-white">
                    <label htmlFor="engine_modal_9"
                        className="inline-flex items-center justify-center p-2 bg-purple-500 rounded-full border-4 border-gray-700 transition duration-300 ease-in-out hover:bg-purple-700">
                        {data?.vehicle_speed}km
                    </label>
                    <ModalUDS id="engine_modal_9" cardTitle={'Vehicle speed'} writeInfo={writeInfoEngine} param="vehicle_speed" manual={false} setter={setData}/>
                    <p>Vehicle speed</p>
                </div>
            </div>
        </div>
    )
}

export default DivCenterEngine