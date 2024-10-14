import { Event } from './Event';
import { Grade } from './Grade';
import { Schedule } from './Schedule';
import { Exam } from './Exam';

export interface Discipline {
  id: string;
  nome: string;
  grades?: Grade[];
  schedules?: Schedule[];
  exams?: Exam[];
  eventos?: Event[];
}
