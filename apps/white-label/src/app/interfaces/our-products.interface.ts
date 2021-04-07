export interface Categories {
  id?: string;
  url?: string;
  name?: string;
}

export interface PerfectServe {
  id?: string;
  name?: string;
  image?: string;
  igredients: string;
  glass: string;
  garnish: string;
  method: string;
}

export interface User {
  your_name: string;
  your_bar: string;
  your_email: string;
}
