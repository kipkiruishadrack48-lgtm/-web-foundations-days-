let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];

function searchNotes(word) {
  return notes.filter(note =>
    note.text.toLowerCase().includes(word.toLowerCase())
  );
}

function longestNote() {
  if (notes.length === 0) {
    return null;
  }

  let longest = notes[0];

  for (let note of notes) {
    if (note.text.length > longest.text.length) {
      longest = note;
    }
  }

  return longest;
}

function countByCategory() {
  let counts = {
    personal: 0,
    work: 0,
    study: 0
  };

  for (let note of notes) {
    counts[note.category]++;
  }

  return counts;
}

function getSummary() {
  let counts = countByCategory();

  let word = notes.length === 1 ? "note" : "notes";

  return `${notes.length} ${word}: ${counts.personal} personal, ${counts.work} work, ${counts.study} study.`;
}

function isDuplicate(text) {
  return notes.some(note =>
    note.text.trim().toLowerCase() === text.trim().toLowerCase()
  );
}

function addNote(text, category) {
  if (text.trim().length < 1 || text.trim().length > 200) {
    console.log("Note must be between 1 and 200 characters.");
    return false;
  }

  if (isDuplicate(text)) {
    console.log("Note is a duplicate.");
    return false;
  }

  if (!["personal", "work", "study"].includes(category)) {
    console.log("Invalid category.");
    return false;
  }

  let newNote = {
    id: notes.length + 1,
    text: text.trim(),
    category: category
  };

  notes.push(newNote);

  return true;
}

console.log(searchNotes("day"));
console.log(longestNote());
console.log(countByCategory());
console.log(getSummary());

console.log(isDuplicate("Call mum"));
console.log(isDuplicate("  CALL MUM  "));
console.log(isDuplicate("Go shopping"));

console.log(addNote("Buy a new notebook", "personal"));
console.log(addNote("Call mum", "personal"));
console.log(addNote("Learn Python", "coding"));
console.log(addNote("", "study"));