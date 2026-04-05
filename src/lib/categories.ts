/**
 * Default structure for the 4 MEN development categories with their indicators.
 * Used when creating a new diagnosis.
 */
import type { DiagnosisCategory } from "./types.js";

export function createDefaultCategories(): DiagnosisCategory[] {
  return [
    {
      area: "PHYSICAL",
      indicators: [
        { id: "physical_1", skillLevel: null },
        { id: "physical_2", skillLevel: null },
        { id: "physical_3", skillLevel: null },
        { id: "physical_4", skillLevel: null },
      ],
    },
    {
      area: "EMOTIONAL",
      indicators: [
        { id: "emotional_1", skillLevel: null },
        { id: "emotional_2", skillLevel: null },
        { id: "emotional_3", skillLevel: null },
        { id: "emotional_4", skillLevel: null },
      ],
    },
    {
      area: "SOCIAL",
      indicators: [
        { id: "social_1", skillLevel: null },
        { id: "social_2", skillLevel: null },
        { id: "social_3", skillLevel: null },
        { id: "social_4", skillLevel: null },
      ],
    },
    {
      area: "COGNITIVE",
      indicators: [
        { id: "cognitive_1", skillLevel: null },
        { id: "cognitive_2", skillLevel: null },
        { id: "cognitive_3", skillLevel: null },
        { id: "cognitive_4", skillLevel: null },
        { id: "cognitive_5", skillLevel: null },
        { id: "cognitive_6", skillLevel: null },
      ],
    },
  ];
}
