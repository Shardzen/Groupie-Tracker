"""
Script de génération de PDF depuis Markdown
Utilise markdown-pdf pour créer un README.pdf professionnel
"""

import subprocess
import sys
import os

def install_markdown_pdf():
    """Installe markdown-pdf via npm si nécessaire"""
    print("📦 Installation de markdown-pdf...")
    try:
        subprocess.run(["npm", "install", "-g", "markdown-pdf"], check=True)
        print("✅ markdown-pdf installé avec succès")
        return True
    except subprocess.CalledProcessError:
        print("❌ Erreur lors de l'installation de markdown-pdf")
        print("💡 Installez Node.js d'abord : https://nodejs.org/")
        return False
    except FileNotFoundError:
        print("❌ npm n'est pas installé")
        print("💡 Installez Node.js d'abord : https://nodejs.org/")
        return False

def generate_pdf(markdown_file, output_pdf):
    """Génère un PDF depuis un fichier Markdown"""
    print(f"📄 Génération du PDF depuis {markdown_file}...")
    
    try:
        # Vérifier que le fichier Markdown existe
        if not os.path.exists(markdown_file):
            print(f"❌ Fichier {markdown_file} introuvable")
            return False
        
        # Générer le PDF
        subprocess.run([
            "markdown-pdf",
            markdown_file,
            "-o", output_pdf,
            "--remarkable-options", '{"breaks": true, "html": true}'
        ], check=True)
        
        print(f"✅ PDF généré avec succès : {output_pdf}")
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Erreur lors de la génération du PDF : {e}")
        return False
    except FileNotFoundError:
        print("❌ markdown-pdf n'est pas installé")
        if install_markdown_pdf():
            return generate_pdf(markdown_file, output_pdf)
        return False

def main():
    """Point d'entrée principal"""
    print("🎸 === GROUPIE TRACKER - Générateur de PDF ===\n")
    
    # Chemins des fichiers
    base_dir = os.path.dirname(os.path.abspath(__file__))
    markdown_file = os.path.join(base_dir, "README_PRODUCTION.md")
    output_pdf = os.path.join(base_dir, "README_PRODUCTION.pdf")
    
    # Générer le PDF
    if generate_pdf(markdown_file, output_pdf):
        print(f"\n🎉 PDF créé avec succès !")
        print(f"📂 Emplacement : {output_pdf}")
    else:
        print("\n❌ Échec de la génération du PDF")
        sys.exit(1)

if __name__ == "__main__":
    main()
