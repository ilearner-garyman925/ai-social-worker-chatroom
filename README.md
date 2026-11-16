# StudyMate

English, two-page academic advisor experience based on the approved mist-blue/lavender UI.

## Run locally

`python -m http.server 5173 --directory dist`

Open http://localhost:5173. No build step or package installation is required.

## Current behaviour

- Three advisors with separate illustrated classroom assets and subject-specific guided lessons.
- Two introductory replies open an MC question; selecting an answer shows feedback. Continue returns to spoken conversation.
- Browser speech synthesis and English speech recognition when supported and permission is granted. Typed answers are always available.
- In-session searchable history, message replay, captions, elapsed time, collapsible history and responsive layout.
- End confirmation, session summary, restart and advisor switching.

This is a frontend with guided lesson scripts, not a connected generative AI service. No API keys or server-side AI are configured. Transcripts remain in memory and clear when starting a new session or reloading. Browser speech recognition may use the browser vendor's service. Microphone availability depends on browser support and permission.

## Validation

JavaScript syntax check passed. Browser-checked advisor selection, typed replies, MC incorrect and correct feedback, continuation, search, captions, ending and history retention. Desktop and narrow layouts visually checked. Microphone denial fallback observed; successful live microphone recognition has not been verified.

The existing private Sites project is declared in `.openai/hosting.json`.

## Academic Advisory Portal update

Page 1 uses City University of Hong Kong, Welcome to Academic Advisory Portal and Start Session. Desktop session layout is chat history on the left, advisor in the middle and general health survey on the right. History has illustrative waveforms with text-to-speech replay and Show text controls; these are not audio recordings.

Only the supplied question 3/12 is implemented. Selection uses neutral radio buttons with no scoring, diagnosis or correct/incorrect feedback. Confirmation is kept in memory for this session; remaining questions are not invented and the full survey is not marked complete. The current guided script is not a live advisor service.
