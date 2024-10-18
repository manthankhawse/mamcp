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

    const { sender } = req.query;

    if (sender !== "0" && sender !== "1") {
        return res.status(400).json({ error: "Invalid sender value. Must be 0 or 1." });
    }

    try {
        let data;

        if (sender === "0") {
            // Find all messages from sender 0
            data = await Message.find({ sender: 0 }).sort({ createdAt: -1 });
        } else if (sender === "1") {
            // Find the latest message from sender 1
            data = await Message.findOne({ sender: 1 }).sort({ createdAt: -1 });
        }

        if (!data || (Array.isArray(data) && data.length === 0)) {
            return res.status(404).json({ success: false, message: "No messages found." });
        }

        return res.status(200).json({ success: true, data });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}
