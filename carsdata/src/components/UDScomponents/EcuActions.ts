import { apiManager, Endpoints } from '@/src/utils/ApiManager';

/* Set a dictionary for easier mapping over the names */
const nameMapping: { [key in '10' | '11' | '12' | '13' | '14']: string } = {
    10: 'MCU',
    11: 'Battery',
    12: 'Engine',
    13: 'Doors',
    14: 'HVAC'
};

export class EcuActions {
    private ecu_id: '10' | '11' | '12' | '13' | '14';

    constructor(ecu_id: '10' | '11' | '12' | '13' | '14') {
        this.ecu_id = ecu_id;
    }

    /* Getter for ECU ID */
    getEcuId(): '10' | '11' | '12' | '13' | '14' {
        return this.ecu_id;
    }

    /* Get ECU Name */
    getName(): string {
        return nameMapping[this.ecu_id];
    }

    /* ECU Reset method */
    ecuReset = async (resetType: string, setData: any) => {
        const name = this.getName();
        console.log(`Resetting ${name}...`);

        const data_sent = { ecu_id: this.ecu_id, type_reset: resetType };
        console.log("Data sent: ",data_sent);

        const response = await apiManager.apiCall(Endpoints.RESET_ECU, { json: data_sent });

        if (response) {
            console.log("Response: ", response);
            setData(response);
        } else {
            console.error("API call failed or was interrupted.");
        }
    }

    /* Read Access Timing method */
    readAccessTiming = async (sub_funct: string, setData: any) => {
        const name = this.getName();
        if (sub_funct === "1") {
            console.log(`Reading Access Timing for ${name} - Default Times...`);
        } else {
            console.log(`Reading Access Timing for ${name} - Current Times...`);
        }

        const data_sent = { ecu_id: this.ecu_id, sub_funct: sub_funct };
        console.log("Data sent: ",data_sent);

        const response = await apiManager.apiCall(Endpoints.READ_ACCESS_TIMING, { json: data_sent });

        if (response) {
            console.log("Response: ", response);
            setData(response);
        } else {
            console.error("API call failed or was interrupted.");
        }
    }

    /* Write Access Timing method */
    writeAccessTiming = async (sub_funct: string, setData: any) => {
        const name = this.getName();
        let data_sent: { [key: string]: any };
        
        if (sub_funct === '2') {
            console.log(`Writing Access Timing for ${name} - Reset to Default...`);
            data_sent = {ecu_id: this.ecu_id, sub_funct: sub_funct};

        } else {
            console.log(`Writing Access Timing for ${name} - Change Current...`)
            data_sent = {p2_max: parseInt(prompt("Enter p2_max value:") || "0", 10),
                        p2_star_max: parseInt(prompt("Enter p2_star_max value:") || "0", 10),
                        ecu_id: this.ecu_id,
                        sub_funct: sub_funct};
        }
        console.log("Data sent: ",data_sent);

        const response = await apiManager.apiCall(Endpoints.WRITE_TIMING, { json: data_sent });

        if (response) {
            console.log("Response: ", response);
            setData(response);
        } else {
            console.error("API call failed or was interrupted.");
        }
    }

    /* Read Diagnostic Trouble Codes (DTC) method */
    readDTC = async (read_dtc_subfunc: any, dtc_mask_bits: any, setData: any) => {
        const name = this.getName();
        console.log(`Reading Diagnostic Trouble Codes for ${name}...`);
        
        const data_sent = {ecu_id: this.ecu_id, read_dtc_subfunc: read_dtc_subfunc, dtc_mask_bits: dtc_mask_bits};
        console.log("Data sent: ",data_sent);

        const response = await apiManager.apiCall(Endpoints.READ_DTC, {json: data_sent});
        
        if (response) {
            console.log("Response: ", response);
            setData(response);
        } else {
            console.error("API call failed or was interrupted.");
        }
    }

    /* Clear Diagnostic Trouble Codes (DTC) method */
    clearDTC = async (dtc_group: string, setData: any) => {
        const name = this.getName();
        console.log(`Clearing Diagnostic Trouble Codes for ${name}...`);
        
        const data_sent = { ecu_id: this.ecu_id, dtc_group: dtc_group };
        console.log("Data sent: ",data_sent);

        const response = await apiManager.apiCall(Endpoints.CLEAR_DTC, { json: data_sent });

        if (response) {
            console.log("Response: ", response);
            setData(response);
        } else {
            console.error("API call failed or was interrupted.");
        }
    }
}