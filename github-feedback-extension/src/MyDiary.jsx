import React, { useEffect, useState } from "react";
import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    CardInfo,
    CardSection,
} from "./components/card";
import ApiService from "./services/api";
import styled from "@emotion/styled";
import { BoxChip } from "./components/box-chip";
import { Colors } from "./utils/colors";
import { formatFeedbackDate } from "./utils/date";
import { compareDesc, parseISO } from "date-fns";
import { FeedbackCard } from "./components/feedback-card";
import { Button, ButtonContainer } from "./components/button";
import { FEEDBACK_FORM } from "./App";
import { Calendar } from "./components/calendar";

const CenteredDiv = styled.div`
    text-align: center;
`;

const CenteredHeading = styled(CenteredDiv)`
    font-size: 1.2em;
`;

const CenteredSubHeading = styled(CenteredHeading)`
    // Todo: use Nunito
    font-family: "Roboto-Thin", sans-serif;
    color: #aaa; // Todo: consult with design to check correct code
    font-weight: 300;
    margin-top: 12px;
    font-size: 1em;
`;

const BoxChipsContainer = styled.div`
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 26px;
`;

const BottomBorderedCardSection = styled(CardSection)`
    border-bottom: 1px solid #dce0e4;
`;

const DateSection = styled(CenteredDiv)`
    font-size: 14px;
    font-family: "Roboto-Thin", sans-serif;
    font-weight: 300;
    margin-top: 20px;
`;

export const MyDiary = ({ onPageChange }) => {
    let [feedbackList, setFeedbackList] = useState([]);
    let [checkInStatus, setCheckInStatus] = useState({});
    let [selectedDate, setSelectedDate] = useState(new Date());
    const [isFeedbackListLoaded, setIsFeedbackListLoaded] = useState(false);
    const [isCheckInStatusLoaded, setIsCheckInStatusLoaded] = useState(false);

    useEffect(() => {
        let isMounted = true;
        if (!isFeedbackListLoaded) {
            ApiService.get("/feedback")
                .then((res) => {
                    if (isMounted) {
                        setFeedbackList(
                            res.data
                                .map((f) => ({
                                    ...f,
                                    created_at: parseISO(f.created_at),
                                }))
                                .sort((a, b) =>
                                    compareDesc(a.created_at, b.created_at)
                                )
                                .map((f) => ({
                                    ...f,
                                    date: formatFeedbackDate(f.created_at),
                                }))
                        );
                        setIsFeedbackListLoaded(true);
                    }
                })
                .catch((e) => {
                    if (isMounted) {
                        alert("Could not load feedback!");
                        setIsFeedbackListLoaded(true);
                    }
                });
        }
        return () => {
            isMounted = false;
        };
    }, [isFeedbackListLoaded]);

    useEffect(() => {
        let isMounted = true;
        if (!isCheckInStatusLoaded) {
            ApiService.get("/check_in_status")
                .then((res) => {
                    if (isMounted) {
                        setCheckInStatus(res.data);
                        setIsCheckInStatusLoaded(true);
                    }
                })
                .catch(() => {
                    if (isMounted) {
                        alert("Could not load check in status!");
                        setIsCheckInStatusLoaded(true);
                    }
                });
        }
        return () => {
            isMounted = false;
        };
    }, [isCheckInStatusLoaded]);

    const feedbackKeyedByDate = feedbackList.reduce((grouped, feedback) => {
        let existing = [];
        if (grouped.has(feedback.date)) {
            existing = grouped.get(feedback.date);
        }

        grouped.set(feedback.date, [...existing, feedback]);

        return grouped;
    }, new Map());

    const selectedDateFeedbackList = feedbackKeyedByDate.get(
        formatFeedbackDate(selectedDate)
    );

    return (
        <Card>
            <CardHeader dismissible>My Log</CardHeader>
            <CardBody>
                {(!isFeedbackListLoaded || !isCheckInStatusLoaded) && (
                    <CenteredDiv>Loading...</CenteredDiv>
                )}
                {checkInStatus.isTodaysCheckInDone && (
                    <BottomBorderedCardSection>
                        <CardInfo>
                            <CenteredHeading>Way to go!</CenteredHeading>
                            <CenteredSubHeading>
                                You've completed your daily checkin
                            </CenteredSubHeading>
                        </CardInfo>
                        <BoxChipsContainer>
                            <BoxChip
                                title="Daily Checkin"
                                text="Finished!"
                                color={Colors.secondary2}
                            />
                            <BoxChip
                                title="Current Streak"
                                text={`${checkInStatus.currentStreak} Days 🔥`}
                                color={Colors.primary}
                            />
                            <BoxChip
                                title="Longest Streak"
                                text={`${checkInStatus.longestStreak} Days`}
                                color={Colors.purple2}
                            />
                        </BoxChipsContainer>
                    </BottomBorderedCardSection>
                )}
                {isFeedbackListLoaded && (
                    <CardSection>
                        <Calendar
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                            feedbackKeyedByDate={feedbackKeyedByDate}
                        />
                    </CardSection>
                )}
                {selectedDateFeedbackList && (
                    <CardSection>
                        <DateSection>
                            {formatFeedbackDate(selectedDate)}
                        </DateSection>
                        {selectedDateFeedbackList.map((f) => (
                            <FeedbackCard key={f.id} feedback={f} />
                        ))}
                    </CardSection>
                )}
            </CardBody>
            <CardFooter>
                <ButtonContainer>
                    <Button primary onClick={() => onPageChange(FEEDBACK_FORM)}>
                        Back
                    </Button>
                </ButtonContainer>
            </CardFooter>
        </Card>
    );
};
