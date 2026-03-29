import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  filename: { type: String },
  matchScore: { type: Number, required: true },
  pros: [{ type: String }],
  gaps: [{ type: String }],
  jobContext: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Candidate = mongoose.model('Candidate', candidateSchema);
export default Candidate;
