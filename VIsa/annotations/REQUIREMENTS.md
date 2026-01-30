# Annotations Block — High-Level Requirements

## Core Capabilities

- **Add annotations**  
  Authors can add one or more annotations. Each has an ordered position (e.g. 1, 2, 3…) and supports rich content.

- **Annotation content includes links**  
  Annotation text is rich text and can contain one or more links (internal or external).

- **Multiple images per block**  
  The block can reference multiple images. Authors can add, remove, and replace images.

- **Annotations can reference multiple images**  
  A single annotation can have a highlight region on more than one image (e.g. “See detail here” on image 1 and image 2).

- **Visual highlights on images**  
  Each annotation can define rectangular highlight regions on selected images. In view mode, hovering an annotation can show its highlights; in edit mode, highlights are draggable and can be added/removed per image.

- **Edit vs view**  
  In edit mode, authors manage annotations, text, links, images, and highlight regions. In view mode, users see the list and images with highlights (e.g. on hover), and can follow links in the text.

## Styling & Configuration

- **Highlight and circle colors**  
  Block-level settings allow customizing the highlight color and the annotation number/circle color.

## Out of Scope (for this high-level set)

- Specific UX/UI details, APIs, or data schemas are not defined here; they are design/implementation concerns.
