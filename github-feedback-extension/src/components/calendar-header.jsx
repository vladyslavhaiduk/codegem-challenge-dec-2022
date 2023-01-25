import React from "react";
import styled from "@emotion/styled";
import { format, subMonths, addMonths } from "date-fns";

const ChevronLeft = () => (
    <svg
        width="6"
        height="10"
        viewBox="0 0 6 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M0.348118 4.77327C0.15528 4.96811 0.15528 5.28189 0.348119 5.47673L4.39463
            9.56517C4.70886 9.88266 5.25 9.66014 5.25 9.21344V1.03655C5.25 0.589858 4.70886
            0.367344 4.39463 0.68483L0.348118 4.77327Z"
            fill="#717C99"
        />
    </svg>
);

const ChevronRight = () => (
    <svg
        width="6"
        height="10"
        viewBox="0 0 6 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M5.65188 5.47673C5.84472 5.28189 5.84472 4.96811 5.65188 4.77327L1.60537
            0.68483C1.29114 0.367344 0.75 0.58986 0.75 1.03656L0.75 9.21345C0.75 9.66014
            1.29114 9.88266 1.60537 9.56517L5.65188 5.47673Z"
            fill="#717C99"
        />
    </svg>
);

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    margin-bottom: 10px;
`;

const ChevronButton = styled.button`
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;
`;

const CurrentMonth = styled.h2`
    font-family: "Roboto", sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 1.1em;
    color: #717c99;
    text-transform: uppercase;
`;

export const CalendarHeader = ({ activeDate, setActiveDate }) => {
    return (
        <Wrapper>
            <ChevronButton
                onClick={() => setActiveDate(subMonths(activeDate, 1))}
            >
                <ChevronLeft />
            </ChevronButton>
            <CurrentMonth>{format(activeDate, "MMMM yyyy")}</CurrentMonth>
            <ChevronButton
                onClick={() => setActiveDate(addMonths(activeDate, 1))}
            >
                <ChevronRight />
            </ChevronButton>
        </Wrapper>
    );
};
