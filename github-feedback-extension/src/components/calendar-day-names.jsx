import React from "react";
import styled from "@emotion/styled";
import { format, startOfWeek, addDays, isSaturday, isSunday } from "date-fns";

const Wrapper = styled.div`
    position: relative;
    z-index: 100;
    display: grid;
    grid-template-columns: repeat(5, 1fr) 10px repeat(2, 1fr);
    align-items: center;
    justify-items: center;
    gap: 5px;
`;

const DayName = styled.div`
    grid-column: ${(props) => {
        if (props.saturday) return "7 / 8";
        if (props.sunday) return "8 / 9";
    }};
    font-family: "Roboto", sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 0.8em;
    color: #6a737d;
`;

export const CalendarDayNames = ({ activeDate }) => {
    const generateDayNames = () => {
        const weekStartDate = startOfWeek(activeDate, { weekStartsOn: 1 });
        const dayNames = [];

        for (let day = 0; day < 7; day++) {
            const currentDay = addDays(weekStartDate, day);

            const saturday = isSaturday(currentDay);
            const sunday = isSunday(currentDay);

            dayNames.push(
                <DayName saturday={saturday} sunday={sunday}>
                    {format(currentDay, "E")}
                </DayName>
            );
        }

        return dayNames;
    };

    return <Wrapper>{generateDayNames()}</Wrapper>;
};
