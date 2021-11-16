import React from 'react'
import ReactPaginate from "react-paginate";



function Pagination({ handlePageClick, pageCount, currentPage }) {
    console.log(currentPage)
    return (
        <>
            <ReactPaginate
                onPageChange={handlePageClick}
                previousLabel={"Previous"}
                nextLabel={"Next"}
                pageCount={pageCount}
                containerClassName={"paginationBttns"}
                previousLinkClassName={"previousBttn"}
                nextLinkClassName={"nextBttn"}
                disabledClassName={"paginationDisabled"}
                activeClassName={"paginationActive"}
                forcePage={currentPage}
            />
        </>
    );
}

export default Pagination
