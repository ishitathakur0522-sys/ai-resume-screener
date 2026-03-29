export const generateCandidateAnalysis = async (jobDescription, resumeText, filename) => {

    const jd = jobDescription.toLowerCase();
    const resume = resumeText.toLowerCase();

    // Extract important keywords only
    const jdWords = jd
        .replace(/[^\w\s]/g, "")
        .split(/\s+/)
        .filter(word =>
            word.length > 3 &&
            !["hiring", "intern", "required", "skills", "mandatory", "role", "job", "work"].includes(word)
        );

    let matchCount = 0;
    let matchedWords = [];

    jdWords.forEach(word => {
        if (resume.includes(word)) {
            matchCount++;
            matchedWords.push(word);
        }
    });

    // Base score
    let score = Math.floor((matchCount / jdWords.length) * 100);
    // 🚀 Strong Boost scoring (for demo impact)
    // Balanced boost (not too much)
    if (matchedWords.includes("python")) score += 10;
    if (matchedWords.includes("machine")) score += 10;
    if (matchedWords.includes("java")) score += 5;

    if (resume.includes("project")) score += 10;

    // slight scaling
    if (score > 50) score += 5;
    if (score > 70) score += 5;

    score = Math.min(score, 95);
    score = Math.min(score, 95);

    // Strengths
    let pros = [];
    if (matchedWords.length > 0) {
        pros.push(`Matched keywords: ${matchedWords.slice(0, 6).join(", ")}`);
    }
    if (resume.includes("project")) {
        pros.push("Has project experience");
    }

    // Gaps
    let gaps = [];
    jdWords.forEach(word => {
        if (!resume.includes(word)) {
            gaps.push(`Missing ${word}`);
        }
    });

    if (gaps.length === 0) {
        gaps.push("No major gaps");
    }

    const nameMatch = filename.split('.')[0] || "Candidate";

    return {
        name: nameMatch.replace(/[_-]/g, ' '),
        matchScore: score,
        pros,
        gaps
    };
};
