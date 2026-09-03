"""Transcribe an audio or video file with faster-whisper.

Invoked by extract/video.ts as: python whisper_transcribe.py <media-path>
Prints exactly one JSON object to stdout: {"text": "..."}
Errors go to stderr as JSON, with a non-zero exit code.

faster-whisper decodes via PyAV, which bundles its own FFmpeg libraries, so a
video container works as input directly — no system ffmpeg needed.
"""

import json
import logging
import os
import sys


def main() -> int:
    if len(sys.argv) < 2:
        print(json.dumps({"error": "usage: whisper_transcribe.py <media-path>"}), file=sys.stderr)
        return 2

    media_path = sys.argv[1]
    if not os.path.isfile(media_path):
        print(json.dumps({"error": f"no such file: {media_path}"}), file=sys.stderr)
        return 2

    # Anything written to stdout other than the final JSON line would corrupt
    # what the Node side parses, so library logging is pinned to stderr-only.
    logging.basicConfig(level=logging.ERROR, stream=sys.stderr)
    logging.getLogger("faster_whisper").setLevel(logging.ERROR)

    try:
        from faster_whisper import WhisperModel
    except ImportError as exc:
        print(json.dumps({"error": f"ModuleNotFoundError: faster_whisper ({exc})"}), file=sys.stderr)
        return 1

    # int8 on CPU because no GPU is assumed on a dev machine. Model size is a
    # config knob, not a second abstraction seam — the seam is SttProvider.
    model_size = os.environ.get("WHISPER_MODEL_SIZE", "small")

    try:
        model = WhisperModel(model_size, device="cpu", compute_type="int8")
        segments, _info = model.transcribe(media_path, beam_size=5)
        text = " ".join(segment.text.strip() for segment in segments).strip()
    except Exception as exc:  # noqa: BLE001 - surfaced verbatim to the Node caller
        print(json.dumps({"error": f"{type(exc).__name__}: {exc}"}), file=sys.stderr)
        return 1

    print(json.dumps({"text": text}))
    return 0


if __name__ == "__main__":
    sys.exit(main())
