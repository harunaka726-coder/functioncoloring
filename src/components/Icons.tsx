/** Same Ionicons set as the native app (via react-icons/io5). */
import {
  IoAdd,
  IoAnalytics,
  IoAnalyticsOutline,
  IoArrowRedoOutline,
  IoArrowUndoOutline,
  IoColorPalette,
  IoCreateOutline,
  IoDownloadOutline,
  IoEyeOffOutline,
  IoEyeOutline,
  IoGridOutline,
  IoImages,
  IoImagesOutline,
  IoResizeOutline,
  IoRefresh,
  IoSaveOutline,
  IoSettings,
  IoSettingsOutline,
  IoShareOutline,
  IoTextOutline,
  IoTrashOutline,
} from 'react-icons/io5';

const size = 20;
const sizeLg = 26;

export const Icons = {
  grid: (p?: { size?: number }) => <IoGridOutline size={p?.size ?? size} />,
  axes: (p?: { size?: number }) => <IoResizeOutline size={p?.size ?? size} />,
  labels: (p?: { size?: number }) => <IoTextOutline size={p?.size ?? size} />,
  reset: (p?: { size?: number }) => <IoRefresh size={p?.size ?? size} />,
  download: (p?: { size?: number }) => (
    <IoDownloadOutline size={p?.size ?? size} />
  ),
  save: (p?: { size?: number }) => <IoSaveOutline size={p?.size ?? size} />,
  share: (p?: { size?: number }) => <IoShareOutline size={p?.size ?? size} />,
  paint: (p?: { size?: number }) => <IoColorPalette size={p?.size ?? size} />,
  eye: (p?: { size?: number }) => <IoEyeOutline size={p?.size ?? size} />,
  eyeOff: (p?: { size?: number }) => <IoEyeOffOutline size={p?.size ?? size} />,
  trash: (p?: { size?: number }) => <IoTrashOutline size={p?.size ?? size} />,
  add: (p?: { size?: number }) => <IoAdd size={p?.size ?? 28} />,
  undo: (p?: { size?: number }) => (
    <IoArrowUndoOutline size={p?.size ?? size} />
  ),
  redo: (p?: { size?: number }) => (
    <IoArrowRedoOutline size={p?.size ?? size} />
  ),
  edit: (p?: { size?: number }) => <IoCreateOutline size={p?.size ?? size} />,
  home: (active: boolean) =>
    active ? (
      <IoAnalytics size={sizeLg} />
    ) : (
      <IoAnalyticsOutline size={sizeLg} />
    ),
  album: (active: boolean) =>
    active ? <IoImages size={sizeLg} /> : <IoImagesOutline size={sizeLg} />,
  settings: (active: boolean) =>
    active ? (
      <IoSettings size={sizeLg} />
    ) : (
      <IoSettingsOutline size={sizeLg} />
    ),
};
