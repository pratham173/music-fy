/**
 * Prompt Templates for Study Themes
 */

/**
 * Theme A: "The Exam Cram" - Speed & Formula Focus
 */
export const EXAM_CRAM_PROMPT = (content) => `
You are an expert exam preparation tutor. Create a concise "Last-Minute Exam Cheatsheet" from the following study material.

CONTENT:
${content}

Generate a response in the following format:

# Exam Cram Cheatsheet

## High-Yield Topics
[Provide 5-8 bullet points of the most exam-likely concepts]

## Formula Sheet
[List all important formulas in LaTeX format with variable definitions]
Example format:
- $$E = mc^2$$ where $E$ is energy, $m$ is mass, $c$ is speed of light

## Memory Hooks
[Provide 3-5 mnemonics, acronyms, or analogies for difficult concepts]

Keep it concise and actionable. Focus on what students need to memorize for exams.
Use LaTeX for all mathematical equations (inline: $...$, block: $$...$$).
`;

/**
 * Theme B: "The Problem Solver" - Numerical/Logic Focus
 */
export const PROBLEM_SOLVER_PROMPT = (content) => `
You are an expert problem-solving tutor. Create a "Practice Drill" with solved examples from the following study material.

CONTENT:
${content}

Generate a response in the following format:

# Problem Solver Practice Drill

## Brief Context
[One-sentence explanation of the core concept]

## Solved Examples

### Example 1: [Problem Title]
**Problem:** [State the problem clearly]

**Solution:**
Step 1: [First step with explanation]
Step 2: [Second step with explanation]
...
**Answer:** [Final answer]

### Example 2: [Problem Title]
[Same format as Example 1]

### Example 3: [Problem Title]
[Same format as Example 1]

## Common Mistakes & Edge Cases
[List 3-5 common mistakes students make and edge cases to watch for]

Use LaTeX for all mathematical equations (inline: $...$, block: $$...$$).
Make problems progressively more challenging.
`;

/**
 * Theme C: "The Deep Diver" - Derivation & Concept Focus
 */
export const DEEP_DIVER_PROMPT = (content) => `
You are an expert conceptual tutor focused on deep understanding. Create a "Conceptual Deep Dive" from the following study material.

CONTENT:
${content}

Generate a response in the following format:

# Conceptual Deep Dive

## The 'Why' - Intuition
[Explain the intuition and reasoning behind the concepts in 2-3 paragraphs]

## Full Derivations
[Provide complete mathematical derivations with detailed explanations]
Show all steps. Explain why each step is necessary.
Use LaTeX format for all equations.

## Real-World Applications
[Provide 3-5 concrete examples of how this concept is used in practice]

## Connections
[Explain how this concept relates to other topics in the field]

Be thorough and descriptive. Focus on building deep understanding, not memorization.
Use LaTeX for all mathematical equations (inline: $...$, block: $$...$$).
`;

/**
 * Get prompt template based on theme
 */
export function getPromptForTheme(theme, content) {
  switch (theme) {
    case 'exam_cram':
      return EXAM_CRAM_PROMPT(content);
    case 'problem_solver':
      return PROBLEM_SOLVER_PROMPT(content);
    case 'deep_diver':
      return DEEP_DIVER_PROMPT(content);
    default:
      return EXAM_CRAM_PROMPT(content);
  }
}

/**
 * Theme metadata
 */
export const THEMES = {
  exam_cram: {
    id: 'exam_cram',
    name: 'The Exam Cram',
    description: 'Speed & Formula Focus',
    icon: '⚡',
    color: '#FF6B6B'
  },
  problem_solver: {
    id: 'problem_solver',
    name: 'The Problem Solver',
    description: 'Numerical & Logic Focus',
    icon: '🧮',
    color: '#4ECDC4'
  },
  deep_diver: {
    id: 'deep_diver',
    name: 'The Deep Diver',
    description: 'Derivation & Concept Focus',
    icon: '🔬',
    color: '#95E1D3'
  }
};
