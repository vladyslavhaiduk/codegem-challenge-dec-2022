import React from "react";
import styled from "@emotion/styled";
import {
    format,
    isSameDay,
    isSameMonth,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addDays,
    isPast,
    isSunday,
    isSaturday,
} from "date-fns";
import {
    bucketedSentimentValue,
    emojiAndColorForSentiment,
} from "../utils/sentiments";
import { formatFeedbackDate } from "../utils/date";

const Wrapper = styled.div`
    position: relative;
    z-index: 100;
    display: grid;
    grid-template-columns: repeat(5, 1fr) 10px repeat(2, 1fr);
    gap: 5px;
`;

const Title = styled.p`
    margin: 0;
    font-size: 1.1em;
`;

const BadgeList = styled.ul`
    position: absolute;
    bottom: 2px;
    left: 2px;
    display: flex;
    gap: 1px;
    list-style: none;
`;

const Badge = styled.li`
    width: 7px;
    height: 7px;
    border: 0.05px solid rgba(0, 0, 0, 0.1);
    border-radius: 100px;
    background: ${(props) => props.sentimentColor};
    box-shadow: inset 0px 0px 1px rgba(0, 0, 0, 0.2);
`;

const NoBadges = styled.div`
    position: absolute;
    bottom: 3px;
    left: 3px;
    font-size: 8px;
    line-height: 1;
    color: #6d6e72;
`;

const Day = styled.div`
    position: relative;
    grid-column: ${(props) => {
        if (props.saturday) return "7 / 8";
        if (props.sunday) return "8 / 9";
    }};
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 6.86px 6.86px 6.86px 4.5px;
    background: ${(props) => props.sentimentColor ?? "#F5F8FF"};
    color: ${(props) => (props.sentimentColor ? "#FFFFFF" : "#CBD5F7")};
    box-shadow: ${(props) =>
        props.sentimentColor
            ? "inset 0px 0px 7px rgba(0, 0, 0, 0.2)"
            : "inset 0px 0px 5px rgba(0, 0, 0, 0.07)"};
    opacity: ${(props) => (props.active || props.future ? 1 : 0.5)};
    aspect-ratio: 1 / 1;
    outline: ${(props) => {
        if (props.selected) return "1.5px solid #537DEF";
        if (props.today) return "1.5px solid #000000";
    }};
    cursor: ${(props) => (props.future ? "auto" : "pointer")};

    &:hover {
        outline: ${(props) => (!props.future ? "1.5px solid #537DEF" : "")};
    }
`;

export const CalendarDays = ({
    activeDate,
    selectedDate,
    setSelectedDate,
    feedbackKeyedByDate,
}) => {
    const generateBadgesForDay = (feedbackList) => {
        return feedbackList.slice(0, 3).map((f) => {
            const sentimentValue = bucketedSentimentValue(
                parseFloat(f.average_sentiment)
            );
            const { color } = emojiAndColorForSentiment(sentimentValue);
            return <Badge sentimentColor={color} />;
        });
    };

    const getFeedbackDataForDate = (date) => {
        const feedbackList = feedbackKeyedByDate.get(formatFeedbackDate(date));

        if (feedbackList) {
            const totalSentimentValue = feedbackList.reduce((acc, f) => {
                return (
                    acc +
                    bucketedSentimentValue(parseFloat(f.average_sentiment))
                );
            }, 0);
            const avgSentimentValue = bucketedSentimentValue(
                totalSentimentValue / feedbackList.length
            );
            const { emoji, color } =
                emojiAndColorForSentiment(avgSentimentValue);
            const badges = generateBadgesForDay(feedbackList);

            return { emoji, color, badges };
        }
    };

    const generateDaysForWeek = (date, selectedDate, activeDate) => {
        let currentDate = date;
        const weekDays = [];

        for (let day = 0; day < 7; day++) {
            const cloneDate = currentDate;

            const { emoji, color, badges } =
                getFeedbackDataForDate(currentDate) ?? {};

            const sameMonth = isSameMonth(currentDate, activeDate);
            const sameDay = isSameDay(currentDate, selectedDate);
            const today = isSameDay(currentDate, new Date());
            const saturday = isSaturday(currentDate);
            const sunday = isSunday(currentDate);
            const future = !isPast(currentDate);

            weekDays.push(
                <Day
                    active={sameMonth}
                    selected={sameDay}
                    today={today}
                    saturday={saturday}
                    sunday={sunday}
                    future={future}
                    sentimentColor={color}
                    onClick={
                        !future
                            ? () => {
                                  setSelectedDate(cloneDate);
                              }
                            : undefined
                    }
                >
                    <Title>
                        {sameDay && emoji ? emoji : format(currentDate, "d")}
                    </Title>
                    {badges ? (
                        <BadgeList>{badges}</BadgeList>
                    ) : (
                        !future && <NoBadges>{"\u00d7"}</NoBadges>
                    )}
                </Day>
            );

            currentDate = addDays(currentDate, 1);
        }

        return weekDays;
    };

    const generateDays = () => {
        const startOfTheSelectedMonth = startOfMonth(activeDate);
        const endOfTheSelectedMonth = endOfMonth(activeDate);
        const startDate = startOfWeek(startOfTheSelectedMonth, {
            weekStartsOn: 1,
        });
        const endDate = endOfWeek(endOfTheSelectedMonth, { weekStartsOn: 1 });

        let currentDate = startDate;
        const days = [];

        while (currentDate <= endDate) {
            days.push(
                generateDaysForWeek(currentDate, selectedDate, activeDate)
            );
            currentDate = addDays(currentDate, 7);
        }

        return days;
    };

    return <Wrapper>{generateDays()}</Wrapper>;
};
