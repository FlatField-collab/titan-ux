// Locally-hosted avatar images (formerly i.pravatar.cc).
// Keyed by the legacy pravatar `img=N` id so call sites stay readable.
import a3 from "./avatar-3.jpg";
import a5 from "./avatar-5.jpg";
import a7 from "./avatar-7.jpg";
import a8 from "./avatar-8.jpg";
import a9 from "./avatar-9.jpg";
import a10 from "./avatar-10.jpg";
import a11 from "./avatar-11.jpg";
import a12 from "./avatar-12.jpg";
import a13 from "./avatar-13.jpg";
import a14 from "./avatar-14.jpg";
import a15 from "./avatar-15.jpg";
import a16 from "./avatar-16.jpg";
import a17 from "./avatar-17.jpg";
import a22 from "./avatar-22.jpg";
import a23 from "./avatar-23.jpg";
import a26 from "./avatar-26.jpg";
import a30 from "./avatar-30.jpg";
import a32 from "./avatar-32.jpg";
import a33 from "./avatar-33.jpg";
import a44 from "./avatar-44.jpg";
import a47 from "./avatar-47.jpg";
import a48 from "./avatar-48.jpg";
import a49 from "./avatar-49.jpg";
import a51 from "./avatar-51.jpg";
import a52 from "./avatar-52.jpg";
import a53 from "./avatar-53.jpg";
import a57 from "./avatar-57.jpg";
import a58 from "./avatar-58.jpg";
import a60 from "./avatar-60.jpg";
import a65 from "./avatar-65.jpg";
import a68 from "./avatar-68.jpg";

const AVATARS: Record<number, string> = {
  3: a3, 5: a5, 7: a7, 8: a8, 9: a9, 10: a10, 11: a11, 12: a12, 13: a13,
  14: a14, 15: a15, 16: a16, 17: a17, 22: a22, 23: a23, 26: a26, 30: a30,
  32: a32, 33: a33, 44: a44, 47: a47, 48: a48, 49: a49, 51: a51, 52: a52,
  53: a53, 57: a57, 58: a58, 60: a60, 65: a65, 68: a68,
};

export function avatar(id: number): string {
  return AVATARS[id] ?? "";
}
