import React from 'react';
import DivCenterMCU from '@/src/components/UDScomponents/DivCenterMCU';
import DivRight from '@/src/components/UDScomponents/DivRight';
import DivLeft from '@/src/components/UDScomponents/DivLeft';

const MCUPage = () => {
    return (
        <DivLeft>
            <DivCenterMCU image={"/carSketch2.svg"} /><DivRight />
        </DivLeft>
    );
};

export default MCUPage;
