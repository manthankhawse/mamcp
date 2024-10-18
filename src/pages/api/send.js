import connectDB from "../../../dbconfig/connectDB";
import Message from "../../../dbconfig/models/message"; // Adjust the path if needed
import Cors from 'cors';

// Initialize the CORS middleware
const cors = Cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    origin: '*', // Change this to a specific origin if needed
});

// Helper function to run middleware
function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
}

export default async function handler(req, res) {
    // Run the CORS middleware
    await runMiddleware(req, res, cors);

    await connectDB();

    const { message, sender } = req.query;

    if (!message || (sender !== "0" && sender !== "1")) {
        return res.status(400).json({ error: "Invalid query parameters" });
    }

    try {
        const newMessage = new Message({ message, sender: Number(sender) });
        await newMessage.save();
        return res.status(200).json({ success: true, data: newMessage });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}
