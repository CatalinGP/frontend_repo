import { displayLoadingCircle, displayErrorPopup, removeLoadingCircle } from '@/src/components/sharedComponents/LoadingCircle';

/* Types for the item flag (used to read a single attribute) */
export type BatteryItems = 'battery_level' | 'voltage' | 'percentage' | 'battery_state_of_charge' | 'life_cycle' | 'fully_charged' | 'serial_number' |
    'range_battery' | 'charging_time' | 'device_consumption';

export type DoorsItems = 'door' | 'passenger' | 'driver' | 'passenger_lock' | 'ajar';

export type EngineItems = 'engine_rpm' | 'coolant_temperature' | 'throttle_position' | 'vehicle_speed' | 'engine_load' | 'fuel_level' |
    'oil_temperature' | 'fuel_pressure' | 'intake_air_temperature' | 'transmission_status';

export type HvacItems = 'mass_air_flow' | 'ambient_air_temperature' | 'cabin_temperature' | 'cabin_temperature_driver_set' |
    'fan_speed' | 'hvac_modes';

type Item = BatteryItems | DoorsItems | EngineItems | HvacItems;

/* This type contains the information about an API Endpoint:
 * url : the url of the API endpoint
 * method : fetching method; can be GET or POST
 * need_manual_flow : true if the endpoints need the is_manual_flow, false otherwise
 * supports_item_flag : true if the endpoint supports item flag (only for ECU reads), false otherwise
*/
type EndpointInfo = {
    url: string;
    method: 'GET' | 'POST';
    need_manual_flow: boolean;
    supports_item_flag: boolean;
};

/* This type contains the information about an API route:
 * path : the path of the API route file
 * method : fetching method; can be GET or POST
*/
type RouteInfo = {
    path: string;
    method: 'GET' | 'POST';
};

/* A record containing all current API Endpoints:
 * key : a string containing an intuitive label of the service called trough that endpoint
 * value : an EndpointInfo structure containing the information described above
*/
export const Endpoints: Record<string, EndpointInfo> = {
    READ_BATTERY: {
        url: 'http://127.0.0.1:5000/api/read_info_battery',
        method: 'GET',
        need_manual_flow: true,
        supports_item_flag: true
    },

    WRITE_BATTERY: {
        url: 'http://127.0.0.1:5000/api/write_info_battery',
        method: 'POST',
        need_manual_flow: false,
        supports_item_flag: false
    },

    READ_DOORS: {
        url: 'http://127.0.0.1:5000/api/read_info_doors',
        method: 'GET',
        need_manual_flow: true,
        supports_item_flag: true
    },

    WRITE_DOORS: {
        url: 'http://127.0.0.1:5000/api/write_info_doors',
        method: 'POST',
        need_manual_flow: false,
        supports_item_flag: false
    },

    READ_ENGINE: {
        url: 'http://127.0.0.1:5000/api/read_info_engine',
        method: 'GET',
        need_manual_flow: true,
        supports_item_flag: true
    },

    WRITE_ENGINE: {
        url: 'http://127.0.0.1:5000/api/write_info_engine',
        method: 'POST',
        need_manual_flow: false,
        supports_item_flag: false
    },

    READ_HVAC: {
        url: 'http://127.0.0.1:5000/api/read_info_hvac',
        method: 'GET',
        need_manual_flow: true,
        supports_item_flag: true
    },

    WRITE_HVAC: {
        url: 'http://127.0.0.1:5000/api/write_info_hvac',
        method: 'POST',
        need_manual_flow: false,
        supports_item_flag: false
    },

    REQUEST_IDS: {
        url: 'http://127.0.0.1:5000/api/request_ids',
        method: 'GET',
        need_manual_flow: false,
        supports_item_flag: false
    },

    SEND_FRAME: {
        url: 'http://127.0.0.1:5000/api/send_frame',
        method: 'POST',
        need_manual_flow: false,
        supports_item_flag: false
    },

    UPDATE_VERSION: {
        url: 'http://127.0.0.1:5000/api/update_to_version',
        method: 'POST',
        need_manual_flow: false,
        supports_item_flag: false
    },

    UPDATE_DATA: {
        url: 'http://127.0.0.1:5000/api/drive_update_data',
        method: 'GET',
        need_manual_flow: false,
        supports_item_flag: false
    },

    CHANGE_SESSION: {
        url: 'http://127.0.0.1:5000/api/change_session',
        method: 'POST',
        need_manual_flow: false,
        supports_item_flag: false
    },

    READ_DTC: {
        url: 'http://127.0.0.1:5000/api/read_dtc_info',
        method: 'GET',
        need_manual_flow: false,
        supports_item_flag: false
    },

    AUTHENTICATE: {
        url: 'http://127.0.0.1:5000/api/authenticate',
        method: 'GET',
        need_manual_flow: false,
        supports_item_flag: false
    },

    READ_ACCESS_TIMING: {
        url: 'http://127.0.0.1:5000/api/read_access_timing',
        method: 'POST',
        need_manual_flow: false,
        supports_item_flag: false
    },

    TESTER_PRESENT: {
        url: 'http://127.0.0.1:5000/api/tester_present',
        method: 'GET',
        need_manual_flow: false,
        supports_item_flag: false
    },

    GET_IDENTIFIERS: {
        url: 'http://127.0.0.1:5000/api/get_identifiers',
        method: 'GET',
        need_manual_flow: false,
        supports_item_flag: false
    },

    RESET_ECU: {
        url: 'http://127.0.0.1:5000/api/reset_ecu',
        method: 'POST',
        need_manual_flow: false,
        supports_item_flag: false
    },

    WRITE_TIMING: {
        url: 'http://127.0.0.1:5000/api/write_timing',
        method: 'POST',
        need_manual_flow: false,
        supports_item_flag: false
    },

    CLEAR_DTC: {
        url: 'http://127.0.0.1:5000/api/clear_dtc_info',
        method: 'POST',
        need_manual_flow: false,
        supports_item_flag: false
    }
};

/* A record containing all current API Routes:
 * key : a string containing an intuitive label of the action done trough that route
 * value : an RoutetInfo structure containing the information described above
*/
export const Routes: Record<string, RouteInfo> = {
    DB_GET_AVAILABLE_VERSIONS: {
        path: '/api/getAvailableVersions',
        method: 'GET'
    }
};

/* The class that defines the API Manager */
class ApiManager {

    /* Method that takes care of the API calls and returns the response:
     * endpoint : contains the informations of a given endpoint (Example of usage: Endpoints.READ_BATTERY)
     * options : a serie of non mandatory arguments that are initialized by default if not provided
     *   - json : json for the POST endpoints;
     *   - manual_flow : value for the is_manual_flow flag for the services that support it
     *   - item : value of the item flag for the services that support it
    */
    async apiCall(endpoint: EndpointInfo,
        options: { json?: object | null; 
                   manual_flow?: boolean; 
                   item?: Item | null;
                   ecu_id?: '0x11' | '0x12';
                   read_dtc_subfunc?: '1' | '2';
                   dtc_mask_bits?: string[]} = {}): Promise<any> {

        /* Set default values using destructuring for the options that were not provided */
        const { json = null, 
                manual_flow = false, 
                item = null,
                ecu_id = null,
                read_dtc_subfunc = null,
                dtc_mask_bits = []} = options;

        displayLoadingCircle();
        try {        

        /*** Treat different error cases to ensure the parameters were provided correctly ***/

            /* Error case: invalid endpoint */
            if (!endpoint) {
                throw new Error('apiCall: The provided endpoint is invalid!');
            }

            /* Error case: POST endpoint with empty payload */
            if (endpoint.method === 'POST' && json === null) {
                throw new Error('apiCall: Payload JSON is null!');
            }
            
            /* Error case: Missing arguments for READ_DTC */
            if (endpoint.url === Endpoints.READ_DTC.url) {
                if (!ecu_id || !read_dtc_subfunc || dtc_mask_bits.length === 0) {
                    throw new Error('apiCall: Missing parameter for Read DTC.\nEnsure you have provided ecu_id, read_dtc_subfunc and dtc_mask_bits.');
                }
            }

        /*** Construct URL for based on the flags supported ***/

            let url = endpoint.url;

            /* If the called service is READ_DTC, construct URL with specific flags */
            if (endpoint.url === Endpoints.READ_DTC.url) {
            
                /* Add ecu_id */
                url += '?ecu_id=' + ecu_id;

                /* Add subfunction */
                url += '&subfunc=' + read_dtc_subfunc;

                /* Add mask_bits */
                for (const mask_bit of dtc_mask_bits) {
                    url+= '&dtc_mask_bits=' + mask_bit;
                }
            } else {
            
                /* Adds manual_flow flag in the url for the endpoints that need it (where need_manual_flag is true).
                   Also add item flag if needed */
                if (endpoint.need_manual_flow) {
                    url += (url.includes('?') ? '&' : '?') + 'is_manual_flow=' + manual_flow;

                    if (endpoint.supports_item_flag && item) {
                        url += (url.includes('?') ? '&' : '?') + 'item=' + item;
                    }
                }
            }

        /*** Prepare fetch options and fetch the response ***/

            /* Set up the options for the fetch request.
               If the method is POST, initialize the Content-Type in headers and also add the payload JSON */
            const fetch_options: RequestInit = {
                method: endpoint.method,
                headers: { 'Content-Type': 'application/json' },
                body: endpoint.method === 'POST' ? JSON.stringify(json) : undefined
            };

            /* Make the API call */
            const response = await fetch(url, fetch_options);

            /* Error case: response is not ok (code between 200-299) */
            if (!response.ok) {
                throw new Error(`apiCall: Error: ${response.status} ${response.statusText}`);
            }

            /* Parse the JSON response */
            const responseData = await response.json();

            /* Check for connection errors */
            if (responseData?.ERROR === 'interrupted') {
                throw new Error('Connection interrupted');
            }

            /* Return the parsed response */
            return responseData;
        } catch (error) {
            console.error('API Call error: ', error);
            displayErrorPopup("Error during API Call");
            return null;
        } finally {
            removeLoadingCircle();
        }
    }

    /* Method that takes care of the API route calls and returns the response:
     * route : contains the informations of a given endpoint (Example of usage: Routes.DB_GET_AVAILABLE_VERSIONS)
    */
    async routeCall(route: RouteInfo): Promise<any> {

        displayLoadingCircle();
        try {
            /* Error case: invalid endpoint */
            if (!route) {
                throw new Error('routeCall: The provided route is invalid!');
            }

            /* Set up the path that will be used */
            let path = route.path;

            /* Set up the options for the fetch request */
            const options: RequestInit = {
                method: route.method,
            };

            /* Make the Route call */
            const response = await fetch(path, options);

            /* Error case: response is not ok */
            if (!response.ok) {
                throw new Error(`routeCall: Error: ${response.status} ${response.statusText}`);
            }

            /* Parse the JSON response */
            const responseData = await response.json();

            /* Check for connection errors */
            if (responseData?.ERROR === 'interrupted') {
                throw new Error('Connection interrupted');
            }

            /* Return the parsed response */
            return responseData;

        } catch (error) {
            console.error('Route Call error: ', error);
            displayErrorPopup("Error during Route Call");
            return null;
        } finally {
            removeLoadingCircle();
        }
    }
}

export const apiManager = new ApiManager();