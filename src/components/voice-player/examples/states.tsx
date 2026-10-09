/** Every state side by side, each labelled by its prop: the transfer is drawn on the play disk itself — in flight with the cross and the ring, failed with the retry, not fetched with the download arrow — `unplayed`, `transfer`, `transferProgress`, `disabled`. */
import { Typography, VoicePlayer } from "prime-ui-kit";

const VOICE_URL = "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3";

const WAVEFORM = [
  0.22, 0.46, 0.7, 0.54, 0.3, 0.62, 0.9, 0.74, 0.4, 0.26, 0.58, 0.8, 0.5, 0.34, 0.66, 0.44, 0.2,
  0.38, 0.72, 0.56,
];

/** Stand-ins for the chat's transfer service: the disks show their actions. */
const cancelTransfer = () => {};
const retryTransfer = () => {};
const fetchRecording = () => {};

export default function VoicePlayerStatesExample() {
  return (
    <>
      <div>
        <div>
          <VoicePlayer src={VOICE_URL} waveform={WAVEFORM} duration={24} />
          <Typography as="span" variant="caption" tone="muted">
            default
          </Typography>
        </div>
        <div>
          <VoicePlayer src={VOICE_URL} waveform={WAVEFORM} duration={24} unplayed />
          <Typography as="span" variant="caption" tone="muted">
            unplayed
          </Typography>
        </div>
        <div>
          <VoicePlayer src={VOICE_URL} waveform={WAVEFORM} duration={24} disabled />
          <Typography as="span" variant="caption" tone="muted">
            disabled
          </Typography>
        </div>
      </div>
      <div>
        <div>
          <VoicePlayer
            src={VOICE_URL}
            waveform={WAVEFORM}
            duration={24}
            transfer="loading"
            transferProgress={0.45}
            onCancel={cancelTransfer}
          />
          <Typography as="span" variant="caption" tone="muted">
            transfer · loading
          </Typography>
        </div>
        <div>
          <VoicePlayer
            src={VOICE_URL}
            waveform={WAVEFORM}
            duration={24}
            transfer="failed"
            onRetry={retryTransfer}
          />
          <Typography as="span" variant="caption" tone="muted">
            transfer · failed
          </Typography>
        </div>
        <div>
          <VoicePlayer
            src={VOICE_URL}
            waveform={WAVEFORM}
            duration={24}
            transfer="remote"
            transferDirection="download"
            onDownload={fetchRecording}
          />
          <Typography as="span" variant="caption" tone="muted">
            transfer · remote
          </Typography>
        </div>
      </div>
    </>
  );
}
