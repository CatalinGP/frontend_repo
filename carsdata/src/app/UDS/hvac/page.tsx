import React from 'react';
import DivCenterHvac from '@/src/components/UDScomponents/DivCenterHVAC';
import DivRight from '@/src/components/UDScomponents/DivRight';
import DivLeft from '@/src/components/UDScomponents/DivLeft';

const HvacPage = () => {
    return (
        <DivLeft>
            <DivCenterHvac image={"/hvac-icon.svg"} /><DivRight />
        </DivLeft>
    );
};

export default HvacPage;
