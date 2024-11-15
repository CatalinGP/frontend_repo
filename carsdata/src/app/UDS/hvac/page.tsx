import React from 'react';
import DivCenterHvac from '@/src/components/UDScomponents/DivCenterHVAC';
import DivRight from '@/src/components/UDScomponents/DivRight';
import DivLeft from '@/src/components/UDScomponents/DivLeft';

const HvacPage = () => {
    return (
        <div className="flex h-full">
           
                <DivLeft /><DivCenterHvac image={"/hvac-icon.svg"} /><DivRight />
            
        </div>
    );
};

export default HvacPage;
