import os
import sys
import markdown
from xhtml2pdf import pisa

# CSS simplifié compatible xhtml2pdf
PDF_CSS = """
<style>
    @page {
        size: A4;
        margin: 2cm;
        @frame footer_frame {
            -pdf-frame-content: footerContent;
            bottom: 1cm;
            margin-left: 2cm;
            margin-right: 2cm;
            height: 1cm;
        }
    }
    body { font-family: Helvetica, sans-serif; font-size: 11pt; line-height: 1.5; }
    h1 { color: #8b5cf6; font-size: 24pt; border-bottom: 2px solid #8b5cf6; padding-bottom: 5pt; }
    h2 { color: #6366f1; font-size: 18pt; margin-top: 20pt; }
    code { background-color: #f3f4f6; color: #ef4444; font-family: Courier; }
    pre { background-color: #1f2937; color: #e5e7eb; padding: 10pt; border-radius: 5pt; }
    blockquote { border-left: 4px solid #8b5cf6; padding-left: 10pt; color: #666; }
</style>
"""

def convert_html_to_pdf(source_html, output_filename):
    with open(output_filename, "w+b") as result_file:
        pisa_status = pisa.CreatePDF(source_html, dest=result_file)
    return pisa_status.err

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    input_file = os.path.join(base_dir, "README_PRODUCTION.md")
    output_file = os.path.join(base_dir, "README_PRODUCTION.pdf")

    if not os.path.exists(input_file):
        print(f"❌ Fichier {input_file} introuvable")
        return

    print("📄 Lecture du Markdown...")
    with open(input_file, 'r', encoding='utf-8') as f:
        text = f.read()

    print("🔄 Conversion en HTML...")
    html = markdown.markdown(text, extensions=['extra', 'codehilite', 'tables'])
    
    # Injection du CSS et du footer
    full_html = f"""
    <html>
    <head>{PDF_CSS}</head>
    <body>
        <div id="footerContent" style="text-align:center; color:gray; font-size:9pt;">
            Groupie Tracker - Documentation Technique
        </div>
        {html}
    </body>
    </html>
    """

    print("💾 Génération du PDF...")
    if convert_html_to_pdf(full_html, output_file) == 0:
        print(f"✅ Succès ! PDF créé : {output_file}")
    else:
        print("❌ Erreur lors de la génération PDF")

if __name__ == "__main__":
    main()