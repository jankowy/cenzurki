/**
 * Data types for the "Cenzurki" application.
 * School readiness assessment compliant with MEN requirements.
 */

/** Possible skill assessment levels for each indicator */
export type SkillLevel = "MASTERED" | "SUPPORTED" | "NEEDS_HELP";

/** Development area as defined by MEN */
export type DevelopmentArea = "PHYSICAL" | "EMOTIONAL" | "SOCIAL" | "COGNITIVE";

/** Type of diagnosis document */
export type DiagnosisType = "INITIAL" | "FINAL" | "SHORT";

/** Child's personal data */
export interface Child {
  id: string;
  firstName: string;
  lastName: string;
  birthYear: number;
}

/** A single assessment indicator within a development area */
export interface Indicator {
  id: string;
  skillLevel: SkillLevel | null;
  notes?: string;
}

/** A MEN development area with its assessment indicators */
export interface DiagnosisCategory {
  area: DevelopmentArea;
  indicators: Indicator[];
}

/**
 * Full school readiness assessment sheet for one child.
 * Compliant with "Informacja o gotowości dziecka do podjęcia nauki
 * w szkole podstawowej" (MEN regulation).
 */
export interface Diagnosis {
  id: string;
  childId: string;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  year: number; // school year, e.g. 2025
  type: DiagnosisType;
  /** 4 main MEN development areas */
  categories: DiagnosisCategory[];
  /** Additional developmental needs / recommendations for parents */
  developmentalNeeds: string;
  /** Strengths / predispositions */
  strengths: string;
  /** Notes for the primary school teacher */
  teacherNotes: string;
}

/** Structure of the entire database (one JSON file on disk) */
export interface Database {
  version: number;
  children: Child[];
  diagnoses: Diagnosis[];
}
