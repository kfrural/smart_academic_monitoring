import { Event } from './Event';
import { Grade } from './Grade';
import { Exam } from './Exam';

export interface Discipline {
  id: string;
  nome: string;
  grades?: Grade[];
  exams?: Exam[];
  eventos?: Event[];
}
