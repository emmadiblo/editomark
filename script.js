marked.setOptions({
    gfm: true,
    breaks: true,
    smartLists: true,
    smartypants: true
});

const textarea = document.getElementById('markdown');
const preview = document.getElementById('preview');
const downloadButton = document.getElementById('download');
const copyButton = document.getElementById('copy');
const themeSelect = document.getElementById('theme-select');
const wordCountElement = document.getElementById('wordCount');
const charCountElement = document.getElementById('charCount');

const editor = CodeMirror.fromTextArea(textarea, {
    mode: 'markdown',
    theme: 'default',
    lineNumbers: true,
    lineWrapping: true,
    autofocus: true,
    tabSize: 2,
    styleActiveLine: true,
    matchBrackets: true,
    autoCloseBrackets: true,
});

function updateCounts() {
    const text = editor.getValue();
    const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    const chars = text.length;
    wordCountElement.textContent = `${words} mot${words > 1 ? 's' : ''}`;
    charCountElement.textContent = `${chars} caractère${chars > 1 ? 's' : ''}`;
}

function updatePreview() {
    const markdownText = editor.getValue();
    preview.innerHTML = marked(markdownText);
    updateCounts();
}

editor.on('change', updatePreview);

themeSelect.addEventListener('change', (e) => {
    editor.setOption('theme', e.target.value);
});

function validateFilename(filename) {
    return filename && filename.length > 0 && /^[a-zA-Z0-9-_]+$/.test(filename);
}

function downloadMarkdown() {
    const markdownText = editor.getValue();
    let filename = document.getElementById('filename')?.value || 'document';
    if (validateFilename(filename)) {
        const blob = new Blob([markdownText], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download =  `${filename}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

downloadButton.addEventListener('click', downloadMarkdown);
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        downloadMarkdown();
    }
});


copyButton.addEventListener('click', async () => {
    const markdownText = editor.getValue();
    try {
        await navigator.clipboard.writeText(markdownText);
        copyButton.innerHTML = '<span>✅ Copié!</span>';
        setTimeout(() => {
            copyButton.innerHTML = '<span>📋 Copier</span>';
        }, 2000);
    } catch (err) {
        console.error('Erreur lors de la copie:', err);
    }
});


document.getElementById('upload').addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.md';
    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                editor.setValue(event.target.result);
                // Set the filename input value without the .md extension
                const filename = file.name.replace('.md', '');
                document.getElementById('filename').value = filename;
            };
            reader.readAsText(file);
        }
    });
    input.click();
});

editor.setValue(`# Bienvenue dans l'EditoMark!

## Fonctionnalités

- Prévisualisation en temps réel
- Thèmes personnalisables
- Export en fichier markdown
- Raccourcis clavier (Ctrl+S pour telecharger le fichier)

### Essayez de modifier ce texte!`);