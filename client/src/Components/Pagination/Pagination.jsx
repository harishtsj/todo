import React, { useEffect, useMemo, useRef } from 'react'

const Pagination = ({ postPerPage, filteredList, setCurrentPage, currentPage }) => {

    const length = useMemo(() => filteredList.length, [filteredList])
    const totalPage = useMemo(() => Math.ceil(length / postPerPage), [length, postPerPage])
    // const pages = []

    // for (let i = 1; i <= totalPage; i++) {
    //     pages.push(i)
    // }

    const prevLengthRef = useRef(length);

    useEffect(() => {
        const prevLength = prevLengthRef.current;

        // ✅ Case 1: List was empty → now has items
        if (prevLength === 0 && length > 0) {
            setCurrentPage(1);
        }

        // ✅ Case 2: Items added → go to last page
        else if (length > prevLength) {
            setCurrentPage(totalPage);
        }

        // ✅ Case 3: Items deleted → fix overflow
        else if (currentPage > totalPage) {
            setCurrentPage(totalPage);
        }

        prevLengthRef.current = length;
    }, [length, totalPage]);

    const previousPage = (num) => {
        if (currentPage <= 1) return
        setCurrentPage((prev) => prev - num)
    }

    const nextPage = (num) => {
        if (currentPage >= totalPage) return
        setCurrentPage((prev) => prev + num)
    }

    const getVisiblePages = () => {
        const pages = [];

        if (totalPage <= 3) {
            for (let i = 1; i <= totalPage; i++) {
                pages.push(i)
            }
            return pages
        }

        if (currentPage <= 2) {
            return [1, 2, 3]
        }

        if (currentPage >= totalPage - 1) {
            return [totalPage - 2, totalPage - 1, totalPage]
        }

        return [currentPage - 1, currentPage, currentPage + 1]
    }

    const visiblePages = getVisiblePages()

    return (
        <div className='w-full p-2 my-1'>
            {
                (totalPage > 1) &&
                <div className='flex gap-4 items-center justify-between'>
                    <div>
                        <button className='w-10 bg-blue-500 text-white rounded' onClick={() => setCurrentPage(1)}>
                            {"<<"}
                        </button>
                    </div>
                    <div className='flex gap-3'>
                        <button className='w-10 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed' onClick={() => previousPage(1)}
                            disabled={currentPage === 1}>
                            {"<"}
                        </button>
                        {visiblePages.map((page, index) => {
                            return (
                                <button key={index} className={`w-10 border-2 dark:border-blue-500 rounded ${page === currentPage ? 'bg-blue-500 text-white border-blue-500 scale-110' : 'bg-white text-blue-500 dark:bg-black dark:text-blue-500 scale-90'}`}
                                    onClick={() => setCurrentPage(page)}>
                                    {page}
                                </button>
                            )
                        })}
                        <button className={`w-10 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed`} onClick={() => nextPage(1)}
                            disabled={currentPage === totalPage}>
                            {">"}
                        </button>
                    </div>
                    <div>
                        <button className='w-10 bg-blue-500 text-white rounded' onClick={() => setCurrentPage(totalPage)}>
                            {">>"}
                        </button>
                    </div>

                </div>
            }
        </div>
    )
}

export default Pagination

// import React, { useEffect, useMemo, useRef } from 'react'

// const Pagination = ({ postPerPage, filteredList, setCurrentPage, currentPage }) => {

//     const length = useMemo(() => filteredList.length, [filteredList])
//     const totalPage = useMemo(() => Math.ceil(length / postPerPage), [length, postPerPage])

//     // const pages = []

//     // for (let i = 1; i <= totalPage; i++) {
//     //     pages.push(i)
//     // }

//     const prevLengthRef = useRef(length);

//     useEffect(() => {
//         const prevLength = prevLengthRef.current;

//         // ✅ Case 1: List was empty → now has items
//         if (prevLength === 0 && length > 0) {
//             setCurrentPage(1);
//         }

//         // ✅ Case 2: Items added → go to last page
//         else if (length > prevLength) {
//             setCurrentPage(totalPage);
//         }

//         // ✅ Case 3: Items deleted → fix overflow
//         else if (currentPage > totalPage) {
//             setCurrentPage(totalPage);
//         }

//         prevLengthRef.current = length;
//     }, [length, totalPage]);

//     const previousPage = (num) => {
//         if (currentPage <= 1) return
//         setCurrentPage((prev) => prev - num)
//     }

//     const nextPage = (num) => {
//         if (currentPage >= totalPage) return
//         setCurrentPage((prev) => prev + num)
//     }

//     const getVisiblePages = () => {
//         const pages = [];

//         if (totalPage <= 3) {
//             for (let i = 1; i <= totalPage; i++) {
//                 pages.push(i)
//             }
//             return pages
//         }

//         if (currentPage <= 2) {
//             return [1, 2, 3]
//         }

//         if (currentPage >= totalPage - 1) {
//             return [totalPage - 2, totalPage - 1, totalPage]
//         }

//         return [currentPage - 1, currentPage, currentPage + 1]
//     }

//     const visiblePages = getVisiblePages()

//     return (
//         <div className='w-full p-2 my-1'>
//             {
//                 (totalPage > 1) &&
//                 <div className='flex gap-4 items-center justify-between'>
//                     <div>
//                         <button className={`${totalPage <= 1 ? 'opacity-0' : 'opacity-100 w-10 bg-blue-500 text-white rounded'}`} 
//                         onClick={() => setCurrentPage(1)}>
//                             {"<<"}
//                         </button>
//                     </div>
//                     <div className='flex gap-3'>
//                         <button className={`${totalPage <= 1 ? 'opacity-0' : 'opacity-100 w-10 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed'} `}
//                             onClick={() => previousPage(1)}
//                             disabled={currentPage === 1}>
//                             {"<"}
//                         </button>
//                         {visiblePages.map((page, index) => {
//                             return (
//                                 <button key={index} className={`w-10 border-2 dark:border-blue-500 rounded ${page === currentPage ? 'bg-blue-500 text-white border-blue-500 scale-110' : 'bg-white text-blue-500 dark:bg-black dark:text-blue-500 scale-90'}`}
//                                     onClick={() => setCurrentPage(page)}>
//                                     {page}
//                                 </button>
//                             )
//                         })}
//                         <button className={`${totalPage <= 1 ? 'opacity-0' : 'opacity-100 w-10 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed'}`} onClick={() => nextPage(1)}
//                             disabled={currentPage === totalPage}>
//                             {">"}
//                         </button>
//                     </div>
//                     <div>
//                         <button className={`${totalPage <= 1 ? 'opacity-0' : 'opacity-100 w-10 bg-blue-500 text-white rounded'} `} onClick={() => setCurrentPage(totalPage)}>
//                             {">>"}
//                         </button>
//                     </div>

//                 </div>
//             }
//         </div>
//     )
// }

// export default Pagination