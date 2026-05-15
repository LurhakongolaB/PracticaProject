const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAi = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const getInterviewQuestions = async (req, res) => {
    try {
        const {jobTitle} = req.body;
    if (!jobTitle) {
        
    return res.status(400).json({ error: 'Job title is required' });
    }
    const model = genAi.getGenerativeModel({model: "gemini-1.5-flash"});

    const prompt = `Act as an expert HR manager. provide 3 thoughtful interview questions for the candidate applying for the position of ${jobTitle}. return only the questions as a JSON array of strings. Do not include any introduction or explanation text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const questions = JSON.parse(text);
    res.status(200).json({ questions });
    } catch (error) {
        console.error('Error generating interview questions:', error);
        res.status(500).json({ error: 'Failed to generate interview questions. Please try again later.' });  
    }

};
module.exports = {
    getInterviewQuestions
};