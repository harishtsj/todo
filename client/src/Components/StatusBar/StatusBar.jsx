// import { useEffect, useRef } from "react";

// const StatusTabs = ({ tabs, active, onChange }) => {
//     const containerRef = useRef(null);
//     const indicatorRef = useRef(null);

//     useEffect(() => {
//         const index = tabs.findIndex(t => t.name === active);
//         const container = containerRef.current;
//         const indicator = indicatorRef.current;

//         if (!container || !indicator) return;

//         const tabWidth = container.offsetWidth / tabs.length;

//         indicator.style.transform = `translateX(${index * tabWidth}px)`;
//         indicator.style.width = `${tabWidth}px`;
//     }, [active, tabs]);

//     return (
//         <div className="w-full border-b border-gray-300">
//             <div ref={containerRef} className="flex relative">
//                 {tabs.map((tab) => {
//                     const isActive = active === tab.name;

//                     return (
//                         <button
//                             key={tab.name}
//                             onClick={() => onChange(tab.name)}
//                             className={`flex-1 py-3 text-sm sm:text-base uppercase transition-all duration-200
//                 ${isActive
//                                     ? "text-blue-600 font-medium"
//                                     : "text-gray-500 hover:text-gray-700"}`}
//                         >
//                             {tab.name}
//                         </button>
//                     );
//                 })}

//                 {/* Indicator */}
//                 <div
//                     ref={indicatorRef}
//                     className="absolute bottom-0 h-[2px] bg-blue-600 transition-all duration-300"
//                 />
//             </div>
//         </div>
//     );
// };

// export default StatusTabs;

import React, { useEffect, useRef } from 'react'

const StatusTabs = ({ tabs, active, onChange }) => {

    const containerRef = useRef(null);
    const indicatorRef = useRef(null);

    useEffect(() => {

        const updateIndicator = () => {
            // finding index of the array
            const index = tabs.findIndex(t => t.name === active);
            const container = containerRef.current;
            const indicator = indicatorRef.current;
    
            if (!container || !indicator) return;
    
            // getting the each tabwidth by the container's width / tab's length
            const tabWidth = container.offsetWidth / tabs.length;
    
            // based on the index, the tab line will translate
            indicator.style.transform = `translateX(${index * tabWidth}px)`;
    
            // setting the width of the tab
            indicator.style.width = `${tabWidth}px`;
        }

        updateIndicator();

        window.addEventListener('resize', updateIndicator)

        return () => {
            window.removeEventListener('resize', updateIndicator)
        }

    }, [active, tabs]);

    return (
        <div className="pb-2 w-full">
            <div ref={containerRef} className="flex relative">
                {tabs.map((tab) => {
                    const isActive = active === tab.name;
                    return (
                        <button key={tab.name} onClick={() => onChange(tab.name)}
                            className={`flex-1 py-3 text-sm sm:text-base uppercase transition-all duration-200 
                                ${isActive ? "text-blue-600 font-medium" : "text-gray-500 hover:text-gray-700"}`}>
                            {tab.name}
                        </button>
                    );
                })}

                {/* Indicator */}
                <div
                    ref={indicatorRef}
                    className="absolute bottom-0 h-0.5 bg-blue-600 transition-all duration-150"
                />
            </div>
        </div>
    )
}

export default StatusTabs