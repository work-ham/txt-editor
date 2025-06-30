document.addEventListener('DOMContentLoaded', function() {
    const editor = document.getElementById('editor');
    const saveBtn = document.getElementById('save-btn');
    const clearBtn = document.getElementById('clear-btn');
    const darkModeBtn = document.getElementById('dark-mode-btn');
    const downloadBtn = document.getElementById('download-btn');
    const importBtn = document.getElementById('import-btn');
    const fileInput = document.getElementById('file-input');
    const wordCountEl = document.querySelector('.word-count');
    const charCountEl = document.querySelector('.char-count');
    const fileInfoEl = document.querySelector('.file-info');
    
    let currentFileName = 'Untitled.txt';
    let isDarkMode = true;
    
    // Load saved content from localStorage
    const savedContent = localStorage.getItem('textEditorContent');
    if (savedContent) {
        editor.value = savedContent;
        updateCounts();
    }
    
    // Update word and character counts
    function updateCounts() {
        const text = editor.value;
        const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
        const charCount = text.length;
        
        wordCountEl.textContent = wordCount;
        charCountEl.textContent = charCount;
    }
    
    // Save to localStorage
    function saveContent() {
        localStorage.setItem('textEditorContent', editor.value);
        const now = new Date();
        fileInfoEl.textContent = `${currentFileName} (saved ${now.toLocaleTimeString()})`;
    }
    
    // Download file
    function downloadFile() {
        const blob = new Blob([editor.value], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = currentFileName || 'document.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    // Toggle dark/light mode
    function toggleDarkMode() {
        isDarkMode = !isDarkMode;
        
        if (isDarkMode) {
            document.documentElement.style.setProperty('--bg-color', '#1e1e1e');
            document.documentElement.style.setProperty('--text-color', '#e0e0e0');
            document.documentElement.style.setProperty('--toolbar-bg', '#252526');
            document.documentElement.style.setProperty('--border-color', '#3c3c3c');
            darkModeBtn.textContent = 'Light Mode';
        } else {
            document.documentElement.style.setProperty('--bg-color', '#ffffff');
            document.documentElement.style.setProperty('--text-color', '#333333');
            document.documentElement.style.setProperty('--toolbar-bg', '#f3f3f3');
            document.documentElement.style.setProperty('--border-color', '#dddddd');
            darkModeBtn.textContent = 'Dark Mode';
        }
    }
    
    // Handle file import
    function handleFileImport(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        currentFileName = file.name;
        fileInfoEl.textContent = currentFileName;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            editor.value = e.target.result;
            updateCounts();
            saveContent();
        };
        reader.readAsText(file);
    }
    
    // Event listeners
    editor.addEventListener('input', updateCounts);
    
    saveBtn.addEventListener('click', saveContent);
    
    clearBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to clear the editor?')) {
            editor.value = '';
            updateCounts();
            localStorage.removeItem('textEditorContent');
            fileInfoEl.textContent = 'Untitled.txt';
            currentFileName = 'Untitled.txt';
        }
    });
    
    darkModeBtn.addEventListener('click', toggleDarkMode);
    
    downloadBtn.addEventListener('click', function() {
        const fileName = prompt('Enter file name:', currentFileName);
        if (fileName) {
            currentFileName = fileName.endsWith('.txt') ? fileName : fileName + '.txt';
            downloadFile();
        }
    });
    
    importBtn.addEventListener('click', function() {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', handleFileImport);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            saveContent();
        }
    });
    
    // Initialize counts
    updateCounts();
});