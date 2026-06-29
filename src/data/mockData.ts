import { avatar } from "@/assets/avatars";
export type Technician = {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
};

export const technicians: Technician[] = [
  { id: "t1", name: "Marcus Johnson",  role: "Premise Tech II",  avatarUrl: avatar(13) },
  { id: "t2", name: "Sofia Ramirez",   role: "Premise Tech III", avatarUrl: avatar(49) },
  { id: "t3", name: "Elliot Chen",     role: "Senior Tech",      avatarUrl: avatar(17) },
  { id: "t4", name: "Priya Patel",     role: "Premise Tech II",  avatarUrl: avatar(44) },
  { id: "t5", name: "Dwayne Carter",   role: "Premise Tech I",   avatarUrl: avatar(33) },
  { id: "t6", name: "Hannah Becker",   role: "Premise Tech III", avatarUrl: avatar(48) },
  { id: "t7", name: "Andre Thompson",  role: "Lead Tech",        avatarUrl: avatar(65) },
  { id: "t8", name: "Stephan Müller",  role: "Premise Tech II",  avatarUrl: avatar(51) },
];

export function getTechnician(id: string): Technician | undefined {
  return technicians.find((t) => t.id === id);
}
