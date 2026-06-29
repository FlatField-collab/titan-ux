import lucasBrooksAvatar from "@/assets/lucas-brooks-avatar.png";
import { avatar } from "@/assets/avatars";

export type VRideQueueItem = {
  id: string;
  name: string;
  avatar: string;
  chip: "Visit Due" | "Multiple Alerts";
  tone: "neutral" | "danger";
};

export const VRIDE_QUEUE: VRideQueueItem[] = [
  {
    id: "juan-benni",
    name: "Juan Benni",
    avatar: avatar(14),
    chip: "Visit Due",
    tone: "neutral",
  },
  {
    id: "gabriel-sinclair",
    name: "Gabriel Sinclair",
    avatar: avatar(12),
    chip: "Visit Due",
    tone: "neutral",
  },
  {
    id: "lucas-brooks",
    name: "Lucas Brooke",
    avatar: lucasBrooksAvatar,
    chip: "Multiple Alerts",
    tone: "danger",
  },
];
