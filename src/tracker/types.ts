export type InteractionType =
  | "click"
  | "nav"
  | "scroll"
  | "key"
  | "input"
  | "submit"
  | "task_complete";

export interface BaseEvent {
  t: string;
  type: InteractionType;
  viewName: string;
  pathname: string;
}

export interface ElementFields {
  tagType: string;
  label: string | null;
  role: string | null;
  tag: string;
  selector: string;
}

export interface ClickEvent extends BaseEvent, ElementFields {
  type: "click";
  x: number;
  y: number;
  /** Set to `false` when the destination route is not built and the
   *  navigation guard intercepted the tap. Real navigations leave this
   *  field unset so blocked taps are easy to filter in session data. */
  wired?: boolean;
}


export interface NavEvent extends BaseEvent {
  type: "nav";
}

export interface ScrollEvent extends BaseEvent {
  type: "scroll";
  scrollY: number;
}

export interface KeyEvent extends BaseEvent {
  type: "key";
  key: string;
  meta: boolean;
  ctrl: boolean;
  alt: boolean;
  shift: boolean;
}

export interface InputEvent_ extends BaseEvent, ElementFields {
  type: "input";
  valueLength: number;
  inputType: string | null;
}

export interface SubmitEvent_ extends BaseEvent, ElementFields {
  type: "submit";
}

export interface TaskCompleteEvent extends BaseEvent {
  type: "task_complete";
  taskId: string;
  taskTitle: string;
  durationMs: number;
}

export type InteractionEvent =
  | ClickEvent
  | NavEvent
  | ScrollEvent
  | KeyEvent
  | InputEvent_
  | SubmitEvent_
  | TaskCompleteEvent;

export interface TaskTiming {
  taskId: string;
  taskTitle: string;
  startedAt: string;
  completedAt: string;
  durationMs: number;
}

export interface UsabilitySession {
  id: string;
  label?: string;
  studyId?: string;
  createdAt: string;
  endedAt?: string;
  interactions: InteractionEvent[];
  tasks?: TaskTiming[];
}
