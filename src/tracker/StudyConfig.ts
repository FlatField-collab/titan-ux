export interface StudyTask {
  id: string;
  title: string;
  instruction: string;
}

export interface StudyConfigShape {
  supabaseUrl: string;
  supabaseKey: string;
  studyId: string;
  accessCode: string;
  instructions: string;
  tasks: StudyTask[];
}

export const STUDY_CONFIG: StudyConfigShape = {
  supabaseUrl: "https://wdagqijnktvnfwzwiukc.supabase.co",
  supabaseKey: "sb_publishable_3t1qJ6o6763rC9PoCAqW7A_6S4qhMh4",
  studyId: "TITAN-S1-R1",
  accessCode: "",
  instructions: "",
  tasks: [
    {
      id: "task-1",
      title: "Task 1 of 3",
      instruction: "Placeholder — will be overridden by URL parameter.",
    },
    {
      id: "task-2",
      title: "Task 2 of 3",
      instruction: "Placeholder — will be overridden by URL parameter.",
    },
    {
      id: "task-3",
      title: "Task 3 of 3",
      instruction: "Placeholder — will be overridden by URL parameter.",
    },
  ],
};
