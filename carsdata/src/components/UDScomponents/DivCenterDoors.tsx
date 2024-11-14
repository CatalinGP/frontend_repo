'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import ModalUDS from './ModalUDS';
import './style.css';
import { displayLoadingCircle, displayErrorPopup, removeLoadingCicle } from '../sharedComponents/LoadingCircle';
import logger from '@/src/utils/Logger';
import { Endpoints, apiManager, DoorsItems } from '@/src/utils/ApiManager';

export interface doorsData {
    ajar: any,
    door: any,
    passenger: any,
    passenger_lock: any,
}

const checkInput = (message: any) => {
    let value;
    do {
        value = prompt(message);
        if (value !== '0' && value !== '1') {
            alert('Accepted value: 0/1');
        }
    } while (value !== '0' && value !== '1');
    return value;
};

export const readInfoDoors = async (setData: any,
    options: { manual_flow?: boolean; item?: DoorsItems | null } = {}) => {

    /* Set default values using destructuring for the options that were not provided */
    const { manual_flow = false, item = null } = options;

    displayLoadingCircle();
    console.log("Reading doors info...");

    try {
        /* Use API Manager to do the API call */
        const data = await apiManager.apiCall(Endpoints.READ_DOORS, {
            manual_flow: options.manual_flow,
            item: options.item
        });

        console.log("Read doors data: ", data);
        setData(data);

        /* If communication was intrerrupted, log error */
        if (data?.ERROR === 'interrupted') {
            console.error("Connection interrupted");
            displayErrorPopup("Connection failed");
        }
    } catch (error) {
        /* Handler for errors returned by API Manager */
        console.error("Error during read operation: ", error);
        displayErrorPopup("Connection failed");
    } finally { removeLoadingCicle(); }
};

export const writeInfoDoors = async (item: DoorsItems, newValue: string, setData: any,
    options: { manual_flow?: boolean } = {}) => {

    /* Set default values using destructuring for the options that were not provided */
    const { manual_flow = false } = options;

    console.log("Writing doors info...");

    /* Set a dictionary for easier mapping over the values */
    const variableMapping: { [key: string]: any } = {
        door: { is_manual_flow: manual_flow, door: parseInt(newValue) },
        passenger: { is_manual_flow: manual_flow, passenger: parseInt(newValue) },
        passenger_lock: { is_manual_flow: manual_flow, passenger_lock: parseInt(newValue) },
        ajar: { is_manual_flow: manual_flow, ajar: parseInt(newValue) },
    };

    const data_sent = variableMapping[item];

    if (!data_sent) {
        console.error(`Invalid variable for write: ${item}`);
        return;
    }

    console.log(data_sent);
    displayLoadingCircle();

    try {
        /* Use API Manager to do the API call */
        const response = await apiManager.apiCall(Endpoints.WRITE_DOORS, {
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
        readInfoDoors(setData, { manual_flow: manual_flow });
    }
}


const DivCenterDoors = (props: any) => {
    logger.init();
    const [data, setData] = useState<doorsData | null>(null);


    useEffect(() => {
        readInfoDoors(setData);
    }, []);


    return (
        <div className="w-[65%] flex h-screen bg-indigo-950 math-paper">
            {/* Left section */}
            <div className="w-[35%] flex flex-col items-center">
                <h3 className="text-white text-3xl">Vehicle Model</h3>
                {/* <button className="btn" onClick={callApi}>Button{jsonResp.age}</button> */}
                <div className="w-full h-full flex flex-col items-center justify-center">

                    {/* Ajar */}
                    <div className="w-[30%] m-7 grid justify-items-end">
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn m-1 text-white inline-flex items-center justify-center p-2 bg-blue-500 rounded-full border-4 border-gray-700 transition duration-300 ease-in-out hover:bg-blue-700">
                                {data?.ajar}
                            </div>
                            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                                <li><a onClick={() => writeInfoDoors("ajar", "0", setData)}>No Warning</a></li>
                                <li><a onClick={() => writeInfoDoors("ajar", "1", setData)}>Warning</a></li>
                            </ul>
                        </div>
                        <p className="text-white">Ajar</p>
                    </div>

                    {/* Door */}
                    <div className="w-[30%] m-7 grid justify-items-end">
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn m-1 text-white inline-flex items-center justify-center p-2 bg-red-500 rounded-full border-4 border-gray-700 transition duration-300 ease-in-out hover:bg-red-700">
                                {data?.door}
                            </div>
                            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                                <li><a onClick={() => writeInfoDoors("door", "0", setData)}>Closed</a></li>
                                <li><a onClick={() => writeInfoDoors("door", "1", setData)}>Open</a></li>
                            </ul>
                        </div>
                        <p className="text-white">Door</p>
                    </div>



                </div>
            </div>

            {/* Middle Section - Image */}
            <div className="w-[30%] h-screen flex">
                <Image src={props.image} alt="car sketch" width={400} height={204} className="invert" />
            </div>


            {/* Right section */}
            <div className="w-[35%] flex flex-col items-center justify-center">

                {/* Passenger */}
                <div className="w-[30%] m-7 grid justify-items-start">
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn m-1 text-white inline-flex items-center justify-center p-2 bg-red-500 rounded-full border-4 border-gray-700 transition duration-300 ease-in-out hover:bg-red-700">
                            {data?.passenger}
                        </div>
                        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                            <li><a onClick={() => writeInfoDoors("passenger", "0", setData)}>Closed</a></li>
                            <li><a onClick={() => writeInfoDoors("passenger", "1", setData)}>Open</a></li>
                        </ul>
                    </div>
                    <p className="text-white">Passenger</p>
                </div>

                {/* Passenger lock*/}
                <div className="w-[30%] m-7 grid justify-items-start">
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn m-1 text-white inline-flex items-center justify-center p-2 bg-green-500 rounded-full border-4 border-gray-700 transition duration-300 ease-in-out hover:bg-green-700">
                            {data?.passenger_lock}
                        </div>
                        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                            <li><a onClick={() => writeInfoDoors("passenger_lock", "0", setData)}>Locked</a></li>
                            <li><a onClick={() => writeInfoDoors("passenger_lock", "1", setData)}>Unlocked</a></li>
                        </ul>
                        <p className="text-white">Passenger lock</p>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default DivCenterDoors

