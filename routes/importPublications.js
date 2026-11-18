const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');
const Publication = require('../models/Publication');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getRandomDelay = () => {
    return Math.floor(Math.random() * 3000) + 2000;
};

const scrapeGoogleScholarProfile = async (scholarId, startYear) => {
    const publications = [];
    let pageNum = 0;
    let hasMore = true;
    
    while (hasMore && pageNum < 10) {
        const url = `https://scholar.google.com/citations?user=${scholarId}&hl=en&cstart=${pageNum * 100}&pagesize=100`;
        
        console.log(`Fetching page ${pageNum + 1}: ${url}`);
        
        try {
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1',
                    'Cache-Control': 'max-age=0',
                },
                timeout: 30000,
            });
            
            const $ = cheerio.load(response.data);
            
            const rows = $('#gsc_a_b tbody tr');
            
            if (rows.length === 0) {
                console.log('No more rows found');
                hasMore = false;
                break;
            }
            
            console.log(`Found ${rows.length} publications on page ${pageNum + 1}`);
            
            let shouldStop = false;
            
            rows.each((index, element) => {
                if (shouldStop) return;
                
                const titleElement = $(element).find('.gsc_a_at');
                const title = titleElement.text().trim();
                
                const authorsElement = $(element).find('.gs_gray');
                const authorsText = authorsElement.first().text().trim();
                
                const venueElement = $(element).find('.gs_gray').eq(1);
                const venueText = venueElement.text().trim();
                
                const yearElement = $(element).find('.gsc_a_h');
                const yearText = yearElement.text().trim();
                const year = parseInt(yearText);
                
                const citationsElement = $(element).find('.gsc_a_ac');
                const citationsText = citationsElement.text().trim();
                const citations = citationsText === '*' ? 0 : parseInt(citationsText) || 0;
                
                if (!year || year < startYear) {
                    shouldStop = true;
                    hasMore = false;
                    return;
                }
                
                const authors = authorsText.split(',').map(a => a.trim()).filter(a => a);
                
                publications.push({
                    title,
                    authors: authors.map(name => ({
                        name,
                        email: `${name.toLowerCase().replace(/[^a-z0-9]+/g, '.')}@placeholder.edu`,
                    })),
                    journal: venueText || 'Unknown Venue',
                    year,
                    doi: null,
                    abstract: '',
                    citations,
                    category: venueText.toLowerCase().includes('conference') || 
                             venueText.toLowerCase().includes('proceedings') ? 'conference' : 'journal',
                    featured: false,
                });
            });
            
            const nextButton = $('#gsc_a_b .gsc_pgn_pnx');
            if (nextButton.length === 0 || shouldStop) {
                hasMore = false;
            } else {
                pageNum++;
                await sleep(getRandomDelay());
            }
            
        } catch (error) {
            console.error(`Error on page ${pageNum + 1}:`, error.message);
            if (error.response && error.response.status === 429) {
                console.log('Rate limited! Waiting 30 seconds...');
                await sleep(30000);
                continue;
            }
            if (error.response && error.response.status === 403) {
                console.log('Blocked! Google Scholar is blocking automated requests.');
                break;
            }
            hasMore = false;
        }
    }
    
    return publications;
};

router.post('/from-scholar', async (req, res) => {
    try {
        const { scholarUrl, startYear = 2020 } = req.body;
        
        if (!scholarUrl) {
            return res.status(400).json({ success: false, message: 'Google Scholar profile URL is required' });
        }
        
        let scholarId = null;
        if (scholarUrl.includes('user=')) {
            scholarId = scholarUrl.match(/user=([^&]+)/)[1];
        }
        
        if (!scholarId) {
            return res.status(400).json({ success: false, message: 'Could not extract Scholar ID from URL' });
        }
        
        console.log(`Scraping Google Scholar for Scholar ID: ${scholarId}`);
        console.log(`Start Year: ${startYear}`);
        
        const publications = await scrapeGoogleScholarProfile(scholarId, startYear);
        
        if (publications.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'No publications found. Google Scholar might be blocking automated requests.' 
            });
        }
        
        console.log(`Total publications found: ${publications.length}`);
        
        const created = await Publication.insertMany(publications);
        
        res.json({ 
            success: true, 
            count: created.length,
            message: `Successfully imported ${created.length} publications`,
            data: created,
        });
    } catch (error) {
        console.error('Import error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;