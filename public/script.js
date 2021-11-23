"use strict";

const WHITE_KEYS = [
  "z",
  "x",
  "c",
  "v",
  "b",
  "n",
  "m",
  "k",
  "j",
  "h",
  "g",
  "f",
  "d",
  "s",
];
const BLACK_KEYS = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];

const recordBtn = document.querySelector(".record-btn");
const playBtn = document.querySelector(".play-btn");
const saveBtn = document.querySelector(".save-btn");
const songLink = document.querySelector(".song-link");
const keys = document.querySelectorAll(".key");
const whiteKeys = document.querySelectorAll(".key.white");
const blackKeys = document.querySelectorAll(".key.black");
const keyMap = [...keys].reduce((map, key) => {
  map[key.dataset.note] = key;
  return map;
}, {});

let recordStartTime;
let songNotes = curSong && curSong.notes;

keys.forEach((key) => {
  key.addEventListener("click", () => playNote(key));
});

if (recordBtn) {
  recordBtn.addEventListener("click", toggleRecording);
}
if (saveBtn) {
  saveBtn.addEventListener("click", saveSong);
}
playBtn.addEventListener("click", playSong);

document.addEventListener("keydown", (e) => {
  if (e.repeat) return;
  const key = e.key;
  const whiteKeyIdx = WHITE_KEYS.indexOf(key);
  const blackKeyIdx = BLACK_KEYS.indexOf(key);

  if (whiteKeyIdx > -1) playNote(whiteKeys[whiteKeyIdx]);
  if (blackKeyIdx > -1) playNote(blackKeys[blackKeyIdx]);
});

function toggleRecording() {
  recordBtn.classList.toggle("active");
  if (isRecording()) {
    startRecording();
  } else {
    stopRecording();
  }
}

function isRecording() {
  return recordBtn != null && recordBtn.classList.contains("active");
}

function startRecording() {
  recordStartTime = Date.now();
  songNotes = [];
  playBtn.classList.remove("show");
  saveBtn.classList.remove("show");
}

function stopRecording() {
  playSong();
  playBtn.classList.add("show");
  saveBtn.classList.add("show");
}

function playSong() {
  if (songNotes.length === 0) return;
  songNotes.forEach((note) => {
    setTimeout(() => {
      playNote(keyMap[note.key]);
    }, note.startTime);
  });
}

function playNote(key) {
  if (isRecording()) recordNote(key.dataset.note);
  const noteAudio = document.getElementById(key.dataset.note);
  noteAudio.currentTime = 0;
  noteAudio.play();
  key.classList.add("active");
  noteAudio.addEventListener("ended", () => {
    key.classList.remove("active");
  });
}

function recordNote(note) {
  songNotes.push({
    key: note,
    startTime: Date.now() - recordStartTime,
  });
}

function saveSong() {
  axios.post("/songs", { songNotes: songNotes }).then((res) => {
    songLink.classList.add("show");
    songLink.href = `/songs/${res.data._id}`;
  });
}
