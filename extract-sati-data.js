// SATI Data Extraction and Enhancement Script
// This script extracts detailed information from scraped data and organizes it

const fs = require('fs');

// Read the scraped data
function loadScrapedData() {
    try {
        const data = fs.readFileSync('scraped_www_satiengg_in_1754119744.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading scraped data:', error);
        return null;
    }
}

// Extract department information
function extractDepartments(scrapedData) {
    const departments = {};
    
    scrapedData.pages.forEach(page => {
        if (page.url.includes('/departments/')) {
            const deptName = page.url.split('/departments/')[1];
            if (deptName) {
                departments[deptName] = {
                    url: page.url,
                    title: page.title,
                    content: page.content
                };
            }
        }
    });
    
    return departments;
}

// Extract fee information
function extractFeeInfo(scrapedData) {
    const feePages = scrapedData.pages.filter(page => 
        page.url.includes('/fee-structure') || 
        page.url.includes('/admission/')
    );
    
    return feePages.map(page => ({
        url: page.url,
        title: page.title,
        content: page.content
    }));
}

// Extract current notices
function extractNotices(scrapedData) {
    const homePage = scrapedData.pages.find(page => page.url === 'https://www.satiengg.in');
    if (homePage && homePage.content && homePage.content.paragraphs) {
        const notices = homePage.content.paragraphs
            .filter(p => p.includes('Notice') || p.includes('2025'))
            .slice(0, 10); // Get first 10 notices
        return notices;
    }
    return [];
}

// Extract contact information
function extractContactInfo(scrapedData) {
    const contactInfo = {};
    
    scrapedData.pages.forEach(page => {
        if (page.content && page.content.lists) {
            page.content.lists.forEach(list => {
                list.items.forEach(item => {
                    if (item.includes('Technical Support') || item.includes('Email')) {
                        contactInfo[item] = true;
                    }
                });
            });
        }
    });
    
    return Object.keys(contactInfo);
}

// Main extraction function
function extractEnhancedData() {
    console.log('🔍 Extracting enhanced SATI data...');
    
    const scrapedData = loadScrapedData();
    if (!scrapedData) {
        console.error('❌ Failed to load scraped data');
        return;
    }
    
    const enhancedData = {
        departments: extractDepartments(scrapedData),
        feeInfo: extractFeeInfo(scrapedData),
        notices: extractNotices(scrapedData),
        contactInfo: extractContactInfo(scrapedData),
        totalPages: scrapedData.website_info.total_pages_scraped,
        scrapingDate: scrapedData.website_info.scraping_completed_at
    };
    
    // Save enhanced data
    fs.writeFileSync('enhanced-sati-extraction.json', JSON.stringify(enhancedData, null, 2));
    
    console.log('✅ Enhanced data extracted successfully!');
    console.log(`📊 Found ${Object.keys(enhancedData.departments).length} departments`);
    console.log(`💰 Found ${enhancedData.feeInfo.length} fee-related pages`);
    console.log(`📢 Found ${enhancedData.notices.length} current notices`);
    console.log(`📞 Found ${enhancedData.contactInfo.length} contact details`);
    
    return enhancedData;
}

// Generate enhanced knowledge base
function generateEnhancedKnowledgeBase() {
    const enhancedData = extractEnhancedData();
    
    const knowledgeBase = {
        "departments_detailed": {
            "title": "Detailed Department Information",
            "source": "Official Website",
            "content": `DEPARTMENTS AT SATI:\n\n${Object.keys(enhancedData.departments).map(dept => 
                `- ${dept.replace(/-/g, ' ').toUpperCase()}: ${enhancedData.departments[dept].title}`
            ).join('\n')}\n\nEach department has dedicated faculty, laboratories, and research facilities.`
        },
        "current_notices_2025": {
            "title": "Current Notices & Updates (2025)",
            "source": "Official Website",
            "content": `RECENT NOTICES:\n\n${enhancedData.notices.map(notice => 
                `- ${notice.substring(0, 100)}...`
            ).join('\n\n')}`
        },
        "fee_structure_detailed": {
            "title": "Detailed Fee Structure",
            "source": "Official Website",
            "content": `FEE STRUCTURE INFORMATION:\n\n${enhancedData.feeInfo.map(fee => 
                `- ${fee.title}: ${fee.url}`
            ).join('\n')}\n\nDetailed fee breakdowns are available on the official website.`
        },
        "contact_detailed": {
            "title": "Detailed Contact Information",
            "source": "Official Website",
            "content": `CONTACT DETAILS:\n\n${enhancedData.contactInfo.join('\n')}\n\nFor more information, visit the official website.`
        }
    };
    
    // Save enhanced knowledge base
    fs.writeFileSync('enhanced-knowledge-base.json', JSON.stringify(knowledgeBase, null, 2));
    
    console.log('✅ Enhanced knowledge base generated!');
    return knowledgeBase;
}

// Run the extraction
if (require.main === module) {
    generateEnhancedKnowledgeBase();
}

module.exports = {
    extractEnhancedData,
    generateEnhancedKnowledgeBase
}; 