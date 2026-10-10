
const noteText = document.getElementById("note-text");
const charCount = document.getElementById("char-count");
const wordCount = document.getElementById("word-count");
const clearBtn = document.getElementById("clear-btn");
const themeToggle = document.getElementById("theme-toggle");

const DRAFT_KEY = "quicknotes-day4-draft";
const THEME_KEY = "quicknotes-day4-theme";

function updateCounts() {
    const text = noteText.value;
    const characters = text.length;

    const words = text.trim() === ""
        ? 0
        : text.trim().split(/\s+/).length;

    charCount.textContent = `${characters} / 200 characters`;
    wordCount.textContent = `${words} words`;

    charCount.classList.remove("warning", "over");

    if (characters > 200) {
        charCount.classList.add("over");
    } else if (characters > 180) {
        charCount.classList.add("warning");
    }
}

function saveDraft() {
    localStorage.setItem(DRAFT_KEY, noteText.value);
}

function clearNote() {
    noteText.value = "";
    localStorage.removeItem(DRAFT_KEY);
    updateCounts();
}

function updateThemeLabel() {
    themeToggle.textContent = document.body.classList.contains("dark")
        ? "Light mode"
        : "Dark mode";
}

// Restore the saved draft when the page loads.
const savedDraft = localStorage.getItem(DRAFT_KEY);

if (savedDraft !== null) {
    noteText.value = savedDraft;
}

// Restore the saved theme when the page loads.
const savedTheme = localStorage.getItem(THEME_KEY);

if (savedTheme === "dark") {
    document.body.classList.add("dark");
} else {
    document.body.classList.remove("dark");
}

updateThemeLabel();
updateCounts();

// Save the draft and update the counters whenever text changes.
noteText.addEventListener("input", function () {
    updateCounts();
    saveDraft();
});

// Clear the note when the Clear button is clicked.
clearBtn.addEventListener("click", function () {
    clearNote();
});

// Pressing Escape inside the textarea clears the note.
noteText.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        clearNote();
    }
});

// Toggle the theme and remember the user's choice.
themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark");

    const currentTheme = document.body.classList.contains("dark")
        ? "dark"
        : "light";

    localStorage.setItem(THEME_KEY, currentTheme);
    updateThemeLabel();
});
