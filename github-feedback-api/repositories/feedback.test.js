require("dotenv").config();
const { subDays, nextSaturday } = require("date-fns");
const FeedbackModel = require("../models/feedback");
const FeedbackRepository = require("./feedback");

const getFeedbackModelQueryReturn = (resultSizeValue) => ({
    where: () => ({
        where: () => ({
            resultSize: () => resultSizeValue,
        }),
    }),
});

const getDbProviderQueryReturn = (created_at, day_of_streak) => ({
    orderBy: () => ({
        first: () => ({
            created_at,
            day_of_streak,
        }),
    }),
});

describe("Feedback Repository", () => {
    const feedbackRepo = new FeedbackRepository();

    let feedbackModelQuerySpy;
    let dbProviderQuerySpy;
    let dbProviderAddSpy;

    beforeEach(() => {
        feedbackModelQuerySpy = jest.spyOn(FeedbackModel, "query");
        dbProviderQuerySpy = jest.spyOn(feedbackRepo.dbProvider, "query");
        dbProviderAddSpy = jest.spyOn(feedbackRepo.dbProvider, "add");
    });

    it("getTodaysCheckInsCount - success", async () => {
        feedbackModelQuerySpy.mockReturnValueOnce(
            getFeedbackModelQueryReturn(1)
        );

        const result = await feedbackRepo.getTodaysCheckInsCount();

        expect(feedbackModelQuerySpy).toHaveBeenCalled();
        expect(result).toBe(1);
    });

    it("saveFeedback streak feature - success created over the weekend", async () => {
        dbProviderQuerySpy.mockReturnValueOnce(
            getDbProviderQueryReturn(new Date(), 2)
        );
        dbProviderAddSpy.mockImplementationOnce((tableName, entity) => {
            expect(entity.day_of_streak).toBe(2);
            return [100];
        });

        await feedbackRepo.saveFeedback({
            source: "",
            feedback: "",
            createdAt: nextSaturday(new Date()),
        });

        expect(dbProviderQuerySpy).toHaveBeenCalled();
        expect(dbProviderAddSpy).toHaveBeenCalled();
    });

    it("saveFeedback streak feature - success last feedback yesterday", async () => {
        dbProviderQuerySpy.mockReturnValueOnce(
            getDbProviderQueryReturn(subDays(new Date(), 1), 2)
        );
        dbProviderAddSpy.mockImplementationOnce((tableName, entity) => {
            expect(entity.day_of_streak).toBe(3);
            return [100];
        });

        await feedbackRepo.saveFeedback({
            source: "",
            feedback: "",
        });

        expect(dbProviderQuerySpy).toHaveBeenCalled();
        expect(dbProviderAddSpy).toHaveBeenCalled();
    });

    it("saveFeedback streak feature - success last feedback today", async () => {
        dbProviderQuerySpy.mockReturnValueOnce(
            getDbProviderQueryReturn(new Date(), 2)
        );
        dbProviderAddSpy.mockImplementationOnce((tableName, entity) => {
            expect(entity.day_of_streak).toBe(2);
            return [100];
        });

        await feedbackRepo.saveFeedback({
            source: "",
            feedback: "",
        });

        expect(dbProviderQuerySpy).toHaveBeenCalled();
        expect(dbProviderAddSpy).toHaveBeenCalled();
    });

    it("saveFeedback streak feature - success last feedback 3 days ago", async () => {
        dbProviderQuerySpy.mockReturnValueOnce(
            getDbProviderQueryReturn(subDays(new Date(), 3), 2)
        );
        dbProviderAddSpy.mockImplementationOnce((tableName, entity) => {
            expect(entity.day_of_streak).toBe(1);
            return [100];
        });

        await feedbackRepo.saveFeedback({
            source: "",
            feedback: "",
        });

        expect(dbProviderQuerySpy).toHaveBeenCalled();
        expect(dbProviderAddSpy).toHaveBeenCalled();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });
});
