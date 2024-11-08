import React from 'react';
import DivCenterEngine from '@/src/components/UDScomponents/DivCenterEngine';
import DivRight from '@/src/components/UDScomponents/DivRight';
import DivLeft from '@/src/components/UDScomponents/DivLeft';

const EnginePage = () => {
    return (
        <div className="flex h-full">
           
                <DivLeft /><DivCenterEngine image={"/engine.svg"} /><DivRight />
            
        </div>
    );
};

export default EnginePage;
