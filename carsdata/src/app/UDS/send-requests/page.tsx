import React from 'react';
import SendRequests from '@/src/components/UDScomponents/SendRequests';
import DivLeft from '@/src/components/UDScomponents/DivLeft';

const SendRequestsPage = () => {
    return (
        <div className="flex h-full">
           
                <DivLeft /><SendRequests />
            
        </div>
    );
};

export default SendRequestsPage;
