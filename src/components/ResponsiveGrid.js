import React, { useState, useEffect, useRef } from 'react';
import {
    MDBCol, MDBRow,
} from 'mdb-react-ui-kit';

export default function ResponsiveGrid({ items, breakpoints, loadNextItems = () => { }, isLoading = true, setIsLoading = () => { } }) {
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined,
    });
    const [yOffset, setYOffset] = useState(0);

    // Observer for infinite scroll
    const observerTarget = useRef(null);
    const sizeRef = useRef();


    useEffect(() => {
        const y = sizeRef.current.offsetTop;
        setYOffset(y);
    }, []);

    // Initalizes intersection observer to call each time observer enters view
    useEffect(() => {

        if (typeof IntersectionObserver === 'undefined') {
            return;
        }

        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) {
                    loadNextItems();
                }
            },
        );

        const obsCurrent = observerTarget.current;

        if (obsCurrent && !isLoading) {
            observer.observe(obsCurrent);
        }

        return () => {
            if (obsCurrent) {
                observer.unobserve(obsCurrent);
            }
        };
    }, [isLoading, loadNextItems]);


    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        if (typeof window !== 'undefined') {
            handleResize();
        }

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);


    // Gets breakpoint for current width
    function getBreakpoint() {
        if (typeof windowSize.width === 'undefined') {
            return 1;
        }
        const cur_width = windowSize.width;
        for (let i = breakpoints.length - 1; i >= 0; i--) {
            if (breakpoints[i] < cur_width) return i;
        }
    }





    const numColumns = getBreakpoint();

    // Holds the columns for the photo grid 
    const columns = new Array(numColumns);
    // Splits the images into the right number of columns
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const columnIndex = i % numColumns;

        if (!columns[columnIndex]) {
            columns[columnIndex] = [];
        }
        columns[columnIndex].push(item);
    }


    return (
        <div ref={sizeRef}>
            <MDBRow className='m-1' style={{ minHeight: `calc(100vh-${yOffset}` }}>
                {columns.map((column, i) => (
                    <MDBCol className="column p-0" key={i}>
                        {column.map((item) => (
                            item
                        ))}
                    </MDBCol>
                ))}

            </MDBRow>
            <p className='display-block' ref={observerTarget}></p>
        </div>

    )
}