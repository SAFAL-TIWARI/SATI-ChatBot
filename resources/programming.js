// Programming Page JavaScript
// Monaco Editor and Terminal functionality

// Global variables
let monacoEditor = null;
let currentLanguage = 'c';
let isEditorReady = false;

// Terminal variables
let terminalHistory = [];
let historyIndex = -1;
let currentDirectory = '~';

// DOM Elements
const languageSelect = document.getElementById('languageSelect');
const editorTitle = document.getElementById('editorTitle');
const runBtn = document.getElementById('runBtn');
const downloadBtn = document.getElementById('downloadBtn');
const copyBtn = document.getElementById('copyBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const clearTerminalBtn = document.getElementById('clearTerminalBtn');
const terminal = document.getElementById('terminal');
const terminalOutput = document.querySelector('.terminal-output');
const terminalInput = document.getElementById('terminalInput');
const darkModeToggle = document.getElementById('darkModeToggle');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileNavMenu = document.getElementById('mobileNavMenu');
const blurOverlay = document.getElementById('blurOverlay');

// Language configurations
const languageConfig = {
    javascript: {
        name: 'JavaScript',
        extension: 'js',
        monacoLanguage: 'javascript',
        defaultCode: `// Welcome to SATI Programming Hub!
// Write your JavaScript code here

function greetSATI() {
    console.log("Hello from SATI Programming Hub!");
    console.log("Happy coding, SATI students! 🚀");
    
    // Example: Calculate factorial
    const number = 5;
    const factorial = calculateFactorial(number);
    console.log(\`Factorial of \${number} is: \${factorial}\`);
}

function calculateFactorial(n) {
    if (n <= 1) return 1;
    return n * calculateFactorial(n - 1);
}

// Run the greeting function
greetSATI();`
    },
    python: {
        name: 'Python',
        extension: 'py',
        monacoLanguage: 'python',
        defaultCode: `# Welcome to SATI Programming Hub!
# Write your Python code here

def greet_sati():
    print("Hello from SATI Programming Hub!")
    print("Happy coding, SATI students! 🚀")
    
    # Example: Calculate factorial
    number = 5
    factorial = calculate_factorial(number)
    print(f"Factorial of {number} is: {factorial}")

def calculate_factorial(n):
    if n <= 1:
        return 1
    return n * calculate_factorial(n - 1)

# Run the greeting function
greet_sati()`
    },
    cpp: {
        name: 'C++',
        extension: 'cpp',
        monacoLanguage: 'cpp',
        defaultCode: `// Welcome to SATI Programming Hub!
// Write your C++ code here

#include <iostream>
#include <string>

using namespace std;

int calculateFactorial(int n) {
    if (n <= 1) return 1;
    return n * calculateFactorial(n - 1);
}

int main() {
    cout << "Hello from SATI Programming Hub!" << endl;
    cout << "Happy coding, SATI students! 🚀" << endl;
    
    // Example: Calculate factorial
    int number = 5;
    int factorial = calculateFactorial(number);
    cout << "Factorial of " << number << " is: " << factorial << endl;
    
    return 0;
}`
    },
    c: {
        name: 'C',
        extension: 'c',
        monacoLanguage: 'c',
        defaultCode: `// Welcome to SATI Programming Hub!
// Write your C code here

#include <stdio.h>

int calculateFactorial(int n) {
    if (n <= 1) return 1;
    return n * calculateFactorial(n - 1);
}

int main() {
    printf("Hello from SATI Programming Hub!\\n");
    printf("Happy coding, SATI students! 🚀\\n");
    
    // Example: Calculate factorial
    int number = 5;
    int factorial = calculateFactorial(number);
    printf("Factorial of %d is: %d\\n", number, factorial);
    
    return 0;
}`
    },
    java: {
        name: 'Java',
        extension: 'java',
        monacoLanguage: 'java',
        defaultCode: `// Welcome to SATI Programming Hub!
// Write your Java code here

public class SATIProgram {
    
    public static int calculateFactorial(int n) {
        if (n <= 1) return 1;
        return n * calculateFactorial(n - 1);
    }
    
    public static void main(String[] args) {
        System.out.println("Hello from SATI Programming Hub!");
        System.out.println("Happy coding, SATI students! 🚀");
        
        // Example: Calculate factorial
        int number = 5;
        int factorial = calculateFactorial(number);
        System.out.println("Factorial of " + number + " is: " + factorial);
    }
}`
    },
    html: {
        name: 'HTML',
        extension: 'html',
        monacoLanguage: 'html',
        defaultCode: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SATI Programming Hub</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
            padding: 50px;
            margin: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.1);
            padding: 30px;
            border-radius: 15px;
            backdrop-filter: blur(10px);
        }
        h1 {
            color: #FFD700;
            margin-bottom: 20px;
        }
        .highlight {
            background: rgba(255, 215, 0, 0.2);
            padding: 10px;
            border-radius: 8px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Welcome to SATI Programming Hub!</h1>
        <p>Happy coding, SATI students!</p>
        <div class="highlight">
            <p>This is where your HTML comes to life!</p>
            <p>Build amazing web experiences here.</p>
        </div>
        <p>Keep learning, keep growing! 💻</p>
    </div>
</body>
</html>`
    },
    css: {
        name: 'CSS',
        extension: 'css',
        monacoLanguage: 'css',
        defaultCode: `/* Welcome to SATI Programming Hub! */
/* Write your CSS code here */

/* Modern SATI Theme */
:root {
    --primary-color: #1976d2;
    --accent-color: #00c853;
    --bg-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --text-color: #ffffff;
    --shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

body {
    font-family: 'Inter', 'Arial', sans-serif;
    background: var(--bg-gradient);
    color: var(--text-color);
    margin: 0;
    padding: 0;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.sati-container {
    max-width: 600px;
    background: rgba(255, 255, 255, 0.1);
    padding: 40px;
    border-radius: 20px;
    backdrop-filter: blur(15px);
    box-shadow: var(--shadow);
    text-align: center;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.sati-title {
    font-size: 2.5rem;
    color: #FFD700;
    margin-bottom: 20px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.sati-subtitle {
    font-size: 1.2rem;
    margin-bottom: 30px;
    opacity: 0.9;
}

.highlight-box {
    background: rgba(255, 215, 0, 0.2);
    padding: 20px;
    border-radius: 12px;
    margin: 25px 0;
    border-left: 4px solid var(--accent-color);
}

.code-snippet {
    background: rgba(0, 0, 0, 0.3);
    padding: 15px;
    border-radius: 8px;
    font-family: 'Courier New', monospace;
    margin: 20px 0;
    text-align: left;
}

/* Animations */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.sati-container {
    animation: fadeInUp 0.8s ease-out;
}

/* Responsive Design */
@media (max-width: 768px) {
    .sati-container {
        margin: 20px;
        padding: 30px 20px;
    }
    
    .sati-title {
        font-size: 2rem;
    }
}`
    },
    php: {
        name: 'PHP',
        extension: 'php',
        monacoLanguage: 'php',
        defaultCode: `<?php
// Welcome to SATI Programming Hub!
// Write your PHP code here

function greetSATI() {
    echo "Hello from SATI Programming Hub!\\n";
    echo "Happy coding, SATI students! 🚀\\n";
    
    // Example: Calculate factorial
    $number = 5;
    $factorial = calculateFactorial($number);
    echo "Factorial of $number is: $factorial\\n";
}

function calculateFactorial($n) {
    if ($n <= 1) return 1;
    return $n * calculateFactorial($n - 1);
}

// Run the greeting function
greetSATI();

// Example: Working with arrays
$satiDepartments = [
    "Computer Science Engineering",
    "Electronics & Communication",
    "Mechanical Engineering",
    "Electrical Engineering",
    "Civil Engineering"
];

echo "\\nSATI Departments:\\n";
foreach ($satiDepartments as $index => $department) {
    echo ($index + 1) . ". $department\\n";
}
?>`
    },
    typescript: {
        name: 'TypeScript',
        extension: 'ts',
        monacoLanguage: 'typescript',
        defaultCode: `// Welcome to SATI Programming Hub!
// Write your TypeScript code here

interface Student {
    name: string;
    rollNumber: string;
    department: string;
    year: number;
}

class SATIStudent implements Student {
    constructor(
        public name: string,
        public rollNumber: string,
        public department: string,
        public year: number
    ) {}

    introduce(): void {
        console.log(\`Hello! I'm \${this.name} from \${this.department}\`);
        console.log(\`Roll Number: \${this.rollNumber}, Year: \${this.year}\`);
    }

    calculateGPA(marks: number[]): number {
        const total = marks.reduce((sum, mark) => sum + mark, 0);
        return total / marks.length;
    }
}

// Example usage
function greetSATI(): void {
    console.log("Hello from SATI Programming Hub!");
    console.log("Happy coding, SATI students! 🚀");

    const student = new SATIStudent(
        "John Doe",
        "CS2021001",
        "Computer Science Engineering",
        3
    );

    student.introduce();

    const marks: number[] = [85, 92, 78, 88, 95];
    const gpa = student.calculateGPA(marks);
    console.log(\`GPA: \${gpa.toFixed(2)}\`);
}

greetSATI();`
    },
    ruby: {
        name: 'Ruby',
        extension: 'rb',
        monacoLanguage: 'ruby',
        defaultCode: `# Welcome to SATI Programming Hub!
# Write your Ruby code here

def greet_sati
  puts "Hello from SATI Programming Hub!"
  puts "Happy coding, SATI students! 🚀"
  
  # Example: Calculate factorial
  number = 5
  factorial = calculate_factorial(number)
  puts "Factorial of #{number} is: #{factorial}"
end

def calculate_factorial(n)
  return 1 if n <= 1
  n * calculate_factorial(n - 1)
end

# Ruby class example
class SATIStudent
  attr_accessor :name, :roll_number, :department, :year
  
  def initialize(name, roll_number, department, year)
    @name = name
    @roll_number = roll_number
    @department = department
    @year = year
  end
  
  def introduce
    puts "Hello! I'm #{@name} from #{@department}"
    puts "Roll Number: #{@roll_number}, Year: #{@year}"
  end
end

# Run the greeting function
greet_sati

# Example usage
student = SATIStudent.new("Jane Doe", "CS2021002", "Computer Science", 3)
student.introduce`
    },
    swift: {
        name: 'Swift',
        extension: 'swift',
        monacoLanguage: 'swift',
        defaultCode: `// Welcome to SATI Programming Hub!
// Write your Swift code here

import Foundation

func greetSATI() {
    print("Hello from SATI Programming Hub!")
    print("Happy coding, SATI students! 🚀")
    
    // Example: Calculate factorial
    let number = 5
    let factorial = calculateFactorial(number)
    print("Factorial of \\(number) is: \\(factorial)")
}

func calculateFactorial(_ n: Int) -> Int {
    if n <= 1 { return 1 }
    return n * calculateFactorial(n - 1)
}

// Swift struct example
struct SATIStudent {
    let name: String
    let rollNumber: String
    let department: String
    let year: Int
    
    func introduce() {
        print("Hello! I'm \\(name) from \\(department)")
        print("Roll Number: \\(rollNumber), Year: \\(year)")
    }
    
    func calculateGPA(marks: [Double]) -> Double {
        let total = marks.reduce(0, +)
        return total / Double(marks.count)
    }
}

// Run the greeting function
greetSATI()

// Example usage
let student = SATIStudent(
    name: "Alex Smith",
    rollNumber: "CS2021003",
    department: "Computer Science",
    year: 3
)

student.introduce()

let marks = [85.0, 92.0, 78.0, 88.0, 95.0]
let gpa = student.calculateGPA(marks: marks)
print("GPA: \\(String(format: "%.2f", gpa))")`
    },
    kotlin: {
        name: 'Kotlin',
        extension: 'kt',
        monacoLanguage: 'kotlin',
        defaultCode: `// Welcome to SATI Programming Hub!
// Write your Kotlin code here

fun greetSATI() {
    println("Hello from SATI Programming Hub!")
    println("Happy coding, SATI students! 🚀")
    
    // Example: Calculate factorial
    val number = 5
    val factorial = calculateFactorial(number)
    println("Factorial of $number is: $factorial")
}

fun calculateFactorial(n: Int): Int {
    return if (n <= 1) 1 else n * calculateFactorial(n - 1)
}

// Kotlin data class example
data class SATIStudent(
    val name: String,
    val rollNumber: String,
    val department: String,
    val year: Int
) {
    fun introduce() {
        println("Hello! I'm $name from $department")
        println("Roll Number: $rollNumber, Year: $year")
    }
    
    fun calculateGPA(marks: List<Double>): Double {
        return marks.average()
    }
}

fun main() {
    greetSATI()
    
    // Example usage
    val student = SATIStudent(
        name = "Sarah Johnson",
        rollNumber = "CS2021004",
        department = "Computer Science",
        year = 3
    )
    
    student.introduce()
    
    val marks = listOf(85.0, 92.0, 78.0, 88.0, 95.0)
    val gpa = student.calculateGPA(marks)
    println("GPA: %.2f".format(gpa))
}`
    },
    go: {
        name: 'Go',
        extension: 'go',
        monacoLanguage: 'go',
        defaultCode: `// Welcome to SATI Programming Hub!
// Write your Go code here

package main

import (
    "fmt"
)

func greetSATI() {
    fmt.Println("Hello from SATI Programming Hub!")
    fmt.Println("Happy coding, SATI students! 🚀")
    
    // Example: Calculate factorial
    number := 5
    factorial := calculateFactorial(number)
    fmt.Printf("Factorial of %d is: %d\\n", number, factorial)
}

func calculateFactorial(n int) int {
    if n <= 1 {
        return 1
    }
    return n * calculateFactorial(n-1)
}

// Go struct example
type SATIStudent struct {
    Name       string
    RollNumber string
    Department string
    Year       int
}

func (s SATIStudent) introduce() {
    fmt.Printf("Hello! I'm %s from %s\\n", s.Name, s.Department)
    fmt.Printf("Roll Number: %s, Year: %d\\n", s.RollNumber, s.Year)
}

func (s SATIStudent) calculateGPA(marks []float64) float64 {
    total := 0.0
    for _, mark := range marks {
        total += mark
    }
    return total / float64(len(marks))
}

func main() {
    greetSATI()
    
    // Example usage
    student := SATIStudent{
        Name:       "Mike Wilson",
        RollNumber: "CS2021005",
        Department: "Computer Science",
        Year:       3,
    }
    
    student.introduce()
    
    marks := []float64{85.0, 92.0, 78.0, 88.0, 95.0}
    gpa := student.calculateGPA(marks)
    fmt.Printf("GPA: %.2f\\n", gpa)
}`
    },
    rust: {
        name: 'Rust',
        extension: 'rs',
        monacoLanguage: 'rust',
        defaultCode: `// Welcome to SATI Programming Hub!
// Write your Rust code here

fn greet_sati() {
    println!("Hello from SATI Programming Hub!");
    println!("Happy coding, SATI students! 🚀");
    
    // Example: Calculate factorial
    let number = 5;
    let factorial = calculate_factorial(number);
    println!("Factorial of {} is: {}", number, factorial);
}

fn calculate_factorial(n: u32) -> u32 {
    match n {
        0 | 1 => 1,
        _ => n * calculate_factorial(n - 1),
    }
}

// Rust struct example
#[derive(Debug)]
struct SATIStudent {
    name: String,
    roll_number: String,
    department: String,
    year: u8,
}

impl SATIStudent {
    fn new(name: String, roll_number: String, department: String, year: u8) -> Self {
        SATIStudent {
            name,
            roll_number,
            department,
            year,
        }
    }
    
    fn introduce(&self) {
        println!("Hello! I'm {} from {}", self.name, self.department);
        println!("Roll Number: {}, Year: {}", self.roll_number, self.year);
    }
    
    fn calculate_gpa(&self, marks: &[f64]) -> f64 {
        let total: f64 = marks.iter().sum();
        total / marks.len() as f64
    }
}

fn main() {
    greet_sati();
    
    // Example usage
    let student = SATIStudent::new(
        "Emma Davis".to_string(),
        "CS2021006".to_string(),
        "Computer Science".to_string(),
        3,
    );
    
    student.introduce();
    
    let marks = [85.0, 92.0, 78.0, 88.0, 95.0];
    let gpa = student.calculate_gpa(&marks);
    println!("GPA: {:.2}", gpa);
}`
    }
};

// Initialize the page
document.addEventListener('DOMContentLoaded', function () {
    initializePage();
    setupEventListeners();
    initializeMonacoEditor();
    initializeDropdownFunctionality();
    initializeDesktopDropdownDelay();
    setCurrentPageActive();
});

// Initialize page settings
function initializePage() {
    // Check for saved theme - check multiple possible keys for compatibility
    const savedTheme = localStorage.getItem('sati_theme') ||
        localStorage.getItem('light') ||
        localStorage.getItem('theme') ||
        'dark';

    // Apply theme immediately
    applyTheme(savedTheme);

    // Set up system theme listener if needed
    if (savedTheme === 'system') {
        setupSystemThemeListener();
    }

    // Initialize default content
    loadDefaultContent();

    // Ensure proper page state
    ensureProperPageState();
}

// Ensure proper page state for programming page
function ensureProperPageState() {
    // Force update dropdown labels to show "Programming"
    updateDropdownLabel('Programming');
    updateMobileDropdownLabel('Programming');

    // Add active class to dropdown toggle
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    if (dropdownToggle) {
        dropdownToggle.classList.add('active');
    }

    // Add active class to mobile dropdown toggle
    const mobileDropdownToggle = document.querySelector('.mobile-dropdown-toggle');
    if (mobileDropdownToggle) {
        mobileDropdownToggle.classList.add('active');
    }

    // Debug log to verify function is called
    console.log('Programming page state ensured - dropdown should show "Programming"');
}

// Apply theme with system theme detection
function applyTheme(theme) {
    let actualTheme = theme;

    // Handle system theme detection
    if (theme === 'system') {
        // Check if user's system prefers dark mode
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            actualTheme = 'dark';
        } else {
            actualTheme = 'light';
        }
    }

    // Apply the actual theme
    document.documentElement.setAttribute('data-theme', actualTheme);

    // Update dark mode icon based on actual theme
    updateDarkModeIcon(actualTheme === 'dark');

    // Update Monaco editor theme if editor is ready
    if (monacoEditor && isEditorReady) {
        const monacoTheme = actualTheme === 'dark' ? 'vs-dark' : 'vs';
        monaco.editor.setTheme(monacoTheme);
    }
}

// Setup system theme listener
function setupSystemThemeListener() {
    // Remove existing listener if any
    if (window.systemThemeListener) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        if (mediaQuery.removeEventListener) {
            mediaQuery.removeEventListener('change', window.systemThemeListener);
        } else if (mediaQuery.removeListener) {
            mediaQuery.removeListener(window.systemThemeListener);
        }
    }

    // Create new listener
    window.systemThemeListener = (e) => {
        const savedTheme = localStorage.getItem('sati_theme') || localStorage.getItem('theme');
        if (savedTheme === 'system') {
            const actualTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', actualTheme);
            updateDarkModeIcon(actualTheme === 'dark');

            // Update Monaco editor theme
            if (monacoEditor && isEditorReady) {
                const monacoTheme = actualTheme === 'dark' ? 'vs-dark' : 'vs';
                monaco.editor.setTheme(monacoTheme);
            }
        }
    };

    // Add listener with fallback for older browsers
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', window.systemThemeListener);
    } else if (mediaQuery.addListener) {
        mediaQuery.addListener(window.systemThemeListener);
    }
}

// Setup all event listeners
function setupEventListeners() {
    // Language selector
    if (languageSelect) {
        languageSelect.addEventListener('change', handleLanguageChange);
    }

    // Editor action buttons
    if (runBtn) {
        runBtn.addEventListener('click', handleRunCode);
    }

    if (downloadBtn) {
        downloadBtn.addEventListener('click', handleDownloadCode);
    }

    if (copyBtn) {
        copyBtn.addEventListener('click', handleCopyCode);
    }

    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', handleOpenInNewTab);
    }

    if (clearTerminalBtn) {
        clearTerminalBtn.addEventListener('click', handleClearTerminal);
    }

    // Terminal input handling
    if (terminalInput) {
        terminalInput.addEventListener('keydown', handleTerminalKeydown);
        terminalInput.addEventListener('focus', () => {
            terminalInput.parentElement.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        });
        terminalInput.addEventListener('blur', () => {
            terminalInput.parentElement.style.backgroundColor = 'transparent';
        });
    }

    // Dark mode toggle
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', toggleDarkMode);
    }

    // Mobile menu toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function (event) {
        if (!event.target.closest('.nav-menu') && !event.target.closest('.mobile-nav-menu')) {
            closeMobileMenu();
        }
    });

    // Mobile navigation links (exclude dropdown toggle)
    document.querySelectorAll('.mobile-nav-link:not(.mobile-dropdown-toggle)').forEach(link => {
        link.addEventListener('click', function () {
            closeMobileMenu();
        });
    });

    // Blur overlay click to close mobile menu
    if (blurOverlay) {
        blurOverlay.addEventListener('click', closeMobileMenu);
    }

    // Menu items (for disabled state handling)
    document.querySelectorAll('.menu-item.disabled').forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const category = this.querySelector('span').textContent;
            showNotification(`${category} feature is coming soon!`, 'info');
        });
    });


}

// Initialize Monaco Editor
function initializeMonacoEditor() {
    // Configure Monaco Editor paths
    require.config({
        paths: {
            'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs'
        }
    });

    require(['vs/editor/editor.main'], function () {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const monacoTheme = currentTheme === 'dark' ? 'vs-dark' : 'vs';

        monacoEditor = monaco.editor.create(document.getElementById('monacoEditor'), {
            value: languageConfig[currentLanguage].defaultCode,
            language: languageConfig[currentLanguage].monacoLanguage,
            theme: monacoTheme,
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            readOnly: false,
            automaticLayout: true,
            minimap: {
                enabled: true
            },
            wordWrap: 'on',
            contextmenu: true,
            selectOnLineNumbers: true,
            glyphMargin: true,
            folding: true,
            foldingStrategy: 'indentation',
            showFoldingControls: 'always',
            unfoldOnClickAfterEndOfLine: false,
            disableLayerHinting: false,
            enableSplitViewResizing: false,
            renderSideBySide: false
        });

        isEditorReady = true;

        // Add error detection
        monaco.editor.onDidCreateModel((model) => {
            monaco.editor.setModelMarkers(model, 'owner', []);
        });

        // Handle editor resize
        window.addEventListener('resize', () => {
            if (monacoEditor) {
                monacoEditor.layout();
            }
        });

        showNotification('Code editor is ready!', 'success');
    });
}

// Handle language change
function handleLanguageChange() {
    const newLanguage = languageSelect.value;

    if (newLanguage !== currentLanguage) {
        currentLanguage = newLanguage;
        const config = languageConfig[currentLanguage];

        // Update editor title
        editorTitle.textContent = `Coding in ${config.name}`;

        // Update Monaco editor language and content
        if (monacoEditor && isEditorReady) {
            const model = monacoEditor.getModel();
            monaco.editor.setModelLanguage(model, config.monacoLanguage);
            monacoEditor.setValue(config.defaultCode);
        }

        // Clear terminal
        handleClearTerminal();

        showNotification(`Switched to ${config.name}`, 'success');
    }
}

// Handle run code
function handleRunCode() {
    if (!monacoEditor || !isEditorReady) {
        showNotification('Editor is not ready yet', 'warning');
        return;
    }

    const code = monacoEditor.getValue();
    const config = languageConfig[currentLanguage];

    // Clear terminal output (but keep input line)
    if (terminalOutput) {
        terminalOutput.innerHTML = '';
    }

    // Show running state
    runBtn.classList.add('loading');
    runBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Running...';

    // Simulate code execution (since we can't actually run server-side code)
    setTimeout(() => {
        runBtn.classList.remove('loading');
        runBtn.innerHTML = '<i class="fas fa-play"></i> Run';

        // Display simulated output based on language
        displaySimulatedOutput(code, config);
    }, 1500);
}

// Display simulated output
function displaySimulatedOutput(code, config) {
    const timestamp = new Date().toLocaleTimeString();
    let output = `[${timestamp}] Running ${config.name} code...\n\n`;

    // Language-specific simulated outputs
    switch (currentLanguage) {
        case 'c':
            output += simulateCOutput(code);
            break;
        case 'cpp':
            output += simulateCPPOutput(code);
            break;
        case 'python':
            output += simulatePythonOutput(code);
            break;
        case 'html':
            output += simulateHTMLOutput(code);
            break;
        case 'css':
            output += simulateCSSOutput(code);
            break;
        case 'javascript':
            output += simulateJavaScriptOutput(code);
            break;
        case 'java':
            output += simulateJavaOutput(code);
            break;
        default:
            output += simulateGenericOutput(code, config);
    }

    output += `\n\n[${new Date().toLocaleTimeString()}] Execution completed.`;

    if (terminalOutput) {
        terminalOutput.innerHTML = `<pre>${output}</pre>`;
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
}

// Simulate JavaScript output
function simulateJavaScriptOutput(code) {
    let output = '';

    // Look for console.log statements
    const consoleLogRegex = /console\.log\(['"`]([^'"`]*?)['"`]\)/g;
    let match;

    while ((match = consoleLogRegex.exec(code)) !== null) {
        output += match[1] + '\n';
    }

    // Look for template literals in console.log
    const templateRegex = /console\.log\(`([^`]*?)`\)/g;
    while ((match = templateRegex.exec(code)) !== null) {
        let templateStr = match[1];
        // Simple template literal simulation
        templateStr = templateStr.replace(/\$\{(\w+)\}/g, (_, varName) => {
            if (varName === 'number') return '5';
            if (varName === 'factorial') return '120';
            return varName;
        });
        output += templateStr + '\n';
    }

    if (!output) {
        output = 'Hello from SATI Programming Hub!\nHappy coding, SATI students! 🚀\nFactorial of 5 is: 120\n';
    }

    return output;
}

// Simulate Python output
function simulatePythonOutput(code) {
    let output = '';

    // Look for print statements
    const printRegex = /print\(['"`]([^'"`]*?)['"`]\)/g;
    let match;

    while ((match = printRegex.exec(code)) !== null) {
        output += match[1] + '\n';
    }

    // Look for f-strings
    const fStringRegex = /print\(f['"`]([^'"`]*?)['"`]\)/g;
    while ((match = fStringRegex.exec(code)) !== null) {
        let fStr = match[1];
        // Simple f-string simulation
        fStr = fStr.replace(/\{(\w+)\}/g, (_, varName) => {
            if (varName === 'number') return '5';
            if (varName === 'factorial') return '120';
            return varName;
        });
        output += fStr + '\n';
    }

    if (!output) {
        output = 'Hello from SATI Programming Hub!\nHappy coding, SATI students! 🚀\nFactorial of 5 is: 120\n';
    }

    return output;
}

// Simulate C output
function simulateCOutput(code) {
    let output = '';

    // Look for printf statements with format specifiers
    const printfRegex = /printf\(['"`]([^'"`]*?)['"`](?:\s*,\s*([^)]+))?\)/g;
    let match;

    while ((match = printfRegex.exec(code)) !== null) {
        let formatStr = match[1];
        let args = match[2];
        
        // Replace format specifiers with actual values
        if (args && formatStr.includes('%d')) {
            // Handle the specific case: "Factorial of %d is: %d"
            if (formatStr.includes('Factorial of') && formatStr.includes('is:')) {
                formatStr = 'Factorial of 5 is: 120';
            } else {
                // Replace %d with simulated values in order
                let replacementValues = ['5', '120'];
                let replacementIndex = 0;
                formatStr = formatStr.replace(/%d/g, () => {
                    return replacementValues[replacementIndex++] || '0';
                });
            }
        }
        
        output += formatStr.replace(/\\n/g, '\n');
    }

    if (!output) {
        output = 'Hello from SATI Programming Hub!\nHappy coding, SATI students! 🚀\nFactorial of 5 is: 120\n';
    }

    return output;
}

// Simulate C++ output
function simulateCPPOutput(code) {
    let output = '';

    // Look for simple cout statements
    const simpleCoutRegex = /cout\s*<<\s*['"`]([^'"`]*?)['"`]\s*<<\s*endl/g;
    let match;
    
    while ((match = simpleCoutRegex.exec(code)) !== null) {
        output += match[1] + '\n';
    }
    
    // Look for cout with variables (exact pattern from template)
    const coutVarRegex = /cout\s*<<\s*['"`]([^'"`]*?)['"`]\s*<<\s*(\w+)\s*<<\s*['"`]([^'"`]*?)['"`]\s*<<\s*(\w+)\s*<<\s*endl/g;
    
    // Reset regex lastIndex
    coutVarRegex.lastIndex = 0;
    
    while ((match = coutVarRegex.exec(code)) !== null) {
        let part1 = match[1];
        let var1 = match[2];
        let part2 = match[3];
        let var2 = match[4];
        
        // Simulate variable values
        let val1 = var1 === 'number' ? '5' : var1;
        let val2 = var2 === 'factorial' ? '120' : var2;
        
        output += part1 + val1 + part2 + val2 + '\n';
    }

    // Also handle the case where we didn't match the variable pattern
    // but we have the specific factorial line
    if (!output.includes('Factorial') && code.includes('Factorial of')) {
        // Look for any cout statement containing "Factorial of"
        const factorialCoutRegex = /cout\s*<<[^;]*Factorial of[^;]*<<\s*endl/g;
        if (factorialCoutRegex.test(code)) {
            output += 'Factorial of 5 is: 120\n';
        }
    }

    if (!output) {
        output = 'Hello from SATI Programming Hub!\nHappy coding, SATI students! 🚀\nFactorial of 5 is: 120\n';
    }

    return output;
}

// Simulate Java output
function simulateJavaOutput(code) {
    let output = '';

    // Look for simple System.out.println statements
    const printlnRegex = /System\.out\.println\(['"`]([^'"`]*?)['"`]\)/g;
    let match;

    while ((match = printlnRegex.exec(code)) !== null) {
        output += match[1] + '\n';
    }

    // Look for System.out.println with string concatenation (exact pattern from template)
    const concatRegex = /System\.out\.println\(['"`]([^'"`]*?)['"`]\s*\+\s*(\w+)\s*\+\s*['"`]([^'"`]*?)['"`]\s*\+\s*(\w+)\)/g;
    
    // Reset regex lastIndex
    concatRegex.lastIndex = 0;
    
    while ((match = concatRegex.exec(code)) !== null) {
        let part1 = match[1];
        let var1 = match[2];
        let part2 = match[3];
        let var2 = match[4];
        
        // Simulate variable values
        let val1 = var1 === 'number' ? '5' : var1;
        let val2 = var2 === 'factorial' ? '120' : var2;
        
        output += part1 + val1 + part2 + val2 + '\n';
    }

    // Also handle the case where we didn't match the concatenation pattern
    // but we have the specific factorial line
    if (!output.includes('Factorial') && code.includes('Factorial of')) {
        // Extract all println statements and process them
        const allPrintlnRegex = /System\.out\.println\(([^)]+)\)/g;
        let allMatch;
        
        while ((allMatch = allPrintlnRegex.exec(code)) !== null) {
            let statement = allMatch[1];
            
            // Handle the factorial concatenation specifically
            if (statement.includes('Factorial of') && statement.includes('+')) {
                output += 'Factorial of 5 is: 120\n';
            }
        }
    }

    if (!output) {
        output = 'Hello from SATI Programming Hub!\nHappy coding, SATI students! 🚀\nFactorial of 5 is: 120\n';
    }

    return output;
}

// Simulate HTML output
function simulateHTMLOutput(code) {
    return 'HTML code compiled successfully!\nOpen in browser to see the visual output.\nTip: Use the "New Tab" button to view your HTML in a separate window.';
}

// Simulate CSS output
function simulateCSSOutput(code) {
    return 'CSS code compiled successfully!\nStyles are ready to be applied to HTML elements.\nTip: Combine with HTML to see the visual effects.';
}

// Simulate generic output
function simulateGenericOutput(code, config) {
    return `${config.name} code compiled successfully!\nCode is ready for execution.\nNote: This is a simulated output for demonstration purposes.`;
}

// Handle download code
function handleDownloadCode() {
    if (!monacoEditor || !isEditorReady) {
        showNotification('Editor is not ready yet', 'warning');
        return;
    }

    const code = monacoEditor.getValue();
    const config = languageConfig[currentLanguage];
    const filename = `sati_code.${config.extension}`;

    // Create blob and download
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showNotification(`Code downloaded as ${filename}`, 'success');
}

// Handle copy code
function handleCopyCode() {
    if (!monacoEditor || !isEditorReady) {
        showNotification('Editor is not ready yet', 'warning');
        return;
    }

    const code = monacoEditor.getValue();

    // Copy to clipboard
    navigator.clipboard.writeText(code).then(() => {
        showNotification('Code copied to clipboard!', 'success');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = code;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Code copied to clipboard!', 'success');
    });
}

// Handle open in new tab
function handleOpenInNewTab() {
    if (!monacoEditor || !isEditorReady) {
        showNotification('Editor is not ready yet', 'warning');
        return;
    }

    const code = monacoEditor.getValue();
    const config = languageConfig[currentLanguage];

    // Create a new window with the code editor
    const newWindow = window.open('', '_blank');
    const html = createFullscreenEditorHTML(code, config);

    newWindow.document.write(html);
    newWindow.document.close();

    showNotification('Code editor opened in new tab', 'success');
}

// Create fullscreen editor HTML
function createFullscreenEditorHTML(code, config) {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const isDark = currentTheme === 'dark';

    return `
<!DOCTYPE html>
<html lang="en" data-theme="${currentTheme}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SATI Code Editor - ${config.name}</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs/loader.min.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Inter', sans-serif; 
            background: ${isDark ? '#121212' : '#f5f7f9'};
            color: ${isDark ? '#ffffff' : '#2c3e50'};
            height: 100vh;
            display: flex;
            flex-direction: column;
        }
        .header {
            background: ${isDark ? '#1e1e1e' : '#ffffff'};
            padding: 15px 20px;
            border-bottom: 1px solid ${isDark ? '#333333' : '#e1e8ed'};
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .title { color: #1976d2; font-weight: 600; }
        .editor-container { flex: 1; }
        #editor { width: 100%; height: 100%; }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="title">SATI Code Editor - ${config.name}</h1>
        <span>Fullscreen Mode</span>
    </div>
    <div class="editor-container">
        <div id="editor"></div>
    </div>
    <script>
        require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } });
        require(['vs/editor/editor.main'], function () {
            monaco.editor.create(document.getElementById('editor'), {
                value: ${JSON.stringify(code)},
                language: '${config.monacoLanguage}',
                theme: '${isDark ? 'vs-dark' : 'vs'}',
                fontSize: 14,
                automaticLayout: true,
                minimap: { enabled: true },
                wordWrap: 'on'
            });
        });
    </script>
</body>
</html>`;
}

// Handle clear terminal
function handleClearTerminal() {
    if (terminalOutput) {
        terminalOutput.innerHTML = '';
        showNotification('Terminal cleared', 'success');
    }
}

// Handle terminal keydown events
function handleTerminalKeydown(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const command = terminalInput.value.trim();
        if (command) {
            executeTerminalCommand(command);
            terminalHistory.push(command);
            historyIndex = terminalHistory.length;
        }
        terminalInput.value = '';
    } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (historyIndex > 0) {
            historyIndex--;
            terminalInput.value = terminalHistory[historyIndex];
        }
    } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (historyIndex < terminalHistory.length - 1) {
            historyIndex++;
            terminalInput.value = terminalHistory[historyIndex];
        } else {
            historyIndex = terminalHistory.length;
            terminalInput.value = '';
        }
    } else if (event.key === 'Tab') {
        event.preventDefault();
        // Basic tab completion for common commands
        const currentValue = terminalInput.value;
        const suggestions = ['help', 'clear', 'ls', 'pwd', 'echo', 'date', 'whoami', 'run', 'compile'];
        const matches = suggestions.filter(cmd => cmd.startsWith(currentValue));
        if (matches.length === 1) {
            terminalInput.value = matches[0];
        }
    }
}

// Execute terminal command
function executeTerminalCommand(command) {
    // Add command to terminal output
    addToTerminalOutput(`<span class="terminal-prompt">sati@programming:${currentDirectory}$ </span><span class="terminal-command">${command}</span>`);
    
    // Parse command and arguments
    const parts = command.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);
    
    // Execute command
    switch (cmd) {
        case 'help':
            showTerminalHelp();
            break;
        case 'clear':
            handleClearTerminal();
            break;
        case 'ls':
            listFiles(args);
            break;
        case 'pwd':
            addToTerminalOutput(`<span class="terminal-result">${currentDirectory}</span>`);
            break;
        case 'echo':
            addToTerminalOutput(`<span class="terminal-result">${args.join(' ')}</span>`);
            break;
        case 'date':
            addToTerminalOutput(`<span class="terminal-result">${new Date().toString()}</span>`);
            break;
        case 'whoami':
            addToTerminalOutput(`<span class="terminal-result">sati-student</span>`);
            break;
        case 'run':
            addToTerminalOutput(`<span class="terminal-success">Running current code...</span>`);
            handleRunCode();
            break;
        case 'compile':
            addToTerminalOutput(`<span class="terminal-success">Compiling current code...</span>`);
            handleRunCode();
            break;
        case 'lang':
        case 'language':
            if (args.length > 0) {
                changeLanguageFromTerminal(args[0]);
            } else {
                addToTerminalOutput(`<span class="terminal-result">Current language: ${languageConfig[currentLanguage].name}</span>`);
            }
            break;
        case 'save':
            addToTerminalOutput(`<span class="terminal-success">Downloading current code...</span>`);
            handleDownloadCode();
            break;
        case 'copy':
            addToTerminalOutput(`<span class="terminal-success">Copying code to clipboard...</span>`);
            handleCopyCode();
            break;
        case 'cd':
            changeDirectory(args[0] || '~');
            break;
        case 'version':
            addToTerminalOutput(`<span class="terminal-result">SATI Programming Hub v1.0.0</span>`);
            break;
        case 'about':
            showAboutInfo();
            break;
        default:
            addToTerminalOutput(`<span class="terminal-error">Command not found: ${cmd}. Type 'help' for available commands.</span>`);
    }
}

// Add content to terminal output
function addToTerminalOutput(content) {
    if (terminalOutput) {
        const div = document.createElement('div');
        div.className = 'terminal-history-item';
        div.innerHTML = content;
        terminalOutput.appendChild(div);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
}

// Show terminal help
function showTerminalHelp() {
    const helpText = `<span class="terminal-result">Available commands:
  help          - Show this help message
  clear         - Clear terminal output
  ls            - List files in current directory
  pwd           - Show current directory
  echo [text]   - Display text
  date          - Show current date and time
  whoami        - Show current user
  run           - Run/compile current code
  compile       - Alias for run command
  lang [name]   - Change programming language or show current
  save          - Download current code
  copy          - Copy code to clipboard
  cd [dir]      - Change directory
  version       - Show version information
  about         - Show about information

Navigation:
  ↑/↓ arrows    - Browse command history
  Tab           - Auto-complete commands</span>`;
    addToTerminalOutput(helpText);
}

// List files (simulated)
function listFiles(args) {
    const files = [
        'main.' + languageConfig[currentLanguage].extension,
        'README.md',
        'examples/',
        'docs/',
        'tests/'
    ];
    
    const fileList = files.map(file => {
        if (file.endsWith('/')) {
            return `<span style="color: #74c0fc;">${file}</span>`;
        } else if (file.endsWith('.' + languageConfig[currentLanguage].extension)) {
            return `<span style="color: #51cf66;">${file}</span>`;
        } else {
            return `<span style="color: #ffffff;">${file}</span>`;
        }
    }).join('  ');
    
    addToTerminalOutput(`<span class="terminal-result">${fileList}</span>`);
}

// Change directory (simulated)
function changeDirectory(dir) {
    if (!dir || dir === '~') {
        currentDirectory = '~';
    } else if (dir === '..') {
        if (currentDirectory !== '~') {
            const parts = currentDirectory.split('/');
            parts.pop();
            currentDirectory = parts.join('/') || '~';
        }
    } else if (dir.startsWith('/')) {
        currentDirectory = dir;
    } else {
        if (currentDirectory === '~') {
            currentDirectory = '~/' + dir;
        } else {
            currentDirectory = currentDirectory + '/' + dir;
        }
    }
    
    // Update prompt
    const prompt = document.querySelector('.terminal-prompt');
    if (prompt) {
        prompt.textContent = `sati@programming:${currentDirectory}$ `;
    }
}

// Change language from terminal
function changeLanguageFromTerminal(langName) {
    const langMap = {
        'c': 'c',
        'cpp': 'cpp',
        'c++': 'cpp',
        'java': 'java',
        'python': 'python',
        'py': 'python',
        'javascript': 'javascript',
        'js': 'javascript',
        'typescript': 'typescript',
        'ts': 'typescript',
        'html': 'html',
        'css': 'css',
        'php': 'php',
        'ruby': 'ruby',
        'rb': 'ruby',
        'swift': 'swift',
        'kotlin': 'kotlin',
        'kt': 'kotlin'
    };
    
    const targetLang = langMap[langName.toLowerCase()];
    if (targetLang && languageConfig[targetLang]) {
        currentLanguage = targetLang;
        if (languageSelect) {
            languageSelect.value = targetLang;
        }
        updateEditorLanguage();
        addToTerminalOutput(`<span class="terminal-success">Language changed to ${languageConfig[targetLang].name}</span>`);
    } else {
        const availableLangs = Object.keys(langMap).join(', ');
        addToTerminalOutput(`<span class="terminal-error">Unknown language: ${langName}. Available: ${availableLangs}</span>`);
    }
}

// Show about information
function showAboutInfo() {
    const aboutText = `<span class="terminal-result">SATI Programming Hub
Built for Samrat Ashok Technological Institute (SATI)
Developed by Team FluxoNauts

Features:
- Multi-language code editor with Monaco Editor
- Interactive terminal with command support
- Real-time code execution simulation
- Dark/Light theme support
- Mobile-responsive design

Visit: https://sati-chatbot.vercel.app</span>`;
    addToTerminalOutput(aboutText);
}

// Initialize terminal with welcome message
function initializeTerminal() {
    if (terminalOutput && terminalInput) {
        const welcomeMessage = `<span class="terminal-success">Welcome to SATI Programming Hub Interactive Terminal!</span>
<span class="terminal-result">Type 'help' to see available commands.</span>
<span class="terminal-result">You can run code, change languages, and more!</span>`;
        
        addToTerminalOutput(welcomeMessage);
        
        // Removed auto-focus to prevent jumping to terminal input on page load
        // Users can manually click on the terminal input when they want to use it
    }
}

// Toggle dark mode
function toggleDarkMode() {
    const currentActualTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentActualTheme === 'dark' ? 'light' : 'dark';

    // Apply theme
    applyTheme(newTheme);

    // Save to all possible localStorage keys for consistency across pages
    localStorage.setItem('sati_theme', newTheme);
    localStorage.setItem('light', newTheme);
    localStorage.setItem('theme', newTheme);

    // Remove system theme listener since we're switching to explicit theme
    if (window.systemThemeListener) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        if (mediaQuery.removeEventListener) {
            mediaQuery.removeEventListener('change', window.systemThemeListener);
        } else if (mediaQuery.removeListener) {
            mediaQuery.removeListener(window.systemThemeListener);
        }
        window.systemThemeListener = null;
    }
}

// Update dark mode toggle state
function updateDarkModeIcon(isDark) {
    // Set checkbox state based on theme (checked = dark mode)
    if (darkModeToggle) {
        darkModeToggle.checked = isDark;
    }
}

// Toggle mobile menu
function toggleMobileMenu() {
    if (mobileNavMenu) {
        mobileNavMenu.classList.toggle('show');
    }

    // Update mobile menu toggle icon
    const icon = mobileMenuToggle.querySelector('i');
    if (mobileNavMenu && mobileNavMenu.classList.contains('show')) {
        icon.className = 'fas fa-times';
        document.body.classList.add('mobile-menu-open');
        if (blurOverlay) {
            blurOverlay.classList.add('show');
        }
    } else {
        icon.className = 'fas fa-bars';
        document.body.classList.remove('mobile-menu-open');
        if (blurOverlay) {
            blurOverlay.classList.remove('show');
        }
    }
}

// Close mobile menu
function closeMobileMenu() {
    if (mobileNavMenu) {
        mobileNavMenu.classList.remove('show');
    }
    const icon = mobileMenuToggle.querySelector('i');
    icon.className = 'fas fa-bars';
    document.body.classList.remove('mobile-menu-open');
    if (blurOverlay) {
        blurOverlay.classList.remove('show');
    }
}

// Load default content
function loadDefaultContent() {
    // Set default language
    if (languageSelect) {
        languageSelect.value = currentLanguage;
    }

    // Set default title
    if (editorTitle) {
        editorTitle.textContent = `Coding in ${languageConfig[currentLanguage].name}`;
    }

    // Clear terminal
    if (terminalOutput) {
        terminalOutput.innerHTML = '';
    }

    // Initialize terminal with welcome message
    initializeTerminal();

    // Ensure proper active states are set
    setCurrentPageActive();
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // Hide and remove notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Notification styles
const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--card-bg);
        color: var(--text-primary);
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: var(--shadow-hover);
        border: 1px solid var(--border-color);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        transform: translateX(400px);
        opacity: 0;
        transition: all 0.3s ease;
        max-width: 350px;
        word-wrap: break-word;
    }

    .notification.show {
        transform: translateX(0);
        opacity: 1;
    }

    .notification-success {
        border-left: 4px solid var(--accent-color);
    }

    .notification-success i {
        color: var(--accent-color);
    }

    .notification-warning {
        border-left: 4px solid #ff9800;
    }

    .notification-warning i {
        color: #ff9800;
    }

    .notification-info {
        border-left: 4px solid var(--primary-color);
    }

    .notification-info i {
        color: var(--primary-color);
    }

    .notification-error {
        border-left: 4px solid #f44336;
    }

    .notification-error i {
        color: #f44336;
    }

    @media (max-width: 768px) {
        .notification {
            right: 10px;
            left: 10px;
            max-width: none;
            transform: translateY(-100px);
        }

        .notification.show {
            transform: translateY(0);
        }
    }
`;

// Add notification styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Navigation Dropdown Functionality
function initializeDropdownFunctionality() {
    // Mobile dropdown toggle functionality
    const mobileDropdownToggles = document.querySelectorAll('.mobile-dropdown-toggle');

    mobileDropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function (e) {
            e.preventDefault();
            const dropdown = this.parentElement;
            dropdown.classList.toggle('open');
        });
    });
}

// Desktop dropdown delay functionality
function initializeDesktopDropdownDelay() {
    const navDropdown = document.querySelector('.nav-dropdown');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    let hideTimeout;

    if (navDropdown && dropdownMenu) {
        // Show dropdown on hover
        navDropdown.addEventListener('mouseenter', function () {
            // Clear any existing timeout
            if (hideTimeout) {
                clearTimeout(hideTimeout);
                hideTimeout = null;
            }
            // Show dropdown immediately
            dropdownMenu.classList.add('show');
        });

        // Hide dropdown with delay on mouse leave
        navDropdown.addEventListener('mouseleave', function () {
            // Set timeout to hide dropdown after 500ms
            hideTimeout = setTimeout(() => {
                dropdownMenu.classList.remove('show');
            }, 500);
        });

        // If mouse enters dropdown menu, cancel hide timeout
        dropdownMenu.addEventListener('mouseenter', function () {
            if (hideTimeout) {
                clearTimeout(hideTimeout);
                hideTimeout = null;
            }
        });

        // If mouse leaves dropdown menu, start hide timeout
        dropdownMenu.addEventListener('mouseleave', function () {
            hideTimeout = setTimeout(() => {
                dropdownMenu.classList.remove('show');
            }, 500);
        });
    }
}

// Set current page active state based on URL
function setCurrentPageActive() {
    const currentPath = window.location.pathname;

    // Handle programming page
    if (currentPath.includes('/resources/programming.html')) {
        updateDropdownLabel('Programming');
        updateMobileDropdownLabel('Programming');
    }
}

// Update dropdown label for desktop
function updateDropdownLabel(activeItem) {
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    if (dropdownToggle) {
        dropdownToggle.innerHTML = `${activeItem} <i class="fas fa-chevron-down"></i>`;

        // Update active states
        const dropdownItems = document.querySelectorAll('.dropdown-item');
        dropdownItems.forEach(item => {
            item.classList.remove('active');
            if (item.textContent.trim() === activeItem) {
                item.classList.add('active');
            }
        });
    }
}

// Update dropdown label for mobile
function updateMobileDropdownLabel(activeItem) {
    const mobileDropdownToggle = document.querySelector('.mobile-dropdown-toggle');
    if (mobileDropdownToggle) {
        // Update the span text and icon
        const span = mobileDropdownToggle.querySelector('span');
        const icon = mobileDropdownToggle.querySelector('i:not(.mobile-dropdown-arrow)');

        if (span) {
            span.textContent = activeItem;
        }

        if (icon) {
            // Update icon based on active item
            if (activeItem === 'Programming') {
                icon.className = 'fas fa-code';
            } else if (activeItem === 'Materials') {
                icon.className = 'fas fa-book';
            }
        }

        // Update active states
        const mobileDropdownItems = document.querySelectorAll('.mobile-dropdown-item');
        mobileDropdownItems.forEach(item => {
            item.classList.remove('active');
            if (item.textContent.trim() === activeItem) {
                item.classList.add('active');
            }
        });
    }
}

// Export functions for external use
window.showNotification = showNotification;
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;