
// get the year 
const getValidYears = (): Record<string, number> => {
    const years: Record<string, number> = {};
    const startYear = 1980; // 
    const endYear = new Date().getFullYear();
    const chars = "ABCDEFGHJKLMNPRSTVWXY123456789";
    
    for (let i = 0; i <= endYear - startYear; i++) {
        years[chars[i % chars.length]] = startYear + i;
    }
    return years;
};

const validYears = getValidYears();

const isValidVIN = (vin: string): false | true => {
    // check if vin contains exactly 17 characters
    if (vin.length !== 17) return false;

    // check if vin contains only allowed characters
    const vinPattern = /^[A-HJ-NPR-Z0-9]{17}$/;
    if (!vinPattern.test(vin)) return false;

    // split vin in sections
    const wmi = vin.slice(0, 3); 
    const vds = vin.slice(3, 9); 
    const vis = vin.slice(9);    

    // extra validation for wmi 
    if (/^000/.test(wmi)) {
        console.log('wmi starts with 000')
        return false;
    }

    // check vds structure
    if (!/^[A-HJ-NPR-Z0-9]{6}$/.test(vds)) return false;

    // validate the year
    const yearChar = vin[9];
    if (!validYears[yearChar]) return false;

    // check last part
    if (/^[0]+$/.test(vis.slice(2))) return false;

    // vin is valid if it checks the tests before
    return true; 
};

export { isValidVIN };
