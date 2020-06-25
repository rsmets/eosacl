import React from "react";

const AdminInfo = ({
    name,
    locks
}) => (
    <div>
        <h5>
            {name}
        </h5>
        <ul>
            {locks.map((ids) => (
                <li>
                    Lock Id: {ids}
                </li>
            ))}
        </ul>
    </div>
);

module.exports = AdminInfo;