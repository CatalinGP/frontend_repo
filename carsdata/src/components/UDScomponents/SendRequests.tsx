'use client'
import Link from 'next/link';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import ModalUDS from './ModalUDS';
import { displayLoadingCircle, displayErrorPopup, removeLoadingCicle } from '../sharedComponents/LoadingCircle';
import { batteryData, readInfoBattery, writeInfoBattery } from './DivCenterBattery';
import { engineData, readInfoEngine, writeInfoEngine } from './DivCenterEngine';
import { doorsData, readInfoDoors, writeInfoDoors } from './DivCenterDoors';
import { HVACData, readInfoHVAC, writeInfoHvac } from './DivCenterHVAC';
import logger from '@/src/utils/Logger';
import { BatteryItems } from '@/src/utils/ApiManager';
import { apiManager, Endpoints } from '@/src/utils/ApiManager';
import { json } from 'stream/consumers';
import ModalHvacModes from './ModalHvacModes';
import ModalReadDTC from './ModalReadDTC';
import ModalClearDTC from './ModalClearDTC';

let intervalID: number | NodeJS.Timeout | null = null;

const SendRequests = () => {
    logger.init();

    const [logs, setLogs] = useState<string[]>([]);
    const [data23, setData23] = useState<{ ecu_ids: [], mcu_id: any, status: string, time_stamp: string } | string[] | string | null |
        { name: string; version: string; }[]>();
    const [varBatteryData, setVarBatteryData] = useState<batteryData | null>();
    const [canId, setCanId] = useState("");
    const [canData, setCanData] = useState("");
    const [disableFrameAndDtcBtns, setDisableFrameAndDtcBtns] = useState<boolean>(false);
    const [disableRequestIdsBtn, setDisableRequestIdsBtn] = useState<boolean>(false);
    const [disableUpdateToVersionBtn, setDisableUpdateToVersionBtn] = useState<boolean>(false);
    const [disableInfoBatteryBtns, setDisableInfoBatteryBtns] = useState<boolean>(false);
    const [disableInfoEngineBtns, setDisableInfoEngineBtns] = useState<boolean>(false);
    const [disableInfoDoorsBtns, setDisableInfoDoorsBtns] = useState<boolean>(false);
    const [disableInfoHvacBtns, setDisableInfoHvacBtns] = useState<boolean>(false);
    const [disableConvertBtn, setDisableConvertBtn] = useState<boolean>(true);
    const [session, setSession] = useState("default");
    const [testerPres, setTesterPres] = useState<string>("disabled");
    const [accessTiming, setAccessTiming] = useState<string>("current");
    const [selectedECUid, setSelectedECUid] = useState<string>("");
    const [selectedECU, setSelectedECU] = useState<string>("Select ECU");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [cardTitle, setCardTitle] = useState("");
    const [paramToEdit, setParamToEdit] = useState("");
    const [ecuId, setecuId] = useState("");
    const [selectedDtc, setSelectedDtc] = useState("Select ECU Id");
    const [disableClearDTC, setDisableClearDTC] = useState<boolean>(false);
    const [disableReadTiming, setDisableReadTiming] = useState<boolean>(false);
    const [subFunct, setSubFunct] = useState<string | null>(null);
    const [ecuId2, setecuId2] = useState<string | null>(null);

    const [disableWriteTiming, setDisableWriteTiming] = useState<boolean>(false);
    const [subFunct2, setSubFunct2] = useState<string | null>(null);
    const [ecuId3, setecuId3] = useState<string | null>(null);

    const [readDTCResult, setReadDTCResult] = useState<any>(null); // Pentru a stoca rezultatele funcției readDTC
    const [modalEcuId, setModalEcuId] = useState<string | null>(null);

    /* Handler for Read DTC modal */
    const handleOpenReadDTC = (ecuId: string) => {
        setModalEcuId(ecuId);
        document.getElementById('readDTCModal')?.click();
    };

    /* Handler for Read Access Timing when subfunction is selected */
    const handleReadAccessTiming = (sub_funct: string) => {
        if (ecuId2) {
            readAccessTiming(ecuId2, sub_funct, setData23);
        }
    };

    const getSelected = (id: string) => {
        if (ecuId2 === id) {
            return {
                backgroundColor: '#4b5563',
                color: 'white',
                fontWeight: 'bold',
            };
        }
        return {};
    };

    /* Handler for Write Access Timing when subfunction is selected */
    const handleWriteAccessTiming = (sub_funct: string) => {
        if (ecuId3) {
            writeAccessTiming(ecuId3, sub_funct, setData23);
        }
    };

    const getSelected2 = (id: string) => {
        if (ecuId3 === id) {
            return {
                backgroundColor: '#4b5563',
                color: 'white',
                fontWeight: 'bold',
            };
        }
        return {};
    };

    const fetchLogs = async () => {
        displayLoadingCircle();
        console.log("Fetching logs...");
        await fetch(`http://127.0.0.1:5000/api/logs`, {
            method: 'GET',
        }).then(response => response.json())
            .then(data => {
                setLogs(data.logs);
                console.log(data);
            })
            .catch(error => {
                console.error('Error fetching logs:', error);
                displayErrorPopup("Connection failed");
                removeLoadingCicle();
            });
        removeLoadingCicle();
    }

    // Send a CAN frame to the server
    const sendFrame = async (initialRequest: any) => {
        try {
            displayLoadingCircle();
            /* Function for reading data from json */
            const data_sent = {
                can_id: canId,
                can_data: canData
            }
            /* Use API Manager to do the API call */
            const data = await apiManager.apiCall(Endpoints.SEND_FRAME, { json: data_sent })
            setData23(data);
            /* If communication was intrerrupted, log error */
            if (data?.ERROR === 'interrupted') {
                console.error("Connection interrupted");
                displayErrorPopup("Connection failed");
            }
            /* Handler for errors returned by API Manager */
        } catch (error) {
            console.error("Error during read operation: ", error);
            displayErrorPopup("Connection failed");
        } finally { removeLoadingCicle(); }
    };

    // Read Diagnostic Trouble Codes (DTC)
    const readDTC = async (ecu_id: any, read_dtc_subfunc: any, dtc_mask_bits: any) => {
        try {
            displayLoadingCircle();
            const data = await apiManager.apiCall(Endpoints.READ_DTC, {
                ecu_id: ecu_id,
                read_dtc_subfunc: read_dtc_subfunc,
                dtc_mask_bits: dtc_mask_bits
            });

            console.log("API Response:", data);
            setData23(data);
            /* If communication was intrerrupted, log error */
            if (data?.ERROR === 'interrupted') {
                console.error("Connection interrupted");
                displayErrorPopup("Connection failed");
            }

        } catch (error) {
            console.log("Read error", error)
            displayErrorPopup("can't read DTC ");
        }
        removeLoadingCicle();
    }

    const clearDTC = async (ecu_id: string, dtc_group: string, setData: any) => {
        console.log("Clearing DTC...");
        const data_sent = { ecu_id: ecu_id, dtc_group: dtc_group }
        displayLoadingCircle();

        try {
            const response = await apiManager.apiCall(Endpoints.CLEAR_DTC, { json: data_sent });

            if (response?.ERROR === 'interrupted') {
                console.error("Connection interrupted");
                displayErrorPopup("Connection failed");
            }
            setData(response);
            console.log(response);
        } catch (error) {
            console.error("Error during Clear DTC: ", error);
            displayErrorPopup("Error during Clear DTC");
        } finally {
            removeLoadingCicle();
        }
    }

    /* Function that reads the data about MCU & ECUs IDs */
    const requestIds = async (initialRequest: boolean) => {
        try {
            displayLoadingCircle();
            /* Use API Manager to do the API call */
            const data = await apiManager.apiCall(Endpoints.REQUEST_IDS)
            setData23(data);
            /* If communication was intrerrupted, log error */
            if (data?.ERROR === 'interrupted') {
                console.error("Connection interrupted");
                displayErrorPopup("Connection failed");
            }
            /* Handler for errors returned by API Manager */
        } catch (error) {
            console.error("Error during read operation: ", error);
            displayErrorPopup("Connection failed");
        } finally { removeLoadingCicle(); }
    };


    const updateToVersion = async () => {
        displayLoadingCircle();
        const ecuId = prompt('Enter ECU ID:');
        const version = prompt('Enter Version:');
        console.log({ ecu_id: ecuId, version: version });
        console.log("Updateing version...");
        try {
            await fetch(`http://127.0.0.1:5000/api/update_to_version`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ecu_id: ecuId, version: version }),
            }).then(response => response.json())
                .then(data => {
                    setData23(data);
                    console.log(data);
                    fetchLogs();
                });
        } catch (error) {
            console.log(error);
            displayErrorPopup("Connection failed");
            removeLoadingCicle();
        }
        removeLoadingCicle();
    }

    const getNewSoftVersions = async (): Promise<{ message: string; versions: { name: string; version: string }[] }> => {
        displayLoadingCircle();
        const responseContainer = document.getElementById('response-data');

        responseContainer && (responseContainer.innerHTML = "<p>Getting new soft versions...</p>");

        let versionsArray: { name: string; version: string }[] = [];

        try {
            const response = await fetch(`http://127.0.0.1:5000/api/drive_update_data`, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Response data:", data);

            if (data && data.children && data.children.length > 0) {

                for (const folder of data.children) {
                    console.log("Processing folder:", folder.name);

                    for (const child of folder.children) {
                        const fullName: string = child.name;
                        const version: string = getVersion(fullName);
                        console.log(`Found file: ${fullName}, version: ${version}`);
                        const nameWithoutId: string = fullName.split('.zip')[0];
                        versionsArray.push({ name: nameWithoutId, version });
                    }
                };

                console.log("Versions array:", versionsArray);


                const searchTerms = ["HVAC", "battery", "engine", "doors"];
                const filteredVersions = getElementByName(versionsArray, searchTerms);
                console.log("Filtered ECU Versions:", filteredVersions);

                setData23(versionsArray);

                return {
                    message: "Versions retrieved successfully",
                    versions: filteredVersions
                };
            } else {
                return { message: "No versions available", versions: [] };
            }
        } catch (error) {
            console.error("Error:", error);
            const errorMessage = (error instanceof Error) ? error.message : "Unknown error occurred";

            if (responseContainer) {
                responseContainer.innerHTML += `<h3>Error:</h3><p>${errorMessage}</p>`;
            }

            return {
                message: "Failed to retrieve versions",
                versions: []
            };
        } finally {
            removeLoadingCicle();
        }
    };

    const getVersion = (fullName: string): string => {
        const versionMatch = fullName.match(/_(\d+\.\d+)\.zip/);
        console.log(`Extracting version from: ${fullName}`);
        return versionMatch ? versionMatch[1] : "unknown";
    };  // to be removed 

    const getElementByName = (versionsArray: { name: string; version: string }[], searchTerms: string[]) => {
        const filteredVersions = versionsArray.filter(version =>
            searchTerms.some(term => version.name.toLowerCase().includes(term.toLowerCase()))
        );
        return filteredVersions;
    };

    const checkInput = (message: any) => {
        let value;
        do {
            value = prompt(message);
            if (value !== '0' && value !== '1') {
                alert('Accepted value: 0/1');
            }
        } while (value !== '0' && value !== '1');
        return value;
    }; // will be moved only in DivCenterHvac

    //Change session
    const changeSession = async () => {
        let sessiontype = {
            sub_funct: session === "default" ? 2 : 1
        };
        displayLoadingCircle();
        console.log("Session type sent:", sessiontype);
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/change_session`, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(sessiontype),
            });
            const data = await response.json();
            console.log("API response:", data);

            if (data.message && data.message.includes("Session changed to")) {
                console.log("Session change confirmed:", data.message);

                setSession(prevSession => {
                    const newSession = prevSession === "default" ? "programming" : "default";
                    console.log("Session updated to:", newSession);
                    return newSession;
                });
            } else {
                console.log("Failed to change session:", data.message || "Unknown error");
            }
            setData23(data);
            fetchLogs();
        } catch (error) {
            console.log("Error:", error);
        } finally {
            removeLoadingCicle();
        }
    };

    const authenticate = async () => {
        console.log("Authenticating...");
        displayLoadingCircle();
        try {
            await fetch(`http://127.0.0.1:5000/api/authenticate`, {
                method: 'GET',
            }).then(response => response.json())
                .then(data => {
                    setData23(data);
                    console.log(data);
                    fetchLogs();
                });
        } catch (error) {
            console.log(error);
            removeLoadingCicle();
        }
        removeLoadingCicle();
    }

    const readAccessTiming = async (ecu_id: string, sub_funct: string, setData: any) => {

        if (sub_funct === "1") {
            console.log("Read Access Timing - Default");
        } else {
            console.log("Read Access Timing - Current");
        }

        const data_sent = { ecu_id: ecu_id, sub_funct: sub_funct }
        displayLoadingCircle();

        try {
            const response = await apiManager.apiCall(Endpoints.READ_ACCESS_TIMING, { json: data_sent });

            if (response?.ERROR === 'interrupted') {
                console.error("Connection interrupted");
                displayErrorPopup("Connection failed");
            }
            setData(response);
            console.log(response);
        } catch (error) {
            console.error("Error during Read Access Timing: ", error);
            displayErrorPopup("Error during Read Access Timing");
        } finally {
            removeLoadingCicle();
        }
    }

    const writeAccessTiming = async (ecu_id: string, sub_funct: string, setData: any) => {
        let data_sent: { [key: string]: any };

        if (sub_funct === '2') {
            console.log('Write Access Timing - Reset to Default');
            data_sent = { ecu_id: ecu_id, sub_funct: sub_funct };

        } else {
            data_sent = {
                p2_max: parseInt(prompt("Enter p2_max value:") || "0", 10),
                p2_star_max: parseInt(prompt("Enter p2_star_max value:") || "0", 10),
                ecu_id: ecu_id,
                sub_funct: sub_funct
            };
        }

        displayLoadingCircle();
        try {
            const response = await apiManager.apiCall(Endpoints.WRITE_TIMING, { json: data_sent });

            if (response?.ERROR === 'interrupted') {
                console.error("Connection interrupted");
                displayErrorPopup("Connection failed");
            }
            setData(response);
            console.log(response);
        } catch (error) {
            console.error("Error during Read Access Timing: ", error);
            displayErrorPopup("Error during Read Access Timing");
        } finally {
            removeLoadingCicle();
        }
    };

    const getIdentifiers = async () => {
        console.log("Reading all data identifiers...");
        displayLoadingCircle();
        try {
            await fetch(`http://127.0.0.1:5000/api/get_identifiers`, {
                method: 'GET',
            }).then(response => response.json())
                .then(data => {
                    setData23(data);
                    console.log(data);
                    fetchLogs();
                });
        } catch (error) {
            console.log(error);
            removeLoadingCicle();
        }
        removeLoadingCicle();
    }

    const checkTesterPresent = async () => {
        console.log("Checking state of tester present...");
        try {
            await fetch(`http://127.0.0.1:5000/api/tester_present`, {
                method: 'GET',
            }).then(response => response.json())
                .then(data => {
                    setData23(data);
                    console.log(data);
                });
        } catch (error) {
            console.log(error);
        }
    }

    const testerPresent = () => {
        if (testerPres === "disabled") {
            setTesterPres("enabled");
            if (!intervalID) {
                intervalID = window.setInterval(() => {
                    checkTesterPresent();
                }, 2000);
            } else {
                console.log("An interval is already running with ID:", intervalID);
            }

        } else {
            console.log("Stopping interval (Entering 'else' branch)");
            setTesterPres("disabled");
            if (intervalID) {
                clearInterval(intervalID);
                console.log("Interval stopped with ID:", intervalID);
                intervalID = null;
            } else {
                console.log("No interval to stop (intervalID is null).");
            }
        }
    };

    // Reset the ECU based on the selected ECU ID and reset type
    const ecuReset = async (resetType: string) => {
        if (selectedECUid === "") {
            displayErrorPopup("Select ECU");
            return;
        }
        console.log("Reseting ECU...");
        console.log({
            ecu_id: selectedECUid,
            type_reset: resetType
        });
        displayLoadingCircle();
        try {
            await fetch(`http://127.0.0.1:5000/api/reset_ecu`, {
                method: 'POST',
                // mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ecu_id: selectedECUid,
                    type_reset: resetType
                }),
            })
                .then(response => response.json())
                .then(data => {
                    setData23(data);
                    console.log(data);
                    fetchLogs();
                    displayErrorPopup(selectedECUid + " reseted");
                })
        } catch (error) {
            console.log(error);
            displayErrorPopup("Connection failed");
            removeLoadingCicle();
        }
        removeLoadingCicle();
    }

    const renderDictionary = (data: any) => {
        if (typeof data !== "object" || data === null) {
            return <span>{String(data)}</span>;
        }

        return (
            <ul className="list-disc ml-4">
                {Object.entries(data).map(([key, value]) => (
                    <li key={key}>
                        <strong>{key}:</strong> {renderDictionary(value)}
                    </li>
                ))}
            </ul>
        );
    };


    useEffect(() => {
        requestIds(true);
    }, []);

    return (
        <div className="bg-gray-100 w-[90%] h-screen flex flex-col items-center">
            <div className="w-[60%] h-screen flex flex-col">
                <h1 className="text-3xl mt-2">CAN Interface Control</h1>
                <div className="inline-flex">
                    <div className="flex flex-col">
                        <button className="btn btn-info w-fit mt-2 text-white">
                            <Link href="http://127.0.0.1:5000/apidocs/" target="_blank" rel="noopener noreferrer">Go to Docs</Link>
                        </button>
                        <button className="btn btn-info w-fit mt-2 text-white" onClick={() => logger.downloadLogs()}>
                            Download Logs
                        </button>
                    </div>
                    <div className="mt-2 ml-5">
                        <p>Tester present: {testerPres}</p>
                        <input type="checkbox" className="toggle toggle-info" checked={testerPres === "disabled" ? false : true} onChange={testerPresent} />
                    </div>
                    <div className="mt-2 ml-5">
                        <p>Session: {session}</p>
                        <input type="checkbox" className="toggle toggle-info" checked={session === "programming"} onChange={changeSession} />
                    </div>
                    {/*               <div className="mt-2 ml-5">
                        <p>Read {accessTiming} access timing</p>
                        <input type="checkbox" className="toggle toggle-info" checked={accessTiming === "current" ? false : true} onChange={readAccessTiming} />
                    </div> */}
                    <div className="mt-2 ml-5 border-2 border-black">
                        <p>ECU reset</p>
                        <div className="dropdown">
                            <button tabIndex={0} className="btn bg-blue-500 w-fit m-1 hover:bg-blue-600 text-white relative" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                                {selectedECU}
                                <Image
                                    src="/dropdownarrow.png"
                                    alt="Dropdown arrow icon"
                                    className="dark:invert m-1 hover:object-scale-down"
                                    width={10}
                                    height={10}
                                    priority
                                />
                            </button>
                            {isDropdownOpen && (
                                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-fit p-2 shadow">
                                    <li><a onClick={() => { setSelectedECUid("10"); setSelectedECU("MCU"); setIsDropdownOpen(false) }}>MCU</a></li>
                                    <li><a onClick={() => { setSelectedECUid("11"); setSelectedECU("Battery"); setIsDropdownOpen(false) }}>Battery</a></li>
                                    <li><a onClick={() => { setSelectedECUid("12"); setSelectedECU("Engine"); setIsDropdownOpen(false) }}>Engine</a></li>
                                    <li><a onClick={() => { setSelectedECUid("13"); setSelectedECU("Doors"); setIsDropdownOpen(false) }}>Doors</a></li>
                                    <li><a onClick={() => { setSelectedECUid("14"); setSelectedECU("HVAC"); setIsDropdownOpen(false) }}>HVAC</a></li>
                                </ul>
                            )}
                        </div>

                        <div className="dropdown">
                            <button tabIndex={1} className="btn bg-blue-500 w-fit m-1 hover:bg-blue-600 text-white relative" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                                Reset type
                                <Image
                                    src="/dropdownarrow.png"
                                    alt="Dropdown arrow icon"
                                    className="dark:invert m-1 hover:object-scale-down"
                                    width={10}
                                    height={10}
                                    priority
                                />
                            </button>
                            {isDropdownOpen && (
                                <ul tabIndex={1} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-fit p-2 shadow">
                                    <li><a onClick={() => { ecuReset("soft"); setIsDropdownOpen(false) }}>Soft</a></li>
                                    <li><a onClick={() => { ecuReset("hard"); setIsDropdownOpen(false) }}>Hard</a></li>
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
                <div>
                    <p className="text-xl mt-2">CAN ID:</p>
                    <input type="text" placeholder="e.g., 0xFa, 0x1234" className="input input-bordered w-full" onChange={e => setCanId(e.target.value)} />
                    <p className="text-xl mt-2">CAN Data:</p>
                    <input type="text" placeholder="e.g., 0x12, 0x34" className="input input-bordered w-full" onChange={e => setCanData(e.target.value)} />
                    <button className="btn btn-success w-fit mt-2 text-white" onClick={sendFrame} disabled={disableFrameAndDtcBtns}>Send Frame</button>
                </div>
                <div className="w-full h-px mt-2 bg-gray-300"></div>
                <div>
                    <button className="btn bg-blue-500 w-fit m-1 hover:bg-blue-600 text-white" onClick={() => requestIds(false)} disabled={disableRequestIdsBtn}>Request IDs</button>
                    <div className="dropdown">
                        <button tabIndex={2} className="btn bg-blue-500 w-fit m-1 hover:bg-blue-600 text-white relative" disabled={disableInfoBatteryBtns}>
                            Read Battery Info
                            <Image
                                src="/dropdownarrow.png"
                                alt="Dropdown arrow icon"
                                className="dark:invert m-1 hover:object-scale-down"
                                width={10}
                                height={10}
                                priority
                            />
                        </button>
                        <ul tabIndex={2} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-fit p-2 shadow">
                            <li><a onClick={() => { readInfoBattery(setData23, { manual_flow: true }) }}>All params</a></li>
                            <li><a onClick={() => { readInfoBattery(setData23, { manual_flow: true, item: 'battery_level' }) }}>Battery level</a></li>
                            <li><a onClick={() => { readInfoBattery(setData23, { manual_flow: true, item: 'battery_state_of_charge' }) }}>State of charge</a></li>
                            <li><a onClick={() => { readInfoBattery(setData23, { manual_flow: true, item: 'percentage' }) }}>Percentage</a></li>
                            <li><a onClick={() => { readInfoBattery(setData23, { manual_flow: true, item: 'voltage' }) }}>Voltage</a></li>
                        </ul>
                    </div>

                    <div className="dropdown">
                        <button tabIndex={3} className="btn bg-blue-500 w-fit m-1 hover:bg-blue-600 text-white relative" disabled={disableInfoBatteryBtns}>
                            Write Battery Info
                            <Image
                                src="/dropdownarrow.png"
                                alt="Dropdown arrow icon"
                                className="dark:invert m-1 hover:object-scale-down"
                                width={10}
                                height={10}
                                priority
                            />
                        </button>
                        <ul tabIndex={3} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-fit p-2 shadow">
                            <li>
                                <label htmlFor="my_modal_7" onClick={() => { setCardTitle("Battery level"), setParamToEdit("battery_level") }}>Battery level</label>
                            </li>
                            <li>
                                <label htmlFor="my_modal_7" onClick={() => { setCardTitle("State of charge"), setParamToEdit("battery_state_of_charge") }}>State of charge</label>
                            </li>
                            <li>
                                <label htmlFor="my_modal_7" onClick={() => { setCardTitle("Percentage"), setParamToEdit("percentage") }}>Percentage</label>
                            </li>
                            <li>
                                <label htmlFor="my_modal_7" onClick={() => { setCardTitle("Voltage"), setParamToEdit("voltage") }}>Voltage</label>
                            </li>
                        </ul>
                        <ModalUDS id="my_modal_7" cardTitle={cardTitle} writeInfo={writeInfoBattery} param={paramToEdit} manual={true} setter={setData23} />
                    </div>


                    <div className="dropdown">
                        <button tabIndex={4} className="btn bg-blue-500 w-fit m-1 hover:bg-blue-600 text-white relative" disabled={disableInfoEngineBtns}>
                            Read Engine Info
                            <Image
                                src="/dropdownarrow.png"
                                alt="Dropdown arrow icon"
                                className="dark:invert m-1 hover:object-scale-down"
                                width={10}
                                height={10}
                                priority
                            />
                        </button>
                        <ul tabIndex={4} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-fit p-2 shadow">
                            <li><a onClick={() => { readInfoEngine(setData23, { manual_flow: true }) }} >All params</a></li>
                            <li><a onClick={() => { readInfoEngine(setData23, { manual_flow: true, item: 'coolant_temperature' }) }} >Coolant temperature</a></li>
                            <li><a onClick={() => { readInfoEngine(setData23, { manual_flow: true, item: 'engine_load' }) }} >Engine load</a></li>
                            <li><a onClick={() => { readInfoEngine(setData23, { manual_flow: true, item: 'engine_rpm' }) }} >RPM</a></li>
                            <li><a onClick={() => { readInfoEngine(setData23, { manual_flow: true, item: 'fuel_level' }) }} >Fuel</a></li>
                            <li><a onClick={() => { readInfoEngine(setData23, { manual_flow: true, item: 'fuel_pressure' }) }} >Fuel pressure</a></li>
                            <li><a onClick={() => { readInfoEngine(setData23, { manual_flow: true, item: 'intake_air_temperature' }) }} >Intake air temperature</a></li>
                            <li><a onClick={() => { readInfoEngine(setData23, { manual_flow: true, item: 'oil_temperature' }) }} >Oil temperature</a></li>
                            <li><a onClick={() => { readInfoEngine(setData23, { manual_flow: true, item: 'throttle_position' }) }} >Throttle position</a></li>
                            <li><a onClick={() => { readInfoEngine(setData23, { manual_flow: true, item: 'vehicle_speed' }) }} >Speed</a></li>
                        </ul>
                    </div>


                    <div className="dropdown">
                        <button tabIndex={5} className="btn bg-blue-500 w-fit m-1 hover:bg-blue-600 text-white relative" disabled={disableInfoEngineBtns}>
                            Write Engine Info
                            <Image
                                src="/dropdownarrow.png"
                                alt="Dropdown arrow icon"
                                className="dark:invert m-1 hover:object-scale-down"
                                width={10}
                                height={10}
                                priority
                            />
                        </button>
                        <div>
                            <ul tabIndex={5} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-fit p-2 shadow">
                                <li>
                                    <label htmlFor="my_modal_8" onClick={() => { setCardTitle("Coolant temperature"), setParamToEdit("coolant_temperature") }}>Coolant temperature</label>
                                </li>
                                <li>
                                    <label htmlFor="my_modal_8" onClick={() => { setCardTitle("Load"), setParamToEdit("engine_load") }} >Engine load</label>
                                </li>
                                <li>
                                    <label htmlFor="my_modal_8" onClick={() => { setCardTitle("RPM"), setParamToEdit("engine_rpm") }} >RPM</label>
                                </li>
                                <li>
                                    <label htmlFor="my_modal_8" onClick={() => { setCardTitle("Fuel"), setParamToEdit("fuel_level") }} >Fuel</label>
                                </li>
                                <li>
                                    <label htmlFor="my_modal_8" onClick={() => { setCardTitle("Fuel pressure"), setParamToEdit("fuel_pressure") }} >Fuel pressure</label>
                                </li>
                                <li>
                                    <label htmlFor="my_modal_8" onClick={() => { setCardTitle("Intake air temperature"), setParamToEdit("intake_air_temperature") }} >Intake air temperature</label>
                                </li>
                                <li>
                                    <label htmlFor="my_modal_8" onClick={() => { setCardTitle("Oil temperature"), setParamToEdit("oil_temperature") }} >Oil temperature</label>
                                </li>
                                <li>
                                    <label htmlFor="my_modal_8" onClick={() => { setCardTitle("Throttle position"), setParamToEdit("throttle_position") }} >Throttle position</label>
                                </li>
                                <li>
                                    <label htmlFor="my_modal_8" onClick={() => { setCardTitle("Speed"), setParamToEdit("vehicle_speed") }} >Speed</label>
                                </li>
                            </ul>
                            <ModalUDS id="my_modal_8" cardTitle={cardTitle} writeInfo={writeInfoEngine} param={paramToEdit} manual={true} setter={setData23} />
                        </div>
                    </div>

                    <div className="dropdown">
                        <button tabIndex={6} className="btn bg-blue-500 w-fit m-1 hover:bg-blue-600 text-white relative" disabled={disableInfoDoorsBtns}>
                            Read Doors Info
                            <Image
                                src="/dropdownarrow.png"
                                alt="Dropdown arrow icon"
                                className="dark:invert m-1 hover:object-scale-down"
                                width={10}
                                height={10}
                                priority
                            />
                        </button>
                        <ul tabIndex={6} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-fit p-2 shadow">
                            <li><a onClick={() => { readInfoDoors(setData23, { manual_flow: true }) }} >All params</a></li>
                            <li><a onClick={() => { readInfoDoors(setData23, { manual_flow: true, item: 'ajar' }) }} >Ajar</a></li>
                            <li><a onClick={() => { readInfoDoors(setData23, { manual_flow: true, item: 'door' }) }} >Door</a></li>
                            <li><a onClick={() => { readInfoDoors(setData23, { manual_flow: true, item: 'passenger' }) }} >Passenger</a></li>
                            <li><a onClick={() => { readInfoDoors(setData23, { manual_flow: true, item: 'passenger_lock' }) }} >Passenger lock</a></li>
                        </ul>
                    </div>

                    <div className="dropdown">
                        <button tabIndex={7} className="btn bg-blue-500 w-fit m-1 hover:bg-blue-600 text-white relative" disabled={disableInfoDoorsBtns}>
                            Write Doors Info
                            <Image
                                src="/dropdownarrow.png"
                                alt="Dropdown arrow icon"
                                className="dark:invert m-1 hover:object-scale-down"
                                width={10}
                                height={10}
                                priority
                            />
                        </button>
                        <div>
                            <ul tabIndex={7} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-fit p-2 shadow">
                                <li>
                                    <label htmlFor="my_modal_9" onClick={() => { setCardTitle("Ajar"), setParamToEdit("ajar") }} >Ajar</label>
                                </li>
                                <li>
                                    <label htmlFor="my_modal_9" onClick={() => { setCardTitle("Door"), setParamToEdit("door") }} >Door</label>
                                </li>
                                <li>
                                    <label htmlFor="my_modal_9" onClick={() => { setCardTitle("Passenger"), setParamToEdit("passenger") }} >Passenger</label>
                                </li>
                                <li>
                                    <label htmlFor="my_modal_9" onClick={() => { setCardTitle("Passenger lock"), setParamToEdit("passenger_lock") }} >Passenger lock</label>
                                </li>
                            </ul>
                            <ModalUDS id="my_modal_9" cardTitle={cardTitle} writeInfo={writeInfoDoors} param={paramToEdit} manual={true} setter={setData23} />
                        </div>
                    </div>

                    <div className="dropdown">
                        <button tabIndex={8} className="btn bg-blue-500 w-fit m-1 hover:bg-blue-600 text-white relative" disabled={disableInfoHvacBtns}>
                            Read HVAC Info
                            <Image
                                src="/dropdownarrow.png"
                                alt="Dropdown arrow icon"
                                className="dark:invert m-1 hover:object-scale-down"
                                width={10}
                                height={10}
                                priority
                            />
                        </button>
                        <ul tabIndex={8} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-fit p-2 shadow">
                            <li><a onClick={() => { readInfoHVAC(setData23, { manual_flow: true }) }} >All params</a></li>
                            <li><a onClick={() => { readInfoHVAC(setData23, { manual_flow: true, item: 'ambient_air_temperature' }) }} >Ambient temperature</a></li>
                            <li><a onClick={() => { readInfoHVAC(setData23, { manual_flow: true, item: 'cabin_temperature' }) }} >Cabin temperature</a></li>
                            <li><a onClick={() => { readInfoHVAC(setData23, { manual_flow: true, item: 'cabin_temperature_driver_set' }) }} >Driver seat</a></li>
                            <li><a onClick={() => { readInfoHVAC(setData23, { manual_flow: true, item: 'fan_speed' }) }} >Fan speed</a></li>
                            <li><a onClick={() => { readInfoHVAC(setData23, { manual_flow: true, item: 'hvac_modes' }) }} >HVAC modes</a></li>
                            <li><a onClick={() => { readInfoHVAC(setData23, { manual_flow: true, item: 'mass_air_flow' }) }} >Mass air flow</a></li>
                        </ul>
                    </div>

                    <div className="dropdown">
                        <button tabIndex={9} className="btn bg-blue-500 w-fit m-1 hover:bg-blue-600 text-white relative" disabled={disableInfoHvacBtns}>
                            Write HVAC Info
                            <Image
                                src="/dropdownarrow.png"
                                alt="Dropdown arrow icon"
                                className="dark:invert m-1 hover:object-scale-down"
                                width={10}
                                height={10}
                                priority
                            />
                        </button>
                        <div>
                            <ul tabIndex={9} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-fit p-2 shadow">
                                <li>
                                    <label htmlFor="my_modal_10" onClick={() => { setCardTitle("Ambient air temperature"), setParamToEdit("ambient_air_temperature"); }}>Ambient temperature</label>
                                </li>
                                <li>
                                    <label htmlFor="my_modal_10" onClick={() => { setCardTitle("Cabin temperature"), setParamToEdit("cabin_temperature"); }}>Cabin temperature</label>
                                </li>
                                <li>
                                    <label htmlFor="my_modal_10" onClick={() => { setCardTitle("Cabin temperature driver set"), setParamToEdit("cabin_temperature_driver_set"); }}>Driver seat</label>
                                </li>
                                <li>
                                    <label htmlFor="my_modal_10" onClick={() => { setCardTitle("Fan speed"), setParamToEdit("fan_speed"); }}>Fan speed</label>
                                </li>
                                <li>
                                    <label htmlFor="my_modal_11" onClick={() => { setCardTitle("Hvac modes"), setParamToEdit("hvac_modes"); }}>Hvac modes</label>
                                </li>
                                <li>
                                    <label htmlFor="my_modal_10" onClick={() => { setCardTitle("Mass air flow"), setParamToEdit("mass_air_flow"); }}>Mass air flow</label>
                                </li>
                            </ul>
                            <ModalUDS id="my_modal_10" cardTitle={cardTitle} writeInfo={writeInfoHvac} param={paramToEdit} manual={true} setter={setData23} />
                            <ModalHvacModes id="my_modal_11" writeInfo={writeInfoHvac} manual={true} setter={setData23} />
                        </div>
                    </div>
                    <button className="btn bg-blue-500 w-fit m-1 hover:bg-blue-600 text-white" >Google Drive Info</button>
                </div>

                <div className="w-full h-px mt-2 bg-gray-300"></div>

                <div className="mt-2">
                    <button className="btn btn-warning w-fit ml-1 mt-2 text-white" onClick={authenticate} disabled={disableFrameAndDtcBtns}>Authenticate</button>

                    {/* Dropdown for ReadDTC ECUs */}
                    <div className="dropdown">
                        <label tabIndex={0} className="btn btn-success w-fit ml-1 mt-2 text-white">
                            Read DTC
                            <Image
                                src="/dropdownarrow.png"
                                alt="Dropdown arrow icon"
                                className="dark:invert m-1 hover:object-scale-down"
                                width={10}
                                height={10}
                                priority
                            />
                        </label>
                        <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                            <li>
                                <a onClick={() => handleOpenReadDTC("0x11")}>Battery</a>
                            </li>
                            <li>
                                <a onClick={() => handleOpenReadDTC("0x12")}>Engine</a>
                            </li>
                        </ul>
                    </div>

                    {/* Read DTC modal */}
                    {modalEcuId && (
                        <ModalReadDTC
                            id="readDTCModal"
                            ecu_id={modalEcuId}
                            readDTC={readDTC}
                            setter={setReadDTCResult}
                        />
                    )}

                    <div className="dropdown">
                        <button tabIndex={10} className="btn btn-success w-fit ml-1 mt-2 text-white" disabled={disableClearDTC}>
                            Clear DTC
                            <Image
                                src="/dropdownarrow.png"
                                alt="Dropdown arrow icon"
                                className="dark:invert m-1 hover:object-scale-down"
                                width={10}
                                height={10}
                                priority
                            />
                        </button>
                        <div>
                            <ul tabIndex={7} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-fit p-2 shadow">
                                <li>
                                    <label htmlFor="clearDTC_modal" onClick={() => { setecuId("11") }} >Battery</label>
                                </li>
                                <li>
                                    <label htmlFor="clearDTC_modal" onClick={() => { setecuId("12") }} >Engine</label>
                                </li>
                            </ul>
                            <ModalClearDTC id="clearDTC_modal" ecu_id={ecuId} clearDTC={clearDTC} setter={setData23} />
                        </div>
                    </div>

                    <button className="btn btn-warning w-fit ml-1 mt-2 text-white" onClick={getIdentifiers} disabled={disableFrameAndDtcBtns}>Read identifiers</button>

                    {/* <button className="btn bg-blue-500 w-fit ml-1 mt-2 hover:bg-blue-600 text-white" onClick={readAccessTiming}>Read Timing</button> */}

                    <div className="dropdown">
                        <button tabIndex={10} className="btn bg-blue-500 w-fit m-1 hover:bg-blue-600 text-white" disabled={disableReadTiming}>
                            Read Timing
                            <Image
                                src="/dropdownarrow.png"
                                alt="Dropdown arrow icon"
                                className="dark:invert m-1 hover:object-scale-down"
                                width={10}
                                height={10}
                                priority
                            />
                        </button>
                        <div>
                            <ul tabIndex={7} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-fit p-2 shadow">
                                <li style={getSelected("10")}>
                                    <label onClick={() => { setecuId2("10") }}>
                                        MCU
                                    </label>
                                </li>
                                <li style={getSelected("11")}>
                                    <label onClick={() => { setecuId2("11") }}>
                                        Battery
                                    </label>
                                </li>
                                <li style={getSelected("12")}>
                                    <label onClick={() => { setecuId2("12") }}>
                                        Engine
                                    </label>
                                </li>
                                <li style={getSelected("13")}>
                                    <label onClick={() => { setecuId2("13") }}>
                                        Doors
                                    </label>
                                </li>
                                <li style={getSelected("14")}>
                                    <label onClick={() => { setecuId2("14") }}>
                                        HVAC
                                    </label>
                                </li>

                                {ecuId2 && (
                                    <>
                                        <li className="menu-title">
                                            Select Timing
                                        </li>
                                        <li>
                                            <label
                                                htmlFor="default_timing"
                                                onClick={() => { setSubFunct('1'); handleReadAccessTiming('1') }}
                                            >
                                                Default
                                            </label>
                                        </li>
                                        <li>
                                            <label
                                                htmlFor="current_timing"
                                                onClick={() => { setSubFunct('3'); handleReadAccessTiming('3') }}
                                            >
                                                Current
                                            </label>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>

                    <div className="dropdown">
                        <button tabIndex={10} className="btn bg-blue-500 w-fit m-1 hover:bg-blue-600 text-white" disabled={disableWriteTiming}>
                            Write Timing
                            <Image
                                src="/dropdownarrow.png"
                                alt="Dropdown arrow icon"
                                className="dark:invert m-1 hover:object-scale-down"
                                width={10}
                                height={10}
                                priority
                            />
                        </button>
                        <div>
                            <ul tabIndex={7} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-fit p-2 shadow">
                                <li style={getSelected2("10")}>
                                    <label onClick={() => { setecuId3("10") }}>
                                        MCU
                                    </label>
                                </li>
                                <li style={getSelected2("11")}>
                                    <label onClick={() => { setecuId3("11") }}>
                                        Battery
                                    </label>
                                </li>
                                <li style={getSelected2("12")}>
                                    <label onClick={() => { setecuId3("12") }}>
                                        Engine
                                    </label>
                                </li>
                                <li style={getSelected2("13")}>
                                    <label onClick={() => { setecuId3("13") }}>
                                        Doors
                                    </label>
                                </li>
                                <li style={getSelected2("14")}>
                                    <label onClick={() => { setecuId3("14") }}>
                                        HVAC
                                    </label>
                                </li>

                                {ecuId3 && (
                                    <>
                                        <li className="menu-title">
                                            Select Timing
                                        </li>
                                        <li>
                                            <label
                                                htmlFor="default_timing"
                                                onClick={() => { setSubFunct2('2'); handleWriteAccessTiming('2') }}
                                            >
                                                Reset to Default
                                            </label>
                                        </li>
                                        <li>
                                            <label
                                                htmlFor="current_timing"
                                                onClick={() => { setSubFunct2('4'); handleWriteAccessTiming('4') }}
                                            >
                                                Write Current
                                            </label>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>

                    <button className="btn btn-warning w-fit ml-1 mt-2 text-white" onClick={getNewSoftVersions}>Check new soft versions</button>

                    {data23 && (
                        <div>
                            <h1 className="text-2xl mt-2">Response</h1>
                            <div className="m-2 p-2 list-disc">
                                {renderDictionary(data23)}
                            </div>
                        </div>
                    )}

                    <div className="m-2 border-2 border-black overflow-x-auto max-h-52">
                        <h1 className="text-2xl mt-2">Logs:</h1>
                        <table className="table table-zebra">
                            <thead>
                                <tr>
                                    <th>Index</th>
                                    <th>Log Message</th>
                                </tr>
                            </thead>
                            <tbody id="log-body">
                                {logs.map((log: any, index: any) => (
                                    <tr key={index}>
                                        <td align="center">{index}</td>
                                        <td align="center">{log}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div >
            </div>
        </div >
    )
}

export default SendRequests;
