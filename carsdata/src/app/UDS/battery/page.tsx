import React from 'react';
import DivCenterBattery from '@/src/components/UDScomponents/DivCenterBattery';
import DivRight from '@/src/components/UDScomponents/DivRight';
import DivLeft from '@/src/components/UDScomponents/DivLeft';

const BatteryPage = () => {
    return (
        <div className="flex h-full">
           
                <DivLeft /><DivCenterBattery image={"/battery.svg"} /><DivRight />
            
        </div>
    );
};

export default BatteryPage;
