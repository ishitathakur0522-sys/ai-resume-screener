import express from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import Candidate from '../models/Candidate.js';
import { generateCandidateAnalysis } from '../services/aiService.js';

const router = express.Router();

// Multer setup for in-memory storage. 
// Necessary because pdfParse works great with buffers in memory.
const storage = multer.memoryStorage();
const upload = multer({ storage });

// @route   POST /api/upload
// @desc    Upload multiple PDFs and job description, analyze and store
router.post('/upload', upload.array('resumes', 20), async (req, res) => {
    try {
        const { jobDescription } = req.body;
        const files = req.files;

        if (!jobDescription) {
            return res.status(400).json({ error: 'Job description is required.' });
        }
        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'At least one resume PDF is required.' });
        }

        const results = [];

        // Note: Using a standard for-loop to await each processing step sequentially.
        // In a real high-throughput system you might use Promise.all or a message queue.
        for (const file of files) {
            let resumeText = '';

            try {
                // Extract text from the PDF buffer
                const pdfData = await pdfParse(file.buffer);
                resumeText = pdfData.text;
            } catch (e) {
                console.error(`Failed to parse PDF ${file.originalname}`, e);
                // We will pass empty text to AI; it can score accordingly
            }

            // Send to AI Service (Mock)
            const analysis = await generateCandidateAnalysis(jobDescription, resumeText, file.originalname);

            // Create and save Candidate record
            const candidate = new Candidate({
                name: analysis.name || 'Unknown',
                filename: file.originalname,
                matchScore: analysis.matchScore,
                pros: analysis.pros,
                gaps: analysis.gaps,
                jobContext: jobDescription
            });

            // If MongoDB is not connected (e.g., user hasn't set up Atlas yet), this might fail.
            // We should catch and handle gracefully for the mock mode if DB is disconnected.
            try {
                await candidate.save();
                results.push(candidate);
            } catch (dbErr) {
                console.error('DB Save error - is MongoDB running? Returning unsaved mock object.', dbErr.message);
                // Adding _id for react keys
                candidate._id = Math.random().toString(36).substring(7);
                results.push(candidate);
            }
        }

        res.status(201).json({ message: 'Processed successfully', candidates: results });

    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ error: 'An error occurred during processing.' });
    }
});

// @route   GET /api/candidates
// @desc    Get all candidates sorted by matchScore
router.get('/candidates', async (req, res) => {
    try {
        const candidates = await Candidate.find().sort({ matchScore: -1 });
        res.json(candidates);
    } catch (error) {
        console.error('Fetch Error:', error);
        res.status(500).json({ error: 'Failed to fetch candidates. Is MongoDB Connected?' });
    }
});
// @route   DELETE /api/clear
// @desc    Delete all candidates
router.delete('/clear', async (req, res) => {
    try {
        await Candidate.deleteMany({});
        res.json({ message: "All candidates deleted successfully" });
    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({ error: "Failed to delete candidates" });
    }
});
export default router;
