// src/types/index.ts

export interface Crewmate {
    id: string;
    name: string;
    role:
      | 'Engineer'
      | 'Designer'
      | 'Frontend Engineer'
      | 'Backend Engineer'
      | 'Fullstack Engineer';
    specialty: string;
    experience: string;
    created_at: string;
}