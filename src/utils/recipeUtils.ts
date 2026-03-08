import { Recipe } from "../types/recipe";

export const copyRecipeToClipboard = async (
  recipe: Recipe,
): Promise<boolean> => {
  try {
    const recipeText = formatRecipeForCopy(recipe);
    await navigator.clipboard.writeText(recipeText);
    return true;
  } catch (error) {
    console.error("Failed to copy recipe:", error);
    return false;
  }
};

export const shareRecipe = async (recipe: Recipe): Promise<boolean> => {
  const shareData = {
    title: recipe.title,
    text: recipe.description,
    url: `${window.location.origin}?recipe=${recipe.id}`,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return true;
    } catch (error) {
      console.error("Error sharing:", error);
      return false;
    }
  } else {
    // Fallback: copy share link to clipboard
    try {
      await navigator.clipboard.writeText(shareData.url);
      return true;
    } catch (error) {
      console.error("Failed to copy share link:", error);
      return false;
    }
  }
};

export const shareToSocial = (
  recipe: Recipe,
  platform: "twitter" | "facebook" | "pinterest",
): void => {
  const url = encodeURIComponent(
    `${window.location.origin}?recipe=${recipe.id}`,
  );
  const text = encodeURIComponent(
    `Check out this amazing recipe: ${recipe.title}`,
  );

  const urls = {
    twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${url}&description=${text}`,
  };

  window.open(urls[platform], "_blank", "width=600,height=400");
};

export const generateRecipeJSON = (recipe: Recipe): string => {
  return JSON.stringify(recipe, null, 2);
};

export const downloadRecipeAsJSON = (recipe: Recipe): void => {
  const json = generateRecipeJSON(recipe);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${recipe.title.replace(/\s+/g, "-").toLowerCase()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadRecipeAsPDF = (recipe: Recipe): void => {
  const content = formatRecipeForPrint(recipe);
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  }
};

export const formatRecipeForCopy = (recipe: Recipe): string => {
  const ingredientsList = recipe.ingredients
    .map((ing) => `• ${ing.amount} ${ing.unit} ${ing.name}`)
    .join("\n");

  const stepsList = recipe.steps
    .map((step) => `${step.number}. ${step.description}`)
    .join("\n");

  return `${recipe.title}

${recipe.description}

Servings: ${recipe.servings}
Prep Time: ${recipe.prepTime} min
Cook Time: ${recipe.cookTime} min
Difficulty: ${recipe.difficulty}

INGREDIENTS:
${ingredientsList}

INSTRUCTIONS:
${stepsList}`;
};

export const formatRecipeForPrint = (recipe: Recipe): string => {
  const ingredientsList = recipe.ingredients
    .map((ing) => `<li>${ing.amount} ${ing.unit} ${ing.name}</li>`)
    .join("");

  const stepsList = recipe.steps
    .map((step) => `<li>${step.description}</li>`)
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    h1 { color: #2d3748; border-bottom: 2px solid #667eea; padding-bottom: 10px; }
    h2 { color: #4a5568; margin-top: 20px; }
    ul { list-style-position: inside; }
    .recipe-meta { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 15px; margin: 20px 0; }
    .meta-item { background: #f7fafc; padding: 10px; border-radius: 5px; }
    @media print { .no-print { display: none; } }
  </style>
</head>
<body>
  <h1>${recipe.title}</h1>
  <p>${recipe.description}</p>
  
  <div class="recipe-meta">
    <div class="meta-item"><strong>Servings:</strong> ${recipe.servings}</div>
    <div class="meta-item"><strong>Prep:</strong> ${recipe.prepTime} min</div>
    <div class="meta-item"><strong>Cook:</strong> ${recipe.cookTime} min</div>
    <div class="meta-item"><strong>Level:</strong> ${recipe.difficulty}</div>
  </div>

  <h2>Ingredients</h2>
  <ul>${ingredientsList}</ul>

  <h2>Instructions</h2>
  <ol>${stepsList}</ol>
</body>
</html>
  `;
};

export const calculateServingMultiplier = (
  originalServings: number,
  desiredServings: number,
): number => {
  return desiredServings / originalServings;
};

export const adjustIngredient = (
  amount: string,
  multiplier: number,
): string => {
  const num = parseFloat(amount);
  if (isNaN(num)) return amount;
  return (num * multiplier).toFixed(2).replace(/\.?0+$/, "");
};
