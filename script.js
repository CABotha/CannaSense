// Risk Level Configuration
const RISK_LEVELS = {
    low: {
        range: { min: 0, max: 15 },
        level: "Low Risk",
        class: "low-risk",
        clause: "The employee acknowledges that their job duties involve tasks that require a high level of concentration, precision, or quick reaction times. The employee agrees to refrain from using cannabis in any manner that could impair their work performance or prejudice the safety of themselves or others. The employee accepts that they will be subject to testing in the event that they enter high risk situations from time to time or as required in the discretion of the business and at law.",
        measures: [
            "Provide general education on the potential risks associated with cannabis use.",
            "Maintain standard workplace safety protocols.",
            "Ensure clear communication of company policies."
        ]
    },
    possible: {
        range: { min: 16, max: 30 },
        level: "Possible Risk",
        class: "possible-risk",
        clause: "The employee acknowledges that their job duties involve tasks that require a high level of concentration, precision, or quick reaction times. The employee agrees to refrain from using cannabis in any manner that could impair their work performance or prejudice the safety of themselves or others. The employee accepts that they will be subject to testing in the event that they enter high risk situations from time to time or as required in the discretion of the business and at law.",
        measures: [
            "Provide targeted education on specific risks associated with cannabis use.",
            "Implement regular safety briefings.",
            "Ensure supervision during critical tasks."
        ]
    },
    substantial: {
        range: { min: 31, max: 45 },
        level: "Substantial Risk",
        class: "substantial-risk",
        clause: "The employee acknowledges that their job duties may be safety critical and involve tasks that require a high level of concentration, precision, or quick reaction times. The employee agrees to refrain from using cannabis in any manner that could impair their work performance or prejudice the safety of themselves or others. The employee accepts that they will be subject to testing in the event that they enter high risk situations from time to time or as required in the discretion of the business and at law.",
        measures: [
            "Implement comprehensive safety training program.",
            "Conduct regular risk assessments.",
            "Establish clear reporting procedures for safety concerns.",
            "Consider periodic drug testing as permitted by law."
        ]
    },
    high: {
        range: { min: 46, max: 55 },
        level: "High Risk",
        class: "high-risk",
        clause: "The employee acknowledges that their job duties are safety-critical and involve tasks that require the highest level of concentration, precision, and quick reaction times. The employee understands that traces of cannabis and/or impairment as a result thereof is strictly prohibited and that they will be subject to frequent, random, reasonable, and justified drug tests, as permitted by law. Any violation of the company's policy prohibiting the use of cannabis while on duty may result in disciplinary action, up to and including termination of employment, based on a thorough investigation and consideration of all relevant factors. The employee agrees to refrain from using cannabis while on duty.",
        measures: [
            "Implement strict safety protocols and monitoring.",
            "Conduct mandatory safety training sessions.",
            "Establish regular drug testing program.",
            "Maintain detailed safety incident reporting.",
            "Require supervisor presence during high-risk tasks."
        ]
    },
    veryHigh: {
        range: { min: 56, max: 100 },
        level: "Very High Risk",
        class: "very-high-risk",
        clause: "The employee acknowledges that their job duties are safety-critical and involve tasks that require the highest level of concentration, precision, and quick reaction times. The employee understands that traces of cannabis and/or impairment as a result thereof is strictly prohibited and that they will be subject to frequent, random, reasonable, and justified drug tests, as permitted by law. Any violation of the company's policy prohibiting the use of cannabis may result in disciplinary action, up to and including termination of employment, based on a thorough investigation and consideration of all relevant factors. The employee agrees to refrain from using cannabis at all times.",
        measures: [
            "Implement comprehensive safety management system.",
            "Conduct frequent safety audits and inspections.",
            "Maintain rigorous drug testing program.",
            "Provide extensive safety training and certification.",
            "Establish emergency response procedures.",
            "Require continuous supervision for critical tasks."
        ]
    }
};

// Initialize event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeFormValidation();
    initializeModalHandlers();
    initializeExportButtons();
});

// Initialize form validation
function initializeFormValidation() {
    const jobInfoForm = document.getElementById('job-info-form');
    const riskForm = document.getElementById('risk-form');

    if (jobInfoForm) {
        jobInfoForm.addEventListener('submit', (e) => e.preventDefault());
    }

    if (riskForm) {
        riskForm.addEventListener('submit', handleFormSubmit);
        
        // Add validation listeners to all select elements
        riskForm.querySelectorAll('select').forEach(select => {
            select.addEventListener('change', () => {
                if (select.value !== "") {
                    select.classList.remove('error');
                }
            });
        });
    }
}

// Initialize modal handlers
function initializeModalHandlers() {
    const modal = document.getElementById('error-modal');
    const closeBtn = document.querySelector('.modal .close');
    
    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
}

// Initialize export buttons
function initializeExportButtons() {
    const excelButton = document.querySelector('.excel-button');
    const pdfButton = document.querySelector('.pdf-button');
    
    if (excelButton) {
        excelButton.addEventListener('click', exportToExcel);
    }
    
    if (pdfButton) {
        pdfButton.addEventListener('click', exportToPDF);
    }
}

// Handle form submission
function handleFormSubmit(event) {
    event.preventDefault();
    
    try {
        // Validate job information
        const jobTitle = document.getElementById('job-title').value.trim();
        const department = document.getElementById('department').value.trim();
        const assessmentDate = document.getElementById('assessment-date').value;

        if (!jobTitle || !department || !assessmentDate) {
            showError('Please complete all job information fields.');
            return;
        }

        // Validate all questions are answered
        const unansweredQuestions = validateQuestions();
        if (unansweredQuestions.length > 0) {
            showError('Please answer all questions before calculating the risk level.');
            highlightUnansweredQuestions(unansweredQuestions);
            return;
        }

        const score = calculateScore();
        const riskLevel = determineRiskLevel(score);
        displayResults(score, riskLevel);
        document.getElementById('results-container').style.display = 'block';
        
        // Scroll to results
        document.getElementById('results-container').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });

    } catch (error) {
        showError(error.message);
    }
}

// Validate questions
function validateQuestions() {
    const unansweredQuestions = [];
    const selects = document.querySelectorAll('#risk-form select');
    
    selects.forEach(select => {
        if (select.value === "") {
            unansweredQuestions.push(select);
        }
    });
    
    return unansweredQuestions;
}

// Highlight unanswered questions
function highlightUnansweredQuestions(questions) {
    questions.forEach(question => {
        question.classList.add('error');
    });
}

// Calculate risk score
function calculateScore() {
    let total = 0;
    for (let i = 1; i <= 16; i++) {
        const select = document.getElementById(`q${i}`);
        if (select) {
            total += parseInt(select.value) || 0;
        }
    }
    return total;
}

// Determine risk level based on score
function determineRiskLevel(score) {
    for (const [key, data] of Object.entries(RISK_LEVELS)) {
        if (score >= data.range.min && score <= data.range.max) {
            return { key, ...data };
        }
    }
    return { key: 'veryHigh', ...RISK_LEVELS.veryHigh };
}

// Display results
function displayResults(score, riskLevel) {
    // Display risk result
    const riskResult = document.getElementById('risk-result');
    if (riskResult) {
        riskResult.textContent = `Risk Level: ${riskLevel.level} (Score: ${score})`;
        riskResult.className = `risk-block ${riskLevel.class}`;
    }

    // Display clause
    const clauseContent = document.getElementById('clause-content');
    if (clauseContent) {
        clauseContent.textContent = riskLevel.clause;
    }

    // Display measures
    const measuresContent = document.getElementById('measures-content');
    if (measuresContent) {
        measuresContent.innerHTML = '<ul>' + 
            riskLevel.measures.map(measure => `<li>${measure}</li>`).join('') + 
            '</ul>';
    }
}

// Export to Excel
async function exportToExcel() {
    try {
        showSpinner('excel-button');

        // Check if XLSX is loaded
        if (typeof XLSX === 'undefined') {
            throw new Error('Excel export library not loaded. Please refresh the page and try again.');
        }

        const assessmentData = generateAssessmentData();
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(assessmentData);
        
        // Set column widths
        ws['!cols'] = [{ wch: 60 }, { wch: 40 }];

        XLSX.utils.book_append_sheet(wb, ws, 'Risk Assessment');

        const fileName = generateFileName('xlsx');
        XLSX.writeFile(wb, fileName);

    } catch (error) {
        showError('Failed to export to Excel: ' + error.message);
    } finally {
        hideSpinner('excel-button');
    }
}

// Export to PDF
async function exportToPDF() {
    try {
        showSpinner('pdf-button');

        // Check if jsPDF is loaded
        if (typeof window.jspdf === 'undefined') {
            throw new Error('PDF export library not loaded. Please refresh the page and try again.');
        }

        const { jsPDF } = window.jspdf;
        
        // Create new document
        const doc = new jsPDF();
        
        // Check if autoTable is available
        if (typeof doc.autoTable !== 'function') {
            throw new Error('PDF AutoTable plugin not loaded. Please refresh the page and try again.');
        }

        generatePDFHeader(doc);
        await generatePDFContent(doc);
        addPageNumbers(doc);

        const fileName = generateFileName('pdf');
        doc.save(fileName);

    } catch (error) {
        showError('Failed to export to PDF: ' + error.message);
    } finally {
        hideSpinner('pdf-button');
    }
}

// Generate PDF header
function generatePDFHeader(doc) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Cannabis Workplace Risk Assessment Report', margin, 15);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - 50, 15);
}

// Generate main PDF content
async function generatePDFContent(doc) {
    const margin = 10;
    let yPos = 30;

    // Job Information
    yPos = await addJobInformation(doc, yPos);

    // Risk Results
    yPos = await addRiskResults(doc, yPos);

    // Remaining sections
    await addRemainingPDFSections(doc, yPos);
}

// Add job information section to PDF
async function addJobInformation(doc, yPos) {
    const margin = 10;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Job Information', margin, yPos);
    yPos += 10;

    const jobInfoTable = [
        ['Job Title', document.getElementById('job-title').value],
        ['Department', document.getElementById('department').value],
        ['Assessment Date', document.getElementById('assessment-date').value]
    ];

    doc.autoTable({
        startY: yPos,
        head: [],
        body: jobInfoTable,
        theme: 'plain',
        styles: { fontSize: 10, cellPadding: 3 },
        columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 50 },
            1: { cellWidth: 'auto' }
        }
    });

    return doc.lastAutoTable.finalY + 15;
}

// Add risk results section to PDF
async function addRiskResults(doc, yPos) {
    const margin = 10;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Risk Assessment Results', margin, yPos);
    yPos += 10;

    const riskResult = document.getElementById('risk-result').textContent;
    doc.autoTable({
        startY: yPos,
        body: [[riskResult]],
        theme: 'plain',
        styles: { fontSize: 10, cellPadding: 3 }
    });

    return doc.lastAutoTable.finalY + 15;
}

// Add remaining sections to PDF
async function addRemainingPDFSections(doc, startYPos) {
    const margin = 10;
    let yPos = startYPos;

    // Contract Clause
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Recommended Contract Clause', margin, yPos);
    yPos += 10;

    const clauseContent = document.getElementById('clause-content').textContent;
    doc.autoTable({
        startY: yPos,
        body: [[clauseContent]],
        theme: 'plain',
        styles: { fontSize: 10, cellPadding: 3 }
    });

    // Control Measures
    yPos = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Control Measures', margin, yPos);
    yPos += 10;

    const measures = Array.from(
        document.getElementById('measures-content').querySelectorAll('li')
    ).map(li => [li.textContent]);

    doc.autoTable({
        startY: yPos,
        body: measures,
        theme: 'plain',
        styles: { fontSize: 10, cellPadding: 3 }
    });

    // Question Responses
    yPos = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Question Responses', margin, yPos);
    yPos += 10;

    const questionResponses = [];
    for (let i = 1; i <= 16; i++) {
        const questionEl = document.querySelector(`label[for="q${i}"]`);
        const answerEl = document.querySelector(`#q${i}`);
        if (questionEl && answerEl && answerEl.selectedIndex !== -1) {
            questionResponses.push([
                `Q${i}`,
                questionEl.textContent,
                answerEl.options[answerEl.selectedIndex].text
            ]);
        }
    }

    doc.autoTable({
        startY: yPos,
        head: [['#', 'Question', 'Response']],
        body: questionResponses,
        theme: 'plain',
        styles: { fontSize: 10, cellPadding: 3 },
        columnStyles: {
            0: { cellWidth: 10 },
            1: { cellWidth: 100 },
            2: { cellWidth: 'auto' }
        }
    });
}

// Add page numbers to PDF
function addPageNumbers(doc) {
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(
            `Page ${i} of ${pageCount}`,
            doc.internal.pageSize.getWidth() - 30,
            doc.internal.pageSize.getHeight() - 10
        );
    }
}

// Generate assessment data for exports
function generateAssessmentData() {
    const formData = {
        jobTitle: document.getElementById('job-title').value,
        department: document.getElementById('department').value,
        assessmentDate: document.getElementById('assessment-date').value,
        riskResult: document.getElementById('risk-result').textContent,
        clause: document.getElementById('clause-content').textContent,
        measures: Array.from(document.getElementById('measures-content').querySelectorAll('li'))
            .map(li => li.textContent)
    };

    const data = [
        ['Cannabis Risk Assessment Report'],
        [''],
        ['Job Information'],
        ['Job Title', formData.jobTitle],
        ['Department', formData.department],
        ['Assessment Date', formData.assessmentDate],
        [''],
        ['Risk Assessment Results'],
        [formData.riskResult],
        [''],
        ['Contract Clause'],
        [formData.clause],
        [''],
        ['Recommended Control Measures']
    ];

    // Add measures
    formData.measures.forEach(measure => {
        data.push(['• ' + measure]);
    });

    // Add questions and responses
    data.push([''], ['Question Responses']);
    for (let i = 1; i <= 16; i++) {
        const questionEl = document.querySelector(`label[for="q${i}"]`);
        const answerEl = document.querySelector(`#q${i}`);
        if (questionEl && answerEl && answerEl.selectedIndex !== -1) {
            data.push([
                questionEl.textContent,
                answerEl.options[answerEl.selectedIndex].text
            ]);
        }
    }

    return data;
}

// Generate filename for exports
function generateFileName(extension) {
    const jobTitle = document.getElementById('job-title').value || 'Assessment';
    const date = formatDate(new Date());
    return `Cannabis_Risk_Assessment_${jobTitle.replace(/\s+/g, '_')}_${date}.${extension}`;
}

// Format date for filenames
function formatDate(date) {
    return date.toISOString().split('T')[0].replace(/-/g, '');
}

// Show error message
function showError(message) {
    const modal = document.getElementById('error-modal');
    const messageElement = document.getElementById('error-message');
    if (modal && messageElement) {
        messageElement.textContent = message;
        modal.style.display = 'flex';
    } else {
        alert(message);
    }
}

// Show loading spinner
function showSpinner(buttonClass) {
    const spinner = document.querySelector(`.${buttonClass} .loading-spinner`);
    if (spinner) {
        spinner.style.display = 'inline-block';
    }
}

// Hide loading spinner
function hideSpinner(buttonClass) {
    const spinner = document.querySelector(`.${buttonClass} .loading-spinner`);
    if (spinner) {
        spinner.style.display = 'none';
    }
}