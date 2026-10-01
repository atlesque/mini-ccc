# ADR 0001: Use a local, one-use block model for the agenda

## Status

Accepted

## Decision

The schedule uses seven named, pre-made blocks, including Lunch. Each block can appear once in an agenda, may start on a 30-minute boundary, and may last from 30 minutes to four hours. The default agenda places Lunch from 12:00 to 13:00. The agenda is saved in the browser with local storage; there is no account or server-side schedule.

## Why

The gathering needs a playful planning surface rather than a general calendar. A small fixed palette keeps the interaction understandable, while local persistence matches the private, one-device nature of the event and avoids introducing a backend before one is needed.

Lunch is an editable block like the other named activities. Other gaps remain open time.
