require("dotenv").config();
const FeedbackMoodRepository = require("./feedbackMood");

describe("FeedbackMood Repository", () => {
    const feedbackMoodRepository = new FeedbackMoodRepository();

    it("saveMoodsForFeedback - success", async () => {
        const result = await feedbackMoodRepository.saveMoodsForFeedback(
            1,
            [1, 2, 3]
        );
        expect(result.length).toBe(3);
    });
});
