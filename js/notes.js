var note = document.getElementById("note-box");

note.addEventListener("input", function() {
    chrome.storage.sync.set({
        "note": note.value
    });
});

function initNote() {
    chrome.storage.sync.get("note", function(obj) {
        if (obj.note) {
            note.value = obj.note;
        }
    });    
}