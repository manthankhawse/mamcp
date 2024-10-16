import connectDB from "../../../dbconfig/connectDB";
import Message from "../../../dbconfig/models/message"; // Adjust the path if needed

export default async function handler(req, res) {
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
