import axios from "axios";

export const solve = async (words: string[], answer: string) => {
    try {
        const { data } = await axios.get("/api/solver", {
            params: {
                words: words.join("-"),
                answer
            }
        });
        // const data = await res.json()
        return data;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: "Unkown error."
        };
    }
};
