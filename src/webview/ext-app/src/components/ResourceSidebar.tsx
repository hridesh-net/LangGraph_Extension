import React from "react";

function ResourceSidebar() {
    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Resources</h2>
            <ul className="space-y-2">
                <li className="bg-gray-800 p-2 rounded hover:bg-gray-700 cursor-pointer">
                    <span className="font-semibold">API Gateway</span>
                </li>
                <li className="bg-gray-800 p-2 rounded hover:bg-gray-700 cursor-pointer">
                    <span className="font-semibold">Lambda Function</span>
                </li>
                <li className="bg-gray-800 p-2 rounded hover:bg-gray-700 cursor-pointer">
                    <span className="font-semibold">DynamoDB Table</span>
                </li>
                {/* Add more resources as needed */}
            </ul>
        </div>
    );
}

export default ResourceSidebar;