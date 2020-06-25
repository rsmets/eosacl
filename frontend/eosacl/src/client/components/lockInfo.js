import React from "react";
import AdminInfo from "./adminInfo.js";

const LockInfo = ({
    lockId,
    adminList
}) => (
    <div>
        <h5>
            {lockId}
        </h5>
        <div>
           <ul>
                {adminList.map((admin) => (
                    <AdminInfo 
                        name={admin.name}
                        locks={admin.lockIds}
                    />
                ))}
            </ul> 
        </div>
    </div>
);

module.exports = LockInfo; 