import React from 'react';
import DivCenterDoors from '@/src/components/UDScomponents/DivCenterDoors';
import DivRight from '@/src/components/UDScomponents/DivRight';
import DivLeft from '@/src/components/UDScomponents/DivLeft';

const DoorsPage = () => {
    return (
        <div className="flex h-full">
           
                <DivLeft /><DivCenterDoors image={"/door.svg"} /><DivRight />
            
        </div>
    );
};

export default DoorsPage;
