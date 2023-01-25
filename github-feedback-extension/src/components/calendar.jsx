import React, { useState } from "react";
import styled from "@emotion/styled";
import { CalendarHeader } from "./calendar-header";
import { CalendarDayNames } from "./calendar-day-names";
import { CalendarDays } from "./calendar-days";

const DatesWrapper = styled.div`
    position: relative;

    &::before {
        content: "";
        position: absolute;
        top: -5px;
        right: -5px;
        bottom: -5px;
        display: block;
        width: 96px;
        background: rgba(245, 248, 255, 0.5);
        border: 0.5px solid #f1f4fb;
        border-radius: 6.86px;
    }
`;

export const Calendar = ({
    selectedDate,
    setSelectedDate,
    feedbackKeyedByDate,
}) => {
    const [activeDate, setActiveDate] = useState(new Date());

    return (
        <div>
            <CalendarHeader
                activeDate={activeDate}
                setActiveDate={setActiveDate}
            />
            <DatesWrapper>
                <CalendarDayNames activeDate={activeDate} />
                <CalendarDays
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    activeDate={activeDate}
                    feedbackKeyedByDate={feedbackKeyedByDate}
                />
            </DatesWrapper>
        </div>
    );
};
