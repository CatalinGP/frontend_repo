import React from 'react';
import DivCenterDoors from '@/src/components/UDScomponents/DivCenterDoors';
import DivRight from '@/src/components/UDScomponents/DivRight';
import DivLeft from '@/src/components/UDScomponents/DivLeft';

const DoorsPage = () => {
    return (
        <DivLeft>
            <DivCenterDoors image={"/door.svg"} /><DivRight />
        </DivLeft>
    );
};

export default DoorsPage;
