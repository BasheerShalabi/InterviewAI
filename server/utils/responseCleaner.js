function clean(raw) {
    let cleaned = raw.trim();

    cleaned = cleaned.replace(/```(?:json|js|javascript)?\s*/gi, "");
    cleaned = cleaned.replace(/```/g, "");

    if (cleaned.trim().toLowerCase().startsWith("json")) {
        cleaned = cleaned.trim().slice(4).trim();
    }

    return cleaned;
}

function cleanQuestion(text) {
    let cleaned = text
        .replace(/\*\*/g, '')    // bold
        .replace(/\*/g, '')      // asterisks
        .replace(/_/g, '')       // underscores
        .replace(/\r?\n|\r/g, ' ') // newlines to spaces

    cleaned = cleaned.replace(/^\s*Interviewer:\s*/i, '');

    cleaned = cleaned.replace(/\([^)]*\)\s*$/, '');
    cleaned = cleaned.replace(/\*.*?\*\s*$/, '');
    cleaned = cleaned.trim().replace(/^["']+|["']+$/g, '');


    return cleaned.trim();
}

module.exports ={
    clean,
    cleanQuestion
}