import { Injectable, Renderer2, RendererFactory2, Inject, DOCUMENT } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class SchemaService {
  private renderer: Renderer2;
  private schemaElement: HTMLScriptElement | null = null;

  constructor(
    private rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  /**
   * Adds or updates a JSON-LD schema tag in the document's head.
   * @param schema The JSON object for the schema.
   */
setSchema(schema: any): void {
  if (this.schemaElement) {
    this.removeSchema();
  }

  const script = this.renderer.createElement('script');
  this.renderer.setAttribute(script, 'type', 'application/ld+json');

  // put JSON in the body, not in an attribute
  script.textContent = JSON.stringify(schema);

  this.renderer.appendChild(this.document.head, script);
  this.schemaElement = script;
}

  /**
   * Removes the JSON-LD schema tag from the document's head.
   */
  removeSchema(): void {
    if (this.schemaElement) {
      // make sure it’s actually in the DOM before removing
      if (this.schemaElement.parentNode) {
        this.renderer.removeChild(
          this.schemaElement.parentNode,
          this.schemaElement
        );
      }
      this.schemaElement = null;
    }
  }
}
